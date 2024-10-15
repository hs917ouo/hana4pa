import Link from 'next/link';

export default function LoginedMain() {
  return (
    <div className='mt-16 flex w-1/2 items-center justify-center p-2'>
      <Link
        href='/myRecipe'
        className='m-1 rounded-lg border border-gray-200 bg-green-500 p-1 text-2xl font-semibold text-white'
      >
        나의 레시피 보기
      </Link>
    </div>
  );
}
