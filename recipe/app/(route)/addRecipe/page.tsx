'use client';

import NotLogined from '@/components/NotLogined';
import { useSession } from 'next-auth/react';
import { useEffect, useState } from 'react';

type Recipe = {
  name: string;
  tags: string[];
  ingredients: string[];
  steps: string[];
  version: number;
};

export default function AddRecipe() {
  const { data: session } = useSession();
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
      e.preventDefault(); // 기본 Enter 동작 막기
      addFunction(); // 해당 항목 추가 함수 실행
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return; // 이메일 없으면 종료

    // 기존 레시피 데이터 불러오기
    const storedData = localStorage.getItem(email);
    const recipes = storedData ? JSON.parse(storedData) : [];

    // 같은 이름의 레시피 중 가장 최신 버전을 찾음
    const sameNameRecipes = recipes.filter(
      (recipe: Recipe) => recipe.name === name
    );
    let newVersion = 1;

    if (sameNameRecipes.length > 0) {
      // 같은 이름의 레시피 중 가장 높은 버전을 찾아 다음 버전을 설정
      const latestRecipe = sameNameRecipes.reduce(
        (prev: Recipe, curr: Recipe) =>
          curr.version > prev.version ? curr : prev
      );
      newVersion = latestRecipe.version + 1;
    }

    // 새로운 버전의 레시피 추가
    const newRecipe = {
      name,
      version: newVersion,
      tags,
      ingredients,
      steps,
    };
    recipes.push(newRecipe);

    // 업데이트된 레시피 리스트를 로컬스토리지에 저장
    localStorage.setItem(email, JSON.stringify(recipes));

    // 폼 초기화
    setName('');
    setTags([]);
    setIngredients([]);
    setSteps([]);
  };

  return (
    <>
      {session ? (
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
          <NotLogined />
        </div>
      )}
    </>
  );
}
