export enum ProductCategory {
  BEVERAGES = 'BEVERAGES',
  SNACKS = 'SNACKS',
  FRESH_PRODUCE = 'FRESH_PRODUCE',
  DAIRY_COLD = 'DAIRY_COLD',
  PANTRY = 'PANTRY',
  CLEANING = 'CLEANING',
}

export enum ShelfType {
  STANDARD_RACK = 'STANDARD_RACK',
  REFRIGERATOR = 'REFRIGERATOR',
  PRODUCE_DISPLAY = 'PRODUCE_DISPLAY',
}

export interface ProductLicense {
  id: string;
  name: string;
  cost: number;
  unlocked: boolean;
  description: string;
  categories: ProductCategory[];
}

export interface ProductItem {
  id: string;
  name: string;
  category: ProductCategory;
  wholesaleCost: number;
  recommendedPrice: number;
  currentPrice: number;
  color: string;
  shape: 'box' | 'carton' | 'can' | 'fruit' | 'bottle' | 'bag';
  boxQuantity: number; // Number of items in 1 delivery box
  description: string;
  licenseRequired?: string;
  priceChangeTrend?: 'up' | 'down' | 'stable';
  priceChangeAmount?: number;
}

export interface ShelfSlot {
  shelfId: string;
  tierIndex: number;
  slotIndex: number;
  productId: string | null;
  count: number; // Max items per slot (e.g. 8)
  maxCapacity: number;
}

export interface ShelfData {
  id: string;
  type: ShelfType;
  position: [number, number, number];
  rotation: number; // in radians
  slots: ShelfSlot[];
}

export interface StockBoxData {
  id: string;
  productId: string;
  count: number;
  position: [number, number, number];
  isHeldByPlayer: boolean;
}

export enum CustomerState {
  ENTERING = 'ENTERING',
  BROWSING = 'BROWSING',
  CONSIDERING = 'CONSIDERING',
  PICKING = 'PICKING',
  WAITING_FOR_REGISTER = 'WAITING_FOR_REGISTER',
  AT_REGISTER = 'AT_REGISTER',
  LEAVING = 'LEAVING',
}

export interface CustomerCartItem {
  productId: string;
  pricePaid: number;
  quantity: number;
}

export interface CustomerData {
  id: string;
  name: string;
  avatarColor: string;
  position: [number, number, number];
  targetPosition: [number, number, number];
  state: CustomerState;
  cart: CustomerCartItem[];
  shoppingList: string[]; // product IDs wanted
  mood: 'happy' | 'neutral' | 'annoyed' | 'angry';
  patience: number; // 0 - 100
  thought: string;
  paymentMethod: 'cash' | 'card';
  cashGiven?: number;
}

export interface FinancialRecord {
  day: number;
  revenue: number;
  expenses: number;
  profit: number;
  itemsSold: number;
  customersServed: number;
  reputationChange: number;
}

export interface TodayStats {
  revenue: number;
  wholesaleExpenses: number;
  staffWages: number;
  rentUtilities: number;
  itemsSold: number;
  customersServed: number;
  happyCustomers: number;
  reputationGain: number;
}

export interface StaffData {
  id: string;
  role: 'cashier' | 'restocker';
  name: string;
  dailySalary: number;
  hired: boolean;
  efficiency: number;
}

export interface GameState {
  day: number;
  timeOfDay: string; // "09:00", "14:30"
  cash: number;
  reputation: number; // 0 to 100
  storeName: string;
  storeLevel: number;
  exp: number;
  nextLevelExp: number;
  isStoreOpen: boolean; // OPEN / CLOSED door sign
  unlockedStorage: boolean; // 倉庫バックルーム拡張
  unlockedLicenses: string[]; // Licensed product categories
  shelves: ShelfData[];
  stockBoxes: StockBoxData[];
  customers: CustomerData[];
  financialHistory: FinancialRecord[];
  todayStats: TodayStats;
  showDaySummaryModal: boolean;
  staff: StaffData[];
  heldBoxId: string | null;
  selectedTool: 'hand' | 'scanner' | 'box';
  cameraMode: 'first_person' | 'overhead';
  isRegisterActive: boolean;
  activeCheckoutCustomer: CustomerData | null;
}
