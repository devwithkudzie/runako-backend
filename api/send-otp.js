import twilio from 'twilio';
import { supabase } from './_supabase.js';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.status(405).json({ error: 'Method not allowed' });
    return;
  }
  const { phone } = req.body;
  if (!phone) {
    res.status(400).json({ error: 'Phone number required' });
    return;
  }
  const otp = Math.floor(100000 + Math.random() * 900000).toString();
  const expiresAt = new Date(Date.now() + 5 * 60 * 1000).toISOString();

  // Debug: log env variables (do not log secrets in production!)
  console.log('SUPABASE_URL:', process.env.SUPABASE_URL);
  console.log('SUPABASE_SERVICE_ROLE_KEY exists:', !!process.env.SUPABASE_SERVICE_ROLE_KEY);

  // Store OTP in Supabase
  const { error: dbError, data: dbData } = await supabase.from('otps').insert({ phone, otp, expires_at: expiresAt });
  console.log('Supabase insert result:', { dbError, dbData });
  if (dbError) {
    res.status(500).json({ error: 'Failed to store OTP', details: dbError.message });
    return;
  }

  const accountSid = process.env.TWILIO_ACCOUNT_SID;
  const authToken = process.env.TWILIO_AUTH_TOKEN;
  const messagingServiceSid = process.env.TWILIO_MESSAGING_SERVICE_SID;
  const client = twilio(accountSid, authToken);

  try {
    await client.messages.create({
      to: phone,
      messagingServiceSid,
      body: `Your Runako OTP code is: ${otp}`,
    });
    res.status(200).json({ success: true });
  } catch (e) {
    res.status(500).json({ error: 'Failed to send OTP', details: e.message });
  }
}
