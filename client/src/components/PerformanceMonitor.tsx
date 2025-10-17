import { useEffect, useRef } from "react";
import { useFrame, useThree } from "@react-three/fiber";

export default function PerformanceMonitor() {
  const { gl } = useThree();
  const fpsRef = useRef<number[]>([]);
  const lastTime = useRef(performance.now());
  const qualityAdjusted = useRef(false);

  useFrame(() => {
    // Calculate FPS
    const currentTime = performance.now();
    const delta = currentTime - lastTime.current;
    const fps = 1000 / delta;
    
    fpsRef.current.push(fps);
    
    // Keep only last 60 frames
    if (fpsRef.current.length > 60) {
      fpsRef.current.shift();
    }
    
    // Calculate average FPS
    const avgFps = fpsRef.current.reduce((a, b) => a + b, 0) / fpsRef.current.length;
    
    // Auto-adjust quality if FPS is consistently low
    if (fpsRef.current.length === 60 && !qualityAdjusted.current) {
      if (avgFps < 30) {
        console.log(`Low FPS detected (${avgFps.toFixed(1)}), adjusting quality...`);
        
        // Reduce shadow map size
        if (gl.shadowMap) {
          gl.shadowMap.enabled = false;
        }
        
        // Reduce pixel ratio
        gl.setPixelRatio(Math.min(window.devicePixelRatio * 0.75, 2));
        
        qualityAdjusted.current = true;
      }
    }
    
    lastTime.current = currentTime;
  });

  // Initial optimizations
  useEffect(() => {
    // Set appropriate pixel ratio for device
    const pixelRatio = Math.min(window.devicePixelRatio, 2);
    gl.setPixelRatio(pixelRatio);
    
    // Enable hardware acceleration hints
    gl.powerPreference = "high-performance";
    
    console.log("Performance optimizations applied");
  }, [gl]);

  return null;
}
