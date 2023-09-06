import React, { useState } from "react";
import "./Onboard.css";
import GameScreen from "./GameScreen";

export enum difficultyLev {
  Easy = "Easy",
  Medium = "Medium",
  Hard = "Hard",
}

export const Onboard: React.FC = () => {
  const [difficultyLevel, setDifficulty] = useState<difficultyLev>(
    difficultyLev.Easy
  );
  const [gameScreen, setGameScreen] = useState<boolean>(false);

  const toggleGameScreen = (val: boolean) => {
    setGameScreen(val);
  };

  const onClickButton = (difficultyLev: difficultyLev) => {
    setDifficulty(difficultyLev);
    toggleGameScreen(true);
  };

  return (
    <>
      {gameScreen ? (
        <GameScreen difficultyLevel={difficultyLevel} setDifficulty={setDifficulty} setGameScreen={setGameScreen} />
      ) : (
        <div className="parent-box">
          <h3>Classic Snake Game</h3>
          <h5>Choose Difficulty level:</h5>
          <div className="button-box">
            <button
              className="button-difficulty"
              onClick={() => {
                onClickButton(difficultyLev.Easy);
              }}
            >
              {difficultyLev.Easy.toUpperCase()}
            </button>
            <button
              className="button-difficulty"
              onClick={() => {
                onClickButton(difficultyLev.Medium);
              }}
            >
              {difficultyLev.Medium.toUpperCase()}
            </button>
            <button
              className="button-difficulty"
              onClick={() => {
                onClickButton(difficultyLev.Hard);
              }}
            >
              {difficultyLev.Hard.toUpperCase()}
            </button>
          </div>
        </div>
      )}
    </>
  );
};
