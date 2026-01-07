You are Cursor, acting as a senior WebGL engineer + creative technologist.
Build a production-quality WEB APP called “AR Menu Web” — a fully interactive 3D + WebAR restaurant menu designed to be launched instantly via QR code in a mobile browser.

PRODUCT GOAL
Create a premium, ultra-smooth, demo-ready web experience that restaurant owners can open instantly without installing an app, showcasing:
- A cinematic 3D menu browsing experience
- A WebAR mode where the UI runs persistently over the camera feed and the selected food item appears on the table in realtime as users browse

This is NOT a “tap to view AR per item” experience. The AR scene must persist while browsing.

CORE MODES
1) 3D MODE (default)
   - A high-end interactive 3D “website” experience
   - Users browse menu items via a smooth snapping carousel
   - Selected item appears as a 3D model on a tabletop/pedestal
   - Orbit, pinch-zoom, subtle lighting, and polished transitions
   - Designed to feel premium, Apple-like, and fast

2) AR MODE (WebAR)
   - Full camera feed background
   - Persistent UI overlay (menu browsing, details)
   - Selected food model appears anchored on a detected surface or placed in front of the camera
   - When browsing items, the model swaps smoothly in-place
   - Includes tap-to-place, drag-to-move, pinch-to-scale, rotate gestures
   - Clear AR status indicators (searching surface / placed)

TECH STACK (DO THIS)
- Framework: Vite + React + TypeScript
- Styling: Tailwind CSS + CSS variables for branding
- 3D: Three.js + @react-three/fiber + drei
- WebAR:
   - Use WebXR where supported
   - Fallback to camera-based placement using getUserMedia + hit-test simulation
   - The UI and browsing MUST work regardless of AR support
- State management: Zustand
- Animations: Framer Motion + r3f animations
- Model loading: GLTFLoader with DRACO + KTX2 support hooks
- Target: Mobile browsers first (Safari iOS, Chrome Android)

UX FLOW
- User scans QR → opens the app instantly
- Landing screen:
   - Restaurant logo + name
   - “View Menu in 3D” (primary)
   - “View Menu in AR” (secondary)
- Default entry goes into 3D Mode
- Floating toggle switches between 3D and AR modes at any time

3D MODE DETAILS
- Scene:
   - Ground plane or tabletop
   - Soft fake shadow under model
   - Simple neutral environment lighting
- Model interactions:
   - Orbit rotation (limited angles)
   - Pinch zoom
- Browsing:
   - Bottom snapping carousel with smooth scale/opacity interpolation
   - Swipe left/right to change item
   - On change: animate model out → swap → animate in
- Detail drawer:
   - Slide-up panel with:
     - Name, price, description
     - Ingredients
     - Allergens
     - Calories
     - Spice level indicator
     - Veg / Non-veg badge

AR MODE DETAILS (IMPORTANT)
- Camera feed fills background
- Persistent UI overlay:
   - Top bar: back, restaurant name, AR status
   - Bottom: same snapping menu carousel
   - Side: scale slider + reset button
- Placement behavior:
   - First entry: model floats with placement reticle
   - Tap to place on surface or in front of camera
   - Drag to move, pinch to scale, rotate with two-finger twist
- When browsing items:
   - Keep model position
   - Swap models smoothly with fade/scale animation
- If WebXR plane detection is unavailable:
   - Use a “pseudo placement” system at fixed distance
   - Show subtle messaging: “Move phone to find surface (or tap to place)”

DATA + CONTENT
Create a local dataset in:
 /src/data/menu.ts

Each item:
- id
- name
- price
- currency
- description
- ingredients[]
- allergens[]
- calories
- spicyLevel (0–3)
- veg (boolean)
- category
- model:
   - url (GLB)
   - scale
   - rotation
   - yOffset

Include 10 demo items (burger, pizza, fries, fried chicken, cake, coffee, etc.)
Provide placeholder GLB files in /public/models/ and implement the loader so real models can be swapped easily.

PERFORMANCE REQUIREMENTS
- Lazy load models
- Preload next/previous carousel items
- Cache GLTFs in memory
- Pause render loop when tab not active
- Mobile-first performance tuning (pixel ratio clamp, capped DPR)

PROJECT STRUCTURE
/src
  /components
  /three
  /ar
  /state
  /data
  /theme
  /utils
/public
  /models
  /images

IMPLEMENTATION MUST-HAVES
1) AR abstraction layer:
   - One ARScene component that handles:
     - WebXR if available
     - Camera + pseudo AR fallback if not
   - UI must not depend on AR availability

2) Clean mode switching:
   - Smooth transition between 3D and AR (fade, scale, UI continuity)

3) Brand configurability:
   - restaurant.config.json with:
     - name
     - logo
     - accentColor
     - currency
   - App reads config and re-themes automatically

4) Demo-ready polish:
   - “How it works” overlay for restaurant owners
   - Optional CTA: “Scan QR → Try on your table”

DELIVERABLES
- Fully working web app
- Runs with:
   npm install
   npm run dev
- README including:
   1) How to run
   2) How to replace models
   3) WebAR limitations (honest explanation)
   4) Performance optimization checklist
   5) Path to Native App upgrade (React Native / Expo)

IMPORTANT CONSTRAINT
If full WebXR plane detection is not reliably supported, DO NOT BLOCK the experience.
Implement the best possible fallback and keep the UI + browsing fully functional.

PRIORITY
- Smooth UX > technical perfection
- Demo reliability > experimental features
- Sellability > edge-case completeness

Now build the project.
