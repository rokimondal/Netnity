import nodemailer from "nodemailer"
import { VerificationEmail, WelcomeEmail } from "../constants/emailTemplate.js";

const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 587,
    secure: false, // true for 465, false for other ports
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
    },
});

export const sendVerificationEmail = async (email, code) => {
    try {
        const response = await transporter.sendMail({
            from: `"Netnity" ${process.env.EMAIL_USER}`,
            to: email,
            subject: "🔐 Verify Your Email",
            html: VerificationEmail(code),
        });
    } catch (error) {
        console.log('Email error : ', error);
    }
}

export const sendWellcomeEmail = async (email, name) => {
    try {
        const response = await transporter.sendMail({
            from: `"Netnity" ${process.env.EMAIL_USER}`,
            to: email,
            subject: "🎉 Welcome to Netnity!",
            html: WelcomeEmail(name),
        });

    } catch (error) {
        console.log('Email error : ', error);
    }
}