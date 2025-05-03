import { Vision } from "@/models/About";
import { connectToDB, isSuperAdmin } from "@/utils/functions";

export async function GET() {
    await connectToDB();
    await isSuperAdmin();    
    try {
      const data = await Vision.findOne();
      return new Response(JSON.stringify({ success: true, data }), { status: 200 });
    } catch {
      return new Response(JSON.stringify({ success: false }), { status: 500 });
    }
  }
  
  
  