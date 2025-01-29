import mongoose from "mongoose";
import User from "@models/User";

// Helper Function: Connect to DB
let isConnected = false;
export async function connectToDB() {
    if (isConnected) {
        console.log("Using existing database connection");
        return;
    }

    try {
        await mongoose.connect(process.env.MONGO_URL, { useNewUrlParser: true, useUnifiedTopology: true });
        isConnected = true;
        console.log("Database connected successfully");
    } catch (error) {
        console.error("Database connection failed:", error.message);
        throw new Error("Failed to connect to the database.");
    }
}

// Helper Function: Fetch User Info
export async function fetchUserInfo() {
    const session = await getServerSession(options); // Assumes session handling middleware exists
    const userEmail = session?.user?.email;

    if (!userEmail) {
        throw new Error("Session invalid or user email not found.");
    }

    await connectToDB();
    const user = await User.findOne({ email: userEmail });
    if (!user) {
        throw new Error("User not found in the database.");
    }

    return user;
}

// Helper Function: Check if User is a Seller
export async function isMerchant() {
    try {
        const user = await fetchUserInfo();
        if (user.role !== "merchant" || user.isMerchant !== true) {
            return new Response(
                JSON.stringify({ error: "Unauthorized: Only sellers can perform this operation." }),
                { status: 403 }
            );
        }
        return null;
    } catch (error) {
        console.error("Error in isMerchant:", error.message);
        return new Response(
            JSON.stringify({ error: "Failed to verify merchant status." }),
            { status: 500 }
        );
    }
}

// Helper Function: Check Session
export async function checkSession(email) {
    if (!email) {
        return new Response(
            JSON.stringify({ error: "User email is required." }),
            { status: 400 }
        );
    }

    try {
        const session = await getServerSession(options);
        if (!session || session.user?.email !== email) {
            return new Response(
                JSON.stringify({ error: "Unauthorized: Invalid session or mismatched email." }),
                { status: 403 }
            );
        }
        return null;
    } catch (error) {
        console.error("Error in session check:", error.message);
        return new Response(
            JSON.stringify({ error: "Internal server error during session validation." }),
            { status: 500 }
        );
    }
}

// Function: Fetch User Data
export async function fetchUserData() {
    try {
        const response = await fetch('/api/users');
        if (!response.ok) {
            throw new Error(`Server error: ${response.status}`);
        }

        const user = await response.json();
        return user || {};
    } catch (error) {
        console.error("Error fetching user data:", error.message);
        return { error: "Failed to fetch user data." };
    }
}
