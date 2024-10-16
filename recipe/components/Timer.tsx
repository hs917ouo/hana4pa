import { useState, useEffect } from 'react';

export default function Timer() {
  const [delay, setDelay] = useState<number>(0);
  const [remainingTime, setRemainingTime] = useState<number | null>(null);
  const [isRunning, setIsRunning] = useState<boolean>(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setDelay(Number(e.target.value));
  };

  const handleStartTimer = () => {
    if (delay > 0) {
      setRemainingTime(delay);
      setIsRunning(true);

      const timer = setTimeout(() => {
        alert('종료');
        setIsRunning(false);
        setRemainingTime(null);
      }, delay * 1000);

      const interval = setInterval(() => {
        setRemainingTime((prev) => {
          if (prev !== null && prev > 0) {
            return prev - 1;
          }
          clearInterval(interval);
          return null;
        });
      }, 1000);

      return () => {
        clearTimeout(timer);
        clearInterval(interval);
      };
    }
  };

  useEffect(() => {
    if (!isRunning) {
      setRemainingTime(null);
    }
  }, [isRunning]);

  return (
    <div>
      <input
        type='number'
        value={delay}
        onChange={handleInputChange}
        placeholder='Enter delay in milliseconds'
        className='border p-2'
      />
      <button
        onClick={handleStartTimer}
        className='ml-2 rounded-sm bg-blue-500 p-2 text-white'
      >
        타이머 시작
      </button>
      {remainingTime !== null && (
        <span className='ml-2'>남은 시간: {remainingTime}초</span>
      )}
    </div>
  );
}
