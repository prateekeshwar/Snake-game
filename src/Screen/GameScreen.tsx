import React, {
  useCallback,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from "react";
import "./Onboard.css";
import Canvas from "./Canvas";
import { difficultyLev } from "./Onboard";

interface Props {
  difficultyLevel: difficultyLev;
  setDifficulty: (val: difficultyLev) => void;
  setGameScreen: (val: boolean) => void;
}

const MAP_DELAY = {
  Easy: 300,
  Medium: 200,
  Hard: 100,
};

const GameScreen: React.FC<Props> = ({
  difficultyLevel,
  setDifficulty,
  setGameScreen,
}) => {
  const [snakePosition, setSnakePosition] = useState([
    { x: 280, y: 240 },
    { x: 300, y: 240 },
  ]);
  const [snakeFood, setSnakeFood] = useState({ x: 40, y: 40 });
  const [delay, setDelay] = useState<number>(MAP_DELAY[difficultyLevel]);
  const [score, setScore] = useState<number>(0);
  const highScore = Number(sessionStorage.getItem("highestScore")) || 0;
  const [snakeDirection, setSnakeDirection] = useState<string>();
  const [gameOver, setGameOver] = useState<boolean>(false);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const updateFoodPosition = () => {
    let numX = Math.floor(Math.random() * 1000) % 600;
    numX = numX - (numX % 20);
    let numY = Math.floor(Math.random() * 1000) % 500;
    numY = numY - (numY % 20);
    setSnakeFood({ x: numX, y: numY });
  };

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const hasSnakeEatenSelf = () => {
    const snakeHead = snakePosition[snakePosition.length - 1];
    const snakeBody = snakePosition.slice(0, snakePosition.length - 1);
    if (
      snakeBody.some((val) => val.x === snakeHead.x && val.y === snakeHead.y)
    ) {
      setGameOver(true);
    }
  };

  if (gameOver) {
    if (highScore < score) {
      sessionStorage.setItem("highestScore", String(score));
    }
  }

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const getRandomeXandY = () => {
    setSnakePosition([...snakePosition, snakeFood]);
    setDelay((delay) => delay + 0.02 * delay);
    setScore((score) => score + 5);
    if (delay >= 300) {
      if (difficultyLevel !== difficultyLev.Hard) {
        setDifficulty(difficultyLev.Hard);
      }
    }

    if (delay >= 200 && delay < 300) {
      if (difficultyLevel !== difficultyLev.Medium) {
        setDifficulty(difficultyLev.Medium);
      }
    }
    updateFoodPosition();
  };

  const isSnakeEatingFood = useCallback(() => {
    const snakeHead = snakePosition[snakePosition.length - 1];
    switch (snakeDirection) {
      case "UP":
        return snakeHead.x === snakeFood.x && snakeHead.y - 20 === snakeFood.y;
      case "DOWN":
        return snakeHead.x === snakeFood.x && snakeHead.y + 20 === snakeFood.y;
      case "RIGHT":
        return snakeHead.y === snakeFood.y && snakeHead.x + 20 === snakeFood.x;
      case "LEFT":
        return snakeHead.y === snakeFood.y && snakeHead.x - 20 === snakeFood.x;
    }
    return false;
  }, [snakePosition, snakeDirection, snakeFood]);

  const moveSnake = useCallback(() => {
    hasSnakeEatenSelf();
    const snakePoArr = [...snakePosition];
    const firstPosition = snakePoArr[snakePoArr.length - 1];
    snakePoArr.shift();
    switch (snakeDirection) {
      case "UP":
        if (firstPosition.y > 1) {
          setSnakePosition([
            ...snakePoArr,
            { ...firstPosition, y: firstPosition.y - 20 },
          ]);
        } else {
          setGameOver(true);
        }
        break;
      case "RIGHT":
        if (firstPosition.x < 580) {
          setSnakePosition([
            ...snakePoArr,
            { ...firstPosition, x: firstPosition.x + 20 },
          ]);
        } else {
          setGameOver(true);
        }
        break;
      case "DOWN":
        if (firstPosition.y < 480) {
          setSnakePosition([
            ...snakePoArr,
            { ...firstPosition, y: firstPosition.y + 20 },
          ]);
        } else {
          setGameOver(true);
        }
        break;
      case "LEFT":
        if (firstPosition.x > 1) {
          setSnakePosition([
            ...snakePoArr,
            { ...firstPosition, x: firstPosition.x - 20 },
          ]);
        } else {
          setGameOver(true);
        }
        break;
    }

    if (isSnakeEatingFood()) {
      getRandomeXandY();
    }
  }, [
    snakeDirection,
    snakePosition,
    isSnakeEatingFood,
    getRandomeXandY,
    hasSnakeEatenSelf,
  ]);

  const keyPressHandler = (event: React.KeyboardEvent) => {
    switch (event.code) {
      case "ArrowDown":
        if (snakeDirection !== "UP") {
          setSnakeDirection("DOWN");
        }
        break;
      case "ArrowUp":
        if (snakeDirection !== "DOWN") {
          setSnakeDirection("UP");
        }
        break;
      case "ArrowRight":
        if (snakeDirection !== "LEFT") {
          setSnakeDirection("RIGHT");
        }
        break;
      case "ArrowLeft":
        if (snakeDirection !== "RIGHT") {
          setSnakeDirection("LEFT");
        }
        break;
    }
    console.log(event.code);
  };

  const getCallBack = useRef(moveSnake);

  useLayoutEffect(() => {
    getCallBack.current = moveSnake;
  }, [moveSnake]);

  useEffect(() => {
    if (!delay && delay !== 0) {
      return;
    }

    const snakeInterval = setInterval(() => getCallBack.current(), delay);

    return () => clearInterval(snakeInterval);
  }, [delay]);

  const draw = (dimen: CanvasRenderingContext2D) => {
    if (snakeFood) {
      dimen.fillStyle = "white";
      dimen.fillRect(snakeFood.x, snakeFood.y, 20, 20);
    }
    dimen.fillStyle = "aqua";
    snakePosition.forEach((snakeContent) =>
      dimen.fillRect(snakeContent.x, snakeContent.y, 20, 20)
    );
  };

  const tryAgain = () => {
    setGameOver(false);
    setScore(0);
    setSnakePosition([
      { x: 280, y: 240 },
      { x: 300, y: 240 },
    ]);
    setSnakeFood({ x: 40, y: 40 });
    setDelay(MAP_DELAY[difficultyLevel]);
    setSnakeDirection("RIGHT");
  };

  return (
    <div tabIndex={0} onKeyDown={keyPressHandler} className="container">
      <div className="start-game">
        <h5 className="header">{difficultyLevel}</h5>
        <h5 className="header score">Score: {score}</h5>
        <button
          className="button-difficulty"
          onClick={() => {
            if (gameOver) {
              tryAgain();
            } else {
              setSnakeDirection("RIGHT");
            }
          }}
        >
          {gameOver ? "Try Again" : "Start"}
        </button>
        {gameOver && (
          <button
            className="button-difficulty"
            onClick={() => {
              setGameScreen(false);
            }}
          >
            Go back
          </button>
        )}
      </div>
      {!gameOver ? (
        <Canvas ref={canvasRef} draw={draw} />
      ) : (
        <div className="game-board">
          <h1>Oops! Game over</h1>
          <p className="instruction">
            {" "}
            Click Try again or Go back to change difficulty level
          </p>
        </div>
      )}
      {!gameOver ? (
        <>
          <p className="instruction">Instructions</p>
          <p className="instruction">Click Start game to start the game.</p>
          <p className="instruction">
            Press Up, Down, Left and Right Arrow key to move snake in respective
            direction.
          </p>
        </>
      ) : (
        <>
          <p className="instruction">Score: {score}</p>
          <p className="instruction">highScore: {highScore}</p>
        </>
      )}
    </div>
  );
};

export default GameScreen;
