import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST || 'smtp.example.com',
    port: parseInt(process.env.SMTP_PORT || '587'),
    secure: process.env.SMTP_SECURE === 'true', // true for 465, false for other ports
    auth: {
        user: process.env.SMTP_USER || 'user@example.com',
        pass: process.env.SMTP_PASS || 'password',
    },
});

export const sendPasswordResetEmail = async (email: string, token: string) => {
    // Determine the base URL for the reset link
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
    const resetLink = `${baseUrl}/reset-password?token=${token}`;

    const mailOptions = {
        from: `"Tradefair Auth" <${process.env.SMTP_USER || 'noreply@tradefair.com'}>`,
        to: email,
        subject: 'Password Reset Request',
        html: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #eaeaea; border-radius: 10px;">
                <h2 style="color: #333;">Password Reset Request</h2>
                <p style="color: #555;">We received a request to reset your password. If you didn't make this request, you can safely ignore this email.</p>
                <p style="color: #555;">To reset your password, click the button below:</p>
                <div style="text-align: center; margin: 30px 0;">
                    <a href="${resetLink}" style="background-color: #2563eb; color: white; padding: 12px 24px; text-decoration: none; border-radius: 5px; font-weight: bold; display: inline-block;">Reset Password</a>
                </div>
                <p style="color: #555;">Or copy and paste this link into your browser:</p>
                <p style="color: #2563eb; word-break: break-all;">${resetLink}</p>
                <p style="color: #999; font-size: 12px; margin-top: 40px;">This link will expire in 1 hour.</p>
            </div>
        `,
    };

    try {
        if (process.env.NODE_ENV === 'development' && !process.env.SMTP_PASS) {
            console.log("=========================================");
            console.log("MOCK EMAIL SENT (No SMTP_PASS provided):");
            console.log(`To: ${email}`);
            console.log(`Reset Link: ${resetLink}`);
            console.log("=========================================");
            return { success: true, message: 'Mock email sent (check server console)' };
        }

        await transporter.sendMail(mailOptions);
        return { success: true, message: 'Email sent successfully' };
    } catch (error) {
        console.error('Error sending email:', error);
        return { success: false, error: 'Failed to send email' };
    }
};
