'use client';

import NotLogined from '@/components/NotLogined';
import { useSession } from 'next-auth/react';
import Link from 'next/link';
import { useEffect, useState } from 'react';

type Recipe = {
  name: string;
  tags: string[];
  version: number;
};

export default function MyRecipe() {
  const { data: session } = useSession();
  const [recipes, setRecipes] = useState<Recipe[]>([]);

  useEffect(() => {
    if (session && session.user && session.user.email) {
      const email = session.user.email;
      const storedData = localStorage.getItem(email);
      if (storedData) {
        const parsedRecipes = JSON.parse(storedData);

        // 같은 이름의 레시피 중 최신 버전만 남기기
        const latestRecipes = parsedRecipes.reduce(
          (acc: Recipe[], current: Recipe) => {
            const existing = acc.find((r) => r.name === current.name);
            if (!existing || existing.version < current.version) {
              // 최신 버전이 있으면 교체
              return acc.filter((r) => r.name !== current.name).concat(current);
            }
            return acc;
          },
          []
        );

        setRecipes(latestRecipes);
      }
    }
  }, [session]);
  return (
    <>
      {session ? (
        <div>
          <p className='mt-16'></p>
          {recipes.length > 0 ? (
            recipes.map((recipe) => (
              <div
                key={recipe.name}
                className='m-4 rounded border border-gray-300 p-4'
              >
                <h3 className='text-lg font-bold'>{recipe.name}</h3>
                <div className='flex space-x-2'>
                  {recipe.tags.map((tag, index) => (
                    <span
                      key={index}
                      className='rounded bg-gray-200 p-1 text-gray-600'
                    >
                      #{tag}
                    </span>
                  ))}
                </div>
                <Link
                  href={{
                    pathname: '/detail',
                    query: {
                      email: session?.user?.email,
                      name: recipe.name,
                      version: recipe.version,
                    },
                  }}
                  className='mt-2 inline-block w-full rounded-md bg-green-500 p-1 text-center text-white'
                >
                  자세히 보기
                </Link>
              </div>
            ))
          ) : (
            <>No Recipe</>
          )}
        </div>
      ) : (
        <div className='text-center'>
          <NotLogined />
        </div>
      )}
    </>
  );
}
