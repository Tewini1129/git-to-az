import { useState, useRef } from "react";
import "./App.css";

function App() {
  const [gameState, setGameState] = useState<
    "idle" | "waiting" | "ready" | "result"
  >("idle");

  const [reactionTime, setReactionTime] = useState<number | null>(null);
  const [bestTime, setBestTime] = useState<number | null>(null);

  const startTime = useRef<number>(0);
  const timeoutRef = useRef<number | null>(null);

  const startGame = () => {
    setReactionTime(null);
    setGameState("waiting");

    const delay = Math.floor(Math.random() * 3000) + 2000;

    timeoutRef.current = window.setTimeout(() => {
      startTime.current = performance.now();
      setGameState("ready");
    }, delay);
  };

  const handleClick = () => {
    if (gameState === "waiting") {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }

      setGameState("result");
      setReactionTime(null);
      return;
    }

    if (gameState === "ready") {
      const time = Math.round(performance.now() - startTime.current);

      setReactionTime(time);
      setGameState("result");

      if (bestTime === null || time < bestTime) {
        setBestTime(time);
      }
    }
  };

  return (
    <main className="game">
      <div className="card">
        <h1>⚡ Reaction Rush</h1>

        <p className="description">
          How fast are your reflexes?
        </p>

        {gameState === "idle" && (
          <>
            <div className="icon">⚡</div>

            <p>
              Click start and wait for the screen to turn green.
              Then click as quickly as possible!
            </p>

            <button onClick={startGame}>Start Game</button>
          </>
        )}

        {gameState === "waiting" && (
          <div
            className="game-area waiting"
            onClick={handleClick}
          >
            <div className="big-text">WAIT...</div>
            <p>Don't click yet!</p>
          </div>
        )}

        {gameState === "ready" && (
          <div
            className="game-area ready"
            onClick={handleClick}
          >
            <div className="big-text">CLICK!</div>
            <p>GO! GO! GO!</p>
          </div>
        )}

        {gameState === "result" && (
          <>
            {reactionTime === null ? (
              <div className="too-early">
                <div className="big-text">TOO EARLY! 😭</div>
                <p>You clicked before the green screen.</p>
              </div>
            ) : (
              <div className="result">
                <div className="trophy">🏆</div>

                <h2>{reactionTime} ms</h2>

                <p>
                  {reactionTime < 200
                    ? "INSANE REFLEXES! 🔥"
                    : reactionTime < 300
                    ? "That's really fast! ⚡"
                    : reactionTime < 500
                    ? "Pretty good! 😎"
                    : "You can do better! 💪"}
                </p>

                {bestTime !== null && (
                  <div className="best">
                    Best: <strong>{bestTime} ms</strong>
                  </div>
                )}
              </div>
            )}

            <button onClick={startGame}>Try Again</button>
          </>
        )}
      </div>
    </main>
  );
}

export default App;