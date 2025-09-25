import sgMail from '@sendgrid/mail';
import { VerificationEmail, WelcomeEmail } from "../constants/emailTemplate.js";

sgMail.setApiKey(process.env.SENDGRID_API_KEY);

export const sendVerificationEmail = async (email, code) => {
    try {
        await sgMail.send({
            to: email,
            from: 'your-email@example.com', // Verified sender
            subject: "🔐 Verify Your Email",
            html: VerificationEmail(code),
        });
    } catch (error) {
        console.log('Email error : ', error);
    }
};

export const sendWelcomeEmail = async (email, name) => {
    try {
        await sgMail.send({
            to: email,
            from: 'your-email@example.com', // Verified sender
            subject: "🎉 Welcome to Netnity!",
            html: WelcomeEmail(name),
        });
    } catch (error) {
        console.log('Email error : ', error);
    }
};
