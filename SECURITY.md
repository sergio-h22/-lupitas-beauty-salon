# Security & Best Practices

This document outlines the security features implemented and recommendations for deployment.

---

## Implemented Security Features

### 1. **Admin Authentication**
- ✅ Email + password login via Supabase
- ✅ Session-based authentication
- ✅ Automatic logout on inactivity (30 minutes)
- ✅ Activity logging for compliance

### 2. **Rate Limiting**
- ✅ Login attempt rate limiting (5 attempts per 15 minutes)
- ✅ Prevents brute force attacks
- ✅ User-friendly error messages

### 3. **Security Headers**
- ✅ X-Content-Type-Options: nosniff
- ✅ X-Frame-Options: SAMEORIGIN (prevents clickjacking)
- ✅ X-XSS-Protection: 1; mode=block
- ✅ Strict-Transport-Security: HSTS enabled
- ✅ Permissions-Policy: Restricts camera, mic, geolocation
- ✅ Admin pages: Cache-Control: no-store (prevents caching)

### 4. **Input Validation**
- ✅ Email format validation
- ✅ Password minimum 6 characters (enforce 8+ on signup)
- ✅ Appointment form validation (name, phone, email)
- ✅ XSS protection via Next.js/React

### 5. **Audit Logging**
- ✅ Login/logout events tracked
- ✅ Appointment approvals/cancellations logged
- ✅ Time-off changes logged
- ✅ Failed login attempts recorded
- ✅ Timestamps and user email stored

### 6. **Session Management**
- ✅ 30-minute inactivity timeout
- ✅ Automatic session refresh on activity
- ✅ Secure logout clears session

---

## Before Going Live

### 1. **Database Backup**
```sql
-- Set up automated backups in Supabase
-- Go to: Settings → Backups
-- Recommended: Daily backups, retain 7 days
```

### 2. **Audit Logs to Database**
Currently audit logs are stored in browser sessionStorage. Before production:
- Move audit logs to Supabase database table
- Create admin endpoint to view/export audit logs
- Set retention policy (e.g., keep 90 days)

```sql
CREATE TABLE audit_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_email TEXT NOT NULL,
  action TEXT NOT NULL,
  details JSONB,
  ip_address TEXT,
  timestamp TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_audit_logs_user ON audit_logs(user_email);
CREATE INDEX idx_audit_logs_timestamp ON audit_logs(timestamp DESC);
```

### 3. **Payment Security**
- ✅ Stripe handles encryption (no card data stored)
- Recommended: Set up webhooks for payment events
- Recommended: Enable Stripe 3D Secure for fraud protection

### 4. **Email Notifications**
```
Before launch:
- Add email confirmations for bookings (Resend/SendGrid)
- Send appointment reminders (24 hours before)
- Send owner notifications on new bookings
```

### 5. **Password Policy**
Current minimum: 6 characters
Recommended for production:
- Enforce 12+ characters
- Require uppercase + lowercase + numbers + special chars
- Implement password reset via email

### 6. **Two-Factor Authentication (2FA)**
Recommended for production:
- Add 2FA option for owner account
- Use time-based OTP (TOTP) via authenticator app
- Supabase has native 2FA support

### 7. **Environment Variables**
- Never commit `.env.local` (already in .gitignore)
- Use Vercel's encrypted secrets for production
- Rotate Stripe and Supabase keys annually
- Use separate keys for dev/staging/production

### 8. **CORS Configuration**
If API is accessed from other domains, configure CORS:
```typescript
// middleware.ts
import { NextRequest, NextResponse } from 'next/server';

export function middleware(request: NextRequest) {
  const response = NextResponse.next();

  response.headers.set('Access-Control-Allow-Origin', process.env.ALLOWED_ORIGIN || '*');
  response.headers.set('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');

  return response;
}
```

### 9. **SQL Injection Prevention**
- ✅ Supabase uses parameterized queries (safe)
- Never concatenate SQL strings
- Use Supabase SDK for all database operations

### 10. **Monitoring & Alerts**
Recommended tools:
- **Error tracking**: Sentry (free tier)
- **Uptime monitoring**: UptimeRobot (free tier)
- **Log aggregation**: Vercel logs (built-in)

---

## Deployment Checklist

Before deploying to production:

- [ ] Update `.env.local` with real Stripe keys
- [ ] Update `.env.local` with real Supabase keys
- [ ] Set `NEXT_PUBLIC_PAYMENTS_ENABLED=true` (if using Stripe)
- [ ] Create owner account in Supabase
- [ ] Test login/logout flow
- [ ] Test appointment booking
- [ ] Test payment flow (if enabled)
- [ ] Verify email headers are set (check browser DevTools)
- [ ] Run security audit (see below)
- [ ] Enable HTTPS (automatic on Vercel)
- [ ] Set custom domain in Vercel
- [ ] Enable branch protection on main (require reviews)
- [ ] Set up CI/CD pipeline (Vercel auto-deploys)

---

## Running a Security Audit

```bash
# Check for dependency vulnerabilities
npm audit

# Fix vulnerabilities (if safe)
npm audit fix

# Run security checks (if available)
npm run lint

# Build and test locally
npm run build
npm test
```

---

## Incident Response

### If password compromised:
1. Have owner change password in Supabase
2. Check audit logs for suspicious activity
3. Review recent appointments for changes
4. If deployed, monitor for continued suspicious access

### If Stripe key leaked:
1. Go to Stripe Dashboard
2. Revoke the leaked key immediately
3. Generate new key
4. Update environment variables
5. Redeploy

### If Supabase key leaked:
1. Go to Supabase Settings → API
2. Revoke the old key
3. Generate new key
4. Update environment variables
5. Redeploy

---

## Security Resources

- [OWASP Top 10](https://owasp.org/www-project-top-ten/)
- [Next.js Security Best Practices](https://nextjs.org/docs/basic-features/data-fetching/security)
- [Supabase Security](https://supabase.com/docs/guides/platform/security)
- [Stripe Security](https://stripe.com/docs/security)

---

## Questions?

For security issues, DO NOT post on GitHub. Email the address in `lib/business.ts` (`BUSINESS.email`) with details.
