

import { connectToDB, isMerchant, userInfo } from "@/libs/functions";
import Product from "@/models/Product";

export async function POST(req) {
    //const merchantCheckResponse = await isMerchant(req); 
    const merchantInfo = await userInfo(req);

    const merchantCheck = await isMerchant(req);
        if (merchantCheck instanceof Response) return merchantCheck;

    const productData = await req.json();

    try {
        await connectToDB();

        const newProduct = await Product.create({
            ...productData,
            merchantDetail: {
                merchantId: merchantCheck.merchantId,
                merchantEmail: merchantCheck.merchantEmail,
                merchantName: merchantCheck.merchantName
            },
        });

        return new Response(
            JSON.stringify({ message: "Product added successfully", product: newProduct }),
            { status: 201 }
        );
    } catch (error) {
        console.error("Error adding product:", error.message);
        return new Response(
            JSON.stringify({ error: "Failed to add product" }),
            { status: 500 }
        );
    }
}

export async function GET(req) {
    const  merchantCheck = await isMerchant(req); 
    if (merchantCheck instanceof Response) return merchantCheck;
    
    const merchantInfo = await userInfo(req);
    if (!merchantInfo) {
      return new Response(
        JSON.stringify({ error: "Merchant information not found" }),
        { status: 404 }
      );
    }
    const url = new URL(req.url);

    // Destructure query parameters using searchParams.get()
    const productName = url.searchParams.get("productName");
    const categoryId = url.searchParams.get("categoryId");
    const minPrice = url.searchParams.get("minPrice");
    const maxPrice = url.searchParams.get("maxPrice");
    const minQuantity = url.searchParams.get("minQuantity");
    const maxQuantity = url.searchParams.get("maxQuantity");
    const minSoldQuantity = url.searchParams.get("minSoldQuantity");
    const maxSoldQuantity = url.searchParams.get("maxSoldQuantity");
    const minAvgReview = url.searchParams.get("minAvgReview");
    const maxAvgReview = url.searchParams.get("maxAvgReview");
    const delivery = url.searchParams.get("delivery");
    const minDeliveryPrice = url.searchParams.get("minDeliveryPrice");
    const maxDeliveryPrice = url.searchParams.get("maxDeliveryPrice");
    const startDate = url.searchParams.get("startDate");
    const endDate = url.searchParams.get("endDate");

    // Build the filter object based on query params
    let filter = { 
        'merchantDetail.merchantEmail': merchantInfo.email,
         isDeleted: false }; 

    if (productName) {
        filter.productName = { $regex: productName, $options: 'i' }; 
    }

    if (categoryId) {
        filter['category.categoryId'] = categoryId;
    }

    if (minPrice) {
        filter.price = { $gte: minPrice };
    }

    if (maxPrice) {
        filter.price = { ...filter.price, $lte: maxPrice };
    }

    if (minQuantity) {
        filter.quantity = { $gte: minQuantity };
    }

    if (maxQuantity) {
        filter.quantity = { ...filter.quantity, $lte: maxQuantity };
    }

    if (minSoldQuantity) {
        filter.soldQuantity = { $gte: minSoldQuantity };
    }

    if (maxSoldQuantity) {
        filter.soldQuantity = { ...filter.soldQuantity, $lte: maxSoldQuantity };
    }

    if (minAvgReview) {
        filter['review.rating'] = { $gte: minAvgReview }; // You can calculate the average review in your query if needed
    }

    if (maxAvgReview) {
        filter['review.rating'] = { ...filter['review.rating'], $lte: maxAvgReview };
    }

    if (delivery) {
        filter.delivery = delivery;
    }

    if (minDeliveryPrice) {
        filter.deliveryPrice = { $gte: minDeliveryPrice };
    }

    if (maxDeliveryPrice) {
        filter.deliveryPrice = { ...filter.deliveryPrice, $lte: maxDeliveryPrice };
    }

    if (startDate) {
        filter.createdAt = { $gte: new Date(startDate) };
    }

    if (endDate) {
        filter.createdAt = { ...filter.createdAt, $lte: new Date(endDate) };
    }

    try {
        const page = parseInt(url.searchParams.get("page")) || 1;
        const limit = parseInt(url.searchParams.get("limit")) || 10;
        const skip = (page - 1) * limit;
        // Query the database with the filter
        const products = await Product.find(filter)
                    .skip(skip)
                    .limit(limit)
                    .lean();

        const total = await Product.countDocuments(filter);

        return new Response(JSON.stringify
                ({ products, total, page, limit }),
                { status: 200 }
            );
    } catch (error) {
        console.error("Error fetching products:", error.message);
        return new Response(JSON.stringify({ error: "Failed to fetch products" }), { status: 500 });
    }
    
}
        

export async function PUT(req) {
    try {
        // const body = await req.json();
        // const { productId, quantity, review, ...updateData } = body;
        const url = new URL(req.url);
        const productId = url.searchParams.get("productId");
        const body = await req.json();

        if (!productId) {
            return new Response(
                JSON.stringify({ error: "Product ID is required." }),
                { status: 400 }
            );
        }

        await connectToDB();

        // Fetch the product to validate existence
        const product = await Product.findById(productId);
        if (!product) {
            return new Response(
                JSON.stringify({ error: "Product not found." }),
                { status: 404 }
            );
        }

        // Validate user session
        const user = await userInfo(req);
        if (!user?.email) {
            return new Response(
                JSON.stringify({ error: "Unauthorized. No session found." }),
                { status: 401 }
            );
        }

        const existingProduct = await Product.findOne({
            _id: productId,
            'merchantDetail.merchantEmail': user.email
        });

        if (!existingProduct) {
            return new Response(
                JSON.stringify({ error: "Product not found or unauthorized." }),
                { status: 404 }
            );
        }

        const updatedProduct = await Product.findByIdAndUpdate(
            productId,
            {
                ...body,
                merchantDetail: existingProduct.merchantDetail // Prevent merchant details from being changed
            },
            { new: true }
        );
       

        return new Response(
            JSON.stringify({ message: "Product updated successfully.", updatedProduct }),
            { status: 200 }
        );
    } catch (err) {
        console.error("Error in PUT handler:", err.message);
        return new Response(
            JSON.stringify({ error: "Internal server error." }),
            { status: 500 }
        );
    }
}

export async function DELETE(req) {
    try {
        const { searchParams } = new URL(req.url);
        const productId = searchParams.get("productId");
        // const { productId } = await req.json();

        if (!productId) {
            return new Response(
                JSON.stringify({ error: "Product ID is required." }),
                { status: 400 }
            );
        }

        await connectToDB();

        // Fetch the product to validate its existence
        const product = await Product.findById(productId);
        if (!product) {
            return new Response(
                JSON.stringify({ error: "Product not found." }),
                { status: 404 }
            );
        }

        // Validate the user's session and check ownership
        const user = await userInfo(req);

        if (product.merchantDetail.merchantEmail !== user.email) {
            return new Response(
                JSON.stringify({ error: "Unauthorized. You can only delete your products." }),
                { status: 403 }
            );
        }

        // Perform a soft delete
        product.isDeleted = true;
        product.trashDate = new Date(); // Set the trash date to the current time
        await product.save();

        return new Response(
            JSON.stringify({ message: "Product moved to trash. It will be permanently deleted after 30 days.", product }),
            { status: 200 }
        );
    } catch (err) {
        console.error("Error in DELETE handler:", err.message);
        return new Response(
            JSON.stringify({ error: "Internal server error." }),
            { status: 500 }
        );
    }
}