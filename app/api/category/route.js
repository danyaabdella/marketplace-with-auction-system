import { connectToDB } from "@/libs/functions";
import Category from "@/models/Category";

export async function GET(req) {
    try {
      await connectToDB();

      const { searchParams } = new URL(req.url);
      const id = searchParams.get('id');
      const name = searchParams.get('name');
      const createdBy = searchParams.get('createdBy');
      const createdAt = searchParams.get('createdAt');
  
      let query = {};
      if (id) query._id = id;
      if (name) query.name = name;
      if (createdBy) query.createdBy = createdBy;
      if (createdAt) query.createdAt = { $gte: new Date(createdAt) };
  
      const categories = await Category.find(query);
  
      return new Response(JSON.stringify(categories), { status: 200 });
    } catch (error) {
      return new Response(JSON.stringify({ error: error.message }), { status: 400 });
    }
  }