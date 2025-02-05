import dotenv from "dotenv";
dotenv.config();
import {createElement} from "react";
import { renderToStaticMarkup } from "react-dom/server"; 
import VerificationEmail from "../../../Shared/email/verificationEmail";
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

const sendVerificationEmail = async (username: string, email: string, verifycode: string) => {
    try {
        // Convert React component to static HTML
        const emailHtml = renderToStaticMarkup(
            createElement(VerificationEmail,{username , verifycode})
        );

        await resend.emails.send({
            from: "onboarding@resend.dev",
            to: [email],
            subject: "SponsorFlow | Verification Code",
            html: emailHtml, 
        });

        return {
            success: true,
            message: "Verification email sent successfully",
        };
    } catch (error: any) {
        console.error("Error sending email:", error.message || error);
        return {
            success: false,
            message: "Failed to send verification email",
        };
    }
};

export default sendVerificationEmail;
