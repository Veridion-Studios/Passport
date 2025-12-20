
import { betterAuth } from "better-auth";
import { emailOTP } from "better-auth/plugins";
import { Pool } from "pg";
import { Resend } from "resend";
const resend = new Resend(process.env.RESEND_API_KEY);

export const auth = betterAuth({
    database: new Pool({
        connectionString: process.env.DATABASE_URL,
    }),
    emailAndPassword: {
        enabled: true,
        async sendResetPassword() {
            // Implement password reset email logic if needed
        },
    },
    plugins: [
        emailOTP({
            async sendVerificationOTP({ email, otp, type }) {
                let subject = "";
                let html = "";
                if (type === "sign-in") {
                    subject = "Sign In OTP";
                    html = `<p>Your sign in OTP is: <strong>${otp}</strong></p>`;
                } else if (type === "email-verification") {
                    subject = "Email Verification OTP";
                    html = `<p>Your email verification OTP is: <strong>${otp}</strong></p>`;
                } else if (type === "forget-password") {
                    subject = "Password Reset OTP";
                    html = `<p>Your password reset OTP is: <strong>${otp}</strong></p>`;
                }
                if (subject && html) {
                    await resend.emails.send({
                        from: 'Veridion Studios <no-reply@studio.theveridionlibrary.org>',
                        to: [email],
                        subject,
                        html,
                    });
                }
            },
        })
    ]
});