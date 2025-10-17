import { useState, useRef } from "react";
import { useMobileControls } from "../../hooks/useMobileControls";
import { motion } from "framer-motion";

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
    if (!joystickRef.current || !knobRef.current) return;

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
    
    if (joystickActive || distance > 5) {
      setMovement(moveX, moveY);
    }
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
      <motion.div 
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        className="absolute bottom-6 left-6 pointer-events-auto"
      >
        <div
          ref={joystickRef}
          className="w-28 h-28 bg-black/30 backdrop-blur-sm rounded-full border-2 border-white/20 relative shadow-2xl"
          onTouchStart={handleJoystickStart}
          onTouchMove={handleJoystickMove}
          onTouchEnd={handleJoystickEnd}
          onMouseDown={handleJoystickStart}
          onMouseMove={joystickActive ? handleJoystickMove : undefined}
          onMouseUp={handleJoystickEnd}
          onMouseLeave={handleJoystickEnd}
        >
          {/* Directional indicators */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="absolute top-2 text-white/30 text-xs">↑</div>
            <div className="absolute bottom-2 text-white/30 text-xs">↓</div>
            <div className="absolute left-2 text-white/30 text-xs">←</div>
            <div className="absolute right-2 text-white/30 text-xs">→</div>
          </div>
          <motion.div
            ref={knobRef}
            animate={{ scale: joystickActive ? 1.1 : 1 }}
            className="absolute w-10 h-10 bg-gradient-to-br from-white/70 to-white/50 rounded-full top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 shadow-lg border-2 border-white/40"
          >
            <div className="absolute inset-0 rounded-full bg-white/20 animate-pulse"></div>
          </motion.div>
        </div>
        <div className="text-center mt-2 text-white/60 text-xs font-medium">Move</div>
      </motion.div>

      {/* Action Buttons */}
      <motion.div 
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        className="absolute bottom-6 right-6 pointer-events-auto"
      >
        <div className="flex flex-col gap-3">
          {/* Jump Button */}
          <motion.button
            whileTap={{ scale: 0.9 }}
            className="w-16 h-16 bg-gradient-to-br from-green-600/80 to-green-700/80 backdrop-blur-sm rounded-full border-2 border-white/30 flex items-center justify-center text-white font-bold shadow-2xl shadow-green-500/50 active:shadow-green-500/80"
            onTouchStart={() => setAction('jump', true)}
            onTouchEnd={() => setAction('jump', false)}
            onMouseDown={() => setAction('jump', true)}
            onMouseUp={() => setAction('jump', false)}
          >
            <div className="text-2xl">↑</div>
          </motion.button>
          
          {/* Clone Button */}
          <motion.button
            whileTap={{ scale: 0.9 }}
            className="w-16 h-16 bg-gradient-to-br from-purple-600/80 to-purple-700/80 backdrop-blur-sm rounded-full border-2 border-white/30 flex items-center justify-center text-white font-bold shadow-2xl shadow-purple-500/50 active:shadow-purple-500/80"
            onTouchStart={() => setAction('clone', true)}
            onTouchEnd={() => setAction('clone', false)}
            onMouseDown={() => setAction('clone', true)}
            onMouseUp={() => setAction('clone', false)}
          >
            <div className="text-lg">Q</div>
          </motion.button>
          
          {/* Interact Button */}
          <motion.button
            whileTap={{ scale: 0.9 }}
            className="w-16 h-16 bg-gradient-to-br from-blue-600/80 to-blue-700/80 backdrop-blur-sm rounded-full border-2 border-white/30 flex items-center justify-center text-white font-bold shadow-2xl shadow-blue-500/50 active:shadow-blue-500/80"
            onTouchStart={() => setAction('interact', true)}
            onTouchEnd={() => setAction('interact', false)}
            onMouseDown={() => setAction('interact', true)}
            onMouseUp={() => setAction('interact', false)}
          >
            <div className="text-lg">E</div>
          </motion.button>
        </div>
        <div className="text-center mt-2 text-white/60 text-xs font-medium">Actions</div>
      </motion.div>

      {/* Pause Button */}
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="absolute top-6 right-6 pointer-events-auto"
      >
        <motion.button
          whileTap={{ scale: 0.9 }}
          className="w-12 h-12 bg-gradient-to-br from-red-600/80 to-red-700/80 backdrop-blur-sm rounded-lg border-2 border-white/30 flex items-center justify-center text-white font-bold shadow-2xl shadow-red-500/50"
          onTouchStart={() => setAction('pause', true)}
          onMouseDown={() => setAction('pause', true)}
        >
          <div className="text-xl">⏸</div>
        </motion.button>
      </motion.div>
    </div>
  );
}
