import { supabase } from './_supabase.js';

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
  // Find OTP in Supabase
  const { data, error } = await supabase
    .from('otps')
    .select('*')
    .eq('phone', phone)
    .eq('otp', otp)
    .gt('expires_at', new Date().toISOString())
    .limit(1);

  if (error) {
    res.status(500).json({ error: 'Database error', details: error.message });
    return;
  }
  if (!data || data.length === 0) {
    res.status(401).json({ success: false, error: 'Invalid or expired OTP' });
    return;
  }
  // Delete OTP after use
  await supabase.from('otps').delete().eq('id', data[0].id);
  res.status(200).json({ success: true });
}
