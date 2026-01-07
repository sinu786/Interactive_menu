# AR Menu Web

A premium, interactive 3D + WebAR restaurant menu experience designed to be launched instantly via QR code in a mobile browser.

![AR Menu Preview](./preview.png)

## ✨ Features

### 3D Mode (Default)
- **Cinematic 3D Menu Browsing**: Explore each dish as a detailed 3D model on an elegant pedestal
- **Touch Gestures**: Orbit rotation and pinch-to-zoom for detailed viewing
- **Smooth Animations**: Premium transitions between menu items
- **Detail Drawer**: Full dish information including ingredients, allergens, calories, and spice level

### AR Mode (WebAR)
- **Camera-Based AR**: See dishes on your actual table through your device camera
- **Persistent UI**: Browse menu while AR model stays placed
- **Gesture Controls**: Tap to place, pinch to scale
- **Real-time Model Swapping**: Change dishes while keeping placement

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ 
- npm or yarn

### Installation

```bash
# Install dependencies
npm install

# Start development server
npm run dev
```

The app will be available at `http://localhost:5173`

### Build for Production

```bash
npm run build
npm run preview
```

## 📱 Usage

1. **Scan QR Code**: Point your phone camera at the restaurant's QR code
2. **Choose Experience**: Select "View Menu in 3D" or "View Menu in AR"
3. **Browse Items**: Swipe left/right on the carousel to browse dishes
4. **View Details**: Tap a selected item to see full details
5. **AR Placement**: In AR mode, tap screen to place dish on your table
6. **Adjust Size**: Use the side slider to scale the 3D model

## 🔧 Configuration

### Restaurant Branding

Edit `src/data/restaurant.config.ts`:

```typescript
export const restaurantConfig = {
  name: "Your Restaurant",
  tagline: "Your tagline here",
  logo: "/images/logo.svg",
  accentColor: "#D4AF37", // Your brand color
  secondaryColor: "#1a1a2e",
  currency: "USD",
  currencySymbol: "$"
};
```

### Menu Items

Edit `src/data/menu.ts`:

```typescript
{
  id: 'unique-id',
  name: 'Dish Name',
  price: 19.99,
  currency: 'USD',
  description: 'Description here...',
  ingredients: ['Ingredient 1', 'Ingredient 2'],
  allergens: ['Gluten', 'Dairy'],
  calories: 500,
  spicyLevel: 1, // 0-3
  veg: false,
  category: 'Category',
  model: {
    url: '/Models/your-model.glb',
    scale: 2.5,
    rotation: [0, 0, 0],
    yOffset: 0
  }
}
```

## 🎨 Replacing 3D Models

1. Place your GLB files in the `Models/` folder
2. Update the model path in `src/data/menu.ts`
3. Adjust `scale`, `rotation`, and `yOffset` as needed

### Model Requirements
- Format: GLB (GLTF Binary)
- Recommended poly count: < 100k triangles
- Textures: Embedded, max 2048x2048
- Size: < 5MB per model

### Optimizing Models
- Use [gltf-transform](https://gltf-transform.donmccurdy.com/) for compression
- Apply Draco compression for geometry
- Use KTX2/Basis for textures

## 📱 WebAR Limitations

### What Works
- ✅ Camera feed as background
- ✅ 3D model overlay with gestures
- ✅ Basic placement simulation
- ✅ Pinch-to-scale
- ✅ Model swapping while placed

### Current Limitations
- ❌ True surface detection (requires WebXR support)
- ❌ Occlusion (model doesn't hide behind real objects)
- ❌ Light estimation
- ❌ Persistent anchors

### Browser Support
| Feature | Safari iOS | Chrome Android | Desktop Chrome |
|---------|------------|----------------|----------------|
| 3D Mode | ✅ | ✅ | ✅ |
| Camera AR | ✅ | ✅ | ✅ |
| WebXR AR | ❌ | ✅ (some devices) | ❌ |

## ⚡ Performance Optimization

### Checklist
- [x] Lazy load 3D models
- [x] Preload adjacent carousel items
- [x] Memory-cached GLTFs
- [x] Render pause when tab inactive
- [x] Mobile-optimized DPR clamping (1-2)
- [x] Compressed textures (when possible)

### Recommendations
1. **Model Size**: Keep GLBs under 5MB each
2. **Texture Resolution**: Max 2048x2048, use 1024x1024 when possible
3. **Polygon Count**: Target < 50k triangles per model
4. **Testing**: Always test on target devices (mid-range phones)

## 🛣️ Path to Native App

For enhanced AR capabilities, consider migrating to:

### React Native + Expo
```bash
npx create-expo-app ARMenuNative
```

Benefits:
- Native AR frameworks (ARKit/ARCore)
- True surface detection
- Better performance
- Offline support
- Push notifications

### Recommended Stack
- **Framework**: Expo SDK 50+
- **3D**: expo-gl + three.js
- **AR**: expo-ar (deprecated) or ViroReact
- **State**: Same Zustand store can be reused

## 📁 Project Structure

```
/src
  /components    # UI components (React)
  /three         # Three.js 3D scenes
  /ar            # AR-specific components
  /state         # Zustand store
  /data          # Menu data & config
/Models          # 3D model files (GLB)
/public
  /images        # Static images
```

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing`)
5. Open a Pull Request

## 📄 License

MIT License - feel free to use for your restaurant!

---

Built with ❤️ using React, Three.js, and Framer Motion


