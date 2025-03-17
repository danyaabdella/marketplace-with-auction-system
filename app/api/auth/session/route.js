// app/api/auth/session/route.js
import { getServerSession } from "next-auth";
import { options } from "@/app/api/auth/[...nextauth]/options";

export async function GET() {
  const session = await getServerSession(options);

  if (!session) {
    return new Response(JSON.stringify({ isSignedIn: false }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  }

  return new Response(JSON.stringify({ isSignedIn: true, user: session.user }), {
    status: 200,
    headers: { "Content-Type": "application/json" },
  });
}