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

       
        // Add the seller's information to the merchantDetail field
        const merchantDetail = [{
            merchantId: merchantInfo.id,
            merchantName: merchantInfo.name,
            merchantEmail: merchantInfo.email,
        }];

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

export async function GET(req, res) {
    const products = await Product.find({ isDeleted: false } && {banned: false});
    res.status(200).json(products);
    }
        

export async function PUT(req) {
    try {
        const body = await req.json();
        const { productId, quantity, review, ...updateData } = body;

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
        const user = await userInfo();
        if (!user || !user.email) {
            return new Response(
                JSON.stringify({ error: "Unauthorized. No session found." }),
                { status: 401 }
            );
        }

        // Ensure the user is the seller of the product
        if (product.sellerEmail !== user.email) {
            return new Response(
                JSON.stringify({ error: "Unauthorized. You can only update your products." }),
                { status: 403 }
            );
        }

        // Update quantity (if provided)
        if (typeof quantity === "number" && quantity >= 0) {
            product.quantity = quantity;
        }

        // Add review (if provided)
        if (review && review.rating && review.comment) {
            const newReview = {
                rating: review.rating,
                comment: review.comment,
                user: {
                    name: user.name,
                    email: user.email,
                    image: user.image || null,
                },
            };

            product.reviews.push(newReview);
        }

        // Update other fields (excluding reviews and quantity)
        const fieldsToExclude = ["quantity", "reviews"];
        const filteredUpdates = Object.fromEntries(
            Object.entries(updateData).filter(([key]) => !fieldsToExclude.includes(key))
        );

        Object.assign(product, filteredUpdates);

        // Save the updated product
        await product.save();

        return new Response(
            JSON.stringify({ message: "Product updated successfully.", product }),
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
        const { productId } = await req.json();

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
        const user = await userInfo();

        if (product.sellerEmail !== user.email) {
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