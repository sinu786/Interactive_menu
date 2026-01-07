import { useRef, useEffect, useState, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import { useGLTF, Center, Bounds } from '@react-three/drei';
import { Group, AnimationMixer, LoopRepeat, Box3, Vector3 } from 'three';
import { MenuItem } from '../data/menu';
import { useAppStore } from '../state/store';

interface FoodModelProps {
  item: MenuItem;
  isActive: boolean;
  onLoaded?: () => void;
  autoScale?: boolean;
}

// Target size for the model (in scene units)
const TARGET_SIZE = 1.5;

export function FoodModel({ item, isActive, onLoaded, autoScale = true }: FoodModelProps) {
  const groupRef = useRef<Group>(null);
  const [mixer, setMixer] = useState<AnimationMixer | null>(null);
  const markModelLoaded = useAppStore((s) => s.markModelLoaded);
  
  const { scene, animations } = useGLTF(item.model.url, true);
  
  // Calculate auto-scale based on model bounds
  const calculatedScale = useMemo(() => {
    if (!scene || !autoScale) return item.model.scale;
    
    const box = new Box3().setFromObject(scene);
    const size = new Vector3();
    box.getSize(size);
    
    // Get the largest dimension
    const maxDim = Math.max(size.x, size.y, size.z);
    
    if (maxDim === 0) return item.model.scale;
    
    // Calculate scale to fit within TARGET_SIZE
    const autoScaleValue = TARGET_SIZE / maxDim;
    
    // Combine with user-defined scale multiplier (item.model.scale)
    // If item.model.scale is small (< 1), use it as a multiplier
    // If it's large, the model might be tiny and needs the full value
    const finalScale = item.model.scale < 1 
      ? autoScaleValue * (item.model.scale * 100) // Convert 0.015 -> 1.5x multiplier
      : autoScaleValue;
    
    return Math.min(finalScale, 10); // Cap at 10x to prevent oversized models
  }, [scene, autoScale, item.model.scale]);

  // Clone scene to prevent issues with shared geometry
  const clonedScene = useMemo(() => {
    return scene.clone(true);
  }, [scene]);

  useEffect(() => {
    if (clonedScene) {
      markModelLoaded(item.id);
      onLoaded?.();
      
      // Setup animations if available
      if (animations.length > 0) {
        const newMixer = new AnimationMixer(clonedScene);
        animations.forEach((clip) => {
          const action = newMixer.clipAction(clip);
          action.setLoop(LoopRepeat, Infinity);
          action.play();
        });
        setMixer(newMixer);
      }
    }

    return () => {
      mixer?.stopAllAction();
    };
  }, [clonedScene, animations, item.id, markModelLoaded, onLoaded, mixer]);

  useFrame((_, delta) => {
    if (groupRef.current && isActive) {
      // Subtle idle rotation
      groupRef.current.rotation.y += delta * 0.3;
    }
    
    // Update animation mixer
    mixer?.update(delta);
  });

  return (
    <group ref={groupRef}>
      <Center>
        <Bounds fit clip observe margin={1.2}>
          <group 
            scale={calculatedScale}
            position={[0, item.model.yOffset, 0]}
            rotation={item.model.rotation}
          >
            <primitive object={clonedScene} />
          </group>
        </Bounds>
      </Center>
    </group>
  );
}

// Preload models for better performance
export function preloadModel(url: string) {
  useGLTF.preload(url);
}
