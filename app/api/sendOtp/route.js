import User from "@/models/User";
import { connectToDB } from "@/libs/functions";
import crypto from "crypto";
import nodemailer from "nodemailer";

// Function to send OTP via email
async function sendOtpEmail(email, otp, subject, text) {
    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS
        }
    });

    const mailOptions = {
        from: `"Your App Name" <${process.env.EMAIL_USER}>`,
        to: email,
        subject: subject,
        text: `${text} ${otp}`
    };

    try {
        await transporter.sendMail(mailOptions);
        console.log(`OTP ${otp} sent to ${email}`);
    } catch (error) {
        console.error('Error sending OTP email:', error.message);
        throw new Error('Error sending OTP email');
    }
}

// Now POST handler comes after the helper
export async function POST(req) {
    try {
        const { email } = await req.json();
        const { searchParams } = new URL(req.url);
        const type = searchParams.get("type");

        await connectToDB();
        const user = await User.findOne({ email });

        if (!user) {
            return new Response(JSON.stringify({ message: "User not found" }), { status: 404 });
        }

        if (type === "verify" && user.isEmailVerified) {
            return new Response(JSON.stringify({ message: "Email already verified" }), { status: 400 });
        }

        const otp = crypto.randomInt(100000, 999999).toString();
        const otpExpires = new Date(Date.now() + 15 * 60 * 1000);
        user.otp = otp;
        user.otpExpires = otpExpires;
        await user.save();

        console.log("User to be verified: ", user);

        if (type === "verify") {
            await sendOtpEmail(email, otp, 'Email Verification OTP', 'Your OTP for email verification is:');
        } else if (type === "reset") {
            await sendOtpEmail(email, otp, 'Password Reset OTP', 'Your OTP for password reset is:');
        } else {
            return new Response(JSON.stringify({ message: "Invalid OTP type" }), { status: 400 });
        }

        return new Response(JSON.stringify({ message: "OTP sent to email" }), { status: 200 });

    } catch (err) {
        console.error("Error sending OTP: ", err.message);
        return new Response(JSON.stringify({ error: err.message }), { status: 500 });
    }
}

