import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import User from "@/models/User";

export const authOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        await mongoose.connect(process.env.MONGO_URL);

        // Find the user by email
        const user = await User.findOne({ email: credentials.email });

        if (!user) {
          throw new Error("No user found with this email");
        }

        // Compare the provided password with the hashed password
        const isPasswordValid = await bcrypt.compare(credentials.password, user.password);
        if (!isPasswordValid) {
          throw new Error("Invalid email or password");
        }

        // Return user data (omit sensitive information)
        return { id: user._id, email: user.email };
      },
    }),
  ],
  pages: {
    signIn: "/auth/signin", // Custom sign-in page
  },
  session: {
    jwt: true, // Use JWT for session management
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.email = user.email;
      }
      return token;
    },
    async session({ session, token }) {
      session.user.id = token.id;
      session.user.email = token.email;
      return session;
    },
  },
};

// export async function isSeller() {
//   const session = await getServerSession(authOptions);
//   const userEmail = session?.user?.email;
//   console.log("user email: ", userEmail);
//   if (!userEmail) {
//     return false;
//   }
//   const userInfo = await User.findOne({ email: userEmail });
//   console.log("user info to check seller: ", userInfo);
//   if (!userInfo) {
//     return false;
//   }

//   return userInfo.role === "Seller";
// }

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };