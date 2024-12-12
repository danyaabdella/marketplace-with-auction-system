
import User from "@/models/User";
import mongoose from "mongoose";
import bcrypt from "bcryptjs";

export async function POST(req) {
    try {
        const body = await req.json();

        await mongoose.connect(process.env.MONGO_URL);

        // Check if the user already exists
        const existingUser = await User.findOne({ email: body.email });
        if (existingUser) {
            return new Response(
                JSON.stringify({ message: "User already exists" }),
                { status: 400 }
            );
        }

        // Hash the password
        const hashedPassword = await bcrypt.hash(body.password, 10);

        // Replace the plain-text password with the hashed password
        body.password = hashedPassword;

        // Create the user
        const createdUser = await User.create(body);

        return new Response(JSON.stringify(createdUser), { status: 201 });

    } catch (err) {
        console.error("Error while creating: ", err.message);
        return new Response(JSON.stringify({ error: err.message }), { status: 500 });
    }
}


export async function GET(req) {
  // Accessing the query parameter 'email'
  const email = req.nextUrl.searchParams.get('email');

  if (!email) {
    return new Response(JSON.stringify({ error: "Email is required" }), { status: 400 });
  }

  try {
    await mongoose.connect(process.env.MONGO_URL);

    const existingUser = await User.findOne({ email });

    if (existingUser) {
      return new Response(JSON.stringify(existingUser), { status: 200, headers: { "Content-Type": "application/json" } });
    } else {
      return new Response(JSON.stringify({ error: "User not found" }), { status: 404 });
    }
  } catch (error) {
    return new Response(JSON.stringify({ error: "Internal server error" }), { status: 500 });
  }
}


