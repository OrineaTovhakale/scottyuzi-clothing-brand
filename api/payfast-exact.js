// api/payfast-exact.js
// EXACT implementation matching PayFast PHP example
// WITH SUPABASE DATABASE SAVE + CUSTOMIZATION DATA + COLLECTION STORE

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

    const merchantId = '32912537';
    const merchantKey = 'nsk7s46xwnrj1';
    const passphrase = 'scottyuzi1LIV3';
    
    const orderRef = `ORD${Date.now()}`;
    const cleanPhone = customer.phone.replace(/[\s\-\(\)]/g, '');

    // Build data array - EXACTLY as PayFast expects
    const data = {
      'merchant_id': merchantId,
      'merchant_key': merchantKey,
      'return_url': 'https://scottyuzi.com/order-confirmation',
      'cancel_url': 'https://scottyuzi.com/checkout',
      'notify_url': 'https://scottyuzi.com/api/payfast-notify',
      'name_first': customer.firstName.trim(),
      'name_last': customer.lastName.trim(),
      'email_address': customer.email.trim(),
      'cell_number': cleanPhone,
      'm_payment_id': orderRef,
      'amount': parseFloat(total).toFixed(2),
      'item_name': 'Scotty Uzi Order'
    };

    // Generate signature using EXACT PayFast method
    const signature = pfGenSignature(data, passphrase);
    data.signature = signature;

    console.log('Final data:', data);
    console.log('Signature:', signature);

    // ==========================================
    // SAVE TO SUPABASE DATABASE
    // ==========================================
    try {
      const supabaseUrl = process.env.VITE_SUPABASE_URL;
      const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

      if (supabaseUrl && supabaseKey) {
        const supabase = createClient(supabaseUrl, supabaseKey);

        // Create order in database WITH COLLECTION STORE SUPPORT
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
            payfast_amount: parseFloat(total)
          })
          .select()
          .single();

        if (!orderError) {
          console.log('Order created in database:', orderData.id);

          // Create order items WITH CUSTOMIZATION DATA
          const orderItems = items.map(item => ({
            order_id: orderData.id,
            product_name: item.name,
            size: item.selectedSize,
            quantity: item.quantity,
            price: item.price,
            // CRITICAL: Save customization data as JSON string
            customization: item.customization ? JSON.stringify(item.customization) : null
          }));

          const { error: itemsError } = await supabase.from('order_items').insert(orderItems);
          
          if (itemsError) {
            console.error('Error saving order items:', itemsError);
          } else {
            console.log('Order items saved with customization data!');
          }
        }
      }
    } catch (dbError) {
      console.error('Database error (ignoring):', dbError);
      // Continue with payment even if database fails
    }
    // ==========================================
    // END OF DATABASE SAVE
    // ==========================================

    return res.status(200).json({
      paymentUrl: 'https://www.payfast.co.za/eng/process',
      formData: data
    });

  } catch (error) {
    console.error('Error:', error);
    return res.status(500).json({ error: error.message });
  }
}

// EXACT PayFast signature function (from their PHP code converted to JS)
function pfGenSignature(data, passPhrase = '') {
  // Create parameter string
  let pfOutput = '';
  
  for (let key in data) {
    if (data.hasOwnProperty(key)) {
      if (key !== 'signature') {
        pfOutput += `${key}=${encodeURIComponent(data[key].toString().trim()).replace(/%20/g, '+')}&`;
      }
    }
  }

  // Remove last ampersand
  let getString = pfOutput.slice(0, -1);
  
  if (passPhrase !== '') {
    getString += `&passphrase=${encodeURIComponent(passPhrase.trim()).replace(/%20/g, '+')}`;
  }

  console.log('String to hash:', getString);
  
  return crypto.createHash('md5').update(getString).digest('hex');
}