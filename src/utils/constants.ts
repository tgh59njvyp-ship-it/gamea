import { ProductCategory, ProductItem, ProductLicense, ShelfType, ShelfData, StaffData } from '../types/game';

export const INITIAL_LICENSES: ProductLicense[] = [
  {
    id: 'license_starter',
    name: '基本スターター ライセンス',
    cost: 0,
    unlocked: true,
    description: '基本飲料・スナックの販売権利 (無料)',
    categories: [ProductCategory.BEVERAGES, ProductCategory.SNACKS],
  },
  {
    id: 'license_fresh',
    name: '生鮮食品・果物 ライセンス',
    cost: 1500,
    unlocked: true,
    description: '新鮮なフルーツや精肉類の取扱許可',
    categories: [ProductCategory.FRESH_PRODUCE],
  },
  {
    id: 'license_cold',
    name: '乳製品・チルド飲料 ライセンス',
    cost: 2500,
    unlocked: false,
    description: '冷蔵が必要な牛乳・乳製品の販売許可',
    categories: [ProductCategory.DAIRY_COLD],
  },
  {
    id: 'license_pantry',
    name: '食品・インスタント ライセンス',
    cost: 4000,
    unlocked: false,
    description: 'シリアル・カップ麺などの加工食品取扱許可',
    categories: [ProductCategory.PANTRY],
  },
  {
    id: 'license_cleaning',
    name: '日用品・洗剤 ライセンス',
    cost: 6000,
    unlocked: false,
    description: '洗剤・日用雑貨の仕入れ販売許可',
    categories: [ProductCategory.CLEANING],
  },
];

export const INITIAL_PRODUCTS: ProductItem[] = [
  {
    id: 'prod_milk',
    name: '新鮮牛乳 1L',
    category: ProductCategory.DAIRY_COLD,
    wholesaleCost: 150,
    recommendedPrice: 220,
    currentPrice: 220,
    color: '#3b82f6', // blue carton
    shape: 'carton',
    boxQuantity: 6,
    description: '北海道産の濃厚なフレッシュミルク',
    licenseRequired: 'license_cold',
  },
  {
    id: 'prod_oj',
    name: '果汁100%オレンジ',
    category: ProductCategory.BEVERAGES,
    wholesaleCost: 130,
    recommendedPrice: 198,
    currentPrice: 198,
    color: '#f97316', // orange bottle
    shape: 'bottle',
    boxQuantity: 6,
    description: 'ビタミンCたっぷりの絞りたてオレンジジュース',
    licenseRequired: 'license_starter',
  },
  {
    id: 'prod_soda',
    name: 'スパークリングソーダ',
    category: ProductCategory.BEVERAGES,
    wholesaleCost: 80,
    recommendedPrice: 130,
    currentPrice: 130,
    color: '#06b6d4', // cyan can
    shape: 'can',
    boxQuantity: 12,
    description: '爽快な弾ける微炭酸飲料',
    licenseRequired: 'license_starter',
  },
  {
    id: 'prod_water',
    name: '富士の天然水 500ml',
    category: ProductCategory.BEVERAGES,
    wholesaleCost: 50,
    recommendedPrice: 100,
    currentPrice: 100,
    color: '#38bdf8', // light blue bottle
    shape: 'bottle',
    boxQuantity: 12,
    description: '澄んだおいしさのナチュラルミネラルウォーター',
    licenseRequired: 'license_starter',
  },
  {
    id: 'prod_chips',
    name: 'サクサクポテトチップス',
    category: ProductCategory.SNACKS,
    wholesaleCost: 90,
    recommendedPrice: 150,
    currentPrice: 150,
    color: '#eab308', // yellow bag
    shape: 'bag',
    boxQuantity: 8,
    description: '香ばしい塩味がクセになる人気スナック',
    licenseRequired: 'license_starter',
  },
  {
    id: 'prod_choco',
    name: 'プレミアムチョコバー',
    category: ProductCategory.SNACKS,
    wholesaleCost: 110,
    recommendedPrice: 180,
    currentPrice: 180,
    color: '#78350f', // brown box
    shape: 'box',
    boxQuantity: 10,
    description: 'カカオ70%使用の濃厚カカオチョコレート',
    licenseRequired: 'license_starter',
  },
  {
    id: 'prod_apple',
    name: '青森県産サンふじりんご',
    category: ProductCategory.FRESH_PRODUCE,
    wholesaleCost: 100,
    recommendedPrice: 160,
    currentPrice: 160,
    color: '#ef4444', // red fruit
    shape: 'fruit',
    boxQuantity: 8,
    description: 'シャキシャキ甘いジューシーなりんご',
    licenseRequired: 'license_fresh',
  },
  {
    id: 'prod_banana',
    name: '有機栽培プレミアムバナナ',
    category: ProductCategory.FRESH_PRODUCE,
    wholesaleCost: 120,
    recommendedPrice: 190,
    currentPrice: 190,
    color: '#facc15', // yellow fruit
    shape: 'fruit',
    boxQuantity: 6,
    description: 'もっちり甘く栄養満点のバナナ',
    licenseRequired: 'license_fresh',
  },
  {
    id: 'prod_meat',
    name: '国産黒毛和牛パック',
    category: ProductCategory.FRESH_PRODUCE,
    wholesaleCost: 500,
    recommendedPrice: 880,
    currentPrice: 880,
    color: '#dc2626', // red tray
    shape: 'box',
    boxQuantity: 4,
    description: 'きれいな霜降りの特選牛肉パック',
    licenseRequired: 'license_fresh',
  },
  {
    id: 'prod_cereal',
    name: 'サクサクフルーツグラノーラ',
    category: ProductCategory.PANTRY,
    wholesaleCost: 300,
    recommendedPrice: 480,
    currentPrice: 480,
    color: '#10b981', // green box
    shape: 'box',
    boxQuantity: 6,
    description: 'ドライフルーツ入りの朝食グラノーラ',
    licenseRequired: 'license_pantry',
  },
  {
    id: 'prod_ramen',
    name: '極旨とんこつカップ麺',
    category: ProductCategory.PANTRY,
    wholesaleCost: 120,
    recommendedPrice: 200,
    currentPrice: 200,
    color: '#f43f5e', // red cup
    shape: 'can',
    boxQuantity: 12,
    description: '濃厚なスープとコシのあるストレート麺',
    licenseRequired: 'license_pantry',
  },
  {
    id: 'prod_detergent',
    name: '強力除菌 酵素洗剤',
    category: ProductCategory.CLEANING,
    wholesaleCost: 250,
    recommendedPrice: 398,
    currentPrice: 398,
    color: '#8b5cf6', // purple bottle
    shape: 'bottle',
    boxQuantity: 6,
    description: '頑固な汚れも一発ですっきり落とす洗濯洗剤',
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
      { shelfId: 'shelf_1', tierIndex: 0, slotIndex: 0, productId: 'prod_chips', count: 6, maxCapacity: 8 },
      { shelfId: 'shelf_1', tierIndex: 0, slotIndex: 1, productId: 'prod_choco', count: 8, maxCapacity: 8 },
      { shelfId: 'shelf_1', tierIndex: 1, slotIndex: 0, productId: 'prod_cereal', count: 4, maxCapacity: 8 },
      { shelfId: 'shelf_1', tierIndex: 1, slotIndex: 1, productId: 'prod_ramen', count: 8, maxCapacity: 8 },
      { shelfId: 'shelf_1', tierIndex: 2, slotIndex: 0, productId: 'prod_detergent', count: 5, maxCapacity: 8 },
      { shelfId: 'shelf_1', tierIndex: 2, slotIndex: 1, productId: null, count: 0, maxCapacity: 8 },
    ],
  },
  {
    id: 'shelf_2',
    type: ShelfType.REFRIGERATOR,
    position: [2.5, 0, -1],
    rotation: 0,
    slots: [
      { shelfId: 'shelf_2', tierIndex: 0, slotIndex: 0, productId: 'prod_milk', count: 6, maxCapacity: 8 },
      { shelfId: 'shelf_2', tierIndex: 0, slotIndex: 1, productId: 'prod_oj', count: 6, maxCapacity: 8 },
      { shelfId: 'shelf_2', tierIndex: 1, slotIndex: 0, productId: 'prod_soda', count: 10, maxCapacity: 12 },
      { shelfId: 'shelf_2', tierIndex: 1, slotIndex: 1, productId: 'prod_water', count: 10, maxCapacity: 12 },
      { shelfId: 'shelf_2', tierIndex: 2, slotIndex: 0, productId: 'prod_meat', count: 4, maxCapacity: 6 },
      { shelfId: 'shelf_2', tierIndex: 2, slotIndex: 1, productId: null, count: 0, maxCapacity: 8 },
    ],
  },
  {
    id: 'shelf_3',
    type: ShelfType.PRODUCE_DISPLAY,
    position: [0, 0, -3.5],
    rotation: 0,
    slots: [
      { shelfId: 'shelf_3', tierIndex: 0, slotIndex: 0, productId: 'prod_apple', count: 6, maxCapacity: 8 },
      { shelfId: 'shelf_3', tierIndex: 0, slotIndex: 1, productId: 'prod_banana', count: 5, maxCapacity: 8 },
    ],
  },
];

export const INITIAL_STAFF: StaffData[] = [
  {
    id: 'staff_cashier_1',
    role: 'cashier',
    name: '田中 アオイ (レジ担当)',
    dailySalary: 3500,
    hired: false,
    efficiency: 1.0,
  },
  {
    id: 'staff_restocker_1',
    role: 'restocker',
    name: '佐藤 ケンタ (品出し担当)',
    dailySalary: 4000,
    hired: false,
    efficiency: 1.0,
  },
];

// Checkout Counter dimensions & position in 3D world
export const CHECKOUT_COUNTER_POSITION: [number, number, number] = [-1.5, 0, 2.5];
export const BACKROOM_TERMINAL_POSITION: [number, number, number] = [4, 0, 4.5];
export const ENTRANCE_POSITION: [number, number, number] = [0, 0, 6];
export const DELIVERY_DROP_POSITION: [number, number, number] = [3.5, 0.2, 5];
export const TRASH_BIN_POSITION: [number, number, number] = [4.5, 0, 3.2];
export const STORE_SIGN_POSITION: [number, number, number] = [0, 1.8, 5.8];

