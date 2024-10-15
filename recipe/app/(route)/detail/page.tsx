'use client';

import { useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';

type Recipe = {
  name: string;
  tags: string[];
  ingredients: string[];
  steps: string[];
  version: number;
};

export default function Detail() {
  const searchParams = useSearchParams();
  const email = searchParams.get('email');
  const name = searchParams.get('name');
  const version = searchParams.get('version');

  const [recipe, setRecipe] = useState<Recipe | null>(null);

  useEffect(() => {
    const recipes =
      email && name
        ? localStorage.getItem(email)
          ? (JSON.parse(localStorage.getItem(email) || '') as Recipe[])
          : null
        : null;
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
  }, [email, name, version]);

  return (
    <>
      {recipe ? (
        <div>
          <p className='text-3xl font-bold'>{recipe.name}</p>
          <p>{recipe.steps}</p>
          <p>{recipe.tags}</p>
          <p>{recipe.ingredients}</p>
          <p>{recipe.version}</p>
          <p>{recipe.steps}</p>
        </div>
      ) : (
        <>잘못된 접근입니다.</>
      )}
    </>
  );
}
