'use client';

import { type Recipe } from '@/app';
import NotLogined from '@/components/NotLogined';
import Warning from '@/components/Warning';
import { useSession } from 'next-auth/react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useState } from 'react';

export default function ModifyRecipe() {
  const user = JSON.parse(localStorage.getItem('user') || '') as string;
  const { data: session } = useSession();
  const router = useRouter();
  const searchParams = useSearchParams();
  const email = searchParams.get('email') || '';
  const name = searchParams.get('name') || '';
  const prevVersion = +(searchParams.get('version') || '');

  const getDataFromLocal = () => {
    const data = localStorage.getItem(email);
    if (!data) return null;
    const recipes: Recipe[] = JSON.parse(data);
    if (!recipes) return null;
    return recipes;
  };

  const recipes = getDataFromLocal();

  const getPrevRecipe = (name: string, prevVersion: number) => {
    const recipe = recipes
      ? recipes.find(
          (recipe) => recipe.name === name && recipe.version === prevVersion
        )
      : null;
    if (!recipe) return null;
    return recipe;
  };

  const prevRecipe = getPrevRecipe(name, prevVersion);
  const [tags, setTags] = useState<string[]>(prevRecipe?.tags || []);
  const [ingredients, setIngredients] = useState<string[]>(
    prevRecipe?.ingredients || []
  );
  const [steps, setSteps] = useState<string[]>(prevRecipe?.steps || []);
  const [newTag, setNewTag] = useState('');
  const [newIngredient, setNewIngredient] = useState('');
  const [newStep, setNewStep] = useState('');

  const findSameVersion = (recipe: Recipe) => {
    const filterName = recipes?.filter((r) => r.name === recipe.name);
    const filterTag = filterName?.filter(
      (r) => JSON.stringify(r.tags) === JSON.stringify(recipe.tags)
    );
    const filterIngredient = filterTag?.filter(
      (r) =>
        JSON.stringify(r.ingredients) === JSON.stringify(recipe.ingredients)
    );
    const filterStep = filterIngredient?.filter(
      (r) => JSON.stringify(r.steps) === JSON.stringify(recipe.steps)
    );
    if (filterStep === undefined) return false;
    if (filterStep?.length > 0) {
      return true;
    } else {
      return false;
    }
  };

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

  const deleteTag = (
    e: React.MouseEvent<HTMLButtonElement>,
    selectedTag: string
  ) => {
    e.preventDefault();
    const deletedTagList = tags.filter((tag) => tag !== selectedTag);
    setTags(deletedTagList);
    setNewTag('');
  };

  const deleteIngredient = (
    e: React.MouseEvent<HTMLButtonElement>,
    selectedIngredient: string
  ) => {
    e.preventDefault();
    const deletedIngredientList = ingredients.filter(
      (ingredient) => ingredient !== selectedIngredient
    );
    setIngredients(deletedIngredientList);
    setNewIngredient('');
  };

  const deleteStep = (
    e: React.MouseEvent<HTMLButtonElement>,
    selectedStep: string
  ) => {
    e.preventDefault();
    const deletedStepList = steps.filter((step) => step !== selectedStep);
    setSteps(deletedStepList);
    setNewStep('');
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

    const newRecipe = {
      name,
      version: prevVersion + 1,
      tags,
      ingredients,
      steps,
    };
    if (!recipes) return;
    if (findSameVersion(newRecipe)) {
      alert('동일한 버전이 있습니다.');
      return;
    }
    recipes?.push(newRecipe);
    localStorage.setItem(email, JSON.stringify(recipes));

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
          {(session.user?.email as string) === user &&
          recipes?.find((recipe) => recipe.name === name) &&
          recipes?.find((recipe) => recipe.version === prevVersion) ? (
            <form onSubmit={handleSubmit} className='ml-2 mt-16'>
              <p className='mb-2 text-2xl font-bold'>레시피 수정</p>
              <div>
                <p className='mb-2 text-lg'>레시피 제목</p>
                <p className='w-2/3 rounded-md border border-gray-300 p-2 text-xl'>
                  {name}
                </p>
                <p className='font-bold text-red-500'>
                  레시피 제목은 수정할 수 없습니다.
                </p>
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
                      className='flex gap-1 rounded border border-gray-400 bg-gray-200 p-2 text-gray-600'
                    >
                      <p>#{tag}</p>
                      <button
                        className='rounded-md bg-red-500 px-2 text-white'
                        onClick={(e) => deleteTag(e, tag)}
                      >
                        x
                      </button>
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
                <ul className='ml-3 list-disc'>
                  {ingredients.map((ingredient, index) => (
                    <li className='flex gap-2' key={index}>
                      <p>● {ingredient}</p>
                      <button
                        className='rounded-md bg-red-500 px-2 text-white'
                        onClick={(e) => deleteIngredient(e, ingredient)}
                      >
                        x
                      </button>
                    </li>
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
                <ol className='ml-3'>
                  {steps.map((step, index) => (
                    <li className='flex gap-2' key={index}>
                      <p>
                        {index + 1}. {step}
                      </p>
                      <button
                        className='rounded-md bg-red-500 px-2 text-white'
                        onClick={(e) => deleteStep(e, step)}
                      >
                        x
                      </button>
                    </li>
                  ))}
                </ol>
              </div>
              <button
                type='submit'
                className='m-1 rounded-md bg-blue-300 p-2 text-white'
              >
                레시피 수정
              </button>
            </form>
          ) : (
            <div>
              <Warning />
            </div>
          )}
        </div>
      ) : (
        <div>
          <NotLogined />
        </div>
      )}
    </>
  );
}
