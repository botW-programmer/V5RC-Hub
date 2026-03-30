import { useEffect, useRef } from 'react';
import kaplay from 'kaplay';

export default function EasterEgg({ isOpen, onClose }) {
  const canvasRef = useRef(null);

  useEffect(() => {
    if (!isOpen || !canvasRef.current) return;

    // 1. Initialize Engine
    const k = kaplay({
      global: false,
      canvas: canvasRef.current,
      width: 600,
      height: 300,
      background: [34, 34, 34],
    });

    try { k.loadSound("jump", "/jump.mp3"); } catch (e) {}
    
    // Adjusted gravity and speed for better "game feel"
    const JUMP_FORCE = 700;
    const GAME_SPEED = 300;
    k.setGravity(2400);

    // ==========================================
    // SCENE 1: THE MAIN GAME
    // ==========================================
    k.scene("game", () => {
      let score = 0;

      // Create Player
      const bot = k.add([
        k.rect(30, 30),
        k.pos(50, 100),
        k.color(rgb(94, 162, 201)), // cute blue color
        k.area(),
        k.body(),
      ]);

      // Create Floor
      k.add([
        k.rect(600, 40),
        k.pos(0, 260),
        k.color(100, 100, 100), // gray floor
        k.area(),
        k.body({ isStatic: true }),
      ]);

      // Create Score Text
      const scoreLabel = k.add([
        k.text(score, { size: 24 }),
        k.pos(24, 24),
      ]);

      // Increase score constantly
      k.onUpdate(() => {
        score++;
        scoreLabel.text = score;
      });

      // Jump Controls (Spacebar or Click)
      const doJump = () => {
        if (bot.isGrounded()) {
          bot.jump(JUMP_FORCE);
          try { k.play("jump"); } catch(e) {}
        }
      };
      k.onKeyPress("space", doJump);
      k.onClick(doJump);

      // Obstacle Spawner Function
      function spawnObstacle() {
        k.add([
          // Random height between 30 and 60
          k.rect(30, k.rand(30, 60)), 
          k.area(),
          k.pos(600, 260),
          k.anchor("botleft"), // Keeps it sitting flush on the floor
          k.color(8, 35, 51), // deep grayish blue
          k.move(k.LEFT, GAME_SPEED), // Move left constantly
          "obstacle", // THIS IS THE TAG
        ]);

        // Wait a random time (between 0.8s and 2s), then spawn another!
        k.wait(k.rand(0.8, 2), spawnObstacle);
      }

      // Start the spawning cycle
      spawnObstacle();

      // Collision Detection! If 'bot' hits anything with the 'obstacle' tag...
      bot.onCollide("obstacle", () => {
        k.go("lose", score); // Go to the 'lose' scene and pass the score
      });
    });

    // ==========================================
    // SCENE 2: GAME OVER
    // ==========================================
    k.scene("lose", (finalScore) => {
      k.add([
        k.text("GAME OVER", { size: 48 }),
        k.pos(k.center().x, k.center().y - 40),
        k.anchor("center"),
      ]);
      
      k.add([
        k.text(`Score: ${finalScore}`, { size: 24 }),
        k.pos(k.center().x, k.center().y + 10),
        k.anchor("center"),
      ]);

      k.add([
        k.text("Press SPACE to restart", { size: 16 }),
        k.pos(k.center().x, k.center().y + 50),
        k.anchor("center"),
        k.color(150, 150, 150),
      ]);

      // Restart controls
      k.onKeyPress("space", () => k.go("game"));
      k.onClick(() => k.go("game"));
    });

    // Start the engine on the "game" scene
    k.go("game");

    return () => k.quit();
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-black bg-opacity-90">
      <h2 className="text-3xl font-bold text-white mb-4">Secret Level Unlocked</h2>
      
      <canvas ref={canvasRef} className="rounded-lg shadow-lg border-2 border-red-500"></canvas>
      
      <p className="text-gray-400 mt-4">Press SPACE or Click canvas to jump.</p>
      
      <button 
        onClick={onClose}
        className="mt-6 px-6 py-2 bg-red-600 text-white font-bold rounded hover:bg-red-500 transition"
      >
        Close Game
      </button>
    </div>
  );
}