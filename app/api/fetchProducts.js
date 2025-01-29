export async function GET(req) {
    try {
        const url = new URL(req.url);
        const email = url.searchParams.get("email");
        const name = url.searchParams.get("name"); // Fetch by name
        const category = url.searchParams.get("category"); // Fetch by category
        const lat = parseFloat(url.searchParams.get("lat"));
        const lng = parseFloat(url.searchParams.get("lng"));
        const distanceInKM = 40; // 40KM radius

        await connectToDB();

        let query = {};

        // If email is provided, filter by email
        if (email) {
            query.sellerEmail = email;
        }

        // Add banned filter (not banned products)
        query.banned = false;

        // If location is provided, filter by 40KM radius
        if (lat && lng) {
            query.location = {
                $near: {
                    $geometry: {
                        type: "Point",
                        coordinates: [lng, lat],
                    },
                    $maxDistance: distanceInKM * 1000, // Convert KM to meters
                },
            };
        }

        // If name is provided, filter by product name (case-insensitive)
        if (name) {
            query.name = { $regex: new RegExp(name, "i") }; // Case-insensitive search
        }

        // If category is provided, filter by category
        if (category) {
            query.category = category;
        }

        // Fetch products with specified fields
        const products = await Product.find(query)
            .select("name createdAt quantity location price category deliveryRule reviews") // Include only required fields
            .populate("reviews.user", "name email image") // Populate review user details
            .sort({ createdAt: -1 }); // Sort by creation date (latest first)

        if (products.length === 0) {
            return new Response(
                JSON.stringify({ message: "No products found based on the criteria." }),
                { status: 404 }
            );
        }

        return new Response(JSON.stringify(products), {
            status: 200,
            headers: { "Content-Type": "application/json" },
        });
    } catch (error) {
        console.error("Error fetching products:", error.message);
        return new Response(
            JSON.stringify({ error: "Internal server error." }),
            { status: 500 }
        );
    }
}