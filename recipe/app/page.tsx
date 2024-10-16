'use client';

import LoginedMain from '@/components/LoginedMain';
import NotLogined from '@/components/NotLogined';
import { useSession } from 'next-auth/react';
import { useEffect } from 'react';

export default function Home() {
  const { data: session } = useSession();
  useEffect(() => {
    localStorage.setItem('user', JSON.stringify(session?.user?.email));
  }, [session]);

  return (
    <div className='flex h-full w-full justify-center'>
      {session?.user ? <LoginedMain /> : <NotLogined />}
    </div>
  );
}
