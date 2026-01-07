import { useGLTF } from '@react-three/drei';
import { menuItems } from '../data/menu';

// Model cache management
const modelCache = new Map<string, boolean>();

export function preloadModels(indices: number[]) {
  indices.forEach(index => {
    if (index >= 0 && index < menuItems.length) {
      const url = menuItems[index].model.url;
      if (!modelCache.has(url)) {
        useGLTF.preload(url);
        modelCache.set(url, true);
      }
    }
  });
}

export function preloadAllModels() {
  menuItems.forEach(item => {
    if (!modelCache.has(item.model.url)) {
      useGLTF.preload(item.model.url);
      modelCache.set(item.model.url, true);
    }
  });
}

export function preloadAdjacentModels(currentIndex: number) {
  const indices = [
    currentIndex,
    (currentIndex + 1) % menuItems.length,
    currentIndex === 0 ? menuItems.length - 1 : currentIndex - 1
  ];
  preloadModels(indices);
}

export function clearModelCache() {
  useGLTF.clear();
  modelCache.clear();
}

export function isModelCached(url: string): boolean {
  return modelCache.has(url);
}


