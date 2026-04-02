import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Terminal, Play, RotateCcw } from 'lucide-react';

const GRID_SIZE = 20;
const INITIAL_SNAKE = [
  { x: 10, y: 10 },
  { x: 10, y: 11 },
  { x: 10, y: 12 },
];
const INITIAL_DIRECTION = { x: 0, y: -1 };
const BASE_SPEED = 80;

type Point = { x: number; y: number };

export default function SnakeGame() {
  const [snake, setSnake] = useState<Point[]>(INITIAL_SNAKE);
  const [food, setFood] = useState<Point>({ x: 5, y: 5 });
  const [direction, setDirection] = useState<Point>(INITIAL_DIRECTION);
  const [gameOver, setGameOver] = useState(false);
  const [isPaused, setIsPaused] = useState(true);
  const [score, setScore] = useState(0);
  const [highScore, setHighScore] = useState(0);
  
  const directionRef = useRef(direction);
  const gameBoardRef = useRef<HTMLDivElement>(null);

  const generateFood = useCallback((currentSnake: Point[]): Point => {
    let newFood: Point;
    while (true) {
      newFood = {
        x: Math.floor(Math.random() * GRID_SIZE),
        y: Math.floor(Math.random() * GRID_SIZE),
      };
      // eslint-disable-next-line no-loop-func
      if (!currentSnake.some(segment => segment.x === newFood.x && segment.y === newFood.y)) {
        break;
      }
    }
    return newFood;
  }, []);

  const resetGame = () => {
    setSnake(INITIAL_SNAKE);
    setDirection(INITIAL_DIRECTION);
    directionRef.current = INITIAL_DIRECTION;
    setFood(generateFood(INITIAL_SNAKE));
    setGameOver(false);
    setScore(0);
    setIsPaused(false);
    gameBoardRef.current?.focus();
  };

  const startGame = () => {
    if (gameOver) {
      resetGame();
    } else {
      setIsPaused(false);
      gameBoardRef.current?.focus();
    }
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLButtonElement) {
        return;
      }

      if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', ' '].includes(e.key)) {
        e.preventDefault();
      }

      if (e.key === ' ') {
        if (gameOver) resetGame();
        else setIsPaused(p => !p);
        return;
      }

      if (isPaused || gameOver) return;

      const currentDir = directionRef.current;
      switch (e.key) {
        case 'ArrowUp':
        case 'w':
        case 'W':
          if (currentDir.y !== 1) directionRef.current = { x: 0, y: -1 };
          break;
        case 'ArrowDown':
        case 's':
        case 'S':
          if (currentDir.y !== -1) directionRef.current = { x: 0, y: 1 };
          break;
        case 'ArrowLeft':
        case 'a':
        case 'A':
          if (currentDir.x !== 1) directionRef.current = { x: -1, y: 0 };
          break;
        case 'ArrowRight':
        case 'd':
        case 'D':
          if (currentDir.x !== -1) directionRef.current = { x: 1, y: 0 };
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isPaused, gameOver]);

  useEffect(() => {
    if (isPaused || gameOver) return;

    const moveSnake = () => {
      setSnake(prevSnake => {
        const head = prevSnake[0];
        const newHead = {
          x: head.x + directionRef.current.x,
          y: head.y + directionRef.current.y,
        };

        if (
          newHead.x < 0 ||
          newHead.x >= GRID_SIZE ||
          newHead.y < 0 ||
          newHead.y >= GRID_SIZE
        ) {
          setGameOver(true);
          return prevSnake;
        }

        if (prevSnake.some(segment => segment.x === newHead.x && segment.y === newHead.y)) {
          setGameOver(true);
          return prevSnake;
        }

        const newSnake = [newHead, ...prevSnake];

        if (newHead.x === food.x && newHead.y === food.y) {
          setScore(s => {
            const newScore = s + 10;
            setHighScore(h => Math.max(h, newScore));
            return newScore;
          });
          setFood(generateFood(newSnake));
        } else {
          newSnake.pop();
        }

        setDirection(directionRef.current);
        return newSnake;
      });
    };

    const speed = Math.max(40, BASE_SPEED - Math.floor(score / 50) * 8);
    const intervalId = setInterval(moveSnake, speed);

    return () => clearInterval(intervalId);
  }, [isPaused, gameOver, food, score, generateFood]);

  return (
    <div className="flex flex-col items-center w-full max-w-lg mx-auto uppercase">
      {/* Score Header */}
      <div className="flex justify-between w-full mb-4 px-4 py-2 border-2 border-[#0ff] bg-[#050505] relative">
        <div className="absolute top-0 left-0 w-full h-full border-2 border-[#f0f] translate-x-1 translate-y-1 pointer-events-none mix-blend-screen" />
        <div className="flex flex-col z-10">
          <span className="text-[#f0f] text-sm font-[var(--font-pixel)]">SCORE_</span>
          <span className="text-3xl font-bold text-[#0ff] font-[var(--font-vt323)]">
            {score.toString().padStart(4, '0')}
          </span>
        </div>
        <div className="flex flex-col items-end z-10">
          <span className="text-[#f0f] text-sm font-[var(--font-pixel)] flex items-center gap-2">
            <Terminal className="w-4 h-4" /> MAX_
          </span>
          <span className="text-3xl font-bold text-[#0ff] font-[var(--font-vt323)]">
            {highScore.toString().padStart(4, '0')}
          </span>
        </div>
      </div>

      {/* Game Board */}
      <div 
        ref={gameBoardRef}
        tabIndex={0}
        className="relative w-full aspect-square bg-[#050505] border-4 border-[#0ff] focus:outline-none focus:border-[#f0f] transition-colors"
        style={{
          display: 'grid',
          gridTemplateColumns: `repeat(${GRID_SIZE}, 1fr)`,
          gridTemplateRows: `repeat(${GRID_SIZE}, 1fr)`,
        }}
      >
        {/* Grid Background */}
        <div className="absolute inset-0 pointer-events-none opacity-20"
             style={{
               backgroundImage: 'linear-gradient(to right, #0ff 1px, transparent 1px), linear-gradient(to bottom, #0ff 1px, transparent 1px)',
               backgroundSize: `calc(100% / ${GRID_SIZE}) calc(100% / ${GRID_SIZE})`
             }}
        />

        {/* Snake */}
        {snake.map((segment, index) => {
          const isHead = index === 0;
          const tailRatio = index / snake.length;
          const opacity = 1 - (tailRatio * 0.5);
          
          return (
            <div
              key={`${segment.x}-${segment.y}-${index}`}
              className={`${isHead ? 'bg-[#fff]' : 'bg-[#f0f]'}`}
              style={{
                gridColumnStart: segment.x + 1,
                gridRowStart: segment.y + 1,
                opacity: opacity,
                boxShadow: isHead ? '0 0 10px #fff' : 'none',
                transform: `scale(${isHead ? 1 : 0.9 - (tailRatio * 0.3)})`,
              }}
            />
          );
        })}

        {/* Food */}
        <div
          className="bg-[#0ff] animate-ping"
          style={{
            gridColumnStart: food.x + 1,
            gridRowStart: food.y + 1,
            transform: 'scale(0.8)',
          }}
        />

        {/* Overlays */}
        {(isPaused || gameOver) && (
          <div className="absolute inset-0 bg-[#050505]/80 flex flex-col items-center justify-center z-20 backdrop-blur-sm">
            {gameOver ? (
              <>
                <h2 className="text-2xl md:text-3xl font-[var(--font-pixel)] text-[#fff] mb-4 text-center glitch-text" data-text="CRITICAL_FAILURE">CRITICAL_FAILURE</h2>
                <p className="text-[#0ff] mb-8 font-[var(--font-vt323)] text-3xl">DATA_LOST: {score}</p>
                <button
                  onClick={resetGame}
                  className="flex items-center gap-3 px-6 py-3 border-2 border-[#f0f] text-[#f0f] font-[var(--font-pixel)] text-sm hover:bg-[#f0f] hover:text-[#050505] transition-colors"
                >
                  <RotateCcw className="w-5 h-5" /> REBOOT_SYS
                </button>
              </>
            ) : (
              <>
                <h2 className="text-2xl md:text-3xl font-[var(--font-pixel)] text-[#fff] mb-8 text-center glitch-text" data-text="STANDBY_MODE">STANDBY_MODE</h2>
                <button
                  onClick={startGame}
                  className="flex items-center gap-3 px-6 py-3 border-2 border-[#0ff] text-[#0ff] font-[var(--font-pixel)] text-sm hover:bg-[#0ff] hover:text-[#050505] transition-colors"
                >
                  <Play className="w-5 h-5 fill-current" /> EXECUTE
                </button>
                <p className="mt-8 text-[#f0f] text-xl font-[var(--font-vt323)] flex flex-col items-center gap-2">
                  <span>INPUT: [W,A,S,D] OR [ARROWS]</span>
                  <span>INTERRUPT: [SPACE]</span>
                </p>
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
