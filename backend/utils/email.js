import nodemailer from 'nodemailer';

// Create reusable transporter
const createTransporter = () => {
  return nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: process.env.EMAIL_PORT,
    secure: false, // true for 465, false for other ports
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASSWORD,
    },
  });
};
await createTransporter().verify();
console.log("Server is ready to take our messages");

/**
 * Send password reset email
 * @param {String} to - Recipient email address
 * @param {String} resetToken - Password reset token
 * @param {String} userName - User's name
 */
export const sendPasswordResetEmail = async (to, resetToken, userName) => {
  try {
    const transporter = createTransporter();
    
    const resetUrl = `${process.env.FRONTEND_URL}/reset-password?token=${resetToken}`;
    console.log(resetUrl)
    
    const mailOptions = {
      from: `"Navyut College" <${process.env.EMAIL_FROM}>`,
      to: to,
      subject: 'Password Reset Request',
      html: `
        <!DOCTYPE html>
        <html>
        <head>
            <style>
                body {
                    font-family: Arial, sans-serif;
                    line-height: 1.6;
                    color: #333;
                }
                .container {
                    max-width: 600px;
                    margin: 0 auto;
                    padding: 20px;
                }
                .header {
                    background-color: #4F46E5;
                    color: white;
                    padding: 20px;
                    text-align: center;
                    border-radius: 5px 5px 0 0;
                }
                .content {
                    background-color: #f9f9f9;
                    padding: 30px;
                    border-radius: 0 0 5px 5px;
                }
                .button {
                    display: inline-block;
                    padding: 12px 30px;
                    background-color: #4F46E5;
                    color: white;
                    text-decoration: none;
                    border-radius: 5px;
                    margin: 20px 0;
                }
                .button:hover {
                    background-color: #4338CA;
                }
                .footer {
                    margin-top: 20px;
                    padding-top: 20px;
                    border-top: 1px solid #ddd;
                    font-size: 12px;
                    color: #666;
                }
                .warning {
                    background-color: #FEF2F2;
                    border-left: 4px solid #EF4444;
                    padding: 10px;
                    margin: 20px 0;
                }
            </style>
        </head>
        <body>
            <div class="container">
                <div class="header">
                    <h1>Password Reset Request</h1>
                </div>
                <div class="content">
                    <h2>Hello ${userName},</h2>
                    <p>We received a request to reset your password for your Navyut College account.</p>
                    <p>Click the button below to reset your password:</p>
                    <center>
                        <a href="${resetUrl}" class="button">Reset Password</a>
                    </center>
                    <p>Or copy and paste this link into your browser:</p>
                    <p style="word-break: break-all; color: #4F46E5;">${resetUrl}</p>
                    
                    <div class="warning">
                        <strong>⚠️ Security Notice:</strong>
                        <ul>
                            <li>This link will expire in 1 hour</li>
                            <li>If you didn't request this reset, please ignore this email</li>
                            <li>Never share this link with anyone</li>
                        </ul>
                    </div>
                    
                    <div class="footer">
                        <p>This is an automated email, please do not reply.</p>
                        <p>&copy; ${new Date().getFullYear()} Navyut College. All rights reserved.</p>
                    </div>
                </div>
            </div>
        </body>
        </html>
      `,
    };

    const info = await transporter.sendMail(mailOptions);
    console.log('Password reset email sent:', info.messageId);
    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.error('Error sending password reset email:', error);
    throw new Error('Failed to send password reset email');
  }
};

/**
 * Send password reset confirmation email
 * @param {String} to - Recipient email address
 * @param {String} userName - User's name
 */
export const sendPasswordResetConfirmation = async (to, userName) => {
  try {
    const transporter = createTransporter();
    
    const mailOptions = {
      from: `"Navyut College" <${process.env.EMAIL_FROM}>`,
      to: to,
      subject: 'Password Reset Successful',
      html: `
        <!DOCTYPE html>
        <html>
        <head>
            <style>
                body {
                    font-family: Arial, sans-serif;
                    line-height: 1.6;
                    color: #333;
                }
                .container {
                    max-width: 600px;
                    margin: 0 auto;
                    padding: 20px;
                }
                .header {
                    background-color: #10B981;
                    color: white;
                    padding: 20px;
                    text-align: center;
                    border-radius: 5px 5px 0 0;
                }
                .content {
                    background-color: #f9f9f9;
                    padding: 30px;
                    border-radius: 0 0 5px 5px;
                }
                .footer {
                    margin-top: 20px;
                    padding-top: 20px;
                    border-top: 1px solid #ddd;
                    font-size: 12px;
                    color: #666;
                }
                .info {
                    background-color: #EFF6FF;
                    border-left: 4px solid #3B82F6;
                    padding: 10px;
                    margin: 20px 0;
                }
            </style>
        </head>
        <body>
            <div class="container">
                <div class="header">
                    <h1>✓ Password Reset Successful</h1>
                </div>
                <div class="content">
                    <h2>Hello ${userName},</h2>
                    <p>Your password has been successfully reset.</p>
                    <p>You can now log in to your account with your new password.</p>
                    
                    <div class="info">
                        <strong>ℹ️ Did you make this change?</strong>
                        <p>If you did not reset your password, please contact our support team immediately.</p>
                    </div>
                    
                    <div class="footer">
                        <p>This is an automated email, please do not reply.</p>
                        <p>&copy; ${new Date().getFullYear()} Navyut College. All rights reserved.</p>
                    </div>
                </div>
            </div>
        </body>
        </html>
      `,
    };

    const info = await transporter.sendMail(mailOptions);
    console.log('Password reset confirmation email sent:', info.messageId);
    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.error('Error sending confirmation email:', error);
    // Don't throw error here - password reset already succeeded
    return { success: false, error: error.message };
  }
};
