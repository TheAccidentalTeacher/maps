/**
 * Send Contact Email - Netlify Function
 * Sends contact form submissions to Mr. Somers
 * 
 * Choose ONE method below:
 * - SendGrid (recommended, easy setup, no credit card)
 * - Mailgun (more emails/month, requires credit card)
 */

// ============================================
// SENDGRID SETUP (RECOMMENDED)
// ============================================
const sgMail = require('@sendgrid/mail');

exports.handler = async (event, context) => {
    // Only allow POST requests
    if (event.httpMethod !== 'POST') {
        return {
            statusCode: 405,
            body: JSON.stringify({ error: 'Method not allowed' })
        };
    }

    try {
        const { to, from, name, subject, message } = JSON.parse(event.body);

        // Validate required fields
        if (!to || !from || !name || !subject || !message) {
            return {
                statusCode: 400,
                body: JSON.stringify({ error: 'Missing required fields' })
            };
        }

        console.log('📧 Contact form submission received:');
        console.log('  From:', name, '<' + from + '>');
        console.log('  Subject:', subject);

        // Check if SendGrid is configured
        if (!process.env.SENDGRID_API_KEY) {
            console.error('❌ SENDGRID_API_KEY not configured!');
            return {
                statusCode: 500,
                body: JSON.stringify({
                    error: 'Email service not configured',
                    message: 'Please add SENDGRID_API_KEY to environment variables'
                })
            };
        }

        // Configure SendGrid
        sgMail.setApiKey(process.env.SENDGRID_API_KEY);
        
        // Create email message
        const msg = {
            to: to,
            from: process.env.SENDGRID_VERIFIED_SENDER || 'scosom@gmail.com', // Must be verified in SendGrid
            replyTo: from,
            subject: subject,
            text: `From: ${name} (${from})\n\n${message}`,
            html: `
                <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                    <h2 style="color: #6366F1; border-bottom: 3px solid #FFE951; padding-bottom: 10px;">
                        📧 New Contact Form Submission
                    </h2>
                    <div style="background: #f5f5f5; padding: 20px; border-radius: 8px; margin: 20px 0;">
                        <p><strong>From:</strong> ${name}</p>
                        <p><strong>Email:</strong> <a href="mailto:${from}">${from}</a></p>
                        <p><strong>Subject:</strong> ${subject}</p>
                    </div>
                    <div style="background: white; padding: 20px; border: 2px solid #ddd; border-radius: 8px;">
                        <h3 style="color: #333; margin-top: 0;">Message:</h3>
                        <p style="white-space: pre-wrap; line-height: 1.6;">${message}</p>
                    </div>
                    <hr style="margin: 30px 0; border: 1px solid #ddd;">
                    <p style="color: #666; font-size: 12px;">
                        Sent from Mr. Somers Maps contact form<br>
                        Reply directly to this email to respond to ${name}
                    </p>
                </div>
            `
        };
        
        // Send email via SendGrid
        await sgMail.send(msg);
        
        console.log('✅ Email sent successfully via SendGrid');
        
        return {
            statusCode: 200,
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                success: true,
                message: 'Email sent successfully!'
            })
        };

    } catch (error) {
        console.error('❌ Error sending email:', error);
        
        // SendGrid-specific error handling
        if (error.response) {
            console.error('SendGrid error details:', error.response.body);
        }
        
        return {
            statusCode: 500,
            body: JSON.stringify({
                error: 'Failed to send email',
                details: error.message
            })
        };
    }
};

// ============================================
// SETUP INSTRUCTIONS FOR MR. SOMERS
// ============================================
/*

The contact form currently uses a FALLBACK approach that opens the user's
email client. This works fine! But if you want proper email sending:

OPTION A - SendGrid (Free tier: 100 emails/day)
1. Sign up at https://sendgrid.com
2. Get API key from Settings → API Keys
3. Add to Netlify: Site Settings → Environment Variables
   - Name: SENDGRID_API_KEY
   - Value: your_api_key_here
4. Run: npm install @sendgrid/mail
5. Uncomment the SendGrid code above

OPTION B - Mailgun (Free tier: 5,000 emails/month)
1. Sign up at https://mailgun.com
2. Get API key and domain
3. Add to Netlify environment variables
4. Install: npm install mailgun-js
5. Update code to use Mailgun

OPTION C - Keep it simple (CURRENT)
The mailto fallback works great! Users' email apps open with the message
pre-filled. You receive the email just fine. No setup needed!

RECOMMENDATION: Stick with the mailto fallback for now. It's simple,
reliable, and requires zero configuration. If you get lots of contact
form submissions later, consider SendGrid.

*/
