import { verifyOtp } from '../../../../libs/sendOtp';
import { getServerSession } from 'next-auth';
import { options } from '../[...nextauth]/options';
import { connectToDB } from '@/libs/functions';

export async function POST(req) {
  const { email, otp } = await req.json();
  try {
    connectToDB()
    await verifyOtp(email, otp);
    const session = await getServerSession(options); // Note: This may be null until signIn is called
    return Response.json({ message: 'OTP verified', session });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 400 });
  }
}