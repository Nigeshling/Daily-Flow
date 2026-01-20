import { FoodItem } from '@/types/health';

export const fastFoodDatabase: FoodItem[] = [
  // McDonald's
  { id: 'mcd-bigmac', name: "McDonald's Big Mac", calories: 590, protein: 25, carbs: 46, fat: 34, sodium: 1010 },
  { id: 'mcd-mcchicken', name: "McDonald's McChicken", calories: 400, protein: 14, carbs: 40, fat: 21, sodium: 560 },
  { id: 'mcd-fries-m', name: "McDonald's Medium Fries", calories: 320, protein: 5, carbs: 43, fat: 15, sodium: 260 },
  { id: 'mcd-nuggets-10', name: "McDonald's 10pc Nuggets", calories: 410, protein: 24, carbs: 25, fat: 24, sodium: 900 },
  { id: 'mcd-qpc', name: "McDonald's Quarter Pounder", calories: 520, protein: 30, carbs: 42, fat: 26, sodium: 1100 },
  { id: 'mcd-filet', name: "McDonald's Filet-O-Fish", calories: 390, protein: 16, carbs: 39, fat: 19, sodium: 580 },
  { id: 'mcd-mcflurry', name: "McDonald's McFlurry Oreo", calories: 510, protein: 12, carbs: 80, fat: 17, sodium: 280 },

  // Burger King
  { id: 'bk-whopper', name: 'Burger King Whopper', calories: 677, protein: 28, carbs: 49, fat: 40, sodium: 980 },
  { id: 'bk-chicken', name: 'Burger King Chicken Sandwich', calories: 660, protein: 28, carbs: 48, fat: 40, sodium: 1170 },
  { id: 'bk-onion-rings', name: 'Burger King Onion Rings', calories: 410, protein: 5, carbs: 47, fat: 22, sodium: 840 },

  // Wendy's
  { id: 'wendys-baconator', name: "Wendy's Baconator", calories: 950, protein: 57, carbs: 38, fat: 62, sodium: 1810 },
  { id: 'wendys-spicy', name: "Wendy's Spicy Chicken", calories: 500, protein: 29, carbs: 47, fat: 20, sodium: 1370 },
  { id: 'wendys-frosty', name: "Wendy's Chocolate Frosty", calories: 350, protein: 9, carbs: 56, fat: 9, sodium: 200 },
  { id: 'wendys-nuggets', name: "Wendy's 10pc Nuggets", calories: 450, protein: 21, carbs: 27, fat: 29, sodium: 1040 },

  // Subway
  { id: 'subway-italian', name: 'Subway Italian BMT 6"', calories: 410, protein: 20, carbs: 44, fat: 18, sodium: 1260 },
  { id: 'subway-turkey', name: 'Subway Turkey Breast 6"', calories: 280, protein: 18, carbs: 45, fat: 4, sodium: 760 },
  { id: 'subway-meatball', name: 'Subway Meatball 6"', calories: 480, protein: 22, carbs: 52, fat: 20, sodium: 1020 },
  { id: 'subway-veggie', name: 'Subway Veggie Delite 6"', calories: 230, protein: 9, carbs: 44, fat: 3, sodium: 310 },

  // Taco Bell
  { id: 'tb-crunchy', name: 'Taco Bell Crunchy Taco', calories: 170, protein: 8, carbs: 13, fat: 10, sodium: 310 },
  { id: 'tb-burrito', name: 'Taco Bell Bean Burrito', calories: 380, protein: 14, carbs: 55, fat: 11, sodium: 1080 },
  { id: 'tb-chalupa', name: 'Taco Bell Chalupa Supreme', calories: 350, protein: 14, carbs: 30, fat: 20, sodium: 560 },
  { id: 'tb-nachos', name: 'Taco Bell Nachos BellGrande', calories: 740, protein: 16, carbs: 82, fat: 38, sodium: 1050 },

  // Chick-fil-A
  { id: 'cfa-sandwich', name: 'Chick-fil-A Sandwich', calories: 440, protein: 29, carbs: 40, fat: 19, sodium: 1400 },
  { id: 'cfa-nuggets-12', name: 'Chick-fil-A 12pc Nuggets', calories: 380, protein: 40, carbs: 13, fat: 17, sodium: 1680 },
  { id: 'cfa-waffle-fries', name: 'Chick-fil-A Waffle Fries', calories: 420, protein: 5, carbs: 45, fat: 24, sodium: 240 },

  // Pizza (per slice)
  { id: 'pizza-pepperoni', name: 'Pepperoni Pizza Slice', calories: 300, protein: 13, carbs: 34, fat: 12, sodium: 680 },
  { id: 'pizza-cheese', name: 'Cheese Pizza Slice', calories: 272, protein: 12, carbs: 34, fat: 10, sodium: 551 },
  { id: 'pizza-supreme', name: 'Supreme Pizza Slice', calories: 320, protein: 14, carbs: 35, fat: 14, sodium: 760 },

  // KFC
  { id: 'kfc-breast', name: 'KFC Original Chicken Breast', calories: 390, protein: 39, carbs: 11, fat: 21, sodium: 1190 },
  { id: 'kfc-popcorn', name: 'KFC Popcorn Chicken', calories: 400, protein: 20, carbs: 23, fat: 26, sodium: 1160 },
  { id: 'kfc-mashed', name: 'KFC Mashed Potatoes & Gravy', calories: 130, protein: 2, carbs: 18, fat: 5, sodium: 530 },

  // Drinks
  { id: 'drink-coke', name: 'Coca-Cola (Medium)', calories: 210, protein: 0, carbs: 58, fat: 0, sodium: 45 },
  { id: 'drink-sprite', name: 'Sprite (Medium)', calories: 200, protein: 0, carbs: 54, fat: 0, sodium: 40 },
  { id: 'drink-coffee', name: 'Coffee (Black, 16oz)', calories: 5, protein: 0, carbs: 1, fat: 0, sodium: 5 },
  { id: 'drink-latte', name: 'Latte (16oz)', calories: 190, protein: 13, carbs: 18, fat: 7, sodium: 170 },
  { id: 'drink-smoothie', name: 'Fruit Smoothie (Medium)', calories: 280, protein: 4, carbs: 62, fat: 1, sodium: 45 },

  // Breakfast
  { id: 'mcd-mcmuffin', name: "McDonald's Egg McMuffin", calories: 300, protein: 17, carbs: 30, fat: 13, sodium: 820 },
  { id: 'mcd-hotcakes', name: "McDonald's Hotcakes", calories: 580, protein: 9, carbs: 102, fat: 15, sodium: 600 },
  { id: 'sb-croissant', name: 'Starbucks Butter Croissant', calories: 260, protein: 5, carbs: 32, fat: 13, sodium: 280 },
  { id: 'dd-donut', name: 'Dunkin Glazed Donut', calories: 260, protein: 3, carbs: 31, fat: 14, sodium: 340 },

  // Sides & Snacks
  { id: 'side-chips', name: 'Bag of Chips (1oz)', calories: 150, protein: 2, carbs: 15, fat: 10, sodium: 180 },
  { id: 'side-cookie', name: 'Chocolate Chip Cookie', calories: 220, protein: 2, carbs: 30, fat: 11, sodium: 160 },
  { id: 'side-mozzsticks', name: 'Mozzarella Sticks (6pc)', calories: 480, protein: 22, carbs: 36, fat: 28, sodium: 1280 },
];

export const commonFoods: FoodItem[] = [
  // Healthy options
  { id: 'healthy-salad', name: 'Garden Salad (no dressing)', calories: 35, protein: 2, carbs: 7, fat: 0, fiber: 3, sodium: 25 },
  { id: 'healthy-chicken', name: 'Grilled Chicken Breast', calories: 165, protein: 31, carbs: 0, fat: 4, sodium: 70 },
  { id: 'healthy-salmon', name: 'Grilled Salmon (6oz)', calories: 350, protein: 38, carbs: 0, fat: 21, sodium: 110 },
  { id: 'healthy-rice', name: 'Brown Rice (1 cup)', calories: 216, protein: 5, carbs: 45, fat: 2, fiber: 4, sodium: 10 },
  { id: 'healthy-banana', name: 'Banana', calories: 105, protein: 1, carbs: 27, fat: 0, fiber: 3, sodium: 1 },
  { id: 'healthy-apple', name: 'Apple', calories: 95, protein: 0, carbs: 25, fat: 0, fiber: 4, sodium: 2 },
  { id: 'healthy-eggs', name: 'Eggs (2 large)', calories: 140, protein: 12, carbs: 1, fat: 10, sodium: 140 },
  { id: 'healthy-oatmeal', name: 'Oatmeal (1 cup)', calories: 150, protein: 5, carbs: 27, fat: 3, fiber: 4, sodium: 0 },
  { id: 'healthy-yogurt', name: 'Greek Yogurt (1 cup)', calories: 130, protein: 17, carbs: 8, fat: 4, sodium: 65 },
  { id: 'healthy-almonds', name: 'Almonds (1oz)', calories: 164, protein: 6, carbs: 6, fat: 14, fiber: 4, sodium: 0 },
];

export const allFoods = [...fastFoodDatabase, ...commonFoods];
