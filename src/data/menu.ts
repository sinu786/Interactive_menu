export interface MenuItem {
  id: string;
  name: string;
  price: number;
  currency: string;
  description: string;
  ingredients: string[];
  allergens: string[];
  calories: number;
  spicyLevel: 0 | 1 | 2 | 3;
  veg: boolean;
  category: string;
  model: {
    url: string;
    iosUrl?: string; // USDZ file for iOS Quick Look
    scale: number;
    rotation: [number, number, number];
    yOffset: number;
  };
  image?: string;
}

export const menuItems: MenuItem[] = [
  {
    id: 'burger-classic',
    name: 'Classic Burger',
    price: 16.99,
    currency: 'USD',
    description: 'A juicy beef patty with fresh lettuce, tomato, pickles, and our signature sauce on a toasted brioche bun.',
    ingredients: ['Beef patty', 'Brioche bun', 'Lettuce', 'Tomato', 'Pickles', 'Signature sauce', 'Cheddar cheese'],
    allergens: ['Gluten', 'Dairy', 'Sesame'],
    calories: 720,
    spicyLevel: 0,
    veg: false,
    category: 'Burgers',
    model: {
      url: '/Models/Burger 3D Model.glb',
      scale: 0.015,
      rotation: [0, 0, 0],
      yOffset: 0
    }
  },
  {
    id: 'club-sandwich',
    name: 'Club Sandwich',
    price: 14.99,
    currency: 'USD',
    description: 'Triple-decker sandwich with turkey, bacon, lettuce, tomato, and mayo on toasted white bread.',
    ingredients: ['Turkey breast', 'Bacon', 'Lettuce', 'Tomato', 'Mayonnaise', 'White bread'],
    allergens: ['Gluten', 'Eggs'],
    calories: 580,
    spicyLevel: 0,
    veg: false,
    category: 'Sandwiches',
    model: {
      url: '/Models/Club Sandwich 3D Model.glb',
      scale: 0.015,
      rotation: [0, 0, 0],
      yOffset: 0
    }
  },
  {
    id: 'gourmet-platter',
    name: 'Gourmet Platter',
    price: 34.99,
    currency: 'USD',
    description: 'Chef\'s selection of artisanal cheeses, cured meats, olives, and fresh bread with olive oil.',
    ingredients: ['Artisanal cheeses', 'Prosciutto', 'Salami', 'Olives', 'Focaccia', 'Extra virgin olive oil'],
    allergens: ['Gluten', 'Dairy', 'Nuts'],
    calories: 1200,
    spicyLevel: 0,
    veg: false,
    category: 'Platters',
    model: {
      url: '/Models/Food 3D Model by Nicotrico (1).glb',
      scale: 0.012,
      rotation: [0, 0, 0],
      yOffset: 0
    }
  },
  {
    id: 'mediterranean-bowl',
    name: 'Mediterranean Bowl',
    price: 17.99,
    currency: 'USD',
    description: 'Fresh falafel, hummus, tabbouleh, grilled vegetables, and tzatziki over fluffy couscous.',
    ingredients: ['Falafel', 'Hummus', 'Tabbouleh', 'Grilled vegetables', 'Tzatziki', 'Couscous'],
    allergens: ['Gluten', 'Sesame', 'Dairy'],
    calories: 650,
    spicyLevel: 1,
    veg: true,
    category: 'Bowls',
    model: {
      url: '/Models/Food 3D Model by Nicotrico.glb',
      scale: 0.012,
      rotation: [0, 0, 0],
      yOffset: 0
    }
  },
  {
    id: 'lobster-fries',
    name: 'Lobster with Fries',
    price: 54.99,
    currency: 'USD',
    description: 'Whole Maine lobster, butter-poached and served with crispy golden fries and lemon garlic aioli.',
    ingredients: ['Maine lobster', 'Clarified butter', 'Russet potatoes', 'Lemon garlic aioli', 'Fresh herbs'],
    allergens: ['Shellfish', 'Dairy', 'Eggs'],
    calories: 980,
    spicyLevel: 0,
    veg: false,
    category: 'Seafood',
    model: {
      url: '/Models/Lobster with Fries 3D Model.glb',
      scale: 0.015,
      rotation: [0, 0, 0],
      yOffset: 0
    }
  },
  {
    id: 'pizza-ballerina',
    name: 'Pizza Ballerina',
    price: 22.99,
    currency: 'USD',
    description: 'Wood-fired Neapolitan pizza with San Marzano tomatoes, fresh mozzarella, basil, and EVOO.',
    ingredients: ['San Marzano tomatoes', 'Fresh mozzarella', 'Fresh basil', 'Extra virgin olive oil', '00 flour dough'],
    allergens: ['Gluten', 'Dairy'],
    calories: 820,
    spicyLevel: 0,
    veg: true,
    category: 'Pizza',
    model: {
      url: '/Models/Pizza Ballerina 3D Model.glb',
      scale: 0.015,
      rotation: [0, 0, 0],
      yOffset: 0
    }
  },
  {
    id: 'bbq-ribs',
    name: 'BBQ Ribs from Joia',
    price: 32.99,
    currency: 'USD',
    description: 'Slow-smoked baby back ribs glazed with our house-made bourbon BBQ sauce, fall-off-the-bone tender.',
    ingredients: ['Baby back ribs', 'Bourbon BBQ sauce', 'Dry rub spices', 'Coleslaw', 'Cornbread'],
    allergens: ['Gluten', 'Soy'],
    calories: 1150,
    spicyLevel: 1,
    veg: false,
    category: 'BBQ',
    model: {
      url: '/Models/Ribs from Joia 3D Model.glb',
      scale: 0.015,
      rotation: [0, 0, 0],
      yOffset: 0
    }
  },
  {
    id: 'steak-sandwich',
    name: 'Steak Sandwich',
    price: 24.99,
    currency: 'USD',
    description: 'Sliced ribeye steak with sautéed peppers, onions, provolone, and horseradish cream on ciabatta.',
    ingredients: ['Ribeye steak', 'Bell peppers', 'Caramelized onions', 'Provolone cheese', 'Horseradish cream', 'Ciabatta'],
    allergens: ['Gluten', 'Dairy'],
    calories: 920,
    spicyLevel: 1,
    veg: false,
    category: 'Sandwiches',
    model: {
      url: '/Models/Steak Sandwich 3D Model.glb',
      scale: 0.015,
      rotation: [0, 0, 0],
      yOffset: 0
    }
  },
  {
    id: 'sushi-boat',
    name: 'Sushi Boat Nigiri',
    price: 48.99,
    currency: 'USD',
    description: 'Premium sushi boat featuring 12 pieces of chef\'s selection nigiri with fresh wasabi and pickled ginger.',
    ingredients: ['Salmon', 'Tuna', 'Yellowtail', 'Shrimp', 'Eel', 'Octopus', 'Sushi rice', 'Nori'],
    allergens: ['Fish', 'Shellfish', 'Soy', 'Sesame'],
    calories: 680,
    spicyLevel: 2,
    veg: false,
    category: 'Sushi',
    model: {
      url: '/Models/Sushi Boat Nigiri.glb',
      scale: 0.015,
      rotation: [0, 0, 0],
      yOffset: 0
    }
  }
];

export const categories = [...new Set(menuItems.map(item => item.category))];

export const getItemById = (id: string): MenuItem | undefined => 
  menuItems.find(item => item.id === id);

export const getItemsByCategory = (category: string): MenuItem[] =>
  menuItems.filter(item => item.category === category);
