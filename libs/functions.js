import mongoose from 'mongoose';
import User from '@/models/User';
import { getServerSession } from 'next-auth';
import { options } from '@/app/api/auth/[...nextauth]/options';

export async function fetchUserData() {
  let data;
    try {
      const response = await fetch('/api/users');
      if (!response.ok) {
        throw new Error(`Server error: ${response.status}`);
      }

      const user = await response.json(); 

      if (user) {
        data = user;
        return data;
      } else {
        return {}; 
      }
    } catch (error) {
      console.error("Error fetching user data:", error);
    }
  }

  let isConnected = false;
  
export async function connectToDB() {
    if (isConnected) {
      console.log("Using existing database connection");
      return;
    }
  
    try {
      await mongoose.connect(process.env.MONGO_URL);
  
      isConnected = true;
      console.log("Database connected successfully");
    } catch (error) {
      console.error("Database connection failed:", error);
      throw new Error("Failed to connect to the database");
    }
  }
  
export async function isMerchant() {
    const userData = await userInfo();
    if (userData.role !== "merchant" || userData.isMerchant !== true) {
        console.log("Unauthorized: Only Merchants can perform this operation");
        return new Response(
            JSON.stringify({ error: "Unauthorized: Only Merchants can perform this operation" }),
            { status: 403 }
        );
    }
}

export async function userInfo() {
    const session = await getServerSession(options)
    const userEmail = session?.user?.email;
    if (!userEmail) {
      return false;
    }
    connectToDB();
    let userInfo = await User.findOne({email: userEmail})

    if(!userInfo) {
      return false;
    }
  
    return userInfo;
  }

export async function checkSession(email) {
      if (!email) {
          return new Response(
              JSON.stringify({ error: "User email is required." }),
              { status: 400 }
          );
      }
  
      const session = await getServerSession(options);
      if (!session) {
          return new Response(
              JSON.stringify({ error: "Unauthorized. No session found." }),
              { status: 401 }
          );
      }
  
      const sessionEmail = session?.user?.email;
  
      // Ensure the session email matches the requested email
      if (sessionEmail !== email) {
          return new Response(
              JSON.stringify({ error: "Unauthorized access." }),
              { status: 403 }
          );
      }
  
      return null;
  }
  