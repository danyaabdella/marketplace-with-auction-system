'use client'

import { useSession } from 'next-auth/react';
import React from 'react'
import { useProfile } from '@/components/userProfile';


export default function Home() {
  const { data: session } = useSession();
  const email = session?.user?.email;
  // Only call useProfile if email is available
  const { loading, data, error } = useProfile(email);
//  if(email) {
//   return ( <AuctionPage auctionId="679bb003c65b3ee8ff5b08c9"/>)
//  }
 
{/* <useBidNotifications/> */}
  if (!email) {
    return <div>Please log in</div>;
  }

  // console.log("values: ", data, error);
  
  // if (loading) {
  //   return <div>Loading...</div>;
  // }

  // if (error) {
  //   return <div>{error}</div>;
  // }

  // if (data) {
  //   return (
  //     <div>
  //       {data.email}
  //       {/* <UserNotifications email={email} /> Add UserNotifications component */}
  //     </div>
  //   );
  //}


  return null;
}
