import { Resend } from 'resend';
export class EmailService {
    getResendClient() {
        const apiKey = (typeof process !== 'undefined' ? process.env?.RESEND_API_KEY : undefined)?.trim();
        const fromEmail = (typeof process !== 'undefined' ? process.env?.EMAIL_FROM : undefined)?.trim() || 'LankaVoyage <onboarding@resend.dev>';
        const adminEmail = (typeof process !== 'undefined' ? process.env?.ADMIN_EMAIL : undefined)?.trim() || 'admin@lankavoyage.com';
        if (!apiKey) {
            throw new Error('RESEND_API_KEY is not configured on the server. Please set RESEND_API_KEY in environment variables.');
        }
        return { resend: new Resend(apiKey), fromEmail, adminEmail };
    }
    /**
     * 1. Sends a branded LankaVoyage 6-digit OTP verification email via Resend
     */
    async sendVerificationOTP(params) {
        const { to, name, code, expiresInMinutes = 10 } = params;
        let resend;
        let fromEmail;
        try {
            const client = this.getResendClient();
            resend = client.resend;
            fromEmail = client.fromEmail;
        }
        catch (err) {
            console.error(`❌ [EmailService Config Error] Recipient: ${to} | Error: ${err.message}`);
            return { success: false, error: err.message };
        }
        try {
            const subject = `${code} is your LankaVoyage verification code`;
            const htmlContent = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <title>Your LankaVoyage Verification Code</title>
  <style>
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color: #F8F7F2; margin: 0; padding: 0; color: #17231F; }
    .container { max-width: 540px; margin: 40px auto; background: #ffffff; border-radius: 24px; overflow: hidden; box-shadow: 0 10px 30px rgba(6,44,34,0.08); border: 1px solid #E6E4DC; }
    .header { background: linear-gradient(135deg, #062C22 0%, #0B3D2E 100%); padding: 36px 30px; text-align: center; color: white; }
    .logo-text { font-family: Georgia, serif; font-size: 26px; font-weight: 700; color: #ffffff; }
    .logo-highlight { color: #39A982; }
    .content { padding: 36px 32px; }
    .otp-card { background: #F4F8F6; border: 2px dashed #39A982; border-radius: 18px; padding: 24px 20px; text-align: center; margin: 24px 0; }
    .otp-code { font-family: monospace; font-size: 38px; font-weight: 800; letter-spacing: 10px; color: #062C22; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <div class="logo-text">Lanka<span class="logo-highlight">Voyage</span></div>
      <div style="font-size: 11px; text-transform: uppercase; letter-spacing: 2px; color: #DDEFE8; margin-top: 6px;">Bespoke Sri Lanka Travel</div>
    </div>
    <div class="content">
      <h1 style="font-family: Georgia, serif; font-size: 22px; color: #062C22; margin-top: 0;">Verify Your Email</h1>
      <p>Hello <strong>${escapeHtml(name)}</strong>,</p>
      <p>Please enter the 6-digit verification code below to activate your account:</p>
      <div class="otp-card">
        <div class="otp-code">${code}</div>
        <p style="font-size: 12px; color: #68736E; margin: 8px 0 0 0;">Enter this code on the verification page</p>
      </div>
      <p style="font-size: 12px; color: #8C9993; margin-top: 20px; border-top: 1px solid #F0EEE6; padding-top: 14px;">⏱️ Valid for ${expiresInMinutes} minutes. Never share this code with anyone.</p>
    </div>
  </div>
</body>
</html>
`;
            const response = await resend.emails.send({
                from: fromEmail,
                to: [to],
                subject,
                html: htmlContent,
            });
            if (response.error) {
                console.error(`❌ [Resend Delivery Error] To: ${to} | Error: ${response.error.message}`);
                return { success: false, error: response.error.message };
            }
            console.log(`✅ [EmailService Success] Verification email delivered to ${to} (Message ID: ${response.data?.id})`);
            return { success: true, id: response.data?.id };
        }
        catch (err) {
            console.error(`❌ [EmailService Exception] To: ${to} | Exception: ${err.message || err}`);
            return { success: false, error: err.message || 'Failed to deliver email through Resend.' };
        }
    }
    /**
     * 2. Sends a branded LankaVoyage 6-digit Password Reset OTP email via Resend
     */
    async sendPasswordResetOTP(params) {
        const { to, name, code, expiresInMinutes = 10 } = params;
        let resend;
        let fromEmail;
        try {
            const client = this.getResendClient();
            resend = client.resend;
            fromEmail = client.fromEmail;
        }
        catch (err) {
            console.error(`❌ [EmailService Config Error] Recipient: ${to} | Error: ${err.message}`);
            return { success: false, error: err.message };
        }
        try {
            const subject = `${code} is your LankaVoyage password reset code`;
            const htmlContent = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <title>Reset Your LankaVoyage Password</title>
  <style>
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color: #F8F7F2; margin: 0; padding: 0; color: #17231F; }
    .container { max-width: 540px; margin: 40px auto; background: #ffffff; border-radius: 24px; overflow: hidden; box-shadow: 0 10px 30px rgba(6,44,34,0.08); border: 1px solid #E6E4DC; }
    .header { background: linear-gradient(135deg, #062C22 0%, #0B3D2E 100%); padding: 36px 30px; text-align: center; color: white; }
    .logo-text { font-family: Georgia, serif; font-size: 26px; font-weight: 700; color: #ffffff; }
    .logo-highlight { color: #39A982; }
    .content { padding: 36px 32px; }
    .otp-card { background: #FFFBEB; border: 2px dashed #D97706; border-radius: 18px; padding: 24px 20px; text-align: center; margin: 24px 0; }
    .otp-code { font-family: monospace; font-size: 38px; font-weight: 800; letter-spacing: 10px; color: #92400E; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <div class="logo-text">Lanka<span class="logo-highlight">Voyage</span></div>
      <div style="font-size: 11px; text-transform: uppercase; letter-spacing: 2px; color: #DDEFE8; margin-top: 6px;">Bespoke Sri Lanka Travel</div>
    </div>
    <div class="content">
      <h1 style="font-family: Georgia, serif; font-size: 22px; color: #062C22; margin-top: 0;">Password Reset Request</h1>
      <p>Hello <strong>${escapeHtml(name)}</strong>,</p>
      <p>We received a request to reset the password for your LankaVoyage traveler account. Please enter the 6-digit code below to set a new password:</p>
      <div class="otp-card">
        <div class="otp-code">${code}</div>
        <p style="font-size: 12px; color: #78350F; margin: 8px 0 0 0;">Enter this code on the password reset page</p>
      </div>
      <p style="font-size: 12px; color: #8C9993; margin-top: 20px; border-top: 1px solid #F0EEE6; padding-top: 14px;">⏱️ This single-use code expires in <strong>${expiresInMinutes} minutes</strong>. If you did not request a password reset, you can safely ignore this email.</p>
    </div>
    <div style="background: #F8F7F2; padding: 18px 30px; text-align: center; font-size: 11px; color: #8C9993; border-top: 1px solid #E6E4DC;">
      &copy; ${new Date().getFullYear()} LankaVoyage Ltd. Colombo, Sri Lanka.
    </div>
  </div>
</body>
</html>
`;
            const response = await resend.emails.send({
                from: fromEmail,
                to: [to],
                subject,
                html: htmlContent,
            });
            if (response.error) {
                console.error(`❌ [Resend Delivery Error] Password Reset To: ${to} | Error: ${response.error.message}`);
                return { success: false, error: response.error.message };
            }
            console.log(`✅ [EmailService Success] Password reset OTP delivered to ${to} (Message ID: ${response.data?.id})`);
            return { success: true, id: response.data?.id };
        }
        catch (err) {
            console.error(`❌ [EmailService Exception] Password Reset To: ${to} | Exception: ${err.message || err}`);
            return { success: false, error: err.message || 'Failed to deliver password reset email through Resend.' };
        }
    }
    /**
     * 3. Sends Admin notification when customer creates a new PENDING booking request
     */
    async sendAdminNewBookingNotification(params) {
        let resend;
        let fromEmail;
        let adminEmail;
        try {
            const client = this.getResendClient();
            resend = client.resend;
            fromEmail = client.fromEmail;
            adminEmail = client.adminEmail;
        }
        catch (err) {
            console.error(`❌ [EmailService Config Error] Admin Notification | Error: ${err.message}`);
            return { success: false, error: err.message };
        }
        try {
            const subject = `🔔 New Booking Request: ${params.bookingCode} - ${params.customerName}`;
            const htmlContent = `
<!DOCTYPE html>
<html>
<head><meta charset="utf-8"><title>New Booking Request</title></head>
<body style="font-family: sans-serif; background: #F8F7F2; padding: 20px; color: #062C22;">
  <div style="max-width: 560px; margin: 0 auto; background: white; border-radius: 20px; border: 1px solid #E6E4DC; overflow: hidden; box-shadow: 0 10px 25px rgba(0,0,0,0.05);">
    <div style="background: #062C22; padding: 24px; color: white; text-align: center;">
      <h2 style="margin: 0; font-family: Georgia, serif;">LankaVoyage Admin Portal</h2>
      <p style="margin: 4px 0 0 0; font-size: 12px; color: #39A982; text-transform: uppercase; letter-spacing: 1px;">New Booking Request Received</p>
    </div>
    <div style="padding: 28px;">
      <div style="background: #FFFBEB; border: 1px solid #FDE68A; padding: 12px 16px; border-radius: 12px; margin-bottom: 20px;">
        <strong style="color: #92400E;">Status: PENDING ADMIN REVIEW</strong>
      </div>
      <table style="width: 100%; font-size: 13px; line-height: 1.8;">
        <tr><td style="color: #6B7280; width: 140px;">Booking Code:</td><td><strong style="color: #176B52;">${escapeHtml(params.bookingCode)}</strong></td></tr>
        <tr><td style="color: #6B7280;">Customer:</td><td><strong>${escapeHtml(params.customerName)}</strong></td></tr>
        <tr><td style="color: #6B7280;">Email:</td><td>${escapeHtml(params.customerEmail)}</td></tr>
        <tr><td style="color: #6B7280;">Phone:</td><td>${escapeHtml(params.customerPhone || 'Not provided')}</td></tr>
        <tr><td style="color: #6B7280;">Tour / Service:</td><td><strong>${escapeHtml(params.tourTitle)}</strong></td></tr>
        <tr><td style="color: #6B7280;">Travel Date:</td><td>${escapeHtml(params.startDate)}</td></tr>
        <tr><td style="color: #6B7280;">Flight Number:</td><td>${escapeHtml(params.flightNumber || 'Not specified')}</td></tr>
        <tr><td style="color: #6B7280;">Travelers:</td><td>${params.totalTravelers} Passenger(s)</td></tr>
        <tr><td style="color: #6B7280;">Total Amount:</td><td><strong style="font-size: 16px; color: #062C22;">LKR ${params.totalAmount.toLocaleString()}</strong></td></tr>
      </table>
      <div style="margin-top: 26px; text-align: center;">
        <a href="${params.adminDashboardUrl}" style="background: #0B3D2E; color: white; padding: 12px 24px; text-decoration: none; font-weight: bold; border-radius: 12px; display: inline-block; font-size: 13px;">Review & Confirm in Admin Portal</a>
      </div>
    </div>
  </div>
</body>
</html>
`;
            const response = await resend.emails.send({
                from: fromEmail,
                to: [adminEmail],
                subject,
                html: htmlContent
            });
            if (response.error) {
                console.error(`❌ [Resend Admin Notification Error] Error: ${response.error.message}`);
                return { success: false, error: response.error.message };
            }
            console.log(`✅ [EmailService] Admin notified for new booking ${params.bookingCode}`);
            return { success: true, id: response.data?.id };
        }
        catch (err) {
            console.error(`❌ [EmailService Exception] Admin Notification: ${err.message}`);
            return { success: false, error: err.message };
        }
    }
    /**
     * 4. Sends Customer Confirmation Email with PAY NOW button once Admin confirms booking
     */
    async sendCustomerBookingConfirmed(params) {
        let resend;
        let fromEmail;
        try {
            const client = this.getResendClient();
            resend = client.resend;
            fromEmail = client.fromEmail;
        }
        catch (err) {
            console.error(`❌ [EmailService Config Error] Customer Confirmation | Error: ${err.message}`);
            return { success: false, error: err.message };
        }
        try {
            const subject = `✨ Your LankaVoyage Booking Has Been Confirmed (${params.bookingCode})`;
            const htmlContent = `
<!DOCTYPE html>
<html>
<head><meta charset="utf-8"><title>Booking Confirmed</title></head>
<body style="font-family: sans-serif; background: #F8F7F2; padding: 20px; color: #062C22;">
  <div style="max-width: 560px; margin: 0 auto; background: white; border-radius: 24px; border: 1px solid #E6E4DC; overflow: hidden; box-shadow: 0 10px 30px rgba(0,0,0,0.06);">
    <div style="background: linear-gradient(135deg, #062C22 0%, #0B3D2E 100%); padding: 32px 24px; color: white; text-align: center;">
      <h1 style="font-family: Georgia, serif; font-size: 24px; margin: 0;">Lanka<span style="color: #39A982;">Voyage</span></h1>
      <p style="font-size: 11px; text-transform: uppercase; letter-spacing: 2px; color: #DDEFE8; margin-top: 6px;">Bespoke Sri Lanka Travel</p>
    </div>
    <div style="padding: 32px;">
      <div style="background: #ECFDF5; border: 1px solid #A7F3D0; padding: 14px 18px; border-radius: 14px; margin-bottom: 22px; text-align: center;">
        <span style="color: #065F46; font-weight: bold; font-size: 14px;">🎉 Great news! Your booking request has been CONFIRMED.</span>
      </div>
      <p>Hello <strong>${escapeHtml(params.name)}</strong>,</p>
      <p>Our operations team has reviewed and confirmed availability for your upcoming journey:</p>
      
      <div style="background: #F8F7F2; border-radius: 16px; padding: 18px; margin: 20px 0; font-size: 13px; line-height: 1.8;">
        <div><strong>Booking Code:</strong> <span style="color: #176B52; font-weight: bold;">${escapeHtml(params.bookingCode)}</span></div>
        <div><strong>Experience:</strong> ${escapeHtml(params.tourTitle)}</div>
        <div><strong>Travel Date:</strong> ${escapeHtml(params.startDate)}</div>
        <div><strong>Total Payable:</strong> <strong style="font-size: 15px; color: #062C22;">LKR ${params.totalAmount.toLocaleString()}</strong></div>
      </div>

      <p style="font-size: 13px; color: #4B5563;">Payment is now available. Please click below to complete your payment securely via PayHere:</p>

      <div style="margin: 28px 0; text-align: center;">
        <a href="${params.payNowUrl}" style="background: #0B3D2E; color: white; padding: 14px 32px; text-decoration: none; font-weight: bold; border-radius: 14px; display: inline-block; font-size: 14px; box-shadow: 0 4px 12px rgba(6,44,34,0.15);">Pay Now (PayHere Gateway) &rarr;</a>
      </div>

      <p style="font-size: 11px; color: #8C9993; text-align: center; border-top: 1px solid #F0EEE6; padding-top: 16px; margin-top: 24px;">
        Dedicated Chauffeur & VIP Airport Transfers &bull; LankaVoyage Ltd.
      </p>
    </div>
  </div>
</body>
</html>
`;
            const response = await resend.emails.send({
                from: fromEmail,
                to: [params.to],
                subject,
                html: htmlContent
            });
            if (response.error) {
                console.error(`❌ [Resend Customer Confirmation Error] To: ${params.to} | Error: ${response.error.message}`);
                return { success: false, error: response.error.message };
            }
            console.log(`✅ [EmailService] Customer confirmed notification delivered to ${params.to}`);
            return { success: true, id: response.data?.id };
        }
        catch (err) {
            console.error(`❌ [EmailService Exception] Customer Confirmation: ${err.message}`);
            return { success: false, error: err.message };
        }
    }
    /**
     * 4b. Sends Customer Rejection Email when Admin rejects a booking request
     */
    async sendCustomerBookingRejected(params) {
        let resend;
        let fromEmail;
        try {
            const client = this.getResendClient();
            resend = client.resend;
            fromEmail = client.fromEmail;
        }
        catch (err) {
            return { success: false, error: err.message };
        }
        try {
            const subject = `Update regarding your LankaVoyage Booking Request (${params.bookingCode})`;
            const htmlContent = `
<!DOCTYPE html>
<html>
<head><meta charset="utf-8"><title>Booking Request Update</title></head>
<body style="font-family: sans-serif; background: #F8F7F2; padding: 20px; color: #062C22;">
  <div style="max-width: 560px; margin: 0 auto; background: white; border-radius: 24px; border: 1px solid #E6E4DC; overflow: hidden; box-shadow: 0 10px 30px rgba(0,0,0,0.06);">
    <div style="background: #062C22; padding: 32px 24px; color: white; text-align: center;">
      <h1 style="font-family: Georgia, serif; font-size: 24px; margin: 0;">Lanka<span style="color: #39A982;">Voyage</span></h1>
      <p style="font-size: 11px; text-transform: uppercase; letter-spacing: 2px; color: #DDEFE8; margin-top: 6px;">Bespoke Sri Lanka Travel</p>
    </div>
    <div style="padding: 32px;">
      <div style="background: #FEF2F2; border: 1px solid #FECACA; padding: 14px 18px; border-radius: 14px; margin-bottom: 22px; text-align: center;">
        <span style="color: #991B1B; font-weight: bold; font-size: 14px;">Booking Request Status: Not Confirmed</span>
      </div>
      <p>Hello <strong>${escapeHtml(params.name)}</strong>,</p>
      <p>Thank you for your interest in traveling with LankaVoyage. After reviewing operational availability for <strong>${escapeHtml(params.tourTitle)}</strong> (Ref: <strong>${escapeHtml(params.bookingCode)}</strong>), our operations team is unable to confirm your booking for the requested dates.</p>
      
      ${params.reason ? `<p style="background: #F8F7F2; padding: 12px 16px; border-radius: 12px; font-size: 13px; color: #4B5563;"><strong>Note from concierge:</strong> ${escapeHtml(params.reason)}</p>` : ''}

      <p style="font-size: 13px; color: #4B5563;">No payment has been charged. We invite you to explore alternative dates or custom itineraries with our travel specialists.</p>
      <p style="font-size: 11px; color: #8C9993; text-align: center; border-top: 1px solid #F0EEE6; padding-top: 16px; margin-top: 24px;">
        Dedicated Chauffeur & VIP Airport Transfers &bull; LankaVoyage Ltd.
      </p>
    </div>
  </div>
</body>
</html>
`;
            const response = await resend.emails.send({
                from: fromEmail,
                to: [params.to],
                subject,
                html: htmlContent
            });
            return { success: !response.error, id: response.data?.id, error: response.error?.message };
        }
        catch (err) {
            return { success: false, error: err.message };
        }
    }
    /**
     * 5. Sends Customer Payment Success Email after verified PayHere IPN
     */
    async sendCustomerPaymentSuccess(params) {
        let resend;
        let fromEmail;
        try {
            const client = this.getResendClient();
            resend = client.resend;
            fromEmail = client.fromEmail;
        }
        catch (err) {
            return { success: false, error: err.message };
        }
        try {
            const subject = `✅ Payment Receipt: ${params.bookingCode} - LankaVoyage`;
            const htmlContent = `
<!DOCTYPE html>
<html>
<head><meta charset="utf-8"><title>Payment Receipt</title></head>
<body style="font-family: sans-serif; background: #F8F7F2; padding: 20px; color: #062C22;">
  <div style="max-width: 560px; margin: 0 auto; background: white; border-radius: 24px; border: 1px solid #E6E4DC; overflow: hidden; box-shadow: 0 10px 30px rgba(0,0,0,0.06);">
    <div style="background: #062C22; padding: 28px; color: white; text-align: center;">
      <h1 style="font-family: Georgia, serif; font-size: 22px; margin: 0;">Payment Successful</h1>
      <p style="font-size: 11px; text-transform: uppercase; letter-spacing: 2px; color: #39A982; margin-top: 6px;">LankaVoyage Official Receipt</p>
    </div>
    <div style="padding: 32px;">
      <p>Hello <strong>${escapeHtml(params.name)}</strong>,</p>
      <p>We have successfully received your payment for booking <strong>${escapeHtml(params.bookingCode)}</strong>.</p>
      
      <div style="background: #F4F8F6; border: 1px solid #39A982; border-radius: 16px; padding: 18px; margin: 20px 0; font-size: 13px; line-height: 1.8;">
        <div><strong>Booking Code:</strong> ${escapeHtml(params.bookingCode)}</div>
        <div><strong>Transaction ID:</strong> ${escapeHtml(params.paymentId)}</div>
        <div><strong>Amount Paid:</strong> <strong style="font-size: 16px; color: #062C22;">LKR ${params.amount.toLocaleString()}</strong></div>
        <div><strong>Experience:</strong> ${escapeHtml(params.tourTitle)}</div>
        <div><strong>Date:</strong> ${escapeHtml(params.paymentDate)}</div>
        <div><strong>Payment Status:</strong> <span style="color: #065F46; font-weight: bold;">PAID</span></div>
      </div>
      <p style="font-size: 12px; color: #6B7280;">Your tour itinerary and chauffeur details will be available in your customer portal.</p>
    </div>
  </div>
</body>
</html>
`;
            const response = await resend.emails.send({
                from: fromEmail,
                to: [params.to],
                subject,
                html: htmlContent
            });
            return { success: !response.error, id: response.data?.id, error: response.error?.message };
        }
        catch (err) {
            return { success: false, error: err.message };
        }
    }
    /**
     * 6. Sends Admin Notification upon verified PayHere payment
     */
    async sendAdminPaymentNotification(params) {
        let resend;
        let fromEmail;
        let adminEmail;
        try {
            const client = this.getResendClient();
            resend = client.resend;
            fromEmail = client.fromEmail;
            adminEmail = client.adminEmail;
        }
        catch (err) {
            return { success: false, error: err.message };
        }
        try {
            const subject = `💰 Payment Received: ${params.bookingCode} (LKR ${params.amount.toLocaleString()})`;
            const htmlContent = `
        <div style="font-family: sans-serif; padding: 20px; color: #062C22;">
          <h2>Payment Received</h2>
          <p><strong>Booking Code:</strong> ${escapeHtml(params.bookingCode)}</p>
          <p><strong>Customer:</strong> ${escapeHtml(params.customerName)} (${escapeHtml(params.customerEmail)})</p>
          <p><strong>Amount:</strong> LKR ${params.amount.toLocaleString()}</p>
          <p><strong>Payment ID:</strong> ${escapeHtml(params.paymentId)}</p>
          <p><strong>Service:</strong> ${escapeHtml(params.tourTitle)}</p>
        </div>
      `;
            const response = await resend.emails.send({
                from: fromEmail,
                to: [adminEmail],
                subject,
                html: htmlContent
            });
            return { success: !response.error, id: response.data?.id, error: response.error?.message };
        }
        catch (err) {
            return { success: false, error: err.message };
        }
    }
}
function escapeHtml(str) {
    return str
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#039;');
}
export const emailService = new EmailService();
