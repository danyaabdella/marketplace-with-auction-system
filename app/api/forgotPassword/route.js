import User from "@/models/User";
import crypto from "crypto";
import nodemailer from "nodemailer";
import { connectToDB } from "@/libs/functions";  

const RESET_TOKEN_EXPIRY = "1h"; 

export async function POST(req) {
    try {
        console.log("Received request to reset password.");

        const { email } = await req.json();
        console.log("Email received:", email);

        // Connect to the database
        console.log("Connecting to database...");
        await connectToDB();
        console.log("Database connected successfully.");

        // Check if user exists
        console.log("Searching for user with email:", email);
        const user = await User.findOne({ email });
        if (!user) {
            console.log("User not found.");
            return new Response(JSON.stringify({ error: "User not found." }), { status: 404 });
        }

        console.log("User found:", user);

        // Generate a short reset token using crypto.randomBytes
        console.log("Generating short reset token...");
        const resetToken = crypto.randomBytes(15).toString('hex');  // Generates a 30-character hexadecimal string (15 * 2 = 30 bytes)
        console.log("Reset token generated:", resetToken);

        // Send reset token to the user's email
        const transporter = nodemailer.createTransport({
            service: "gmail",
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS, // Use the correct password here
            },
        });

        console.log("Nodemailer transporter created.");

        // Create the reset URL
        const resetUrl = `${process.env.NEXTAUTH_URL}/reset-password?token=${resetToken}`;
        console.log("Reset URL generated:", resetUrl);

        // Email content
        const mailOptions = {
            from: process.env.EMAIL_USER,
            to: email,
            subject: "Password Reset Request",
            text: `Forgot your password? Click on the following link to reset your password: ${resetUrl}. The link will expire in 1 hour.`,
        };

        console.log("Sending reset password email...");

        // Send the email
        await transporter.sendMail(mailOptions);
        console.log("Password reset email sent successfully.");

        return new Response(JSON.stringify({ message: "Password reset email sent." }), { status: 200 });
    } catch (err) {
        console.error("Error in forgot password API: ", err.message);
        return new Response(JSON.stringify({ error: "Internal server error." }), { status: 500 });
    }
}
