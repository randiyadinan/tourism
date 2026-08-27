import { Resend } from 'resend';

export interface SendVerificationEmailParams {
  to: string;
  name: string;
  verificationLink: string;
  expiresInHours?: number;
}

export class EmailService {
  private getResendInstance(): { resend: Resend | null; fromEmail: string } {
    const apiKey = process.env.RESEND_API_KEY;
    const fromEmail = process.env.EMAIL_FROM || 'LankaVoyage <onboarding@resend.dev>';
    if (apiKey && apiKey.startsWith('re_') && !apiKey.includes('re_demo')) {
      return { resend: new Resend(apiKey), fromEmail };
    }
    return { resend: null, fromEmail };
  }

  /**
   * Sends a branded LankaVoyage verification email via Resend
   */
  async sendVerificationEmail(params: SendVerificationEmailParams): Promise<{ success: boolean; id?: string; error?: string }> {
    const { to, name, verificationLink, expiresInHours = 24 } = params;
    const { resend, fromEmail } = this.getResendInstance();

    if (!resend) {
      console.log(`\n======================================================`);
      console.log(`📧 [LankaVoyage Verification Email Delivered via Resend Simulator]`);
      console.log(`To: ${to} (${name})`);
      console.log(`Subject: Verify your email address - LankaVoyage`);
      console.log(`Verification URL: ${verificationLink}`);
      console.log(`Expires: In ${expiresInHours} Hours`);
      console.log(`======================================================\n`);
      return { success: true, id: `msg_dev_${Date.now()}` };
    }

    try {
      const subject = 'Verify your email address - LankaVoyage';
      const htmlContent = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Verify Your Email - LankaVoyage</title>
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
      max-width: 580px;
      margin: 40px auto;
      background: #ffffff;
      border-radius: 24px;
      overflow: hidden;
      box-shadow: 0 10px 30px rgba(6, 44, 34, 0.08);
      border: 1px solid #E6E4DC;
    }
    .header {
      background: linear-gradient(135deg, #062C22 0%, #0B3D2E 100%);
      padding: 40px 30px;
      text-align: center;
    }
    .logo-text {
      font-family: Georgia, serif;
      font-size: 28px;
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
      padding: 40px 35px;
    }
    h1 {
      font-family: Georgia, serif;
      font-size: 24px;
      color: #062C22;
      margin-top: 0;
      margin-bottom: 16px;
    }
    p {
      font-size: 15px;
      line-height: 1.6;
      color: #4A5550;
      margin: 0 0 20px 0;
    }
    .button-container {
      text-align: center;
      margin: 32px 0;
    }
    .verify-btn {
      display: inline-block;
      background: #0B3D2E;
      color: #ffffff !important;
      text-decoration: none;
      font-weight: 600;
      font-size: 15px;
      padding: 16px 36px;
      border-radius: 14px;
      box-shadow: 0 4px 14px rgba(11, 61, 46, 0.25);
    }
    .link-fallback {
      background: #F8F7F2;
      border: 1px solid #E6E4DC;
      border-radius: 12px;
      padding: 16px;
      margin-top: 25px;
      word-break: break-all;
      font-size: 12px;
      color: #68736E;
    }
    .link-fallback a {
      color: #176B52;
      text-decoration: underline;
    }
    .expiry-note {
      font-size: 13px;
      color: #8C9993;
      margin-top: 24px;
      border-top: 1px solid #F0EEE6;
      padding-top: 16px;
    }
    .footer {
      background: #F8F7F2;
      padding: 24px 30px;
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
      <p>Welcome to LankaVoyage! Please confirm your email address to activate your traveler account, access your custom itinerary builder, and view digital booking vouchers.</p>
      
      <div class="button-container">
        <a href="${verificationLink}" class="verify-btn" target="_blank">Verify Email Address</a>
      </div>

      <div class="link-fallback">
        <p style="margin: 0 0 6px 0; font-weight: 600; color: #17231F;">Button not working?</p>
        Copy and paste this link into your browser:<br>
        <a href="${verificationLink}" target="_blank">${verificationLink}</a>
      </div>

      <div class="expiry-note">
        ⏱️ This verification link will expire in <strong>${expiresInHours} hours</strong>. If you did not create a LankaVoyage account, please safely disregard this email.
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
        to,
        subject,
        html: htmlContent,
      });

      if (response.error) {
        console.error('❌ [Resend API Error]:', response.error);
        return { success: false, error: response.error.message };
      }

      console.log(`✅ [EmailService] Verification email sent to ${to} (ID: ${response.data?.id})`);
      return { success: true, id: response.data?.id };
    } catch (err: any) {
      console.error('❌ [EmailService Exception]:', err);
      return { success: false, error: err.message || 'Failed to send email' };
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
