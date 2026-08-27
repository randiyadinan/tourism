import { Resend } from 'resend';

export interface SendVerificationOTPParams {
  to: string;
  name: string;
  code: string;
  expiresInMinutes?: number;
}

export class EmailService {
  private getResendClient(): { resend: Resend; fromEmail: string } {
    const apiKey = (typeof process !== 'undefined' ? process.env?.RESEND_API_KEY : undefined)?.trim();
    const fromEmail = (typeof process !== 'undefined' ? process.env?.EMAIL_FROM : undefined)?.trim() || 'LankaVoyage <onboarding@resend.dev>';
    
    if (!apiKey) {
      throw new Error('RESEND_API_KEY is not configured on the server. Please set RESEND_API_KEY in environment variables.');
    }
    
    return { resend: new Resend(apiKey), fromEmail };
  }

  /**
   * Sends a branded LankaVoyage 6-digit OTP verification email via Resend
   */
  async sendVerificationOTP(params: SendVerificationOTPParams): Promise<{ success: boolean; id?: string; error?: string }> {
    const { to, name, code, expiresInMinutes = 10 } = params;

    let resend: Resend;
    let fromEmail: string;
    try {
      const client = this.getResendClient();
      resend = client.resend;
      fromEmail = client.fromEmail;
    } catch (err: any) {
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
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Your LankaVoyage Verification Code</title>
  <style>
    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
      background-color: #F8F7F2;
      color: #17231F;
      margin: 0;
      padding: 0;
      -webkit-font-smoothing: antialiased;
    }
    .container {
      max-width: 540px;
      margin: 40px auto;
      background: #ffffff;
      border-radius: 24px;
      overflow: hidden;
      box-shadow: 0 10px 30px rgba(6, 44, 34, 0.08);
      border: 1px solid #E6E4DC;
    }
    .header {
      background: linear-gradient(135deg, #062C22 0%, #0B3D2E 100%);
      padding: 36px 30px;
      text-align: center;
    }
    .logo-text {
      font-family: Georgia, serif;
      font-size: 26px;
      font-weight: 700;
      color: #ffffff;
      letter-spacing: 0.5px;
      margin: 0;
    }
    .logo-highlight {
      color: #39A982;
    }
    .tagline {
      font-size: 11px;
      text-transform: uppercase;
      letter-spacing: 2px;
      color: #DDEFE8;
      margin-top: 6px;
    }
    .content {
      padding: 36px 32px;
    }
    h1 {
      font-family: Georgia, serif;
      font-size: 22px;
      color: #062C22;
      margin-top: 0;
      margin-bottom: 14px;
    }
    p {
      font-size: 15px;
      line-height: 1.6;
      color: #4A5550;
      margin: 0 0 18px 0;
    }
    .otp-card {
      background: #F4F8F6;
      border: 2px dashed #39A982;
      border-radius: 18px;
      padding: 24px 20px;
      text-align: center;
      margin: 28px 0;
    }
    .otp-code {
      font-family: 'Courier New', Courier, monospace;
      font-size: 38px;
      font-weight: 800;
      letter-spacing: 10px;
      color: #062C22;
      margin: 0;
      padding-left: 10px;
    }
    .otp-hint {
      font-size: 12px;
      color: #68736E;
      margin-top: 10px;
      margin-bottom: 0;
    }
    .expiry-alert {
      font-size: 13px;
      color: #8C9993;
      margin-top: 24px;
      border-top: 1px solid #F0EEE6;
      padding-top: 16px;
      text-align: center;
    }
    .footer {
      background: #F8F7F2;
      padding: 22px 30px;
      text-align: center;
      font-size: 12px;
      color: #8C9993;
      border-top: 1px solid #E6E4DC;
    }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <div class="logo-text">Lanka<span class="logo-highlight">Voyage</span></div>
      <div class="tagline">Bespoke Sri Lanka Travel</div>
    </div>
    <div class="content">
      <h1>Verify Your Email Address</h1>
      <p>Hello <strong>${escapeHtml(name)}</strong>,</p>
      <p>Please enter the 6-digit verification code below to activate your LankaVoyage traveler account:</p>
      
      <div class="otp-card">
        <div class="otp-code">${code}</div>
        <p class="otp-hint">Enter this code on the verification page</p>
      </div>

      <div class="expiry-alert">
        ⏱️ This verification code is valid for <strong>${expiresInMinutes} minutes</strong>. For your security, never share this code with anyone.
      </div>
    </div>
    <div class="footer">
      &copy; ${new Date().getFullYear()} LankaVoyage Ltd. Colombo, Sri Lanka.<br>
      Dedicated Chauffeur & VIP Airport Transfers.
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
        console.error(`❌ [Resend Delivery Error] To: ${to} | ErrorName: ${response.error.name} | ErrorMsg: ${response.error.message}`);
        return { success: false, error: response.error.message };
      }

      console.log(`✅ [EmailService Success] Verification email delivered to ${to} (Message ID: ${response.data?.id})`);
      return { success: true, id: response.data?.id };
    } catch (err: any) {
      console.error(`❌ [EmailService Exception] To: ${to} | Exception: ${err.message || err}`);
      return { success: false, error: err.message || 'Failed to deliver email through Resend.' };
    }
  }

  /**
   * Diagnostic test email sending method
   */
  async sendTestEmail(to: string): Promise<{ success: boolean; id?: string; fromEmail?: string; error?: string }> {
    let resend: Resend;
    let fromEmail: string;
    try {
      const client = this.getResendClient();
      resend = client.resend;
      fromEmail = client.fromEmail;
    } catch (err: any) {
      console.error(`❌ [EmailService Test Config Error] To: ${to} | Error: ${err.message}`);
      return { success: false, error: err.message };
    }

    try {
      const subject = 'LankaVoyage Email Service Test';
      const htmlContent = `
        <div style="font-family: sans-serif; padding: 20px; color: #062C22;">
          <h2>LankaVoyage Email Service Connected</h2>
          <p>This is a live test email confirming that Resend delivery is operating correctly on LankaVoyage.</p>
          <p><strong>Sender:</strong> ${fromEmail}</p>
          <p><strong>Timestamp:</strong> ${new Date().toISOString()}</p>
        </div>
      `;

      const response = await resend.emails.send({
        from: fromEmail,
        to: [to],
        subject,
        html: htmlContent,
      });

      if (response.error) {
        console.error(`❌ [Resend Test Error] To: ${to} | Error: ${response.error.message}`);
        return { success: false, error: response.error.message, fromEmail };
      }

      console.log(`✅ [Resend Test Success] Delivered to ${to} (ID: ${response.data?.id})`);
      return { success: true, id: response.data?.id, fromEmail };
    } catch (err: any) {
      console.error(`❌ [Resend Test Exception] To: ${to} | Exception: ${err.message || err}`);
      return { success: false, error: err.message || 'Failed to send test email', fromEmail };
    }
  }
}

function escapeHtml(str: string): string {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

export const emailService = new EmailService();
