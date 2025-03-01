import { checkProductAvailability, connectToDB, userInfo } from "@/libs/functions";
import Auction from "@/models/Auction";
import { getToken } from "next-auth/jwt";
import { scheduleAuctionEnd } from "@/libs/functions";

    export async function POST(req) {
        try {

            const auctionData = await req.json();
            const userData = await userInfo();
            
            if (!userData || userData.role !== "merchant") {
                return new Response(
                    JSON.stringify({ error: "Unauthorized: Only merchants can create auctions" }),
                    { status: 403 }
                );
            }
    
            // Ensure the auction belongs to the logged-in merchant
            if (auctionData.merchantId && auctionData.merchantId !== userData.id) {
                return new Response(
                    JSON.stringify({ error: "Unauthorized: You are not the owner of this auction" }),
                    { status: 403 }
                );
            }

            auctionData.merchantId = userData._id;
            if( auctionData.productId ) {
                const availability = await checkProductAvailability(auctionData.productId, auctionData.quantity);

                if (!availability.available ) {
                    return new Response(
                        JSON.stringify({ error: availability.message }),
                        { status: 400 }
                    );
                }
            }
            

            const newAuction = await Auction.create(auctionData);
            await scheduleAuctionEnd(newAuction);
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
             const { endTime, reservedPrice, itemImg, description, bidIncrement } = req.body;

             if(!auctionId){
                return new Response(
                    JSON.stringify({ error: "Auction ID is required" }),
                    { status: 400 }
                );
             }

              if (auction.merchantId.toString() !== token.id) {
            return new Response(
                JSON.stringify({ error: "Unauthorized: You are not the owner of this auction" }),
                { status: 403 }
            );
        }
             const auction = await Auction.findById(auctionId);
             if( auction.status !== 'active'){
                return new Response(
                    JSON.stringify({ error: "Auction is closed" }),
                    { status: 400 }
                );
             }
             
             if (auction.merchantId.toString() !== token.id) {
                return new Response(
                    JSON.stringify({ error: "Unauthorized: You are not the owner of this auction" }),
                    { status: 403 }
                );
            }
            let scheduleEnd = false;
             if(endTime) {
                auction.endTime = endTime;
                scheduleEnd = true;
             } 
             if(reservedPrice) auction.reservedPrice = reservedPrice;
             if(itemImg) auction.itemImg = itemImg;
             if(description) auction.description = description;
             if(bidIncrement) auction.bidIncrement = bidIncrement;

             await auction.save();
             if( scheduleEnd ) {
                await scheduleAuctionEnd(auction);
             }
             
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
            const token = await getToken({ req });
            if (!token) {
                return new Response(
                    JSON.stringify({ error: "Unauthorized" }),
                    { status: 401 }
                );
            }

            const { searchParams } = new URL(req.url);
            const auctionId = searchParams.get("auctionId");

               // const { auctionId } = req.query; 
               // const { merchantId } = await req.json(); 
        
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
                if (auction.adminApproval !== "pending") {
                    return new Response(
                        JSON.stringify({ error: "You can only delete auctions that are pending approval" }),
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