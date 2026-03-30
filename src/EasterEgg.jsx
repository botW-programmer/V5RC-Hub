import { useEffect, useRef } from 'react';
import kaplay from 'kaplay';

export default function EasterEgg({ isOpen, onClose }) {
  const canvasRef = useRef(null);

  useEffect(() => {
    // Only start if the game is Open and the canvas is on screen
    if (!isOpen || !canvasRef.current) return;

    const k = kaplay({
      global: false,
      canvas: canvasRef.current,
      width: 600,
      height: 300,
      background: [34, 34, 34],
    });

    k.loadSound("jump", "/jump.mp3");
    k.setGravity(1600);

    const bot = k.add([
      k.rect(30, 30),
      k.pos(50, 100),
      k.color(228, 45, 45),
      k.area(),
      k.body(),
    ]);

    k.add([
      k.rect(600, 40),
      k.pos(0, 260),
      k.color(100, 100, 100),
      k.area(),
      k.body({ isStatic: true }),
    ]);

    k.onKeyPress("space", () => {
      if (bot.isGrounded()) {
        bot.jump(600);
        k.play("jump");
      }
    });

    return () => {
      k.quit();
    };
  }, [isOpen]); // Re-run when isOpen changes

  // If the game is NOT open, don't show anything at all
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-black bg-opacity-90">
      <h2 className="text-3xl font-bold text-white mb-4">Secret Level Unlocked</h2>
      
      <canvas ref={canvasRef} className="rounded-lg shadow-lg border-2 border-red-500"></canvas>
      
      <p className="text-gray-400 mt-4">Press SPACE to jump.</p>
      
      <button 
        onClick={onClose}
        className="mt-6 px-6 py-2 bg-red-600 text-white font-bold rounded hover:bg-red-500 transition"
      >
        Close Game
      </button>
    </div>
  );
}