import { serve } from "https://deno.land/std@0.168.0/http/server.ts"

const RESEND_API_KEY = Deno.env.get('RESEND_API_KEY')

serve(async (req) => {
  try {
    const { record } = await req.json()
    
    // Get user details
    const email = record.email
    const name = record.raw_user_meta_data?.name || 'Valued Customer'
    
    // Send welcome email via Resend
    const res = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${RESEND_API_KEY}`
      },
      body: JSON.stringify({
        from: 'ScottyUzi <noreply@yourdomain.com>', // Replace with your domain
        to: [email],
        subject: 'Welcome to the ScottyUzi Family! 🔥',
        html: `
          <!DOCTYPE html>
          <html>
          <head>
            <style>
              body {
                font-family: Arial, sans-serif;
                background-color: #f4f4f4;
                margin: 0;
                padding: 0;
              }
              .container {
                max-width: 600px;
                margin: 50px auto;
                background-color: #ffffff;
                border-radius: 10px;
                overflow: hidden;
                box-shadow: 0 4px 10px rgba(0,0,0,0.1);
              }
              .header {
                background-color: #000000;
                color: #ffffff;
                padding: 40px 20px;
                text-align: center;
              }
              .header h1 {
                margin: 0;
                font-size: 36px;
                font-weight: bold;
                text-transform: uppercase;
              }
              .content {
                padding: 40px 30px;
                color: #333333;
              }
              .content h2 {
                color: #000000;
                font-size: 24px;
                margin-bottom: 20px;
              }
              .content p {
                line-height: 1.8;
                margin-bottom: 20px;
                font-size: 16px;
              }
              .cta-button {
                display: inline-block;
                background-color: #000000;
                color: #ffffff !important;
                padding: 15px 40px;
                text-decoration: none;
                border-radius: 5px;
                font-weight: bold;
                text-transform: uppercase;
                margin: 20px 0;
              }
              .benefits {
                background-color: #f9f9f9;
                padding: 20px;
                border-radius: 5px;
                margin: 20px 0;
              }
              .benefits ul {
                list-style: none;
                padding: 0;
                margin: 0;
              }
              .benefits li {
                padding: 10px 0;
                border-bottom: 1px solid #e0e0e0;
              }
              .benefits li:last-child {
                border-bottom: none;
              }
              .footer {
                background-color: #f4f4f4;
                padding: 20px;
                text-align: center;
                color: #888888;
                font-size: 12px;
              }
            </style>
          </head>
          <body>
            <div class="container">
              <div class="header">
                <h1>WELCOME TO SCOTTYUZI</h1>
              </div>
              <div class="content">
                <h2>Hey ${name}! 🎉</h2>
                <p>
                  We're hyped to have you join the <strong>ScottyUzi family</strong>! You're now part of an exclusive community that's redefining streetwear.
                </p>
                <p>
                  As a member, you'll get access to:
                </p>
                <div class="benefits">
                  <ul>
                    <li>✅ <strong>Early access</strong> to new drops before anyone else</li>
                    <li>✅ <strong>Exclusive discounts</strong> for members only</li>
                    <li>✅ <strong>Free shipping</strong> on orders above R700</li>
                    <li>✅ <strong>VIP customer support</strong> 24/7</li>
                  </ul>
                </div>
                <p>
                  Ready to explore the newest collection? Check out the <strong>Mafia 2.0 Tracksuits</strong> – our most exclusive drop yet.
                </p>
                <center>
                  <a href="https://scottyuzi.vercel.app/collections?category=new-products" class="cta-button">
                    Shop Now
                  </a>
                </center>
                <p style="margin-top: 30px;">
                  Stay fresh,<br/>
                  <strong>The ScottyUzi Team</strong>
                </p>
              </div>
              <div class="footer">
                <p>© ${new Date().getFullYear()} ScottyUzi. All rights reserved.</p>
                <p>
                  <a href="https://scottyuzi.vercel.app" style="color: #888888;">Visit Website</a> | 
                  <a href="https://instagram.com/scottyuzi_merchandise" style="color: #888888;">Follow Us</a>
                </p>
              </div>
            </div>
          </body>
          </html>
        `
      })
    })

    const data = await res.json()
    
    return new Response(
      JSON.stringify({ success: true, data }),
      { headers: { "Content-Type": "application/json" } }
    )
  } catch (error) {
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    )
  }
})