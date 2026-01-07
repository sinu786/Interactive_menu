import { useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Float, Sphere, MeshDistortMaterial } from '@react-three/drei';
import { Mesh } from 'three';

function FloatingOrb({ position, color, scale }: { 
  position: [number, number, number];
  color: string;
  scale: number;
}) {
  const meshRef = useRef<Mesh>(null);
  
  useFrame(({ clock }) => {
    if (meshRef.current) {
      meshRef.current.rotation.x = clock.getElapsedTime() * 0.1;
      meshRef.current.rotation.y = clock.getElapsedTime() * 0.15;
    }
  });

  return (
    <Float
      speed={2}
      rotationIntensity={0.5}
      floatIntensity={1}
    >
      <Sphere ref={meshRef} args={[1, 32, 32]} position={position} scale={scale}>
        <MeshDistortMaterial
          color={color}
          attach="material"
          distort={0.4}
          speed={2}
          roughness={0.2}
          metalness={0.8}
          transparent
          opacity={0.6}
        />
      </Sphere>
    </Float>
  );
}

export function BackgroundScene() {
  return (
    <div className="absolute inset-0 opacity-30 pointer-events-none">
      <Canvas
        dpr={[1, 1.5]}
        camera={{ position: [0, 0, 10], fov: 50 }}
        gl={{ powerPreference: 'low-power', antialias: false }}
      >
        <color attach="background" args={['#0a0a0f']} />
        <ambientLight intensity={0.5} />
        <pointLight position={[10, 10, 10]} intensity={1} color="#D4AF37" />
        
        <FloatingOrb position={[-4, 2, -5]} color="#D4AF37" scale={1.5} />
        <FloatingOrb position={[4, -2, -8]} color="#1a1a2e" scale={2} />
        <FloatingOrb position={[0, 3, -10]} color="#D4AF37" scale={1} />
      </Canvas>
    </div>
  );
}


