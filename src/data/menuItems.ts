/**
 * menuItems.ts
 * ─────────────────────────────────────────────────────────────────────────────
 * Static menu catalogue for Naija Bites.
 *
 * In a production app this data would come from an API/database. For this
 * prototype it is hardcoded so the app works fully offline with no backend.
 *
 * `hasSizes` flag (Pizzas only):
 *  When true, the item can be ordered in Small / Medium / Large. Size pricing
 *  is computed at the cart/checkout level:
 *    Small  = base price
 *    Medium = base price + ₦2,000
 *    Large  = base price + ₦4,500
 *
 * `label` badges are purely cosmetic and rendered by MenuCard and the home page.
 * `isPopular` controls which items appear in the "Most Loved" grid on the home page.
 * `preparationTime` is displayed on the item detail page (minutes).
 */

export type MenuItem = {
  id: string;
  name: string;
  category: string;        // Must match one of the values in `categories` below
  description: string;
  price: number;           // Base price in Nigerian Naira (₦)
  imageUrl: string;        // Unsplash CDN URL
  isPopular: boolean;      // Shows in "Most Loved" section on the home page
  isAvailable: boolean;    // Reserved for future out-of-stock toggling
  label?: "Fan Favourite" | "Best Seller" | "Chef's Pick" | "New"; // Badge overlay
  preparationTime: number; // Estimated prep time in minutes
  hasSizes?: boolean;      // If true, customer must choose Small/Medium/Large
};

export const menuItems: MenuItem[] = [
  {
    id: "m1", name: "Egusi Soup", category: "Soups",
    description: "Rich melon seed soup cooked with assorted meats, stockfish, and palm oil. Served with your choice of swallow.",
    price: 3500, imageUrl: "https://images.unsplash.com/photo-1604908176997-125f25cc6f3d?w=600&q=80",
    isPopular: true, isAvailable: true, label: "Fan Favourite", preparationTime: 20,
  },
  {
    id: "m2", name: "Banga Soup", category: "Soups",
    description: "Traditional palm nut soup native to the Niger Delta, packed with fresh seafood and aromatic spices.",
    price: 4500, imageUrl: "https://images.unsplash.com/photo-1547592166-23ac45744acd?w=600&q=80",
    isPopular: false, isAvailable: true, preparationTime: 25,
  },
  {
    id: "m10", name: "Ofe Onugbu (Bitter Leaf)", category: "Soups",
    description: "Classic Igbo bitter leaf soup with tender goat meat, stockfish, and fresh bitter leaf. A true delicacy.",
    price: 3800, imageUrl: "https://images.unsplash.com/photo-1512058564366-18510be2db19?w=600&q=80",
    isPopular: false, isAvailable: true, preparationTime: 25,
  },
  {
    id: "m11", name: "Afang Soup", category: "Soups",
    description: "A rich Cross River delicacy made with afang leaves, waterleaf, assorted meats and periwinkle.",
    price: 4200, imageUrl: "https://images.unsplash.com/photo-1585937421612-70a008356fbe?w=600&q=80",
    isPopular: false, isAvailable: true, label: "Chef's Pick", preparationTime: 30,
  },
  {
    id: "m3", name: "Jollof Rice", category: "Rice",
    description: "Authentic smoky Nigerian party jollof rice. Perfectly seasoned and served with fried plantains.",
    price: 3000, imageUrl: "https://images.unsplash.com/photo-1567364816519-cbc9c4ffe1eb?w=600&q=80",
    isPopular: true, isAvailable: true, label: "Best Seller", preparationTime: 15,
  },
  {
    id: "m4", name: "Fried Rice", category: "Rice",
    description: "Savory fried rice loaded with mixed vegetables, shrimp, and diced liver. Served with chicken.",
    price: 3000, imageUrl: "https://images.unsplash.com/photo-1603133872878-684f208fb84b?w=600&q=80",
    isPopular: false, isAvailable: true, preparationTime: 15,
  },
  {
    id: "m12", name: "Ofada Rice & Sauce", category: "Rice",
    description: "Local unpolished ofada rice served with the famous designer sauce packed with assorted meats.",
    price: 3500, imageUrl: "https://images.unsplash.com/photo-1516684732162-798a0062be99?w=600&q=80",
    isPopular: true, isAvailable: true, label: "Chef's Pick", preparationTime: 20,
  },
  {
    id: "m5", name: "Suya Platter", category: "Proteins",
    description: "Spicy peanut-marinated grilled beef skewers, served with sliced onions, tomatoes, and yaji spice.",
    price: 2500, imageUrl: "https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=600&q=80",
    isPopular: true, isAvailable: true, label: "Fan Favourite", preparationTime: 10,
  },
  {
    id: "m6", name: "Catfish Peppersoup", category: "Proteins",
    description: "Spicy, aromatic broth loaded with fresh catfish cuts and traditional herbs.",
    price: 5500, imageUrl: "https://images.unsplash.com/photo-1544025162-d76694265947?w=600&q=80",
    isPopular: true, isAvailable: true, preparationTime: 30,
  },
  {
    id: "m13", name: "Asun (Spicy Goat)", category: "Proteins",
    description: "Smoky, fire-roasted peppered goat meat. Tender on the inside, charred on the outside.",
    price: 4500, imageUrl: "https://images.unsplash.com/photo-1529193591184-b1d58069ecdd?w=600&q=80",
    isPopular: true, isAvailable: true, label: "Best Seller", preparationTime: 20,
  },
  {
    id: "m14", name: "Nkwobi (Cow Leg)", category: "Proteins",
    description: "Slow-cooked cow leg in a rich, spicy palm oil sauce with utazi leaves.",
    price: 6000, imageUrl: "https://images.unsplash.com/photo-1625944525533-473f1a3d54e7?w=600&q=80",
    isPopular: false, isAvailable: true, preparationTime: 40,
  },
  {
    id: "m7", name: "Puff Puff", category: "Snacks",
    description: "Soft, golden, deep-fried sweet dough balls. The ultimate Nigerian street snack.",
    price: 1000, imageUrl: "https://images.unsplash.com/photo-1558961363-fa8fdf82db35?w=600&q=80",
    isPopular: true, isAvailable: true, label: "Fan Favourite", preparationTime: 5,
  },
  {
    id: "m15", name: "Akara (Bean Cakes)", category: "Snacks",
    description: "Crispy golden bean cakes made from blended black-eyed peas, peppers and onions.",
    price: 1200, imageUrl: "https://images.unsplash.com/photo-1565958011703-44f9829ba187?w=600&q=80",
    isPopular: false, isAvailable: true, preparationTime: 10,
  },
  {
    id: "m16", name: "Moi Moi", category: "Snacks",
    description: "Steamed bean pudding made with blended beans, peppers, fish, and eggs.",
    price: 1500, imageUrl: "https://images.unsplash.com/photo-1606923829579-0cb981a83e2e?w=600&q=80",
    isPopular: false, isAvailable: true, preparationTime: 15,
  },
  {
    id: "m17", name: "Fried Plantain", category: "Sides",
    description: "Sweet, caramelized fried ripe plantain slices. The perfect side to any Nigerian meal.",
    price: 800, imageUrl: "https://images.unsplash.com/photo-1604329760661-e71dc83f8f26?w=600&q=80",
    isPopular: true, isAvailable: true, preparationTime: 8,
  },
  {
    id: "m18", name: "Pounded Yam", category: "Sides",
    description: "Smooth, stretchy pounded yam — the classic Nigerian swallow. Pairs with any soup.",
    price: 1200, imageUrl: "https://images.unsplash.com/photo-1583524505974-6facd53f4597?w=600&q=80",
    isPopular: false, isAvailable: true, preparationTime: 10,
  },
  {
    id: "m8", name: "Suya Chicken Pizza", category: "Pizza",
    description: "Our signature fusion! Spicy suya chicken, red onions, bell peppers, fresh mozzarella, and yaji spice.",
    price: 5500, imageUrl: "https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=600&q=80",
    isPopular: true, isAvailable: true, label: "Chef's Pick", preparationTime: 25, hasSizes: true,
  },
  {
    id: "m9", name: "Margherita Pizza", category: "Pizza",
    description: "Classic pizza with rich San Marzano tomato sauce, fresh mozzarella, and fragrant basil.",
    price: 4500, imageUrl: "https://images.unsplash.com/photo-1574071318508-1cdbab80d002?w=600&q=80",
    isPopular: false, isAvailable: true, preparationTime: 20, hasSizes: true,
  },
  {
    id: "m19", name: "Pepperoni Pizza", category: "Pizza",
    description: "Loaded with premium pepperoni, mozzarella cheese, and our house tomato sauce.",
    price: 5000, imageUrl: "https://images.unsplash.com/photo-1628840042765-356cda07504e?w=600&q=80",
    isPopular: true, isAvailable: true, label: "Best Seller", preparationTime: 22, hasSizes: true,
  },
  {
    id: "m20", name: "Jollof Pizza", category: "Pizza",
    description: "Only at Naija Bites! Smoky jollof rice sauce base, seasoned chicken, caramelized onions.",
    price: 5800, imageUrl: "https://images.unsplash.com/photo-1513104890138-7c749659a591?w=600&q=80",
    isPopular: true, isAvailable: true, label: "New", preparationTime: 28, hasSizes: true,
  },
];

export const categories = ["All", "Soups", "Rice", "Proteins", "Snacks", "Pizza", "Sides"];
