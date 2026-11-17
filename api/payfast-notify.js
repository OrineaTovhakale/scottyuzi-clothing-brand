// api/payfast-notify.js
// PayFast ITN — hardened for Vercel
// 1) Parse form body  2) Signature (PHP-compatible)  3) PayFast server validate
// 4) Update orders by payment_id  5) Always respond so PayFast stops retrying

import crypto from 'crypto';
import { createClient } from '@supabase/supabase-js';

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).send('Method not allowed');

  try {
    // PayFast sends application/x-www-form-urlencoded
    let pfData = req.body;
    if (typeof pfData === 'string') {
      pfData = Object.fromEntries(new URLSearchParams(pfData));
    }
    if (!pfData || typeof pfData !== 'object') {
      console.error('Empty or invalid body');
      return res.status(400).send('Bad request');
    }

    // Normalize all values to strings
    const data = {};
    for (const [k, v] of Object.entries(pfData)) {
      data[k] = v == null ? '' : String(v);
    }

    console.log('PayFast ITN received', {
      m_payment_id: data.m_payment_id,
      payment_status: data.payment_status,
      amount_gross: data.amount_gross,
      pf_payment_id: data.pf_payment_id,
      merchant_id: data.merchant_id,
      keys: Object.keys(data),
    });

    const passphrase = (process.env.PAYFAST_PASSPHRASE || '').trim();
    const expectedMerchantId = (process.env.PAYFAST_MERCHANT_ID || '').trim();

    // --- Signature check (exclude empty values, PHP-style encode) ---
    const calculated = generateSignature(data, passphrase);
    const signatureOk = calculated === data.signature;
    if (!signatureOk) {
      console.error('Signature mismatch', {
        expected: calculated,
        got: data.signature,
        passphraseSet: Boolean(passphrase),
      });
    } else {
      console.log('Signature OK');
    }

    // --- Merchant ID check ---
    if (expectedMerchantId && data.merchant_id && data.merchant_id !== expectedMerchantId) {
      console.error('Merchant ID mismatch', {
        expected: expectedMerchantId,
        got: data.merchant_id,
      });
      return res.status(200).send('OK'); // don't retry forever
    }

    // --- Server-side validate with PayFast (authoritative) ---
    let payfastValid = false;
    try {
      payfastValid = await validateWithPayFast(data);
      console.log('PayFast validate result:', payfastValid);
    } catch (e) {
      console.error('PayFast validate call failed:', e.message);
    }

    // Trust if signature OR PayFast validate passes (and we have a payment id)
    if (!signatureOk && !payfastValid) {
      console.error('Rejecting ITN: signature invalid and PayFast validate failed');
      // 200 so PayFast stops hammering; fix passphrase / env and next order will work
      return res.status(200).send('OK');
    }

    if (!data.m_payment_id) {
      console.error('No m_payment_id in ITN');
      return res.status(200).send('OK');
    }

    const supabaseUrl =
      process.env.VITE_SUPABASE_URL ||
      process.env.SUPABASE_URL ||
      process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

    if (!supabaseUrl || !supabaseKey) {
      console.error('Missing Supabase env');
      return res.status(500).send('Database configuration error');
    }

    const supabase = createClient(supabaseUrl, supabaseKey);

    const statusMap = {
      COMPLETE: 'completed',
      CANCELLED: 'cancelled',
      FAILED: 'failed',
    };
    const orderStatus = statusMap[data.payment_status] || 'pending';

    const updatePayload = {
      status: orderStatus,
      payfast_payment_status: data.payment_status,
    };
    if (data.amount_gross) {
      updatePayload.payfast_amount = parseFloat(data.amount_gross);
    }

    console.log('Updating order', data.m_payment_id, '->', orderStatus);

    const { data: order, error } = await supabase
      .from('orders')
      .update(updatePayload)
      .eq('payment_id', data.m_payment_id)
      .select()
      .single();

    if (error) {
      console.error('Database update error:', error);
      // Still 200 — avoid endless PayFast retries on DB glitches
      return res.status(200).send('OK');
    }

    if (!order) {
      console.error('No order found for payment_id:', data.m_payment_id);
      return res.status(200).send('OK');
    }

    console.log('Order updated', {
      id: order.id,
      payment_id: order.payment_id,
      status: order.status,
    });

    if (data.payment_status === 'COMPLETE') {
      try {
        await sendOrderConfirmation(data, order, supabase);
      } catch (e) {
        console.error('Email error (order still updated):', e.message);
      }
    }

    return res.status(200).send('OK');
  } catch (error) {
    console.error('Notify fatal error:', error);
    return res.status(200).send('OK');
  }
}

/** PHP urlencode-compatible encoding for PayFast signatures */
function pfEncode(value) {
  return encodeURIComponent(String(value).trim())
    .replace(/%20/g, '+')
    .replace(/!/g, '%21')
    .replace(/'/g, '%27')
    .replace(/\(/g, '%28')
    .replace(/\)/g, '%29')
    .replace(/\*/g, '%2A');
}

/**
 * Build MD5 signature.
 * Exclude signature field and empty values (PayFast ITN convention).
 * Parameter order: insertion order from the POST (Vercel preserves it for form bodies).
 */
function generateSignature(data, passphrase = '') {
  const pairs = [];
  for (const key of Object.keys(data)) {
    if (key === 'signature') continue;
    const val = data[key];
    if (val === '' || val == null) continue;
    pairs.push(`${key}=${pfEncode(val)}`);
  }
  let str = pairs.join('&');
  if (passphrase) {
    str += `&passphrase=${pfEncode(passphrase)}`;
  }
  return crypto.createHash('md5').update(str).digest('hex');
}

/** POST the ITN back to PayFast — returns true if response is VALID */
async function validateWithPayFast(data) {
  const isLive =
    process.env.PAYFAST_LIVE === 'true' || process.env.PAYFAST_LIVE === '1';
  const url = isLive
    ? 'https://www.payfast.co.za/eng/query/validate'
    : 'https://sandbox.payfast.co.za/eng/query/validate';

  const body = new URLSearchParams();
  for (const [k, v] of Object.entries(data)) {
    body.append(k, v);
  }

  const resp = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: body.toString(),
  });
  const text = (await resp.text()).trim();
  return text === 'VALID';
}

async function sendOrderConfirmation(pfData, order, supabase) {
  const resendApiKey = process.env.RESEND_API_KEY;
  if (!resendApiKey) {
    console.log('RESEND_API_KEY not set — skip email');
    return;
  }

  const { data: orderItems } = await supabase
    .from('order_items')
    .select('*')
    .eq('order_id', order.id);

  const itemsHtml = (orderItems || [])
    .map((item) => {
      let custom = '';
      if (item.customization) {
        try {
          const c = JSON.parse(item.customization);
          custom = `<div style="margin-top:6px;padding:8px;background:#fff5f5;border-left:3px solid #e53e3e">
            Name: ${c.name || 'N/A'} · Number: ${c.number || 'N/A'}
          </div>`;
        } catch (_) {}
      }
      return `<li style="padding:8px 0;border-bottom:1px solid #eee">
        <strong>${item.product_name}</strong> (Size: ${item.size}) ×${item.quantity}
        — R${(item.price * item.quantity).toFixed(2)}
        ${custom}
      </li>`;
    })
    .join('');

  const html = `<!DOCTYPE html><html><body style="font-family:Arial,sans-serif;color:#333">
    <div style="max-width:600px;margin:0 auto">
      <div style="background:#000;color:#fff;padding:20px;text-align:center">
        <h1>SCOTTY UZI</h1><p>Order Confirmation</p>
      </div>
      <div style="padding:20px;background:#f9f9f9">
        <h2>Thank you for your order!</h2>
        <p>Hi ${pfData.name_first || ''},</p>
        <p>We've received your payment and are preparing your order.</p>
        <p><strong>Order:</strong> ${pfData.m_payment_id}<br>
        <strong>Total:</strong> R ${pfData.amount_gross}</p>
        <h3>Items</h3>
        <ul style="list-style:none;padding:0">${itemsHtml}</ul>
        <p><strong>Shipping:</strong> ${order.shipping_method || 'Courier'}</p>
        <p>${order.address || ''}<br>${order.city || ''}, ${order.province || ''} ${order.postal_code || ''}</p>
      </div>
      <p style="text-align:center;color:#666;font-size:12px">
        Questions? orders@scottyuzi.com
      </p>
    </div>
  </body></html>`;

  const to = [pfData.email_address, 'kabelomohlabeng364@gmail.com'].filter(Boolean);

  const emailResponse = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${resendApiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      from: 'Scotty Uzi <orders@scottyuzi.com>',
      to,
      subject: `Order Confirmation - ${pfData.m_payment_id}`,
      html,
    }),
  });

  if (!emailResponse.ok) {
    console.error('Email failed:', await emailResponse.text());
  } else {
    console.log('Confirmation email sent');
  }
}
