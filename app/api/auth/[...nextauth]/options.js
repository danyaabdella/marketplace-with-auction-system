// import GitHubProvider from 'next-auth/providers/github';
import CredentialsProvider from 'next-auth/providers/credentials';
import mongoose from 'mongoose';
import argon2 from 'argon2';
import User from '@/models/User';

export const options = {
  providers: [
    CredentialsProvider({
      name: 'Email and Password',
      credentials: {
        email: { label: 'Email:', type: 'email', placeholder: 'your-email@example.com' },
        password: { label: 'Password:', type: 'password', placeholder: 'your-secure-password' },
      },
      async authorize(credentials) {
        console.log("Mongo URI: ", process.env.MONGO_URL);
        await mongoose.connect(process.env.MONGO_URL);

        // Check for Admin or SuperAdmin
        let user = await User.findOne({ email: credentials?.email });

        console.log("user: ", user);

        if (!user) {
          throw new Error('No user found with this email');
        }

        const isPasswordValid = await argon2.verify(user.password, credentials.password);
        const isEmailVerified = await user.isEmailVerified;

        if (!isPasswordValid) {
          throw new Error('Invalid email or password');
        }

        // If email is not verified, throw an error
        if (!isEmailVerified) {
          throw new Error('Email not verified');
        }

        // Return the user object with role if email is verified
        return { id: user._id, email: user.email, role: user.role || null };
      },
    }),
  ],
};