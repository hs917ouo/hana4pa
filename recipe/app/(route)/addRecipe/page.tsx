'use client';

import { type Recipe } from '@/app';
import NotLogined from '@/components/NotLogined';
import Warning from '@/components/Warning';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

export default function AddRecipe() {
  const user = JSON.parse(localStorage.getItem('user') || '') as string;
  const { data: session } = useSession();
  const router = useRouter();
  const [email, setEmail] = useState<string | null>(null);
  const [name, setName] = useState('');
  const [tags, setTags] = useState<string[]>([]);
  const [ingredients, setIngredients] = useState<string[]>([]);
  const [steps, setSteps] = useState<string[]>([]);
  const [newTag, setNewTag] = useState('');
  const [newIngredient, setNewIngredient] = useState('');
  const [newStep, setNewStep] = useState('');

  useEffect(() => {
    if (session && session.user && session.user.email) {
      setEmail(session.user.email);
    }
  }, [session]);

  const addTag = () => {
    if (newTag.trim()) {
      setTags([...tags, newTag.trim()]);
      setNewTag('');
    }
  };

  const addIngredient = () => {
    if (newIngredient.trim()) {
      setIngredients([...ingredients, newIngredient.trim()]);
      setNewIngredient('');
    }
  };

  const addStep = () => {
    if (newStep.trim()) {
      setSteps([...steps, newStep.trim()]);
      setNewStep('');
    }
  };

  const handleKeyDown = (
    e: React.KeyboardEvent<HTMLInputElement>,
    addFunction: () => void
  ) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      addFunction();
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    const storedData = localStorage.getItem(email);
    const recipes = storedData ? (JSON.parse(storedData) as Recipe[]) : [];

    const sameNameRecipes = recipes.filter(
      (recipe: Recipe) => recipe.name === name
    );
    let newVersion = 1;

    if (sameNameRecipes.length > 0) {
      const latestRecipe = sameNameRecipes.reduce(
        (prev: Recipe, curr: Recipe) =>
          curr.version > prev.version ? curr : prev
      );
      newVersion = latestRecipe.version + 1;
    }

    const newRecipe = {
      name,
      version: newVersion,
      tags,
      ingredients,
      steps,
    };
    recipes.push(newRecipe);

    localStorage.setItem(email, JSON.stringify(recipes));

    setName('');
    setTags([]);
    setIngredients([]);
    setSteps([]);

    router.push(
      `/detail?email=${email}&name=${newRecipe.name}&version=${newRecipe.version}`
    );
  };

  return (
    <>
      {session ? (
        <div>
          {(session.user?.email as string) === user ? (
            <form onSubmit={handleSubmit} className='ml-2 mt-16'>
              <p className='mb-2 text-2xl font-bold'>새 레시피 추가</p>
              <div>
                <label className='mb-2 text-lg'>레시피 제목</label>
                <p></p>
                <input
                  type='text'
                  value={name}
                  placeholder='레시피 제목을 입력하세요.'
                  onChange={(e) => setName(e.target.value)}
                  required
                  className='w-2/3 rounded-md border border-gray-300 p-2'
                />
              </div>
              <div>
                <label className='mb-2 text-lg'>태그</label>
                <p></p>
                <input
                  type='text'
                  value={newTag}
                  placeholder='태그를 입력하세요.'
                  onKeyDown={(e) => handleKeyDown(e, addTag)}
                  onChange={(e) => setNewTag(e.target.value)}
                  className='w-2/3 rounded-md border border-gray-300 p-2'
                />
                <button
                  type='button'
                  onClick={addTag}
                  className='m-1 rounded-md bg-purple-300 p-2 text-white'
                >
                  추가
                </button>
                <div className='flex flex-wrap space-x-2'>
                  {tags.map((tag, index) => (
                    <span
                      key={index}
                      className='rounded border border-gray-400 bg-gray-200 p-2 text-gray-600'
                    >
                      #{tag}
                    </span>
                  ))}
                </div>
              </div>
              <div>
                <label className='mb-2 text-lg'>재료 목록</label>
                <p></p>
                <input
                  type='text'
                  value={newIngredient}
                  placeholder='재료를 입력하세요.'
                  onKeyDown={(e) => handleKeyDown(e, addIngredient)}
                  onChange={(e) => setNewIngredient(e.target.value)}
                  className='w-2/3 rounded-md border border-gray-300 p-2'
                />
                <button
                  type='button'
                  onClick={addIngredient}
                  className='m-1 rounded-md bg-green-300 p-2 text-white'
                >
                  추가
                </button>
                <ul className='ml-6 list-disc'>
                  {ingredients.map((ingredient, index) => (
                    <li key={index}>{ingredient}</li>
                  ))}
                </ul>
              </div>
              <div>
                <label className='mb-2 text-lg'>조리 과정</label>
                <p></p>
                <input
                  type='text'
                  value={newStep}
                  placeholder='조리 과정을 입력하세요.'
                  onKeyDown={(e) => handleKeyDown(e, addStep)}
                  onChange={(e) => setNewStep(e.target.value)}
                  className='w-2/3 rounded-md border border-gray-300 p-2'
                />
                <button
                  type='button'
                  onClick={addStep}
                  className='m-1 rounded-md bg-green-300 p-2 text-white'
                >
                  추가
                </button>
                <ol className='ml-6 list-decimal'>
                  {steps.map((step, index) => (
                    <li key={index}>{step}</li>
                  ))}
                </ol>
              </div>
              <button
                type='submit'
                className='m-1 rounded-md bg-blue-300 p-2 text-white'
              >
                레시피 저장
              </button>
            </form>
          ) : (
            <div className='text-center'>
              <Warning />
            </div>
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
