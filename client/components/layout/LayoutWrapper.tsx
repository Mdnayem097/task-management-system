'use client';

import { usePathname } from 'next/navigation';
import Navbar from './Navbar';
import { useAuth } from '@/context/AuthContext';

export default function LayoutWrapper({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const { user } = useAuth(); // AuthContext থেকে ইউজার ডেটা নেওয়া

  // Login & Register পেজে Navbar দেখাবে না
  const isAuthPage = pathname === '/login' || pathname === '/register';

  return (
    <>
      {!isAuthPage && <Navbar user={user} />}
      {children}
    </>
  );
}