import {Resend} from 'resend';
import { VerificationEmail } from '@/components/emails/verify-email';

const resend = new Resend(process.env.RESEND_API_KEY!);

export async function sendVerificationEmail(email: string, token: string) {
    const verificationUrl = `${process.env.NEXTAUTH_PUBLIC_APP_URL}/auth/verify-email?token=${token}`;

    const result = await resend.emails.send({
      from: process.env.RESEND_FROM_EMAIL || "onboarding@resend.dev", // Update with verified domain email
      to: email,
      subject: "Verify your email address",
    //   react: VerificationEmail({ verificationUrl, email }),
      html: `
            <div style="max-width: 600px; margin: 0 auto; font-family: Arial, sans-serif; padding: 20px;">
                <div style="background-color: #f5f5f5; padding: 20px; border-radius: 8px;">
                    <h1 style="font-size: 24px; font-weight: bold; margin-bottom: 16px; color: #333;">
                        Verify Your Email Address
                    </h1>
                    <p style="color: #666; font-size: 14px; margin-bottom: 24px;">Hi ${email},</p>
                    <p style="color: #666; font-size: 14px; margin-bottom: 32px;">
                        Thank you for signing up! Please verify your email address to complete your registration.
                    </p>
                    <div style="text-align: center; margin-bottom: 32px;">
                        <a href="${verificationUrl}" target="_blank" rel="noopener noreferrer" 
                           style="display: inline-block; background-color: #007bff; color: white; padding: 12px 32px; text-decoration: none; border-radius: 6px; font-weight: bold;">
                            Verify Email
                        </a>
                    </div>
                    <p style="color: #999; font-size: 14px; margin-bottom: 16px;">Or copy and paste this link:</p>
                    <p style="color: #007bff; font-size: 12px; word-break: break-all;">${verificationUrl}</p>
                    <p style="color: #999; font-size: 12px; margin-top: 30px;">
                        This link will expire in 24 hours. If you did not create an account, no further action is required.
                    </p>
                </div>
            </div>
        `,
    });

    if (result.error) {
        throw new Error(`Failed to send verification email: ${result.error.message}`);
    }
    return result;
} 