'use client';

import { SessionProvider } from 'next-auth/react';

// This component wraps children with the SessionProvider
export default function ContextProvider({ children }) {
  return <SessionProvider>{children}</SessionProvider>;
}
