-- Supabase SQL for OTP storage
create table if not exists otps (
  id serial primary key,
  phone text not null,
  otp text not null,
  expires_at timestamp with time zone not null
);

create index if not exists idx_otps_phone_otp on otps(phone, otp);
create index if not exists idx_otps_expires_at on otps(expires_at);
