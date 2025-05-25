import { connectToDB, userInfo } from "@/libs/functions";
import Advertisement from "@/models/Advertisement";
import { v4 as uuidv4 } from "uuid";
import { adRegions } from "@/libs/adRegion";
import { NextResponse } from "next/server";

const chapaSecretKey = process.env.CHAPA_SECRET_KEY;

export const POST = async (req) => {
  await connectToDB();
  const user = await userInfo(req);
  if (!user || user.role !== "merchant") {
    return NextResponse.json({ error: "Unauthorized: User must be a merchant" }, { status: 401 });
  }

  const {
    product,
    merchantDetail,
    startsAt,
    endsAt,
    adPrice,
    adRegion,
    isHome = false,
  } = await req.json();

  if (!product || !merchantDetail || !startsAt || !endsAt || !adPrice || !adRegion) {
    return new Response(JSON.stringify({ error: "Missing required fields" }), {
      status: 400,
    });
  }

  const regionCoordinates = adRegions[adRegion];
  if (!regionCoordinates) {
    return new Response(JSON.stringify({ error: "Invalid adRegion" }), {
      status: 400,
    });
  }

  const startDate = new Date(startsAt);
  const endDate = new Date(endsAt);
  if (endDate <= startDate) {
    return new Response(JSON.stringify({ error: "End date must be after start date" }), {
      status: 400,
    });
  }

  const weeks = Math.ceil((endDate - startDate) / (1000 * 60 * 60 * 24 * 7));
  const expectedPrice = isHome ? 100 * Math.max(1, weeks) : 50 * Math.max(1, weeks);
  if (adPrice !== expectedPrice) {
    return new Response(JSON.stringify({ error: "Invalid advertisement price" }), {
      status: 400,
    });
  }

  const regionAdCount = await Advertisement.countDocuments({
    adRegion,
    isActive: true,
    approvalStatus: "APPROVED",
    paymentStatus: "PAID",
    isHome,
  });

  if (regionAdCount >= 5) {
    return new Response(
      JSON.stringify({
        error: `Limit reached: Maximum of 5 active ${isHome ? "home" : "non-home"} ads in ${adRegion}`,
      }),
      { status: 400 }
    );
  }

  const tx_ref = uuidv4().replace(/-/g, "").slice(0, 15);

  const newAd = new Advertisement({
    product,
    merchantDetail,
    startsAt,
    endsAt,
    adPrice,
    tx_ref,
    approvalStatus: "PENDING",
    paymentStatus: "PENDING",
    isHome,
    adRegion,
    location: {
      type: "Point",
      coordinates: regionCoordinates,
    },
  });

  await newAd.save();

  try {
    const checkoutResponse = await fetch(`${process.env.NEXTAUTH_URL || "http://localhost:3000"}/api/adCheckout`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": req.headers.get('authorization') || `Bearer ${user.token || ""}`,
      },
      body: JSON.stringify({
        amount: adPrice,
        adData: {
          adId: newAd._id,
          product,
          merchantDetail,
          startsAt,
          endsAt,
          adRegion,
          isHome,
        },
        user: {
          _id: user._id,
          email: user.email,
          role: user.role,
          fullName: user.fullName,
          phoneNumber: user.phoneNumber,
        },
      }),
      credentials: 'include',
    });

    const checkoutData = await checkoutResponse.json();

    if (!checkoutResponse.ok) {
      await Advertisement.findByIdAndDelete(newAd._id);
      return new Response(
        JSON.stringify({ error: "Payment initialization failed", details: checkoutData.message }),
        { status: 400 }
      );
    }

    return new Response(
      JSON.stringify({
        message: "Ad created and payment initialized successfully",
        checkout_url: checkoutData.checkout_url,
        tx_ref,
        adId: newAd._id,
      }),
      { status: 201 }
    );
  } catch (error) {
    console.error("Error initializing payment:", error);
    await Advertisement.findByIdAndDelete(newAd._id);
    return new Response(
      JSON.stringify({
        error: "Error creating ad or initializing payment",
        details: error.message,
      }),
      { status: 500 }
    );
  }
};

export const GET = async (req) => {
  await connectToDB();

  const url = new URL(req.url);
  const center = url.searchParams.get("center");
  const radius = parseInt(url.searchParams.get("radius")) || 50000;
  const page = parseInt(url.searchParams.get("page")) || 1;
  const limit = parseInt(url.searchParams.get("limit")) || 15;
  const status = url.searchParams.get("status");

  console.log("Filters: ", center, radius, page, limit, status);

  const filter = {};
  if (status) filter.approvalStatus = status;

  try {
    if (center) {
      const [lat, lng] = center.split("-").map(Number);

      const result = await Advertisement.aggregate([
        {
          $geoNear: {
            near: { type: "Point", coordinates: [lng, lat] },
            distanceField: "distance",
            maxDistance: radius,
            spherical: true,
            query: filter,
          },
        },
        { $sort: { createdAt: -1 } },
        { $skip: (page - 1) * limit },
        { $limit: limit },
        {
          $facet: {
            metadata: [{ $count: "total" }],
            data: [
              { $sort: { createdAt: -1 } },
              { $skip: (page - 1) * limit },
              { $limit: limit },
            ],
          },
        },
      ]);

      const ads = result[0]?.data || [];
      const total = result[0]?.metadata[0]?.total || 0;

      console.log("total ads (geo):", total);

      return new Response(
        JSON.stringify({
          ads,
          pagination: {
            currentPage: page,
            totalPages: Math.ceil(total / limit),
            totalAds: total,
          },
        }),
        { status: 200 }
      );
    } else {
      const ads = await Advertisement.find(filter)
        .sort({ createdAt: -1 })
        .skip((page - 1) * limit)
        .limit(limit);

      const total = await Advertisement.countDocuments(filter);

      console.log("total ads (non-geo):", total);

      return new Response(
        JSON.stringify({
          ads,
          pagination: {
            currentPage: page,
            totalPages: Math.ceil(total / limit),
            totalAds: total,
          },
        }),
        { status: 200 }
      );
    }
  } catch (error) {
    console.error("Error fetching ads:", error);
    return new Response(
      JSON.stringify({ error: "Error fetching ads", details: error.message }),
      { status: 500 }
    );
  }
};

