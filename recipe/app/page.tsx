'use client';

import LoginedMain from '@/components/LoginedMain';
import NotLogined from '@/components/NotLogined';
import { useSession } from 'next-auth/react';
import { useEffect } from 'react';

type User = {
  email: string;
};

export default function Home() {
  const { data: session } = useSession();
  useEffect(() => {
    let userList = JSON.parse(localStorage.getItem('users') || '[]') as User[];
    if (
      session?.user?.email &&
      !userList.find((user) => user.email === session.user?.email)
    ) {
      userList = [...userList, { email: session?.user?.email }];
    }

    localStorage.setItem('users', JSON.stringify(userList));
  }, [session]);

  return (
    <div className='flex h-full w-full justify-center'>
      {session?.user ? <LoginedMain /> : <NotLogined />}
    </div>
  );
}
