import { useEffect, useState } from 'react';

export default function CustomCursor() {
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isPointer, setIsPointer] = useState(false);

  useEffect(() => {
    const updatePosition = (e) => {
      setPosition({ x: e.clientX, y: e.clientY });
      
      // Check if hovering over a clickable element
      const target = e.target;
      setIsPointer(
        window.getComputedStyle(target).cursor === 'pointer' || 
        target.tagName.toLowerCase() === 'a' || 
        target.tagName.toLowerCase() === 'button'
      );
    };

    window.addEventListener('mousemove', updatePosition);
    return () => window.removeEventListener('mousemove', updatePosition);
  }, []);

  return (
    <>
      {/* Outer trailing circle */}
      <div 
        className="fixed top-0 left-0 w-8 h-8 rounded-full border-2 border-orange-500/50 pointer-events-none z-[9999] transition-transform duration-200 ease-out mix-blend-screen shadow-[0_0_10px_rgba(249,115,22,0.5)]"
        style={{ 
          transform: `translate(${position.x - 16}px, ${position.y - 16}px) scale(${isPointer ? 1.5 : 1})`,
          backgroundColor: isPointer ? 'rgba(249,115,22,0.1)' : 'transparent'
        }}
      />
      {/* Inner dot */}
      <div 
        className="fixed top-0 left-0 w-2 h-2 rounded-full bg-rose-500 pointer-events-none z-[10000] shadow-[0_0_10px_rgba(225,29,72,0.8)]"
        style={{ transform: `translate(${position.x - 4}px, ${position.y - 4}px)` }}
      />
    </>
  );
}
