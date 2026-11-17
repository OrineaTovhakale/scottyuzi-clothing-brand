// api/payfast-exact.js
// Creates pending order in Supabase + returns PayFast form data
// Uses Vercel env vars for merchant credentials (no hardcoded keys)

import crypto from 'crypto';
import { createClient } from '@supabase/supabase-js';

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { customer, items, total, collectionStore, collectionStoreName } = req.body;

    const merchantId = process.env.PAYFAST_MERCHANT_ID;
    const merchantKey = process.env.PAYFAST_MERCHANT_KEY;
    const passphrase = process.env.PAYFAST_PASSPHRASE || '';

    if (!merchantId || !merchantKey) {
      console.error('Missing PAYFAST_MERCHANT_ID or PAYFAST_MERCHANT_KEY');
      return res.status(500).json({ error: 'Payment configuration error' });
    }

    const orderRef = `ORD${Date.now()}`;
    const cleanPhone = (customer.phone || '').replace(/[\s\-\(\)]/g, '');

    const data = {
      merchant_id: merchantId,
      merchant_key: merchantKey,
      return_url: 'https://scottyuzi.com/order-confirmation',
      cancel_url: 'https://scottyuzi.com/checkout',
      notify_url: 'https://scottyuzi.com/api/payfast-notify',
      name_first: customer.firstName.trim(),
      name_last: customer.lastName.trim(),
      email_address: customer.email.trim(),
      cell_number: cleanPhone,
      m_payment_id: orderRef,
      amount: parseFloat(total).toFixed(2),
      item_name: 'Scotty Uzi Order',
    };

    const signature = pfGenSignature(data, passphrase);
    data.signature = signature;

    console.log('PayFast form prepared for', orderRef);

    // Save pending order to Supabase
    try {
      const supabaseUrl = process.env.VITE_SUPABASE_URL || process.env.SUPABASE_URL;
      const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

      if (supabaseUrl && supabaseKey) {
        const supabase = createClient(supabaseUrl, supabaseKey);

        const { data: orderData, error: orderError } = await supabase
          .from('orders')
          .insert({
            payment_id: orderRef,
            user_email: customer.email,
            total: parseFloat(total),
            status: 'pending',
            first_name: customer.firstName,
            last_name: customer.lastName,
            phone: cleanPhone,
            email: customer.email,
            address: customer.address || null,
            apartment: customer.apartment || null,
            city: customer.city || null,
            province: customer.province || null,
            postal_code: customer.postalCode || null,
            shipping_method: customer.shippingMethod || 'courier',
            collection_store: collectionStore || null,
            collection_store_name: collectionStoreName || null,
            payfast_amount: parseFloat(total),
          })
          .select()
          .single();

        if (!orderError && orderData) {
          console.log('Order created:', orderData.id, orderRef);

          const orderItems = items.map((item) => ({
            order_id: orderData.id,
            product_name: item.name,
            size: item.selectedSize,
            quantity: item.quantity,
            price: item.price,
            customization: item.customization
              ? JSON.stringify(item.customization)
              : null,
          }));

          const { error: itemsError } = await supabase
            .from('order_items')
            .insert(orderItems);

          if (itemsError) {
            console.error('Error saving order items:', itemsError);
          }
        } else if (orderError) {
          console.error('Error creating order:', orderError);
        }
      } else {
        console.error('Missing Supabase URL or SERVICE_ROLE_KEY');
      }
    } catch (dbError) {
      console.error('Database error (continuing to payment):', dbError);
    }

    const isLive = process.env.PAYFAST_LIVE === 'true' || process.env.PAYFAST_LIVE === '1';
    const paymentUrl = isLive
      ? 'https://www.payfast.co.za/eng/process'
      : 'https://sandbox.payfast.co.za/eng/process';

    return res.status(200).json({
      paymentUrl,
      formData: data,
    });
  } catch (error) {
    console.error('Error:', error);
    return res.status(500).json({ error: error.message });
  }
}

function pfGenSignature(data, passPhrase = '') {
  let pfOutput = '';
  for (const key in data) {
    if (Object.prototype.hasOwnProperty.call(data, key) && key !== 'signature') {
      pfOutput += `${key}=${encodeURIComponent(data[key].toString().trim()).replace(/%20/g, '+')}&`;
    }
  }

  let getString = pfOutput.slice(0, -1);
  if (passPhrase !== '') {
    getString += `&passphrase=${encodeURIComponent(passPhrase.trim()).replace(/%20/g, '+')}`;
  }

  return crypto.createHash('md5').update(getString).digest('hex');
}
