# Email Setup Guide for Contact Forms

Your contact forms need a real email service because most people (like you!) use webmail (Gmail, Outlook) instead of desktop email clients.

---

## 🏆 RECOMMENDED: SendGrid Setup (15 minutes)

### Why SendGrid?
- ✅ **Free tier: 100 emails/day** (perfect for classroom use)
- ✅ No credit card required
- ✅ Simple setup
- ✅ Great deliverability

### Step-by-Step Instructions:

#### 1. Create SendGrid Account (5 minutes)
1. Go to https://signup.sendgrid.com/
2. Fill out the form:
   - Email: `scosom@gmail.com` (your Gmail)
   - Password: (create a strong password)
   - Company: "Somers Geography Class" or "Education"
3. Click "Create Account"
4. Check your email for verification link
5. Click the verification link

#### 2. Get Your API Key (3 minutes)
1. Log into SendGrid dashboard
2. Click **Settings** in left sidebar
3. Click **API Keys**
4. Click **Create API Key** button
5. Name it: `MrSomersMaps` or `ContactFormKey`
6. Choose **Restricted Access**:
   - Find "Mail Send" and toggle it to **FULL ACCESS**
   - Everything else can stay off
7. Click **Create & View**
8. **COPY THE API KEY NOW** - you can only see it once!
   - It looks like: `SG.xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx`
   - Save it in a text file temporarily

#### 3. Verify Sender Email (5 minutes)
This is REQUIRED - SendGrid won't send emails until you verify your sender address.

1. In SendGrid dashboard, go to **Settings** → **Sender Authentication**
2. Click **Verify a Single Sender**
3. Fill out the form:
   - **From Name:** Mr. Somers
   - **From Email Address:** scosom@gmail.com
   - **Reply To:** scosom@gmail.com
   - **Company Address:** (your school address)
   - **City/State/Zip:** (your school location)
   - **Country:** United States
4. Click **Create**
5. Check your Gmail inbox for verification email from SendGrid
6. Click the verification link in the email
7. You should see "Sender verified!" message

#### 4. Add API Key to Netlify (2 minutes)
1. Go to your Netlify dashboard: https://app.netlify.com/
2. Click on your site (mrsomersmaps or whatever it's named)
3. Go to **Site settings** → **Environment variables**
4. Click **Add a variable** → **Add a single variable**
5. Add these TWO variables:

   **Variable 1:**
   - Key: `SENDGRID_API_KEY`
   - Value: (paste your SendGrid API key from step 2)
   - Click **Create variable**

   **Variable 2:**
   - Key: `SENDGRID_VERIFIED_SENDER`
   - Value: `scosom@gmail.com`
   - Click **Create variable**

6. Click **Save**

#### 5. Install SendGrid Package (1 minute)
Open PowerShell in your project folder and run:

```powershell
npm install @sendgrid/mail
```

#### 6. Deploy and Test! (2 minutes)
1. Commit your changes:
   ```powershell
   git add .
   git commit -m "Add SendGrid email integration"
   git push origin main
   ```

2. Wait for Netlify to deploy (usually 1-2 minutes)

3. Test the contact form:
   - Go to your live site's Terms of Service page
   - Click "📧 Send Message"
   - Fill out the form and submit
   - Check your Gmail - you should receive the email within seconds!

---

## Alternative: Mailgun Setup (if you prefer)

### Why Mailgun?
- ✅ **Free tier: 5,000 emails/month** (more generous than SendGrid)
- ✅ Good for higher volume
- ❌ **Requires credit card** (won't be charged unless you exceed free tier)
- ❌ More complex setup

### Step-by-Step Instructions:

#### 1. Create Mailgun Account
1. Go to https://signup.mailgun.com/
2. Fill out the form (requires credit card)
3. Verify your email

#### 2. Get API Key
1. Log into Mailgun dashboard
2. Go to **Settings** → **API Keys**
3. Copy your **Private API key**
   - Looks like: `key-xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx`

#### 3. Verify Domain (More Complex)
1. In Mailgun, go to **Sending** → **Domains**
2. Click **Add New Domain**
3. Follow their instructions to add DNS records
   - This requires access to your domain registrar (GoDaddy, Namecheap, etc.)
   - Takes 24-48 hours for DNS to propagate

**OR use Mailgun's sandbox domain** (easier for testing):
- Sandbox domain: `sandboxXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX.mailgun.org`
- Add authorized recipient: `scosom@gmail.com`

#### 4. Update Function Code
Replace the SendGrid code in `send-contact-email.js` with:

```javascript
const formData = require('form-data');
const Mailgun = require('mailgun.js');
const mailgun = new Mailgun(formData);

const mg = mailgun.client({
    username: 'api',
    key: process.env.MAILGUN_API_KEY
});

// Inside the handler function:
const emailData = {
    from: 'Mr. Somers Maps <mailgun@YOUR_DOMAIN.mailgun.org>',
    to: to,
    'h:Reply-To': from,
    subject: subject,
    text: `From: ${name} (${from})\n\n${message}`,
    html: `<p><strong>From:</strong> ${name} (${from})</p><p>${message}</p>`
};

await mg.messages.create(process.env.MAILGUN_DOMAIN, emailData);
```

#### 5. Add Environment Variables to Netlify
- `MAILGUN_API_KEY` = your private API key
- `MAILGUN_DOMAIN` = your verified domain or sandbox domain

#### 6. Install Mailgun Package
```powershell
npm install mailgun.js form-data
```

---

## Testing Locally

To test on your local dev server (`localhost:8888`):

1. Create a `.env.local` file (Git will ignore it):
   ```
   SENDGRID_API_KEY=SG.your_key_here
   SENDGRID_VERIFIED_SENDER=scosom@gmail.com
   ```

2. Update `local-dev-server.js` to load `.env.local`:
   ```javascript
   require('dotenv').config({ path: '.env.local' });
   ```

3. Restart your local server

4. Test the contact form on `localhost:8888/terms-of-service.html`

---

## Troubleshooting

### "Email not sending"
1. Check Netlify logs: Site → Functions → send-contact-email
2. Verify your API key is correct
3. Make sure sender email is verified in SendGrid

### "403 Forbidden" error
- Your SendGrid sender email isn't verified yet
- Check your Gmail for the verification email

### "Missing API key" error
- Environment variables not set in Netlify
- Make sure you saved them and redeployed

### "Emails going to spam"
- This is rare with SendGrid, but if it happens:
- Use your verified Gmail address as the sender
- Avoid spam trigger words in subject/message
- SendGrid has excellent deliverability

---

## Cost Comparison

| Service | Free Tier | Paid Plans Start At | Credit Card Required? |
|---------|-----------|---------------------|----------------------|
| **SendGrid** | 100/day (3,000/month) | $19.95/month (50,000 emails) | ❌ No |
| **Mailgun** | 5,000/month | $35/month (50,000 emails) | ✅ Yes |

**For a classroom contact form:** SendGrid's free tier is perfect. You'd have to receive 100+ contact form submissions per day to hit the limit!

---

## My Recommendation

**Use SendGrid.** It's simpler, doesn't require a credit card, and 100 emails/day is way more than you'll need for a classroom contact form.

Total setup time: **15 minutes**

Questions? Let me know if you get stuck on any step!
