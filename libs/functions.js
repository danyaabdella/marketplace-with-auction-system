import mongoose from 'mongoose';
import User from '@/models/User';
import Product from '@/models/Product';
import Auction from '@/models/Auction';
import Bid from '@/models/Bid';
import { getServerSession } from 'next-auth';
import { options } from '@/app/api/auth/[...nextauth]/options';
import { sendEmail } from './sendEmail';
import { Agenda } from 'agenda';
import { getIO } from './socket';

const agenda = new Agenda({ db: { address: process.env.MONGO_URL } });

// Define a job for auction ending
agenda.define('end auction', async (job) => {
    const auctionId = job.attrs.data.auctionId;
    const auction = await Auction.findById(auctionId);
    if (auction) {
        auction.status = 'ended';
        await auction.save();

        const bidData = await Bid.findOne({ auctionId: auction._id });
        const bidderEmails = bidData ? bidData.bids.map(b => b.bidderEmail) : [];

        // Send notification and email
        if (bidderEmails.length > 0) sendEmail(bidderEmails, 'Auction Ended!', `The auction for ${auction._id} has ended. The highest bid was ${bidData?.highestBid}.`);

        const io = getIO();
        io.to(auction._id.toString()).emit('auction_ended', { auctionId: auction._id, highestBid: bidData?.highestBid });
    }
});

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
  console.log("email: ",session);
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
  
  export async function checkProductAvailability(productId, requestedQuantity = null) {
    try {
        await connectToDB();

        // Find product by ID and retrieve only necessary fields
        const product = await Product.findById(productId).select("quantity");

        if (!product) {
            return { available: false, message: "Product not found" };
        }

        // If only productId is provided, check if stock is greater than 0
        if (requestedQuantity === null) {
            return product.quantity > 0
                ? { available: true, message: "Product is in stock" }
                : { available: false, message: "Product is out of stock" };
        }

        // If requestedQuantity is provided, check if enough stock is available
        return requestedQuantity <= product.quantity
            ? { available: true, message: "Requested quantity is available" }
            : { available: false, message: "Requested quantity exceeds available stock" };

    } catch (error) {
        console.error("Error checking product availability:", error.message);
        return { available: false, message: "Internal server error" };
    }
}

  // Schedule the job to run when auction ends
  export async function scheduleAuctionEnd(auction) {
      const endTime = new Date(auction.endTime);
      const delay = endTime - new Date(); // calculate time remaining until auction ends

      if (delay > 0) {
          await agenda.schedule(new Date(endTime), 'end auction', { auctionId: auction._id });
      } else {
          // If endTime is in the past, immediately end the auction
          await agenda.now('end auction', { auctionId: auction._id });
      }
  }
//   export async function Participant() {
//     await connectToDB();
//     const session = await getServerSession(options)
//     const userEmail = session?.user?.email;
//     const participant = await Bid.find({ bidderEmail: userEmail });
//     if (participant && participant.length > 0) {
//         const auctionIds = participant.map(bid => bid.auctionId);
//         return auctionIds;
//     } else {
//         return false;
//     }
// }
export async function Participant() {
  await connectToDB();
  const session = await getServerSession(options);

  if (!session || !session.user || !session.user.email) {
      console.log("No valid session found.");
      return []; // Return empty array instead of false
  }

  const userEmail = session.user.email;
  console.log("User email:", userEmail);

  const participant = await Bid.find({ 'bids.bidderEmail': userEmail });
  console.log("Participant bids:", participant);

  if (participant.length > 0) {
      const auctionIds = participant.map(bid => bid.auctionId);
      console.log("Auction IDs:", auctionIds);
      return auctionIds;
  } else {
      console.log("No auctions found for this user.");
      return []; // Return empty array instead of false
  }
}

// Function to send OTP
export async function sendOtp(email) {
  try {
      const otpResponse = await fetch(`/api/sendOtp?type=verify`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email }),
      });

      const otpData = await otpResponse.json();
      if (!otpResponse.ok) throw new Error(otpData.message || "Failed to send OTP");

      toast.success("OTP sent to your email");
  } catch (error) {
      toast.error(error.message || "Failed to send OTP");
  }
};
  

