'use client';

import NotLogined from '@/components/NotLogined';
import Warning from '@/components/Warning';
import { useSession } from 'next-auth/react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';

type Recipe = {
  name: string;
  tags: string[];
  ingredients: string[];
  steps: string[];
  version: number;
};

export default function Detail() {
  const user = JSON.parse(localStorage.getItem('user') || '') as string;
  const { data: session } = useSession();
  const router = useRouter();
  const searchParams = useSearchParams();
  const email = searchParams.get('email');
  const name = searchParams.get('name');
  const version = searchParams.get('version');

  const [recipe, setRecipe] = useState<Recipe | null>(null);
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [recipeVersions, setRecipeVersions] = useState<Recipe[]>([]);

  const handleDelete = () => {
    if (email && name) {
      const updated = recipes.filter((recipe) => recipe.name !== name);
      localStorage.setItem(email, JSON.stringify(updated));
    }
    router.push('myRecipe');
  };

  const handleRecovery = (
    e: React.MouseEvent<HTMLButtonElement>,
    version: number
  ) => {
    const update = recipeVersions.find(
      (recipe) => recipe.version === version
    ) as Recipe;
    const findNewVersion = recipeVersions.reduce(
      (prev: Recipe, curr: Recipe) =>
        curr.version > prev.version ? curr : prev
    );
    update.version = findNewVersion.version + 1;
    localStorage.setItem(`${email}`, JSON.stringify(recipes));
    router.push(
      `/detail?email=${email}&name=${name}&version=${update.version}`
    );
  };

  useEffect(() => {
    const recipes =
      email && name
        ? localStorage.getItem(email)
          ? (JSON.parse(localStorage.getItem(email) || '') as Recipe[])
          : null
        : null;
    if (recipes) setRecipes(recipes);
    const foundRecipe = recipes
      ? recipes.find(
          (r: Recipe) =>
            r.name === name && r.version === parseInt(version || '0')
        )
      : null;
    if (foundRecipe) {
      setRecipe(foundRecipe);
    } else {
      setRecipe(null);
    }
    const recipeVersionList =
      recipes && name ? recipes.filter((recipe) => recipe.name === name) : null;
    if (recipeVersionList) {
      setRecipeVersions(recipeVersionList);
    }
  }, [email, name, version, session]);

  return (
    <>
      {session ? (
        <>
          {recipe && (session.user?.email as string) === user ? (
            <div className='ml-2'>
              <p className='mt-16 text-3xl font-bold'>{recipe.name}</p>
              <p className='my-2 font-bold'>조리 과정</p>
              <div>
                {recipe.steps.map((step, index) => (
                  <div className='my-1' key={index}>
                    <p className='my-2 font-bold'>
                      Step {index + 1}: {step}
                    </p>
                    <div className='flex gap-2'>
                      <input
                        type='number'
                        placeholder='시간 (초)'
                        className='rounded-sm border border-gray-300 p-2'
                      />
                      <button className='rounded-sm bg-blue-500 p-2 text-white'>
                        타이머 시작
                      </button>
                    </div>
                  </div>
                ))}
              </div>
              <div className='my-2 flex flex-wrap space-x-2'>
                {recipe.tags.map((tag, index) => (
                  <span
                    key={index}
                    className='rounded-sm bg-gray-200 p-2 text-gray-600'
                  >
                    #{tag}
                  </span>
                ))}
              </div>
              <p className='my-2 font-bold'>재료</p>
              <ul className='ml-6 list-disc'>
                {recipe.ingredients.map((ingredient, index) => (
                  <li key={index}>{ingredient}</li>
                ))}
              </ul>
              <p className='my-2 font-bold'>수정 기록</p>

              {recipeVersions.map((item) => (
                <div
                  className='my-2 flex items-center gap-2'
                  key={item.version}
                >
                  <p className='font-bold'>버전 {item.version}</p>
                  <button
                    onClick={(e) => handleRecovery(e, item.version)}
                    className='rounded-sm bg-blue-500 p-2 text-white'
                  >
                    이 버전으로 복원
                  </button>
                </div>
              ))}

              <div className='my-6 flex gap-2'>
                <Link
                  href='/modifyRecipe'
                  className='rounded-sm bg-yellow-500 p-2 text-white'
                >
                  수정
                </Link>
                <button
                  onClick={handleDelete}
                  className='rounded-sm bg-red-500 p-2 text-white'
                >
                  삭제
                </button>
                <Link
                  href='/myRecipe'
                  className='rounded-sm bg-gray-500 p-2 text-white'
                >
                  목록으로
                </Link>
              </div>
            </div>
          ) : (
            <div className='text-center'>
              <Warning />
            </div>
          )}
        </>
      ) : (
        <div className='text-center'>
          <NotLogined />
        </div>
      )}
    </>
  );
}
