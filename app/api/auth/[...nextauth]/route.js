//http://localhost:3000/api/auth/signin/credentials

import NextAuth from 'next-auth';
import { options } from './options';
import { getServerSession } from 'next-auth';
import User from '@/models/User';
const handler = NextAuth(options)

export { handler as GET, handler as POST }


export async function role() {
    const session = await getServerSession(options);
    const userEmail = session?.user?.email;
    if (!userEmail) {
      return false;
    }
    let userInfo = await User.findOne({email: userEmail})

    console.log("user info to check role: ", userInfo.role);
    if(!userInfo) {
      return false;
    }
  
    return userInfo.role;
  }

 