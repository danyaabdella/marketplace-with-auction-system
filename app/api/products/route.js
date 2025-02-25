import { connectToDB, isMerchant, userInfo } from "@/libs/functions";
import Product from "@/models/Product";

export async function POST(req) {
    const merchantCheckResponse = await isMerchant(); 
    const merchantInfo = await userInfo();

    if (merchantCheckResponse) {
        return merchantCheckResponse; 
    }

    const productData = await req.json();

    try {
        await connectToDB();

        if (merchantInfo.isBanned || merchantInfo.isDeleted) {
            return new Response(JSON.stringify("you can not perform this operation temporarily"))
        }

        // Add the seller's information to the merchantDetail field
        const merchantDetail = {
            merchantId: merchantInfo.id,
            merchantName: merchantInfo.fullName,
            merchantEmail: merchantInfo.email,
        };


        // Add merchantDetail to the product data
        productData.merchantDetail = merchantDetail;

        // Create the product
        const newProduct = await Product.create(productData);

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
    const merchantCheckResponse = await isMerchant(); 
    const merchantInfo = await userInfo();

    if (merchantCheckResponse) {
        return merchantCheckResponse; 
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
    let filter = { 'merchantDetail.merchantEmail': merchantInfo.email }; 

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
        // Query the database with the filter
        const products = await Product.find(filter);
    
        return new Response(JSON.stringify(products), { status: 200 });
    } catch (error) {
        console.error("Error fetching products:", error.message);
        return new Response(JSON.stringify({ error: "Failed to fetch products" }), { status: 500 });
    }
    
}

export async function PUT(req) {
    const merchantCheckResponse = await isMerchant();
    if (merchantCheckResponse) return merchantCheckResponse;

    const merchantInfo = await userInfo();

    if (merchantInfo.isBanned || merchantInfo.isDeleted) {
        return new Response(JSON.stringify("you can not perform this operation temporarily"))
    }

    const { _id, productName, price, quantity, categoryName, categoryId, description, delivery, deliveryPrice, images, location, isDeleted } = await req.json();

    try {
        await connectToDB();

        const product = await Product.findById(_id);
        if (!product) return new Response(JSON.stringify({ error: "Product not found" }),{ status: 404 });

        if (product.merchantDetail.merchantEmail !== merchantInfo.email) return new Response( JSON.stringify({ error: "Unauthorized: You can only update your own products" }), { status: 403 });

        if (product.isDeleted && isDeleted === false) {
            product.isDeleted = false;
            product.trashDate = null;

            await product.save();
            return new Response( JSON.stringify({ message: "Product Restored successfully"}),{ status: 200 });
        }
        // Update the product fields
        product.productName = productName || product.productName;
        product.price = price || product.price;
        if (typeof quantity !== "undefined") {
            product.quantity += quantity;
        }        
        product.description = description || product.description;
        product.delivery = delivery || product.delivery;
        product.deliveryPrice = deliveryPrice || product.deliveryPrice;
        product.images = images || product.images;
        product.location = location || product.location;
        product.category.categoryId = categoryId || product.category.categoryId;
        product.category.categoryName = categoryName || product.category.categoryName;

        await product.save();

        return new Response( JSON.stringify({ message: "Product updated successfully", product }), { status: 200 });
    } catch (error) { 
        return new Response( JSON.stringify({ error: "Failed to update product" }),{ status: 500 });

    }
}

export async function DELETE(req) {
    try {

        const { _id } = await req.json();

        if (!_id) return new Response( JSON.stringify({ error: "Product ID is required." }), { status: 400 });
        
        await connectToDB();

        const product = await Product.findById(_id);
        if (!product) return new Response( JSON.stringify({ error: "Product not found." }),{ status: 404 });
        
        const user = await userInfo();

        if (product.merchantDetail.merchantEmail !== user.email) return new Response( JSON.stringify({ error: "Unauthorized. You can only delete your products." }), { status: 403 });
        
        if (product.isDeleted === true && product.trashDate !== null) {
            return new Response( JSON.stringify({ message: "Product ALready In trash." }),{ status: 201 });
        }
        // Perform a soft delete
        product.isDeleted = true;
        product.trashDate = new Date();

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