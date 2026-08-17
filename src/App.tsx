/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef } from 'react';
import confetti from 'canvas-confetti';
import {
  GameState,
  ProductItem,
  ShelfData,
  ShelfType,
  CustomerData,
  CustomerState,
  StockBoxData,
} from './types/game';
import {
  INITIAL_PRODUCTS,
  INITIAL_SHELVES,
  INITIAL_STAFF,
  DEFAULT_CHECKOUT_POSITION,
  DELIVERY_DROP_POSITION,
} from './utils/constants';
import { soundManager } from './utils/audio';

import { SupermarketCanvas } from './components/3d/SupermarketCanvas';
import { HUD } from './components/ui/HUD';
import { CheckoutInterface } from './components/ui/CheckoutInterface';
import { StoreComputerModal } from './components/ui/StoreComputerModal';
import { DaySummaryModal } from './components/ui/DaySummaryModal';
import { OnboardingModal } from './components/ui/OnboardingModal';
import { LayoutEditModal } from './components/ui/LayoutEditModal';

export default function App() {
  // Initialize Products Map
  const [productsMap, setProductsMap] = useState<Map<string, ProductItem>>(() => {
    const map = new Map<string, ProductItem>();
    INITIAL_PRODUCTS.forEach((p) => map.set(p.id, p));
    return map;
  });

  // Game State
  const [gameState, setGameState] = useState<GameState>(() => {
    const saved = localStorage.getItem('supermarket_sim_state');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        return {
          ...parsed,
          storeName: parsed.storeName ?? 'MY SUPERMARKET',
          storeSignColor: parsed.storeSignColor ?? '#0284c7',
          isStoreNameConfigured: parsed.isStoreNameConfigured ?? false,
          isEditLayoutMode: false,
          checkoutPosition: parsed.checkoutPosition ?? [-0.8, 0, 2.5],
          checkoutRotation: parsed.checkoutRotation ?? 0,
          isStoreOpen: parsed.isStoreOpen ?? false,
          unlockedLicenses: parsed.unlockedLicenses ?? ['license_starter', 'license_fresh'],
          unlockedStorage: parsed.unlockedStorage ?? false,
          todayStats: parsed.todayStats ?? {
            revenue: 0,
            wholesaleExpenses: 0,
            staffWages: 0,
            rentUtilities: 50,
            itemsSold: 0,
            customersServed: 0,
            happyCustomers: 0,
            reputationGain: 0,
          },
          showDaySummaryModal: parsed.showDaySummaryModal ?? false,
        };
      } catch (e) {
        console.error('Failed to load save state:', e);
      }
    }

    return {
      day: 1,
      timeOfDay: '09:00',
      cash: 500.0,
      reputation: 75,
      storeName: 'MY SUPERMARKET',
      storeSignColor: '#0284c7',
      isStoreNameConfigured: false,
      isEditLayoutMode: false,
      checkoutPosition: [-0.8, 0, 2.5],
      checkoutRotation: 0,
      storeLevel: 1,
      exp: 0,
      nextLevelExp: 100,
      isStoreOpen: false,
      unlockedStorage: false,
      unlockedLicenses: ['license_starter', 'license_fresh'],
      shelves: INITIAL_SHELVES,
      stockBoxes: [
        {
          id: 'box_init_1',
          productId: 'prod_bread',
          count: 10,
          position: [3.2, 0.2, 4.5],
          isHeldByPlayer: false,
        },
      ],
      customers: [],
      financialHistory: [],
      todayStats: {
        revenue: 0,
        wholesaleExpenses: 0,
        staffWages: 0,
        rentUtilities: 50,
        itemsSold: 0,
        customersServed: 0,
        happyCustomers: 0,
        reputationGain: 0,
      },
      showDaySummaryModal: false,
      staff: INITIAL_STAFF,
      heldBoxId: null,
      selectedTool: 'hand',
      cameraMode: 'first_person',
      isRegisterActive: false,
      activeCheckoutCustomer: null,
    };
  });

  // Sound Muted State
  const [isMuted, setIsMuted] = useState<boolean>(false);

  // Modals & Register State
  const [isRegisterModalOpen, setIsRegisterModalOpen] = useState<boolean>(false);
  const [isLaptopModalOpen, setIsLaptopModalOpen] = useState<boolean>(false);
  const [scannedItemIndex, setScannedItemIndex] = useState<number>(0);

  // Handle Onboarding Name Completion
  const handleCompleteOnboarding = (storeName: string, signColor: string) => {
    setGameState((prev) => ({
      ...prev,
      storeName,
      storeSignColor: signColor,
      isStoreNameConfigured: true,
    }));
  };

  // Layout Editing Register Move & Rotate
  const handleToggleLayoutEdit = () => {
    soundManager.playDoorChime();
    setGameState((prev) => ({
      ...prev,
      isEditLayoutMode: !prev.isEditLayoutMode,
    }));
  };

  const handleMoveRegister = (dx: number, dz: number) => {
    setGameState((prev) => {
      const [x, y, z] = prev.checkoutPosition;
      return {
        ...prev,
        checkoutPosition: [
          Math.max(-4, Math.min(4, x + dx)),
          y,
          Math.max(-2, Math.min(6, z + dz)),
        ],
      };
    });
  };

  const handleRotateRegister = () => {
    setGameState((prev) => ({
      ...prev,
      checkoutRotation: (prev.checkoutRotation + Math.PI / 2) % (Math.PI * 2),
    }));
  };

  const handleResetRegisterPosition = () => {
    setGameState((prev) => ({
      ...prev,
      checkoutPosition: [-0.8, 0, 2.5],
      checkoutRotation: 0,
    }));
  };

  // Save game state locally
  useEffect(() => {
    localStorage.setItem('supermarket_sim_state', JSON.stringify(gameState));
  }, [gameState]);

  // Handle Level Up Check
  const addExp = (amount: number) => {
    setGameState((prev) => {
      let newExp = prev.exp + amount;
      let newLevel = prev.storeLevel;
      let nextExp = prev.nextLevelExp;

      if (newExp >= nextExp) {
        newLevel += 1;
        newExp = newExp - nextExp;
        nextExp = Math.round(nextExp * 1.5);

        soundManager.playLevelUp();
        confetti({
          particleCount: 80,
          spread: 70,
          origin: { y: 0.6 },
        });
      }

      return {
        ...prev,
        storeLevel: newLevel,
        exp: newExp,
        nextLevelExp: nextExp,
      };
    });
  };

  // Customer Spawner & AI Movement Loop
  useEffect(() => {
    const interval = setInterval(() => {
      setGameState((prev) => {
        // Only spawn customers if the store sign is set to OPEN!
        if (!prev.isStoreOpen) return prev;

        // Limit active customers to 6 max
        if (prev.customers.length >= 6) return prev;

        const customerNames = ['山田 さくら', '佐藤 拓也', '鈴木 恵美', '高橋 健太', '伊藤 葵', '渡辺 蓮'];
        const avatarColors = ['#ef4444', '#3b82f6', '#10b981', '#f59e0b', '#8b5cf6', '#ec4899'];

        const randomName = customerNames[Math.floor(Math.random() * customerNames.length)];
        const randomColor = avatarColors[Math.floor(Math.random() * avatarColors.length)];

        // Random products wanted
        const allProds: string[] = Array.from(productsMap.keys());
        const wanted: string[] = [
          allProds[Math.floor(Math.random() * allProds.length)],
          allProds[Math.floor(Math.random() * allProds.length)],
        ];

        const newCustomer: CustomerData = {
          id: `cust_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
          name: randomName,
          avatarColor: randomColor,
          position: [0, 0, 7], // Spawn outside entrance
          targetPosition: [-2, 0, -1], // Move to shelf
          state: CustomerState.ENTERING,
          cart: [],
          shoppingList: wanted,
          mood: 'happy',
          patience: 100,
          thought: 'いらっしゃいませ！お店に入ります',
          paymentMethod: Math.random() > 0.4 ? 'cash' : 'card',
        };

        // Simulate customer picking products from shelf into cart
        const updatedCart = wanted.map((pId) => {
          const p = productsMap.get(pId);
          const price = p ? p.currentPrice : 200;
          return { productId: pId, pricePaid: price, quantity: 1 };
        });

        newCustomer.cart = updatedCart;
        newCustomer.state = CustomerState.WAITING_FOR_REGISTER;
        newCustomer.position = [-0.8, 0, 2.5]; // Stand at checkout counter

        soundManager.playDoorChime();

        return {
          ...prev,
          customers: [...prev.customers, newCustomer],
        };
      });
    }, 7000);

    return () => clearInterval(interval);
  }, [productsMap]);

  // Toggle Store Open Sign
  const handleToggleStoreOpen = () => {
    setGameState((prev) => ({
      ...prev,
      isStoreOpen: !prev.isStoreOpen,
    }));
  };

  // Trash Empty Cardboard Box
  const handleTrashBox = () => {
    if (!gameState.heldBoxId) return;

    soundManager.playBoxThud();
    setGameState((prev) => ({
      ...prev,
      stockBoxes: prev.stockBoxes.filter((b) => b.id !== prev.heldBoxId),
      heldBoxId: null,
    }));
  };

  // Interaction Handlers
  const handleToggleCamera = () => {
    setGameState((prev) => ({
      ...prev,
      cameraMode: prev.cameraMode === 'first_person' ? 'overhead' : 'first_person',
    }));
  };

  const handleToggleSound = () => {
    const newMuted = !isMuted;
    setIsMuted(newMuted);
    soundManager.setMuted(newMuted);
  };

  // Stock Shelf Slot Click Handler
  const handleSlotClick = (shelfId: string, tierIndex: number, slotIndex: number) => {
    if (!gameState.heldBoxId) return;

    // Find held box
    const heldBox = gameState.stockBoxes.find((b) => b.id === gameState.heldBoxId);
    if (!heldBox) return;

    setGameState((prev) => {
      const updatedShelves = prev.shelves.map((s) => {
        if (s.id !== shelfId) return s;

        const updatedSlots = s.slots.map((slot) => {
          if (slot.tierIndex === tierIndex && slot.slotIndex === slotIndex) {
            return {
              ...slot,
              productId: heldBox.productId,
              count: Math.min(slot.maxCapacity, slot.count + heldBox.count),
            };
          }
          return slot;
        });

        return { ...s, slots: updatedSlots };
      });

      // Remove consumed box
      const updatedBoxes = prev.stockBoxes.filter((b) => b.id !== gameState.heldBoxId);

      return {
        ...prev,
        shelves: updatedShelves,
        stockBoxes: updatedBoxes,
        heldBoxId: null,
      };
    });

    addExp(15);
  };

  // Pick up Stock Box
  const handleBoxClick = (boxId: string) => {
    if (gameState.heldBoxId) return;

    setGameState((prev) => ({
      ...prev,
      heldBoxId: boxId,
      stockBoxes: prev.stockBoxes.map((b) =>
        b.id === boxId ? { ...b, isHeldByPlayer: true } : b
      ),
    }));
  };

  const handleDropBox = () => {
    if (!gameState.heldBoxId) return;

    setGameState((prev) => ({
      ...prev,
      heldBoxId: null,
      stockBoxes: prev.stockBoxes.map((b) =>
        b.id === prev.heldBoxId
          ? { ...b, isHeldByPlayer: false, position: [0, 0.2, 3] }
          : b
      ),
    }));
  };

  // Register Cashier Handlers
  const handleOpenRegister = () => {
    const waitingCustomer = gameState.customers.find(
      (c) => c.state === CustomerState.WAITING_FOR_REGISTER || c.state === CustomerState.AT_REGISTER
    );

    setGameState((prev) => ({
      ...prev,
      activeCheckoutCustomer: waitingCustomer || null,
    }));
    setScannedItemIndex(0);
    setIsRegisterModalOpen(true);
  };

  const handleScanNextItem = () => {
    setScannedItemIndex((prev) => prev + 1);
  };

  const handleCompleteCheckout = (amountCollected: number, changeGiven: number) => {
    const activeCustomer = gameState.activeCheckoutCustomer;
    if (!activeCustomer) return;

    const totalEarned = activeCustomer.cart.reduce((s, i) => s + i.pricePaid * i.quantity, 0);
    const itemQuantity = activeCustomer.cart.reduce((s, i) => s + i.quantity, 0);

    setGameState((prev) => {
      // Remove served customer
      const remainingCustomers = prev.customers.filter((c) => c.id !== activeCustomer.id);

      return {
        ...prev,
        cash: prev.cash + totalEarned,
        reputation: Math.min(100, prev.reputation + 2),
        customers: remainingCustomers,
        activeCheckoutCustomer: null,
        todayStats: {
          ...prev.todayStats,
          revenue: prev.todayStats.revenue + totalEarned,
          itemsSold: prev.todayStats.itemsSold + itemQuantity,
          customersServed: prev.todayStats.customersServed + 1,
          happyCustomers: prev.todayStats.happyCustomers + 1,
        },
      };
    });

    addExp(25);
    setIsRegisterModalOpen(false);
  };

  // Laptop Ordering & Upgrades
  const handleOpenLaptop = () => {
    setIsLaptopModalOpen(true);
  };

  const handleOrderStockBox = (productId: string) => {
    const product = productsMap.get(productId);
    if (!product) return;

    const boxCost = product.wholesaleCost * product.boxQuantity;
    if (gameState.cash < boxCost) return;

    setGameState((prev) => {
      const newBox: StockBoxData = {
        id: `box_${Date.now()}`,
        productId,
        count: product.boxQuantity,
        position: [
          DELIVERY_DROP_POSITION[0] + (Math.random() - 0.5) * 0.5,
          0.2,
          DELIVERY_DROP_POSITION[2] + (Math.random() - 0.5) * 0.5,
        ],
        isHeldByPlayer: false,
      };

      return {
        ...prev,
        cash: prev.cash - boxCost,
        stockBoxes: [...prev.stockBoxes, newBox],
        todayStats: {
          ...prev.todayStats,
          wholesaleExpenses: prev.todayStats.wholesaleExpenses + boxCost,
        },
      };
    });
  };

  const handleUpdatePrice = (productId: string, newPrice: number) => {
    setProductsMap((prev) => {
      const updated = new Map<string, ProductItem>(prev);
      const prod = updated.get(productId);
      if (prod) {
        updated.set(productId, { ...prod, currentPrice: newPrice });
      }
      return updated;
    });
  };

  const handleBuyShelf = (type: ShelfType) => {
    const cost = type === ShelfType.REFRIGERATOR ? 15000 : 8000;
    if (gameState.cash < cost) return;

    setGameState((prev) => {
      const newShelf: ShelfData = {
        id: `shelf_${Date.now()}`,
        type,
        position: [0, 0, -2],
        rotation: 0,
        slots: [
          { shelfId: `shelf_${Date.now()}`, tierIndex: 0, slotIndex: 0, productId: null, count: 0, maxCapacity: 8 },
          { shelfId: `shelf_${Date.now()}`, tierIndex: 0, slotIndex: 1, productId: null, count: 0, maxCapacity: 8 },
        ],
      };

      return {
        ...prev,
        cash: prev.cash - cost,
        shelves: [...prev.shelves, newShelf],
      };
    });
  };

  const handleHireStaff = (staffId: string) => {
    setGameState((prev) => ({
      ...prev,
      staff: prev.staff.map((s) => (s.id === staffId ? { ...s, hired: true } : s)),
    }));
  };

  const handleBuyLicense = (licenseId: string, cost: number) => {
    if (gameState.cash < cost) return;

    setGameState((prev) => ({
      ...prev,
      cash: prev.cash - cost,
      unlockedLicenses: [...prev.unlockedLicenses, licenseId],
    }));
  };

  const handleUnlockStorage = () => {
    if (gameState.cash < 800) return;

    setGameState((prev) => ({
      ...prev,
      cash: prev.cash - 800,
      unlockedStorage: true,
    }));
  };

  // End Day & Show Financial Summary
  const handleEndDay = () => {
    // Calculate total staff wages
    const hiredStaffWages = gameState.staff
      .filter((s) => s.hired)
      .reduce((sum, s) => sum + s.dailySalary, 0);

    setGameState((prev) => ({
      ...prev,
      todayStats: {
        ...prev.todayStats,
        staffWages: hiredStaffWages,
      },
      showDaySummaryModal: true,
    }));
  };

  // Advance to Next Day
  const handleNextDay = () => {
    // Random market price changes (inflation / price swings)
    setProductsMap((prev) => {
      const nextMap = new Map<string, ProductItem>(prev);
      nextMap.forEach((product, id) => {
        const change = (Math.floor(Math.random() * 5) - 2) * 5; // -10, -5, 0, +5, +10
        const newCost = Math.max(20, product.wholesaleCost + change);
        nextMap.set(id, {
          ...product,
          wholesaleCost: newCost,
          priceChangeTrend: change > 0 ? 'up' : change < 0 ? 'down' : 'stable',
          priceChangeAmount: change,
        });
      });
      return nextMap;
    });

    setGameState((prev) => {
      const totalStaffWages = prev.staff
        .filter((s) => s.hired)
        .reduce((sum, s) => sum + s.dailySalary, 0);
      const totalExpenses =
        prev.todayStats.wholesaleExpenses + totalStaffWages + prev.todayStats.rentUtilities;
      const profit = prev.todayStats.revenue - totalExpenses;

      const record = {
        day: prev.day,
        revenue: prev.todayStats.revenue,
        expenses: totalExpenses,
        profit,
        itemsSold: prev.todayStats.itemsSold,
        customersServed: prev.todayStats.customersServed,
        reputationChange: 2,
      };

      return {
        ...prev,
        day: prev.day + 1,
        timeOfDay: '09:00',
        cash: prev.cash - totalStaffWages - prev.todayStats.rentUtilities,
        financialHistory: [...prev.financialHistory, record],
        showDaySummaryModal: false,
        isStoreOpen: false, // Closed at start of new day for stocking
        todayStats: {
          revenue: 0,
          wholesaleExpenses: 0,
          staffWages: 0,
          rentUtilities: 1500,
          itemsSold: 0,
          customersServed: 0,
          happyCustomers: 0,
          reputationGain: 0,
        },
      };
    });
  };

  return (
    <div className="relative w-screen h-screen bg-slate-950 font-sans overflow-hidden select-none">
      {/* 3D Supermarket Canvas */}
      <SupermarketCanvas
        gameState={gameState}
        productsMap={productsMap}
        onSlotClick={handleSlotClick}
        onBoxClick={handleBoxClick}
        onOpenRegister={handleOpenRegister}
        onOpenLaptop={handleOpenLaptop}
        onToggleCamera={handleToggleCamera}
        onToggleStoreOpen={handleToggleStoreOpen}
        onTrashBox={handleTrashBox}
        scannedItemIndex={scannedItemIndex}
      />

      {/* Top/Bottom HUD Interface */}
      <HUD
        gameState={gameState}
        onToggleCamera={handleToggleCamera}
        onOpenRegister={handleOpenRegister}
        onOpenLaptop={handleOpenLaptop}
        onDropBox={handleDropBox}
        onToggleSound={handleToggleSound}
        onToggleStoreOpen={handleToggleStoreOpen}
        onToggleLayoutEdit={handleToggleLayoutEdit}
        onEndDay={handleEndDay}
        isMuted={isMuted}
      />

      {/* Onboarding Modal: Store Exterior Name & Sign Setup */}
      {!gameState.isStoreNameConfigured && (
        <OnboardingModal
          initialStoreName={gameState.storeName}
          initialSignColor={gameState.storeSignColor || '#0284c7'}
          onComplete={handleCompleteOnboarding}
        />
      )}

      {/* Layout Editing Modal */}
      {gameState.isEditLayoutMode && (
        <LayoutEditModal
          checkoutPosition={gameState.checkoutPosition}
          checkoutRotation={gameState.checkoutRotation}
          onMoveRegister={handleMoveRegister}
          onRotateRegister={handleRotateRegister}
          onResetPosition={handleResetRegisterPosition}
          onClose={handleToggleLayoutEdit}
        />
      )}

      {/* Cashier Register Checkout Modal */}
      {isRegisterModalOpen && (
        <CheckoutInterface
          customer={gameState.activeCheckoutCustomer}
          productsMap={productsMap}
          scannedIndex={scannedItemIndex}
          onScanNext={handleScanNextItem}
          onCompleteCheckout={handleCompleteCheckout}
          onClose={() => setIsRegisterModalOpen(false)}
        />
      )}

      {/* Backroom Management Laptop Modal */}
      {isLaptopModalOpen && (
        <StoreComputerModal
          gameState={gameState}
          productsMap={productsMap}
          onOrderStockBox={handleOrderStockBox}
          onUpdatePrice={handleUpdatePrice}
          onBuyShelf={handleBuyShelf}
          onHireStaff={handleHireStaff}
          onBuyLicense={handleBuyLicense}
          onUnlockStorage={handleUnlockStorage}
          onClose={() => setIsLaptopModalOpen(false)}
        />
      )}

      {/* End of Day Financial Summary Modal */}
      {gameState.showDaySummaryModal && (
        <DaySummaryModal
          day={gameState.day}
          stats={gameState.todayStats}
          onNextDay={handleNextDay}
        />
      )}
    </div>
  );
}
