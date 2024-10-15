import LoginedMain from '@/components/LoginedMain';
import NotLogined from '@/components/NotLogined';
import { auth } from '@/lib/auth';

export default async function Home() {
  const session = await auth();
  return (
    <div className='flex h-full w-full justify-center'>
      {session?.user ? <LoginedMain /> : <NotLogined />}
    </div>
  );
}
