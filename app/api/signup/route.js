import User from "@/models/User";
import argon2 from 'argon2';
import { connectToDB } from "@/libs/functions";

export async function POST(req) {
    try {
        const body = await req.json();
        console.log("Body: ", body);
        await connectToDB();

        // Check if the user already exists
        const existingUser = await User.findOne({ email: body.email });
        if (existingUser) {
            return new Response(
                JSON.stringify({ message: "User already exists" }),
                { status: 400 }
            );
        }

        // Hash password
        const hashedPassword = await argon2.hash(body.password);
        body.password = hashedPassword;

        // Create user without sending OTP
        const createdUser = await User.create({ 
            ...body, 
            isEmailVerified: false 
        });

          const otp = generateOtp();
          await sendOtpEmail(email, otp);
          await storeOtp(email, otp);

        return new Response(JSON.stringify(createdUser), { status: 201 });

    } catch (err) {
        console.error("Error while creating: ", err.message);
        return new Response(JSON.stringify({ error: err.message }), { status: 500 });
    }
}

