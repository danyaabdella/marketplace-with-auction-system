
import { connectToDB } from "@/libs/functions"
import Auction from "@/models/Auction"
import Bid from "@/models/Bid"
import { NextResponse } from "next/server"

export async function GET(request) {
    try {
        await connectToDB()
        
        const { searchParams } = new URL(request.url)
        const type = searchParams.get("type")
        const category = searchParams.get("category")
        const minPrice = searchParams.get("minPrice")
        const maxPrice = searchParams.get("maxPrice")
        const status = searchParams.get("status")

        const baseQuery = {}
        
        // Apply filters
        if (category) baseQuery.category = category
        if (status) baseQuery.status = status
        if (minPrice || maxPrice) {
            baseQuery.startingPrice = {}
            if (minPrice) baseQuery.startingPrice.$gte = Number(minPrice)
            if (maxPrice) baseQuery.startingPrice.$lte = Number(maxPrice)
        }

        let auctions = []

        if (type === "all-active") {
            baseQuery.status = "active"
            baseQuery.endTime = { $gt: new Date() }

            auctions = await Auction.aggregate([
                { $match: baseQuery },
                {
                    $lookup: {
                        from: "bids",
                        localField: "_id",
                        foreignField: "auctionId",
                        as: "bidInfo"
                    }
                },
                {
                    $lookup: {
                        from: "users",
                        localField: "merchantId",
                        foreignField: "_id",
                        as: "merchant",
                        pipeline: [
                            { $project: { fullName: 1, image: 1 } }
                        ]
                    }
                },
                {
                    $lookup: {
                        from: "products",
                        localField: "productId",
                        foreignField: "_id",
                        as: "product"
                    }
                },
                {
                    $addFields: {
                        bidInfo: { $arrayElemAt: ["$bidInfo", 0] },
                        merchantId: { $arrayElemAt: ["$merchant", 0] },
                        product: { $arrayElemAt: ["$product", 0] }
                    }
                    // $addFields: {
                    //     currentBid: { $max: "$bidInfo.highestBid" },
                    //     bidCount: { $size: "$bidInfo" },
                    //     merchantName: { $arrayElemAt: ["$merchant.username", 0] },
                    //     productName: { $arrayElemAt: ["$product.productName", 0] },
                    //     mainImage: { $arrayElemAt: ["$itemImg", 0] },
                    //     timeLeft: {
                    //         $divide: [
                    //             { $subtract: ["$endTime", new Date()] },
                    //             1000 * 60 * 60 // Convert to hours
                    //         ]
                    //     }
                    // }
                },
                // Add computed fields
                {
                    $addFields: {
                        currentBid: { $ifNull: ["$bidInfo.highestBid", "$startingPrice"] },
                        bidCount: { $ifNull: ["$bidInfo.totalBids", 0] },
                        productName: "$product.productName",
                        mainImage: { $arrayElemAt: ["$itemImg", 0] },
                        timeLeft: {
                            $divide: [
                                { $subtract: ["$endTime", new Date()] },
                                1000 * 60 * 60 // Convert to hours
                            ]
                        }
                    }
                },
                { $sort: { endTime: 1 } }, // Sort by ending soonest
                { $limit: 50 }
            ])
        }

        return NextResponse.json(auctions)
    } catch (error) {
        console.error("Error fetching auctions:", error)
        return NextResponse.json(
            { error: "Internal server error" },
            { status: 500 }
        )
    }
}