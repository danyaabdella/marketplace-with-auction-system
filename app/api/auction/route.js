import { checkProductAvailability, connectToDB, userInfo } from "@/libs/functions";
import Auction from "@/models/Auction";
import { getToken } from "next-auth/jwt";

    export async function POST(req) {
        try {
            const userData = await userInfo();
            const auctionData = await req.json();

            const availability = await checkProductAvailability(auctionData.productId, auctionData.quantity);

            if (!availability.available ) {
                return new Response(
                    JSON.stringify({ error: availability.message }),
                    { status: 400 }
                );
            }
            if(userData.role !== "merchant" && auctionData.merchantId !== userData.id){
                return new Response(
                    JSON.stringify({ message: "not owner of the product" }),
                    { status: 400 }
                );
            }

            const newAuction = await Auction.create(auctionData);

            return new Response(
                JSON.stringify({ message: "Auction created successfully", auction: newAuction }),
                { status: 201 }
            );
        } catch (error) {
            return new Response(
                JSON.stringify({ error: "Internal server error" }),
                { status: 500 }
            );
        }
    }
    export async function GET(req) {
        const { searchParams } = new URL(req.url);
        const merchantId = searchParams.get("merchantId");

        const auctions = await Auction.find({ merchantId: merchantId });
        return new Response(
            JSON.stringify(auctions),
            { status: 200 }
        );
    }
    export async function PUT(req, res) {
        await connectToDB();
        try {
            const token = await getToken({ req });
            if (!token) {
                return new Response(
                    JSON.stringify({error: "Unauthorized"}),
                    { status: 401 }
                );
        }
             const { auctionId } = req.query;
             const { endTime, reservedPrice, itemImg, description } = req.body;

             if(!auctionId){
                return new Response(
                    JSON.stringify({ error: "Auction ID is required" }),
                    { status: 400 }
                );
             }
             const auction = await Auction.findById(auctionId);
             if( auction.status !== 'requested' || auction.status !== 'active'){
                return new Response(
                    JSON.stringify({ error: "Auction is closed" }),
                    { status: 400 }
                );
             }
             if(endTime) auction.endTime = endTime;
             if(reservedPrice) auction.reservedPrice = reservedPrice;
             if(itemImg) auction.itemImg = itemImg;
             if(description) auction.description = description;

             await auction.save();
             return new Response(
                JSON.stringify({ message: "Auction updated successfully" }),
                { status: 200 }
            );
        } catch (error) {
            console.error('Error updating auction:', error);
            return new Response(
                JSON.stringify({ error: 'Internal Server Error' }),
                { status: 500 });

        }
    }
    export async function DELETE(req) {
        try {
            const { auctionId } = req.query; 
            const { merchantId } = await req.json(); 
    
            const auction = await Auction.findById(auctionId);
            if (!auction) {
                return new Response(
                    JSON.stringify({ error: "Auction not found" }),
                    { status: 404 }
                );
            }
    
            if (auction.merchantId.toString() !== merchantId) {
                return new Response(
                    JSON.stringify({ error: "Unauthorized" }),
                    { status: 403 }
                );
            }
    
            await Auction.deleteOne({ _id: auctionId });
            return new Response(
                JSON.stringify({ message: "Auction deleted successfully" }),
                { status: 200 }
            );
        } catch (error) {
            return new Response(
                JSON.stringify({ error: "Internal server error" }),
                { status: 500 });
        }
    }