export interface RestaurantConfig {
  name: string;
  tagline: string;
  logo: string;
  accentColor: string;
  secondaryColor: string;
  currency: string;
  currencySymbol: string;
}

export const restaurantConfig: RestaurantConfig = {
  name: "Maison Gourmet",
  tagline: "Experience culinary artistry",
  logo: "/images/logo.svg",
  accentColor: "#111111",
  secondaryColor: "#666666",
  currency: "USD",
  currencySymbol: "$"
};

// CSS custom properties generator
export const getCSSVariables = (config: RestaurantConfig) => ({
  '--brand-primary': config.accentColor,
  '--brand-secondary': config.secondaryColor,
  '--brand-accent': config.accentColor,
  '--brand-dark': '#ffffff',
  '--brand-light': '#111111',
});
