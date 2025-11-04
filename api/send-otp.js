import twilio from 'twilio';

const otpStore = globalThis.otpStore || (globalThis.otpStore = new Map());

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
  otpStore.set(phone, { otp, expires: Date.now() + 5 * 60 * 1000 });

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
