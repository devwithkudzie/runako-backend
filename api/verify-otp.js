const otpStore = globalThis.otpStore || (globalThis.otpStore = new Map());

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.status(405).json({ error: 'Method not allowed' });
    return;
  }
  const { phone, otp } = req.body;
  if (!phone || !otp) {
    res.status(400).json({ error: 'Phone and OTP required' });
    return;
  }
  const record = otpStore.get(phone);
  if (!record || record.otp !== otp) {
    res.status(401).json({ success: false, error: 'Invalid OTP' });
    return;
  }
  if (Date.now() > record.expires) {
    otpStore.delete(phone);
    res.status(401).json({ success: false, error: 'OTP expired' });
    return;
  }
  otpStore.delete(phone);
  res.status(200).json({ success: true });
}
