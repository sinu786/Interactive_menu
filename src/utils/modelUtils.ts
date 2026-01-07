/**
 * Model utilities for GLB/USDZ handling
 */

// Convert GLB path to USDZ path
export function getUSDZPath(glbPath: string): string {
  return glbPath.replace(/\.glb$/i, '.usdz');
}

// Check if a file exists (for client-side, we'll attempt to fetch)
export async function checkFileExists(url: string): Promise<boolean> {
  try {
    const response = await fetch(url, { method: 'HEAD' });
    return response.ok;
  } catch {
    return false;
  }
}

// Get the iOS src attribute (USDZ path if available)
export function getIOSSrc(glbPath: string, iosPath?: string): string | undefined {
  // If explicit iOS path provided, use it
  if (iosPath) return iosPath;
  
  // Otherwise derive from GLB path
  return getUSDZPath(glbPath);
}

// Cache for USDZ availability checks
const usdzCache = new Map<string, boolean>();

// Check if USDZ is available for a model (with caching)
export async function isUSDZAvailable(glbPath: string): Promise<boolean> {
  const usdzPath = getUSDZPath(glbPath);
  
  if (usdzCache.has(usdzPath)) {
    return usdzCache.get(usdzPath)!;
  }
  
  const exists = await checkFileExists(usdzPath);
  usdzCache.set(usdzPath, exists);
  
  return exists;
}

// Preload USDZ availability for all menu items
export async function preloadUSDZAvailability(glbPaths: string[]): Promise<void> {
  await Promise.all(glbPaths.map(path => isUSDZAvailable(path)));
}


