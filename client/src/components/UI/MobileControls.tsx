import { useState, useRef } from "react";
import { useMobileControls } from "../../hooks/useMobileControls";

export default function MobileControls() {
  const { setMovement, setAction } = useMobileControls();
  const [joystickActive, setJoystickActive] = useState(false);
  const joystickRef = useRef<HTMLDivElement>(null);
  const knobRef = useRef<HTMLDivElement>(null);

  const handleJoystickStart = (e: React.TouchEvent | React.MouseEvent) => {
    setJoystickActive(true);
    handleJoystickMove(e);
  };

  const handleJoystickMove = (e: React.TouchEvent | React.MouseEvent) => {
    if (!joystickActive || !joystickRef.current || !knobRef.current) return;

    const touch = 'touches' in e ? e.touches[0] : e;
    const rect = joystickRef.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    
    const deltaX = touch.clientX - centerX;
    const deltaY = touch.clientY - centerY;
    const distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY);
    const maxDistance = rect.width / 2 - 10;
    
    // Limit knob to joystick boundary
    const limitedDistance = Math.min(distance, maxDistance);
    const angle = Math.atan2(deltaY, deltaX);
    
    const knobX = Math.cos(angle) * limitedDistance;
    const knobY = Math.sin(angle) * limitedDistance;
    
    knobRef.current.style.transform = `translate(${knobX}px, ${knobY}px)`;
    
    // Convert to movement values (-1 to 1)
    const moveX = knobX / maxDistance;
    const moveY = -knobY / maxDistance; // Invert Y for game coordinates
    
    setMovement(moveX, moveY);
  };

  const handleJoystickEnd = () => {
    setJoystickActive(false);
    if (knobRef.current) {
      knobRef.current.style.transform = 'translate(0px, 0px)';
    }
    setMovement(0, 0);
  };

  return (
    <div className="fixed inset-0 pointer-events-none z-50">
      {/* Movement Joystick */}
      <div className="absolute bottom-8 left-8 pointer-events-auto">
        <div
          ref={joystickRef}
          className="w-24 h-24 bg-black/30 rounded-full border-2 border-white/20 relative"
          onTouchStart={handleJoystickStart}
          onTouchMove={handleJoystickMove}
          onTouchEnd={handleJoystickEnd}
          onMouseDown={handleJoystickStart}
          onMouseMove={joystickActive ? handleJoystickMove : undefined}
          onMouseUp={handleJoystickEnd}
          onMouseLeave={handleJoystickEnd}
        >
          <div
            ref={knobRef}
            className="absolute w-8 h-8 bg-white/60 rounded-full top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 transition-transform"
          />
        </div>
      </div>

      {/* Action Buttons */}
      <div className="absolute bottom-8 right-8 pointer-events-auto">
        <div className="flex flex-col gap-3">
          {/* Jump Button */}
          <button
            className="w-16 h-16 bg-green-600/70 rounded-full border-2 border-white/20 flex items-center justify-center text-white font-bold"
            onTouchStart={() => setAction('jump', true)}
            onTouchEnd={() => setAction('jump', false)}
            onMouseDown={() => setAction('jump', true)}
            onMouseUp={() => setAction('jump', false)}
          >
            ↑
          </button>
          
          {/* Clone Button */}
          <button
            className="w-16 h-16 bg-purple-600/70 rounded-full border-2 border-white/20 flex items-center justify-center text-white font-bold"
            onTouchStart={() => setAction('clone', true)}
            onTouchEnd={() => setAction('clone', false)}
            onMouseDown={() => setAction('clone', true)}
            onMouseUp={() => setAction('clone', false)}
          >
            Q
          </button>
          
          {/* Interact Button */}
          <button
            className="w-16 h-16 bg-blue-600/70 rounded-full border-2 border-white/20 flex items-center justify-center text-white font-bold"
            onTouchStart={() => setAction('interact', true)}
            onTouchEnd={() => setAction('interact', false)}
            onMouseDown={() => setAction('interact', true)}
            onMouseUp={() => setAction('interact', false)}
          >
            E
          </button>
        </div>
      </div>

      {/* Pause Button */}
      <div className="absolute top-8 right-8 pointer-events-auto">
        <button
          className="w-12 h-12 bg-red-600/70 rounded-lg border-2 border-white/20 flex items-center justify-center text-white font-bold"
          onTouchStart={() => setAction('pause', true)}
          onMouseDown={() => setAction('pause', true)}
        >
          ⏸
        </button>
      </div>
    </div>
  );
}
