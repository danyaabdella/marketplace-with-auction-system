import User from "@/models/User";
import { connectToDB } from "@/libs/functions";
import argon2 from "argon2";

export async function POST(req) {
  try {
    const { searchParams } = new URL(req.url);
    const action = searchParams.get("action"); // "verify" or "reset"

    const { email, otp, newPassword } = await req.json();
    if (!email || !otp) {
      return new Response(
        JSON.stringify({ message: "Email and OTP are required" }),
        { status: 400 }
      );
    }

    await connectToDB();
    const user = await User.findOne({ email });

    console.log("User on: ", user);
    console.log("Actions: ", action);

    if (!user) {
      return new Response(JSON.stringify({ message: "User not found" }), {
        status: 404,
      });
    }

    if (!user.otp || !user.otpExpiry) {
      return new Response(
        JSON.stringify({ message: "No OTP found. Request a new one." }),
        { status: 400 }
      );
    }

    if (new Date() > user.otpExpiry) {
      user.otp = null;
      user.otpExpiry = null;
      await user.save();
      return new Response(
        JSON.stringify({ message: "OTP expired. Request a new one." }),
        { status: 400 }
      );
    }

    // Check if both user.otp and provided otp are valid strings
    if (typeof user.otp !== "string" || typeof otp !== "string") {
      return new Response(
        JSON.stringify({ message: "Invalid OTP format" }),
        { status: 400 }
      );
    }

    // Verify OTP
    const isOtpValid = await argon2.verify(user.otp, otp);
    console.log("is otp valid: ". user.otp, otp);
    if (!isOtpValid) {
      return new Response(JSON.stringify({ message: "Invalid OTP" }), {
        status: 400,
      });
    }

    if (action === "verify") {
      if (user.isEmailVerified) {
        return new Response(
          JSON.stringify({ message: "Email already verified" }),
          { status: 400 }
        );
      }

      user.isEmailVerified = true;
      user.otp = null;
      user.otpExpiry = null;
      await user.save();

      return new Response(
        JSON.stringify({ message: "Email verified successfully" }),
        { status: 200 }
      );
    } else if (action === "reset") {
      if (!newPassword) {
        return new Response(
          JSON.stringify({ message: "New password is required" }),
          { status: 400 }
        );
      }

      const hashedPassword = await argon2.hash(newPassword);
      user.password = hashedPassword;
      user.otp = null;
      user.otpExpiry = null;
      await user.save();

      return new Response(
        JSON.stringify({ message: "Password reset successfully" }),
        { status: 200 }
      );
    } else {
      return new Response(JSON.stringify({ message: "Invalid action type" }), {
        status: 400,
      });
    }
  } catch (err) {
    console.error("Error processing request: ", err.message);
    return new Response(JSON.stringify({ error: err.message }), {
      status: 500,
    });
  }
}
