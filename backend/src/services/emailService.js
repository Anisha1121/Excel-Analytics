const nodemailer = require('nodemailer');

class EmailService {
  constructor() {
    this.transporter = this.createTransporter();
  }

  createTransporter() {
    // For development, you can use Ethereal Email (fake SMTP service)
    // For production, use services like Gmail, SendGrid, etc.
    
    if (process.env.NODE_ENV === 'production') {
      // Production email configuration
      return nodemailer.createTransporter({
        host: process.env.SMTP_HOST,
        port: process.env.SMTP_PORT,
        secure: process.env.SMTP_SECURE === 'true',
        auth: {
          user: process.env.SMTP_USER,
          pass: process.env.SMTP_PASS,
        },
      });
    } else {
      // Development: Use Gmail or test account
      return nodemailer.createTransporter({
        service: 'gmail',
        auth: {
          user: process.env.EMAIL_USER,
          pass: process.env.EMAIL_PASS, // Use App Password for Gmail
        },
      });
    }
  }

  async sendPasswordResetEmail(email, resetCode, username) {
    const mailOptions = {
      from: process.env.FROM_EMAIL || process.env.EMAIL_USER,
      to: email,
      subject: 'Password Reset Code - Excel Analytics',
      html: this.getPasswordResetTemplate(resetCode, username),
    };

    try {
      const info = await this.transporter.sendMail(mailOptions);
      console.log('Password reset email sent:', info.messageId);
      return { success: true, messageId: info.messageId };
    } catch (error) {
      console.error('Error sending password reset email:', error);
      throw new Error('Failed to send password reset email');
    }
  }

  getPasswordResetTemplate(resetCode, username) {
    return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Password Reset Code</title>
        <style>
            body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; margin: 0; padding: 0; background-color: #f5f5f5; }
            .container { max-width: 600px; margin: 0 auto; background-color: white; }
            .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 30px; text-align: center; }
            .header h1 { color: white; margin: 0; font-size: 28px; }
            .content { padding: 40px 30px; }
            .reset-code { background-color: #f8f9fa; border: 2px dashed #667eea; padding: 20px; text-align: center; margin: 30px 0; border-radius: 8px; }
            .code { font-size: 32px; font-weight: bold; color: #667eea; letter-spacing: 4px; margin: 10px 0; }
            .warning { background-color: #fff3cd; border-left: 4px solid #ffc107; padding: 15px; margin: 20px 0; }
            .footer { background-color: #f8f9fa; padding: 20px; text-align: center; color: #6c757d; font-size: 14px; }
            .button { display: inline-block; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 12px 30px; text-decoration: none; border-radius: 25px; margin: 20px 0; }
        </style>
    </head>
    <body>
        <div class="container">
            <div class="header">
                <h1>🔐 Password Reset Request</h1>
            </div>
            <div class="content">
                <h2>Hello ${username}!</h2>
                <p>We received a request to reset your password for your Excel Analytics account. If you didn't request this, please ignore this email.</p>
                
                <div class="reset-code">
                    <h3>Your Password Reset Code:</h3>
                    <div class="code">${resetCode}</div>
                    <p><small>Enter this code in the reset password form</small></p>
                </div>

                <div class="warning">
                    <strong>⚠️ Important Security Information:</strong>
                    <ul>
                        <li>This code will expire in <strong>15 minutes</strong></li>
                        <li>Use this code only on the official Excel Analytics website</li>
                        <li>Never share this code with anyone</li>
                        <li>If you didn't request this reset, please contact support immediately</li>
                    </ul>
                </div>

                <p>For your security, this code can only be used once and will expire automatically.</p>
            </div>
            <div class="footer">
                <p>© 2025 Excel Analytics Platform. All rights reserved.</p>
                <p>If you have any questions, contact us at support@excelanalytics.com</p>
            </div>
        </div>
    </body>
    </html>
    `;
  }

  async sendPasswordChangeConfirmation(email, username) {
    const mailOptions = {
      from: process.env.FROM_EMAIL || process.env.EMAIL_USER,
      to: email,
      subject: 'Password Changed Successfully - Excel Analytics',
      html: this.getPasswordChangeTemplate(username),
    };

    try {
      const info = await this.transporter.sendMail(mailOptions);
      console.log('Password change confirmation email sent:', info.messageId);
      return { success: true, messageId: info.messageId };
    } catch (error) {
      console.error('Error sending password change confirmation:', error);
      // Don't throw error for confirmation emails
      return { success: false, error: error.message };
    }
  }

  getPasswordChangeTemplate(username) {
    return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Password Changed Successfully</title>
        <style>
            body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; margin: 0; padding: 0; background-color: #f5f5f5; }
            .container { max-width: 600px; margin: 0 auto; background-color: white; }
            .header { background: linear-gradient(135deg, #28a745 0%, #20c997 100%); padding: 30px; text-align: center; }
            .header h1 { color: white; margin: 0; font-size: 28px; }
            .content { padding: 40px 30px; }
            .success { background-color: #d4edda; border-left: 4px solid #28a745; padding: 15px; margin: 20px 0; }
            .footer { background-color: #f8f9fa; padding: 20px; text-align: center; color: #6c757d; font-size: 14px; }
        </style>
    </head>
    <body>
        <div class="container">
            <div class="header">
                <h1>✅ Password Changed Successfully</h1>
            </div>
            <div class="content">
                <h2>Hello ${username}!</h2>
                
                <div class="success">
                    <strong>Your password has been changed successfully!</strong>
                </div>

                <p>Your Excel Analytics account password was changed on ${new Date().toLocaleString()}.</p>
                
                <p>If you didn't make this change, please contact our support team immediately at support@excelanalytics.com</p>

                <p>For your security, we recommend:</p>
                <ul>
                    <li>Using a strong, unique password</li>
                    <li>Not sharing your login credentials</li>
                    <li>Logging out from shared devices</li>
                </ul>
            </div>
            <div class="footer">
                <p>© 2025 Excel Analytics Platform. All rights reserved.</p>
                <p>This is an automated security notification.</p>
            </div>
        </div>
    </body>
    </html>
    `;
  }
}

module.exports = new EmailService();
