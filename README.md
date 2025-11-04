# Runako OTP Backend (Vercel + Twilio)

This backend provides phone OTP authentication using Twilio, deployable as Vercel serverless functions.

## Endpoints

- `POST /api/send-otp` — Send OTP to a phone number
- `POST /api/verify-otp` — Verify OTP for a phone number

## Setup

1. Copy `.env.example` to `.env` and fill in your Twilio credentials.
2. Run `npm install`.
3. Deploy to Vercel or run locally with `vercel dev`.

## Example Request

### Send OTP
```sh
curl -X POST https://<your-vercel-url>/api/send-otp \
  -H 'Content-Type: application/json' \
  -d '{"phone": "+1234567890"}'
```

### Verify OTP
```sh
curl -X POST https://<your-vercel-url>/api/verify-otp \
  -H 'Content-Type: application/json' \
  -d '{"phone": "+1234567890", "otp": "123456"}'
```
# runako-backend
