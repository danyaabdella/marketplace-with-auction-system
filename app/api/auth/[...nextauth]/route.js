//http://localhost:3000/api/auth/signin/credentials

import NextAuth from 'next-auth';
import { signOut as nextAuthSignOut } from "next-auth/react";
import { options } from './options';
const handler = NextAuth(options)

export { handler as GET, handler as POST }


  export async function role(req, res) {
      // return userInfo.role;
      const user = await userInfo(req, res);  // Call the fixed `userInfo` function

      if (!user) {
        return null;
      }

      console.log("User role:", user.role);
      return user.role;
    }
  export async function signOut() {
    // return NextAuth.signOut(options);
    return nextAuthSignOut();
  }


 
