import { verifyOtp } from '../../../../libs/sendOtp';
import { getServerSession } from 'next-auth';
import { options } from '../[...nextauth]/options';
import { connectToDB } from '@/libs/functions';
import User from '@/models/User';
export async function POST(req) {
  // const { email, otp } = await req.json();
  // try {
  //   await connectToDB()
  //   await verifyOtp(email, otp);
  //   const session = await getServerSession(options); // Note: This may be null until signIn is called
  //   return Response.json({ message: 'OTP verified', session });
  // } catch (error) {
  //   return Response.json({ error: error.message }, { status: 400 });
  // }
  const { email, otp } = await req.json();
  
  try {
    // 1. Ensure proper database connection
    await connectToDB();

    // 2. Verify OTP first
    await verifyOtp(email, otp);

    // 3. Update user's verification status
    const updatedUser = await User.findOneAndUpdate(
      { email },
      { isEmailVerified: true },
      { new: true }
    );

    if (!updatedUser) {
      throw new Error('User not found');
    }
    // 4. Return success response (no session yet)
    return Response.json({ 
      success: true,
      message: 'Email successfully verified',
      email: updatedUser.email,
      // Don't return session here - it will be created during sign-in
    });

  } catch (error) {
    console.error('OTP verification error:', error);
    return Response.json(
      { 
        error: error.message || 'OTP verification failed',
        details: process.env.NODE_ENV === 'development' ? error.stack : undefined
      }, 
      { status: 400 }
    );
  }
}