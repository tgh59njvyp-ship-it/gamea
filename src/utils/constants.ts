import { ProductCategory, ProductItem, ProductLicense, ShelfType, ShelfData, StaffData } from '../types/game';

export const STORAGE_UNLOCK_COST = 800; // $800.00 for adjacent storage room

export const INITIAL_LICENSES: ProductLicense[] = [
  {
    id: 'license_starter',
    name: 'スターター ライセンス (グロサリー)',
    cost: 0,
    unlocked: true,
    description: '食パン・小麦粉・パスタ・シリアルなどの基本日常食品 (無料解禁)',
    categories: [ProductCategory.PANTRY, ProductCategory.SNACKS],
  },
  {
    id: 'license_beverages',
    name: 'ドリンク・飲料 ライセンス',
    cost: 100,
    unlocked: true,
    description: 'ウォーター・ミネラル・ジュース・缶コーラの仕入れ許可',
    categories: [ProductCategory.BEVERAGES],
  },
  {
    id: 'license_cold',
    name: '乳製品・チルド冷品 ライセンス',
    cost: 200,
    unlocked: false,
    description: '牛乳・チーズ・卵・バターの取扱許可',
    categories: [ProductCategory.DAIRY_COLD],
  },
  {
    id: 'license_fresh',
    name: '生鮮野菜・フルーツ ライセンス',
    cost: 400,
    unlocked: false,
    description: '新鮮なリンゴ・バナナ・精肉・野菜の仕入れ許可',
    categories: [ProductCategory.FRESH_PRODUCE],
  },
  {
    id: 'license_cleaning',
    name: '日用消耗品・洗剤 ライセンス',
    cost: 600,
    unlocked: false,
    description: '洗濯洗剤・ペーパー類・日用清掃用品の販売許可',
    categories: [ProductCategory.CLEANING],
  },
];

export const INITIAL_PRODUCTS: ProductItem[] = [
  {
    id: 'prod_bread',
    name: '食パン (Sliced Bread)',
    category: ProductCategory.PANTRY,
    wholesaleCost: 1.20,
    recommendedPrice: 2.50,
    currentPrice: 2.50,
    color: '#fbbf24', // golden bread box
    shape: 'box',
    boxQuantity: 12,
    description: 'ふんわり香ばしい毎日の定番食パン',
    licenseRequired: 'license_starter',
  },
  {
    id: 'prod_flour',
    name: '小麦粉 1kg (Pure Flour)',
    category: ProductCategory.PANTRY,
    wholesaleCost: 0.90,
    recommendedPrice: 1.80,
    currentPrice: 1.80,
    color: '#f1f5f9', // white bag/box
    shape: 'box',
    boxQuantity: 10,
    description: 'お菓子や料理に使える高級薄力小麦粉',
    licenseRequired: 'license_starter',
  },
  {
    id: 'prod_spaghetti',
    name: 'スパゲッティ (Spaghetti)',
    category: ProductCategory.PANTRY,
    wholesaleCost: 1.50,
    recommendedPrice: 3.00,
    currentPrice: 3.00,
    color: '#eab308', // yellow box
    shape: 'box',
    boxQuantity: 12,
    description: 'デュラムセモリナ100%本格ロングパスタ',
    licenseRequired: 'license_starter',
  },
  {
    id: 'prod_cereal',
    name: 'チョコシリアル (Choco Flakes)',
    category: ProductCategory.PANTRY,
    wholesaleCost: 2.20,
    recommendedPrice: 4.50,
    currentPrice: 4.50,
    color: '#78350f', // brown box
    shape: 'box',
    boxQuantity: 8,
    description: '栄養たっぷりの朝食サクサクチョコフレーク',
    licenseRequired: 'license_starter',
  },
  {
    id: 'prod_sugar',
    name: '粉砂糖 (Powdered Sugar)',
    category: ProductCategory.PANTRY,
    wholesaleCost: 1.10,
    recommendedPrice: 2.20,
    currentPrice: 2.20,
    color: '#e2e8f0', // white box
    shape: 'box',
    boxQuantity: 10,
    description: 'サラサラ使いやすい製菓・調理用砂糖',
    licenseRequired: 'license_starter',
  },
  {
    id: 'prod_tea',
    name: '紅茶パック (Black Tea)',
    category: ProductCategory.PANTRY,
    wholesaleCost: 1.80,
    recommendedPrice: 3.80,
    currentPrice: 3.80,
    color: '#b45309', // amber tea box
    shape: 'box',
    boxQuantity: 12,
    description: '芳醇な香りのイングリッシュブレックファストティー',
    licenseRequired: 'license_starter',
  },
  {
    id: 'prod_oil',
    name: 'サンフラワー油 (Sunflower Oil)',
    category: ProductCategory.PANTRY,
    wholesaleCost: 2.50,
    recommendedPrice: 5.00,
    currentPrice: 5.00,
    color: '#facc15', // yellow bottle
    shape: 'bottle',
    boxQuantity: 6,
    description: 'クセがなく使いやすいサラサラひまわり油',
    licenseRequired: 'license_starter',
  },
  {
    id: 'prod_rice',
    name: 'プレミアム米 2kg (Basmati Rice)',
    category: ProductCategory.PANTRY,
    wholesaleCost: 3.00,
    recommendedPrice: 6.00,
    currentPrice: 6.00,
    color: '#22c55e', // green bag
    shape: 'bag',
    boxQuantity: 6,
    description: 'ツヤと粘りがある美味しいライスパック',
    licenseRequired: 'license_starter',
  },
  {
    id: 'prod_water',
    name: 'ミネラルウォーター 500ml',
    category: ProductCategory.BEVERAGES,
    wholesaleCost: 0.50,
    recommendedPrice: 1.20,
    currentPrice: 1.20,
    color: '#38bdf8', // light blue bottle
    shape: 'bottle',
    boxQuantity: 12,
    description: 'すっきりクリアな天然水ボトル',
    licenseRequired: 'license_beverages',
  },
  {
    id: 'prod_soda',
    name: 'スパークリングコーラ 350ml',
    category: ProductCategory.BEVERAGES,
    wholesaleCost: 0.80,
    recommendedPrice: 1.80,
    currentPrice: 1.80,
    color: '#ef4444', // red soda can
    shape: 'can',
    boxQuantity: 12,
    description: '弾ける強炭酸の炭酸飲料',
    licenseRequired: 'license_beverages',
  },
  {
    id: 'prod_milk',
    name: 'フレッシュ牛乳 1L',
    category: ProductCategory.DAIRY_COLD,
    wholesaleCost: 1.50,
    recommendedPrice: 3.00,
    currentPrice: 3.00,
    color: '#3b82f6', // blue carton
    shape: 'carton',
    boxQuantity: 6,
    description: '濃厚な味わいの新鮮パックミルク',
    licenseRequired: 'license_cold',
  },
  {
    id: 'prod_cheese',
    name: 'スライスチーズ (Cheese)',
    category: ProductCategory.DAIRY_COLD,
    wholesaleCost: 2.80,
    recommendedPrice: 5.50,
    currentPrice: 5.50,
    color: '#f59e0b', // amber box
    shape: 'box',
    boxQuantity: 8,
    description: 'トーストにぴったりのとろけるチーズ',
    licenseRequired: 'license_cold',
  },
  {
    id: 'prod_apple',
    name: '採れたてりんご (Apples)',
    category: ProductCategory.FRESH_PRODUCE,
    wholesaleCost: 1.00,
    recommendedPrice: 2.00,
    currentPrice: 2.00,
    color: '#f43f5e', // red fruit
    shape: 'fruit',
    boxQuantity: 8,
    description: 'シャキシャキジューシーな赤りんご',
    licenseRequired: 'license_fresh',
  },
  {
    id: 'prod_banana',
    name: '有機栽培バナナ (Bananas)',
    category: ProductCategory.FRESH_PRODUCE,
    wholesaleCost: 0.80,
    recommendedPrice: 1.60,
    currentPrice: 1.60,
    color: '#facc15', // yellow fruit
    shape: 'fruit',
    boxQuantity: 6,
    description: '甘く熟した美味しいバナナ',
    licenseRequired: 'license_fresh',
  },
  {
    id: 'prod_detergent',
    name: 'コンパクト洗剤 (Detergent)',
    category: ProductCategory.CLEANING,
    wholesaleCost: 3.50,
    recommendedPrice: 7.00,
    currentPrice: 7.00,
    color: '#8b5cf6', // purple bottle
    shape: 'bottle',
    boxQuantity: 6,
    description: '汚れを強力分解する液体洗濯洗剤',
    licenseRequired: 'license_cleaning',
  },
];

export const INITIAL_SHELVES: ShelfData[] = [
  {
    id: 'shelf_1',
    type: ShelfType.STANDARD_RACK,
    position: [-2.5, 0, -1],
    rotation: 0,
    slots: [
      { shelfId: 'shelf_1', tierIndex: 0, slotIndex: 0, productId: 'prod_bread', count: 6, maxCapacity: 8 },
      { shelfId: 'shelf_1', tierIndex: 0, slotIndex: 1, productId: 'prod_flour', count: 8, maxCapacity: 8 },
      { shelfId: 'shelf_1', tierIndex: 1, slotIndex: 0, productId: 'prod_spaghetti', count: 6, maxCapacity: 8 },
      { shelfId: 'shelf_1', tierIndex: 1, slotIndex: 1, productId: 'prod_cereal', count: 5, maxCapacity: 8 },
      { shelfId: 'shelf_1', tierIndex: 2, slotIndex: 0, productId: 'prod_sugar', count: 6, maxCapacity: 8 },
      { shelfId: 'shelf_1', tierIndex: 2, slotIndex: 1, productId: 'prod_tea', count: 6, maxCapacity: 8 },
    ],
  },
  {
    id: 'shelf_2',
    type: ShelfType.STANDARD_RACK,
    position: [2.5, 0, -1],
    rotation: 0,
    slots: [
      { shelfId: 'shelf_2', tierIndex: 0, slotIndex: 0, productId: 'prod_oil', count: 4, maxCapacity: 8 },
      { shelfId: 'shelf_2', tierIndex: 0, slotIndex: 1, productId: 'prod_rice', count: 4, maxCapacity: 8 },
      { shelfId: 'shelf_2', tierIndex: 1, slotIndex: 0, productId: 'prod_water', count: 8, maxCapacity: 12 },
      { shelfId: 'shelf_2', tierIndex: 1, slotIndex: 1, productId: 'prod_soda', count: 8, maxCapacity: 12 },
      { shelfId: 'shelf_2', tierIndex: 2, slotIndex: 0, productId: null, count: 0, maxCapacity: 8 },
      { shelfId: 'shelf_2', tierIndex: 2, slotIndex: 1, productId: null, count: 0, maxCapacity: 8 },
    ],
  },
];

export const INITIAL_STAFF: StaffData[] = [
  {
    id: 'staff_cashier_1',
    role: 'cashier',
    name: '田中 アオイ (レジ担当)',
    dailySalary: 50,
    hired: false,
    efficiency: 1.0,
  },
  {
    id: 'staff_restocker_1',
    role: 'restocker',
    name: '佐藤 ケンタ (品出し担当)',
    dailySalary: 60,
    hired: false,
    efficiency: 1.0,
  },
];

// Initial 3D World Positions
export const DEFAULT_CHECKOUT_POSITION: [number, number, number] = [-1.5, 0, 2.5];
export const BACKROOM_TERMINAL_POSITION: [number, number, number] = [4, 0, 4.5];
export const ENTRANCE_POSITION: [number, number, number] = [0, 0, 6];
export const EXTERIOR_CAMERA_POSITION: [number, number, number] = [0, 2.8, 12];
export const DELIVERY_DROP_POSITION: [number, number, number] = [3.5, 0.2, 5];
export const TRASH_BIN_POSITION: [number, number, number] = [4.5, 0, 3.2];
export const STORE_SIGN_POSITION: [number, number, number] = [0, 2.2, 5.8];
export const STORAGE_ROOM_POSITION: [number, number, number] = [7.5, 0, -1]; // 隣の倉庫


