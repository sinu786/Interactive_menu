#!/usr/bin/env python3
"""
GLB to USDZ Converter using trimesh and USD

This script converts GLB files to USDZ format for iOS Quick Look AR.
Creates proper binary USDC format required by iOS.
"""

import os
import sys
import tempfile
import zipfile
from pathlib import Path

def convert_glb_to_usdz(glb_path, usdz_path):
    """Convert a GLB file to USDZ format with binary USDC."""
    try:
        import trimesh
        from pxr import Usd, UsdGeom, UsdShade, Sdf, Gf, UsdUtils
        
        print(f"  Loading GLB...")
        
        # Load the GLB file with trimesh
        scene = trimesh.load(glb_path, force='scene')
        
        # Create a temporary directory for intermediate files
        with tempfile.TemporaryDirectory() as temp_dir:
            # If it's a scene, we need to combine meshes
            if isinstance(scene, trimesh.Scene):
                meshes = []
                for name, geom in scene.geometry.items():
                    if isinstance(geom, trimesh.Trimesh):
                        meshes.append(geom)
                
                if meshes:
                    combined = trimesh.util.concatenate(meshes)
                else:
                    raise ValueError("No valid meshes found in GLB")
            else:
                combined = scene
            
            print(f"  Creating USD stage ({len(combined.vertices)} vertices, {len(combined.faces)} faces)...")
            
            # Create a new USD stage - use USDC (binary) format
            usdc_path = os.path.join(temp_dir, 'model.usdc')
            stage = Usd.Stage.CreateNew(usdc_path)
            
            # Set up the stage for AR
            UsdGeom.SetStageUpAxis(stage, UsdGeom.Tokens.y)
            UsdGeom.SetStageMetersPerUnit(stage, 1.0)
            
            # Create root xform with proper pivot for AR
            root = UsdGeom.Xform.Define(stage, '/Root')
            
            # Create mesh
            mesh_prim = UsdGeom.Mesh.Define(stage, '/Root/Mesh')
            
            # Set vertices
            vertices = combined.vertices.tolist()
            mesh_prim.GetPointsAttr().Set([Gf.Vec3f(*v) for v in vertices])
            
            # Set face vertex counts and indices
            faces = combined.faces
            face_vertex_counts = [3] * len(faces)
            face_vertex_indices = faces.flatten().tolist()
            
            mesh_prim.GetFaceVertexCountsAttr().Set(face_vertex_counts)
            mesh_prim.GetFaceVertexIndicesAttr().Set(face_vertex_indices)
            
            # Set normals if available
            if combined.vertex_normals is not None:
                normals = combined.vertex_normals.tolist()
                mesh_prim.GetNormalsAttr().Set([Gf.Vec3f(*n) for n in normals])
                mesh_prim.SetNormalsInterpolation(UsdGeom.Tokens.vertex)
            
            # Set vertex colors if available (as displayColor)
            if hasattr(combined.visual, 'vertex_colors') and combined.visual.vertex_colors is not None:
                colors = combined.visual.vertex_colors[:, :3] / 255.0  # RGB only, normalized
                mesh_prim.GetDisplayColorAttr().Set([Gf.Vec3f(*c) for c in colors.tolist()])
            
            # Create a PBR material
            material = UsdShade.Material.Define(stage, '/Root/Material')
            shader = UsdShade.Shader.Define(stage, '/Root/Material/PBRShader')
            shader.CreateIdAttr('UsdPreviewSurface')
            
            # Set material properties
            shader.CreateInput('diffuseColor', Sdf.ValueTypeNames.Color3f).Set(Gf.Vec3f(0.8, 0.8, 0.8))
            shader.CreateInput('roughness', Sdf.ValueTypeNames.Float).Set(0.4)
            shader.CreateInput('metallic', Sdf.ValueTypeNames.Float).Set(0.0)
            shader.CreateInput('opacity', Sdf.ValueTypeNames.Float).Set(1.0)
            
            # Connect shader outputs
            material.CreateSurfaceOutput().ConnectToSource(shader.ConnectableAPI(), 'surface')
            
            # Bind material to mesh
            UsdShade.MaterialBindingAPI(mesh_prim).Bind(material)
            
            # Set the default prim
            stage.SetDefaultPrim(root.GetPrim())
            
            # Save the stage as binary USDC
            stage.GetRootLayer().Save()
            
            print(f"  Packaging USDZ...")
            
            # Create USDZ package using USD's CreateNewARKitUsdzPackage
            # This creates a proper AR-compatible USDZ
            try:
                result = UsdUtils.CreateNewARKitUsdzPackage(
                    Sdf.AssetPath(usdc_path),
                    usdz_path
                )
                if result:
                    print(f"  ✓ Created {os.path.basename(usdz_path)} (ARKit compatible)")
                    return True
            except Exception as e:
                print(f"  ARKit packaging failed ({e}), using standard packaging...")
            
            # Fallback: Manual USDZ creation with proper structure
            # USDZ must be uncompressed ZIP with first file being the USD
            with zipfile.ZipFile(usdz_path, 'w', zipfile.ZIP_STORED) as zf:
                # Add the USDC file first (required by USDZ spec)
                zf.write(usdc_path, 'model.usdc')
            
            print(f"  ✓ Created {os.path.basename(usdz_path)}")
            return True
            
    except Exception as e:
        print(f"  ✗ Error: {e}")
        import traceback
        traceback.print_exc()
        return False


def main():
    models_dir = Path(__file__).parent.parent / 'Models'
    
    if not models_dir.exists():
        print(f"❌ Models directory not found: {models_dir}")
        sys.exit(1)
    
    # Check for specific file argument
    specific_file = None
    if len(sys.argv) > 1:
        specific_file = sys.argv[1]
    
    glb_files = list(models_dir.glob('*.glb'))
    
    if specific_file:
        glb_files = [f for f in glb_files if specific_file.lower() in f.name.lower()]
    
    if not glb_files:
        print("No GLB files found.")
        sys.exit(0)
    
    print(f"\n🔄 Converting {len(glb_files)} GLB file(s) to USDZ (iOS AR format)\n")
    
    success = 0
    failed = 0
    skipped = 0
    
    for glb_path in glb_files:
        usdz_path = glb_path.with_suffix('.usdz')
        
        # Always reconvert to fix format issues
        if usdz_path.exists() and not specific_file:
            print(f"⏭  {glb_path.name} → already exists (use filename arg to force)")
            skipped += 1
            continue
        
        print(f"📦 {glb_path.name}")
        
        if convert_glb_to_usdz(str(glb_path), str(usdz_path)):
            success += 1
        else:
            failed += 1
    
    print(f"\n{'─' * 40}")
    if success:
        print(f"✓ Converted: {success}")
    if skipped:
        print(f"⏭ Skipped: {skipped}")
    if failed:
        print(f"✗ Failed: {failed}")
    print()


if __name__ == '__main__':
    main()
