// api/payfast-notify.js - FIXED VERSION
// Uses correct environment variables for Vercel serverless functions
import crypto from 'crypto';
import { createClient } from '@supabase/supabase-js';

export default async function handler(req, res) {
  // CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    console.log('❌ Method not allowed:', req.method);
    return res.status(405).send('Method not allowed');
  }

  try {
    const pfData = req.body;
    const passphrase = process.env.PAYFAST_PASSPHRASE || 'scottyuzi1LIV3';

    console.log('🔔 PayFast ITN received:', {
      payment_id: pfData.m_payment_id,
      status: pfData.payment_status,
      amount: pfData.amount_gross
    });

    // Verify signature
    const signature = generateSignature(pfData, passphrase);
    
    if (signature !== pfData.signature) {
      console.error('❌ Invalid signature!');
      console.error('Expected:', signature);
      console.error('Got:', pfData.signature);
      return res.status(400).send('Invalid signature');
    }

    console.log('✅ Signature verified');

    // Update database - FIXED: Use correct environment variables
    try {
      // CRITICAL FIX: In Vercel API routes, use process.env directly (no VITE_ prefix needed)
      const supabaseUrl = process.env.VITE_SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL;
      const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

      console.log('🔍 Supabase config:', {
        url: supabaseUrl ? 'Present' : 'MISSING',
        key: supabaseKey ? 'Present' : 'MISSING'
      });

      if (!supabaseUrl || !supabaseKey) {
        console.error('❌ Supabase credentials missing!');
        return res.status(500).send('Database configuration error');
      }

      const supabase = createClient(supabaseUrl, supabaseKey);

      // Determine order status from PayFast payment status
      const statusMap = {
        'COMPLETE': 'completed',
        'CANCELLED': 'cancelled',
        'FAILED': 'failed'
      };
      
      const orderStatus = statusMap[pfData.payment_status] || 'pending';

      console.log(`📝 Updating order ${pfData.m_payment_id} to status: ${orderStatus}`);

      // Update order in database
      const { data: order, error } = await supabase
        .from('orders')
        .update({
          status: orderStatus,
          payfast_payment_status: pfData.payment_status,
          updated_at: new Date().toISOString()
        })
        .eq('payment_id', pfData.m_payment_id)
        .select()
        .single();

      if (error) {
        console.error('❌ Database update error:', error);
        return res.status(500).send('Database error');
      }

      console.log('✅ Order updated successfully!');
      console.log('Order details:', {
        id: order.id,
        payment_id: order.payment_id,
        status: order.status,
        email: order.email
      });

      // Send confirmation email if payment successful
      if (pfData.payment_status === 'COMPLETE') {
        console.log('📧 Payment successful - sending confirmation email');
        await sendOrderConfirmation(pfData, order, supabase);
      } else if (pfData.payment_status === 'CANCELLED') {
        console.log('❌ Payment cancelled by customer');
      } else if (pfData.payment_status === 'FAILED') {
        console.log('❌ Payment failed');
      }

      return res.status(200).send('OK');

    } catch (dbError) {
      console.error('❌ Database error:', dbError);
      return res.status(500).send('Database error');
    }

  } catch (error) {
    console.error('❌ PayFast notification error:', error);
    return res.status(500).send('Error processing notification');
  }
}

// Signature generation - UNCHANGED from your original
function generateSignature(data, passphrase = null) {
  const tempData = { ...data };
  delete tempData.signature;

  let pfOutput = '';
  
  for (let key in tempData) {
    if (tempData.hasOwnProperty(key)) {
      const value = tempData[key].toString().trim();
      pfOutput += `${key}=${encodeURIComponent(value).replace(/%20/g, '+')}&`;
    }
  }

  let getString = pfOutput.slice(0, -1);
  
  if (passphrase !== null) {
    getString += `&passphrase=${encodeURIComponent(passphrase.trim()).replace(/%20/g, '+')}`;
  }

  return crypto.createHash('md5').update(getString).digest('hex');
}

// Send email confirmation
async function sendOrderConfirmation(pfData, order, supabase) {
  try {
    console.log('📧 Preparing confirmation email for:', order.email);

    // Get order items from database
    const { data: orderItems, error: itemsError } = await supabase
      .from('order_items')
      .select('*')
      .eq('order_id', order.id);

    if (itemsError) {
      console.error('Error fetching order items:', itemsError);
      return;
    }

    console.log(`Found ${orderItems?.length || 0} order items`);

    const emailHtml = `
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: #000; color: #fff; padding: 20px; text-align: center; }
          .content { padding: 20px; background: #f9f9f9; }
          .order-items { background: #fff; padding: 15px; margin: 15px 0; border-radius: 5px; }
          .footer { text-align: center; padding: 20px; color: #666; font-size: 12px; }
          ul { list-style: none; padding: 0; }
          li { padding: 8px 0; border-bottom: 1px solid #eee; }
          .customization { background: #fff5f5; border-left: 4px solid #e53e3e; padding: 10px; margin-top: 5px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>SCOTTY UZI</h1>
            <p>Order Confirmation</p>
          </div>
          
          <div class="content">
            <h2>Thank you for your order!</h2>
            <p>Hi ${pfData.name_first},</p>
            <p>We've received your order and we're getting it ready. You'll receive a shipping confirmation email once your order ships.</p>
            
            <div class="order-items">
              <h3>Order Details</h3>
              <p><strong>Order Number:</strong> ${pfData.m_payment_id}</p>
              <p><strong>Order Date:</strong> ${new Date().toLocaleDateString('en-ZA')}</p>
              <p><strong>Total Paid:</strong> R ${pfData.amount_gross}</p>
            </div>
            
            <div class="order-items">
              <h3>Shipping Address</h3>
              <p>${pfData.name_first} ${pfData.name_last}<br>
              ${order.address}<br>
              ${order.apartment ? order.apartment + '<br>' : ''}
              ${order.city}, ${order.province} ${order.postal_code}<br>
              Phone: ${pfData.cell_number}</p>
            </div>
            
            <div class="order-items">
              <h3>Items Ordered</h3>
              <ul>
                ${orderItems.map(item => {
                  let customizationHtml = '';
                  if (item.customization) {
                    try {
                      const custom = JSON.parse(item.customization);
                      customizationHtml = `
                        <div class="customization">
                          <strong>🎨 Customization:</strong><br>
                          Name: ${custom.name || 'N/A'}<br>
                          Number: ${custom.number || 'N/A'}
                        </div>
                      `;
                    } catch (e) {
                      console.error('Error parsing customization:', e);
                    }
                  }
                  
                  return `
                    <li>
                      <strong>${item.product_name}</strong> (Size: ${item.size}) x${item.quantity} 
                      <br>R${(item.price * item.quantity).toFixed(2)}
                      ${customizationHtml}
                    </li>
                  `;
                }).join('')}
              </ul>
            </div>
            
            <div class="order-items">
              <h3>Shipping Method</h3>
              <p>${order.shipping_method || 'Courier Delivery'} (3-5 business days)</p>
            </div>
          </div>
          
          <div class="footer">
            <p>Questions about your order? Contact us at <a href="mailto:orders@scottyuzi.com">orders@scottyuzi.com</a></p>
            <p>&copy; ${new Date().getFullYear()} Scotty Uzi. All rights reserved.</p>
          </div>
        </div>
      </body>
      </html>
    `;

    const resendApiKey = process.env.RESEND_API_KEY;
    
    if (!resendApiKey) {
      console.error('❌ RESEND_API_KEY not set - email not sent');
      return;
    }

    // Send to customer + store owner
    const recipients = [pfData.email_address];
    
    // Add store owner email
    const storeEmail = 'kabelomohlabeng364@gmail.com';
    recipients.push(storeEmail);

    console.log('📧 Sending email to:', recipients);

    const emailResponse = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${resendApiKey}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        from: 'Scotty Uzi <orders@scottyuzi.com>',
        to: recipients,
        subject: `Order Confirmation - ${pfData.m_payment_id}`,
        html: emailHtml
      })
    });

    if (!emailResponse.ok) {
      const errorText = await emailResponse.text();
      console.error('❌ Email sending failed:', errorText);
    } else {
      console.log('✅ Confirmation email sent successfully!');
    }

  } catch (error) {
    console.error('❌ Error sending confirmation email:', error);
  }
}