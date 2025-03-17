import { connectToDB, userInfo } from "@/libs/functions";
import Auction from "@/models/Auction";
import Bid from "@/models/Bid"; // Assuming bids are stored separately


export async function GET(req) {
    try {
        await connectToDB(); // Ensure database connection
        const { searchParams } = new URL(req.url);
        const type = searchParams.get("type");

        // const userData = await userInfo(); // Get logged-in user
        // if (!userData) {
        //     return new Response(
        //         JSON.stringify({ error: "Unauthorized: Please log in" }),
        //         { status: 401 }
        //     );
        // }

        if (type === "all-active") {
            // 1. Fetch all active auctions
            const activeAuctions = await Auction.find({ status: "active" });
            return new Response(JSON.stringify(activeAuctions), { status: 200 });
        }

        if (type === "my-auctions") {
            // 2. fetch participated in auctions
            const userEmail = userData.email;
            const bids = await Bid.find({ userEmail }).distinct("auctionId");

            const participatedAuctions = await Auction.find({ _id: { $in: bids } });

            return new Response(JSON.stringify(participatedAuctions), { status: 200 });
        }

        return new Response(
            JSON.stringify({ error: "Invalid request type" }),
            { status: 400 }
        );

    } catch (error) {
        console.error("Error fetching auctions:", error);
        return new Response(
            JSON.stringify({ error: "Internal server error" }),
            { status: 500 }
        );
    }
}
