import dotenv from "dotenv";
dotenv.config();
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

const sendVerificationEmail = async (
    username: string,
    email: string,
    verifycode: string,
    usertype: string
) => {
    try {

        await resend.emails.send({
            from: "onboarding@resend.dev",
            to: [email],
            subject: "SponsorFlow | Verification Code",
            html: `
                            <!DOCTYPE html>
                <html lang="en">
                <head>
                    <meta charset="UTF-8">
                    <meta name="viewport" content="width=device-width, initial-scale=1.0">
                    <title>Sponsorflow Verification Code</title>
                    <style>
                    @media screen and (max-width: 600px) {
                    .content {
                        width: 100% !important;
                        display: block !important;
                        padding: 10px !important;
                    }
                    .header, .body, .footer {
                        padding: 20px !important;
                    }
                    }
                </style>
                </head>
                <body style="font-family: 'Poppins', Arial, sans-serif">
                    <table width="100%" border="0" cellspacing="0" cellpadding="0">
                        <tr>
                            <td align="center" style="padding: 20px;">
                                <table class="content" width="600" border="0" cellspacing="0" cellpadding="0" style="border-collapse: collapse; border: 1px solid #cccccc;">
                                    <tr>
                                        <td class="header" style="background-color: #345C72; padding: 40px; text-align: center; color: white; font-size: 24px;">
                                            SponsorFlow Verification Code
                                        </td>
                                    </tr>
                
                                    <tr>
                                        <td class="body" style="padding: 40px; text-align: left; font-size: 16px; line-height: 1.6;">
                                        Hello, ${username} <br>
                                        Thank you for registering. Please use the following verification
                                        code to complete your registration:

                                        <p>${verifycode}</p>
                                        </td>
                                    </tr>
                
                                    <tr>
                                        <td style="padding: 0px 40px 0px 40px; text-align: center;">
                                            <!-- CTA Button -->
                                            <table cellspacing="0" cellpadding="0" style="margin: auto;">
                                                <tr>
                                                    <td align="center" style="background-color: #345C72; padding: 10px 20px; border-radius: 5px;">
                                                        <a href="http://sponsorflow-eta.vercel.app/signup/verify/${usertype}/${username}" target="_blank" style="color: #ffffff; text-decoration: none; font-weight: bold;">Verify Here</a>
                                                    </td>
                                                </tr>
                                            </table>
                                        </td>
                                    </tr>
                                    <tr>
                                        <td class="body" style="padding: 40px; text-align: left; font-size: 16px; line-height: 1.6;">
                                        </td>
                                    </tr>
                                    <!-- Footer -->
                                    <tr>
                                        <td class="footer" style="background-color: #333333; padding: 40px; text-align: center; color: white; font-size: 14px;">
                                        Copyright &copy; 2025 | Sponsorflow
                                        </td>
                                    </tr>
                                </table>
                            </td>
                        </tr>
                    </table>
                </body>
                </html>
            `
        });

        return {
            success: true,
            message: "Verification email sent successfully",
        };
    } catch (error: any) {
        console.error("Error sending email:", error.message || error)
        return {
            success: false,
            message: "Failed to send verification email",
        };
    }
};


export default sendVerificationEmail;
    