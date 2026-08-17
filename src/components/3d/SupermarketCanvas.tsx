import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import {
  GameState,
  ProductItem,
  ShelfData,
  ShelfType,
  CustomerData,
  CustomerState,
} from '../../types/game';
import {
  DEFAULT_CHECKOUT_POSITION,
  BACKROOM_TERMINAL_POSITION,
  STORE_SIGN_POSITION,
  TRASH_BIN_POSITION,
} from '../../utils/constants';
import { soundManager } from '../../utils/audio';
import { TouchController } from '../ui/TouchController';
import { createProduct3DMesh, createCardboardBoxTexture, createShelfTagTexture } from '../../utils/productMeshBuilder';

interface SupermarketCanvasProps {
  gameState: GameState;
  productsMap: Map<string, ProductItem>;
  onSlotClick: (shelfId: string, tierIndex: number, slotIndex: number) => void;
  onBoxClick: (boxId: string) => void;
  onOpenRegister: () => void;
  onOpenLaptop: () => void;
  onToggleCamera: () => void;
  onToggleStoreOpen: () => void;
  onTrashBox: () => void;
  scannedItemIndex: number;
}

export const SupermarketCanvas: React.FC<SupermarketCanvasProps> = ({
  gameState,
  productsMap,
  onSlotClick,
  onBoxClick,
  onOpenRegister,
  onOpenLaptop,
  onToggleCamera,
  onToggleStoreOpen,
  onTrashBox,
  scannedItemIndex,
}) => {
  const mountRef = useRef<HTMLDivElement>(null);
  const [hoverText, setHoverText] = useState<string | null>(null);

  // Gamepad State
  const [gamepadConnected, setGamepadConnected] = useState<boolean>(false);
  const [gamepadName, setGamepadName] = useState<string | null>(null);

  // Movement & Camera refs
  const touchMoveRef = useRef<{ x: number; y: number }>({ x: 0, y: 0 });
  const keysRef = useRef<{ [key: string]: boolean }>({});
  const playerPosRef = useRef<THREE.Vector3>(new THREE.Vector3(0, 1.6, 3));
  const playerYawRef = useRef<number>(0);
  const playerPitchRef = useRef<number>(0);
  const isDraggingMouseRef = useRef<boolean>(false);
  const lastMousePosRef = useRef<{ x: number; y: number }>({ x: 0, y: 0 });
  const prevButtonsRef = useRef<{ [key: number]: boolean }>({});
  const interactRef = useRef<() => void>(() => {});

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    const width = container.clientWidth;
    const height = container.clientHeight;

    // 1. SCENE SETUP
    const scene = new THREE.Scene();
    scene.background = new THREE.Color('#e0f2fe'); // Sky blue outdoor tone
    scene.fog = new THREE.FogExp2('#e0f2fe', 0.025);

    // 2. CAMERA
    const camera = new THREE.PerspectiveCamera(65, width / height, 0.1, 100);
    camera.position.copy(playerPosRef.current);

    // 3. RENDERER
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: false });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    container.appendChild(renderer.domElement);

    // 4. LIGHTS
    const ambientLight = new THREE.AmbientLight('#ffffff', 0.7);
    scene.add(ambientLight);

    const sunLight = new THREE.DirectionalLight('#fffbeb', 1.2);
    sunLight.position.set(5, 12, 8);
    sunLight.castShadow = true;
    sunLight.shadow.mapSize.width = 1024;
    sunLight.shadow.mapSize.height = 1024;
    scene.add(sunLight);

    // Ceiling Spotlights
    const ceilingLight1 = new THREE.PointLight('#ffffff', 1.5, 12);
    ceilingLight1.position.set(-2, 4.2, 1);
    scene.add(ceilingLight1);

    const ceilingLight2 = new THREE.PointLight('#ffffff', 1.5, 12);
    ceilingLight2.position.set(2, 4.2, 1);
    scene.add(ceilingLight2);

    // 5. STORE GEOMETRY BUILDER
    // Floor
    const floorGeo = new THREE.PlaneGeometry(10, 10);
    const floorMat = new THREE.MeshStandardMaterial({
      color: '#f8fafc',
      roughness: 0.2,
      metalness: 0.1,
    });
    const floorMesh = new THREE.Mesh(floorGeo, floorMat);
    floorMesh.rotation.x = -Math.PI / 2;
    floorMesh.position.set(0, 0, 1);
    floorMesh.receiveShadow = true;
    scene.add(floorMesh);

    // Backroom Concrete Floor
    const backFloorGeo = new THREE.PlaneGeometry(10, 3);
    const backFloorMat = new THREE.MeshStandardMaterial({
      color: '#475569',
      roughness: 0.8,
    });
    const backFloorMesh = new THREE.Mesh(backFloorGeo, backFloorMat);
    backFloorMesh.rotation.x = -Math.PI / 2;
    backFloorMesh.position.set(0, 0, 5.5);
    backFloorMesh.receiveShadow = true;
    scene.add(backFloorMesh);

    // Grid on Store Floor
    const grid = new THREE.GridHelper(10, 10, '#cbd5e1', '#e2e8f0');
    grid.position.set(0, 0.002, 1);
    scene.add(grid);

    // Walls
    const wallMat = new THREE.MeshStandardMaterial({ color: '#f1f5f9', roughness: 0.5 });
    
    // Left Wall
    const leftWall = new THREE.Mesh(new THREE.BoxGeometry(0.2, 4.5, 12), wallMat);
    leftWall.position.set(-5, 2.25, 1);
    leftWall.receiveShadow = true;
    scene.add(leftWall);

    // Right Wall
    const rightWall = new THREE.Mesh(new THREE.BoxGeometry(0.2, 4.5, 12), wallMat);
    rightWall.position.set(5, 2.25, 1);
    rightWall.receiveShadow = true;
    scene.add(rightWall);

    // Back Wall
    const backWall = new THREE.Mesh(new THREE.BoxGeometry(10, 4.5, 0.2), new THREE.MeshStandardMaterial({ color: '#0284c7', roughness: 0.3 }));
    backWall.position.set(0, 2.25, -4);
    backWall.receiveShadow = true;
    scene.add(backWall);

    // Partition Wall between store & backroom
    const partitionMat = new THREE.MeshStandardMaterial({ color: '#cbd5e1', roughness: 0.6 });
    const partLeft = new THREE.Mesh(new THREE.BoxGeometry(5, 4, 0.15), partitionMat);
    partLeft.position.set(-2.5, 2, 4);
    scene.add(partLeft);
    const partRight = new THREE.Mesh(new THREE.BoxGeometry(3, 4, 0.15), partitionMat);
    partRight.position.set(2.5, 2, 4);
    scene.add(partRight);

    // Store Entrance Signboard
    const signGroup = new THREE.Group();
    signGroup.position.set(0, 4.1, 6.05);
    const signBox = new THREE.Mesh(
      new THREE.BoxGeometry(6.5, 1.0, 0.2),
      new THREE.MeshStandardMaterial({
        color: gameState.storeSignColor || '#0284c7',
        roughness: 0.2,
      })
    );
    signGroup.add(signBox);
    scene.add(signGroup);

    // Adjacent Storage Room (Unlocked or Locked with $800 Sign)
    const storageGroup = new THREE.Group();
    storageGroup.position.set(7.5, 0, 1);

    // Storage Room Floor
    const storageFloor = new THREE.Mesh(
      new THREE.PlaneGeometry(4.8, 8),
      new THREE.MeshStandardMaterial({
        color: gameState.unlockedStorage ? '#334155' : '#1e293b',
        roughness: 0.7,
      })
    );
    storageFloor.rotation.x = -Math.PI / 2;
    storageFloor.position.set(0, 0.001, 0);
    storageGroup.add(storageFloor);

    // Storage Door Wall Barrier
    const doorWallMat = new THREE.MeshStandardMaterial({ color: '#475569', roughness: 0.5 });
    const storageDoorMesh = new THREE.Mesh(
      new THREE.BoxGeometry(0.2, 3.8, 3.0),
      doorWallMat
    );
    storageDoorMesh.position.set(-2.5, 1.9, gameState.unlockedStorage ? -2.2 : 0);
    storageGroup.add(storageDoorMesh);

    scene.add(storageGroup);

    // Automatic Glass Doors
    const isDoorOpen = gameState.customers.some(c => c.state === CustomerState.ENTERING || c.state === CustomerState.LEAVING);
    const glassMat = new THREE.MeshStandardMaterial({
      color: '#38bdf8',
      transparent: true,
      opacity: 0.3,
      roughness: 0.1,
    });
    const doorLeft = new THREE.Mesh(new THREE.BoxGeometry(1.1, 3.4, 0.05), glassMat);
    doorLeft.position.set(isDoorOpen ? -1.8 : -0.55, 1.7, 6);
    scene.add(doorLeft);

    const doorRight = new THREE.Mesh(new THREE.BoxGeometry(1.1, 3.4, 0.05), glassMat);
    doorRight.position.set(isDoorOpen ? 1.8 : 0.55, 1.7, 6);
    scene.add(doorRight);

    // 6. RENDER DYNAMIC SHELVES
    const interactiveObjects: THREE.Object3D[] = [];

    gameState.shelves.forEach((shelf) => {
      const shelfGroup = new THREE.Group();
      shelfGroup.position.set(shelf.position[0], shelf.position[1], shelf.position[2]);
      shelfGroup.rotation.y = shelf.rotation;

      if (shelf.type === ShelfType.STANDARD_RACK) {
        // Shelf frame
        const frameMat = new THREE.MeshStandardMaterial({ color: '#334155', roughness: 0.4 });
        const backBoard = new THREE.Mesh(new THREE.BoxGeometry(1.8, 2.0, 0.04), frameMat);
        backBoard.position.set(0, 1.0, -0.28);
        shelfGroup.add(backBoard);

        const sideL = new THREE.Mesh(new THREE.BoxGeometry(0.06, 2.0, 0.6), frameMat);
        sideL.position.set(-0.9, 1.0, 0);
        shelfGroup.add(sideL);
        const sideR = new THREE.Mesh(new THREE.BoxGeometry(0.06, 2.0, 0.6), frameMat);
        sideR.position.set(0.9, 1.0, 0);
        shelfGroup.add(sideR);

        [0.5, 1.0, 1.5].forEach((yH, tierIdx) => {
          const plank = new THREE.Mesh(
            new THREE.BoxGeometry(1.74, 0.04, 0.55),
            new THREE.MeshStandardMaterial({ color: '#f1f5f9', roughness: 0.2 })
          );
          plank.position.set(0, yH, 0);
          shelfGroup.add(plank);

          // Clickable slots
          [-0.45, 0.45].forEach((xOff, slotIdx) => {
            const slotData = shelf.slots.find(s => s.tierIndex === tierIdx && s.slotIndex === slotIdx);
            const product = slotData?.productId ? productsMap.get(slotData.productId) : null;

            const slotMesh = new THREE.Mesh(
              new THREE.BoxGeometry(0.7, 0.4, 0.5),
              new THREE.MeshBasicMaterial({ visible: false })
            );
            slotMesh.position.set(xOff, yH + 0.2, 0);
            slotMesh.userData = { type: 'slot', shelfId: shelf.id, tierIndex: tierIdx, slotIndex: slotIdx, product };
            shelfGroup.add(slotMesh);
            interactiveObjects.push(slotMesh);

            // Render products
            if (product && slotData) {
              const count = Math.min(slotData.count, 8);
              for (let i = 0; i < count; i++) {
                const row = Math.floor(i / 2);
                const col = i % 2;
                const px = xOff + (col - 0.5) * 0.18;
                const pz = (row - 1) * 0.12;

                const prodMesh = createProduct3DMesh(product.id, product.shape, product.color, product.name);
                prodMesh.position.set(px, yH + 0.02, pz);
                shelfGroup.add(prodMesh);
              }
            }

            // Yellow Shelf Tag Holder on Front Lip (Supermarket Simulator Replica)
            const priceTagTex = createShelfTagTexture(
              product && typeof product.currentPrice === 'number' ? `$ ${product.currentPrice.toFixed(2)}` : '$ -',
              slotData?.count || 0
            );
            const tagMesh = new THREE.Mesh(
              new THREE.PlaneGeometry(0.18, 0.08),
              new THREE.MeshStandardMaterial({
                map: priceTagTex,
                roughness: 0.2,
                side: THREE.DoubleSide,
              })
            );
            tagMesh.position.set(xOff, yH + 0.04, 0.26);
            shelfGroup.add(tagMesh);
          });
        });
      } else if (shelf.type === ShelfType.REFRIGERATOR) {
        // Fridge frame
        const fridgeMat = new THREE.MeshStandardMaterial({ color: '#0f172a', roughness: 0.3 });
        const cabinet = new THREE.Mesh(new THREE.BoxGeometry(1.8, 2.2, 0.7), fridgeMat);
        cabinet.position.set(0, 1.1, 0);
        shelfGroup.add(cabinet);

        // Glass Front
        const glass = new THREE.Mesh(new THREE.BoxGeometry(1.72, 2.05, 0.02), glassMat);
        glass.position.set(0, 1.1, 0.35);
        shelfGroup.add(glass);

        [0.55, 1.05, 1.55].forEach((yH, tierIdx) => {
          const wire = new THREE.Mesh(
            new THREE.BoxGeometry(1.66, 0.02, 0.55),
            new THREE.MeshStandardMaterial({ color: '#38bdf8', metalness: 0.8, roughness: 0.2 })
          );
          wire.position.set(0, yH, 0);
          shelfGroup.add(wire);

          [-0.42, 0.42].forEach((xOff, slotIdx) => {
            const slotData = shelf.slots.find(s => s.tierIndex === tierIdx && s.slotIndex === slotIdx);
            const product = slotData?.productId ? productsMap.get(slotData.productId) : null;

            const slotMesh = new THREE.Mesh(
              new THREE.BoxGeometry(0.7, 0.4, 0.5),
              new THREE.MeshBasicMaterial({ visible: false })
            );
            slotMesh.position.set(xOff, yH + 0.2, 0);
            slotMesh.userData = { type: 'slot', shelfId: shelf.id, tierIndex: tierIdx, slotIndex: slotIdx, product };
            shelfGroup.add(slotMesh);
            interactiveObjects.push(slotMesh);

            if (product && slotData) {
              const count = Math.min(slotData.count, 10);
              for (let i = 0; i < count; i++) {
                const row = Math.floor(i / 2);
                const col = i % 2;
                const px = xOff + (col - 0.5) * 0.16;
                const pz = (row - 1.5) * 0.11;

                const prodMesh = createProduct3DMesh(product.id, product.shape, product.color, product.name);
                prodMesh.position.set(px, yH + 0.02, pz);
                shelfGroup.add(prodMesh);
              }
            }
          });
        });
      } else if (shelf.type === ShelfType.PRODUCE_DISPLAY) {
        // Table
        const produceMat = new THREE.MeshStandardMaterial({ color: '#a16207', roughness: 0.7 });
        const bin = new THREE.Mesh(new THREE.BoxGeometry(1.8, 0.22, 0.8), produceMat);
        bin.position.set(0, 0.75, 0);
        bin.rotation.x = 0.15;
        shelfGroup.add(bin);

        [-0.45, 0.45].forEach((xOff, slotIdx) => {
          const slotData = shelf.slots.find(s => s.slotIndex === slotIdx);
          const product = slotData?.productId ? productsMap.get(slotData.productId) : null;

          const slotMesh = new THREE.Mesh(
            new THREE.BoxGeometry(0.8, 0.3, 0.7),
            new THREE.MeshBasicMaterial({ visible: false })
          );
          slotMesh.position.set(xOff, 0.8, 0);
          slotMesh.userData = { type: 'slot', shelfId: shelf.id, tierIndex: 0, slotIndex: slotIdx, product };
          shelfGroup.add(slotMesh);
          interactiveObjects.push(slotMesh);

          if (product && slotData) {
            const count = Math.min(slotData.count, 8);
            for (let i = 0; i < count; i++) {
              const row = Math.floor(i / 3);
              const col = i % 3;
              const px = xOff + (col - 1) * 0.15;
              const pz = (row - 0.5) * 0.16;

              const prodMesh = createProduct3DMesh(product.id, product.shape, product.color, product.name);
              prodMesh.position.set(px, 0.82, pz);
              shelfGroup.add(prodMesh);
            }
          }
        });
      }

      scene.add(shelfGroup);
    });

    // 7. SUPERMARKET SIMULATOR CHECKOUT COUNTER
    const checkoutPos = gameState.checkoutPosition || DEFAULT_CHECKOUT_POSITION;
    const checkoutGroup = new THREE.Group();
    checkoutGroup.position.set(checkoutPos[0], checkoutPos[1], checkoutPos[2]);
    checkoutGroup.rotation.y = gameState.checkoutRotation || 0;
    
    // Main Counter Desk
    const counterDesk = new THREE.Mesh(
      new THREE.BoxGeometry(2.4, 0.9, 1.2),
      new THREE.MeshStandardMaterial({ color: '#1e293b', roughness: 0.3 })
    );
    counterDesk.position.set(0, 0.45, 0);
    checkoutGroup.add(counterDesk);

    // Black Rubber Conveyor Belt
    const conveyorBelt = new THREE.Mesh(
      new THREE.BoxGeometry(1.5, 0.04, 0.65),
      new THREE.MeshStandardMaterial({ color: '#0f172a', roughness: 0.8 })
    );
    conveyorBelt.position.set(-0.25, 0.92, 0);
    checkoutGroup.add(conveyorBelt);

    // Silver Conveyor Guide Rails
    const railMat = new THREE.MeshStandardMaterial({ color: '#94a3b8', metalness: 0.9, roughness: 0.2 });
    const railFront = new THREE.Mesh(new THREE.BoxGeometry(1.5, 0.08, 0.04), railMat);
    railFront.position.set(-0.25, 0.95, -0.34);
    checkoutGroup.add(railFront);
    const railBack = new THREE.Mesh(new THREE.BoxGeometry(1.5, 0.08, 0.04), railMat);
    railBack.position.set(-0.25, 0.95, 0.34);
    checkoutGroup.add(railBack);

    // POS Barcode Scanner Unit with Red Glass Laser Window
    const scannerBody = new THREE.Mesh(
      new THREE.BoxGeometry(0.24, 0.16, 0.24),
      new THREE.MeshStandardMaterial({ color: '#334155', roughness: 0.3 })
    );
    scannerBody.position.set(0.45, 0.98, 0.15);
    checkoutGroup.add(scannerBody);

    const laserGlass = new THREE.Mesh(
      new THREE.BoxGeometry(0.16, 0.02, 0.16),
      new THREE.MeshStandardMaterial({
        color: '#ef4444',
        emissive: '#dc2626',
        emissiveIntensity: 0.8,
      })
    );
    laserGlass.position.set(0.45, 1.07, 0.15);
    checkoutGroup.add(laserGlass);

    // Cashier POS Monitor Screen
    const monitor = new THREE.Mesh(
      new THREE.BoxGeometry(0.48, 0.38, 0.05),
      new THREE.MeshStandardMaterial({ color: '#0284c7', roughness: 0.2 })
    );
    monitor.position.set(0.65, 1.35, -0.15);
    monitor.rotation.set(0, -0.3, 0.1);
    checkoutGroup.add(monitor);

    // Clickable Register Target
    const registerHit = new THREE.Mesh(
      new THREE.BoxGeometry(1.4, 0.7, 0.9),
      new THREE.MeshBasicMaterial({ visible: false })
    );
    registerHit.position.set(0.4, 1.2, 0);
    registerHit.userData = { type: 'register' };
    checkoutGroup.add(registerHit);
    interactiveObjects.push(registerHit);

    scene.add(checkoutGroup);

    // 8. BACKROOM LAPTOP
    const laptopGroup = new THREE.Group();
    laptopGroup.position.set(
      BACKROOM_TERMINAL_POSITION[0],
      BACKROOM_TERMINAL_POSITION[1],
      BACKROOM_TERMINAL_POSITION[2]
    );

    const desk = new THREE.Mesh(
      new THREE.BoxGeometry(1.4, 0.9, 0.8),
      new THREE.MeshStandardMaterial({ color: '#a16207', roughness: 0.6 })
    );
    desk.position.set(0, 0.45, 0);
    laptopGroup.add(desk);

    const laptopHit = new THREE.Mesh(
      new THREE.BoxGeometry(0.6, 0.4, 0.5),
      new THREE.MeshBasicMaterial({ visible: false })
    );
    laptopHit.position.set(0, 1.0, 0);
    laptopHit.userData = { type: 'laptop' };
    laptopGroup.add(laptopHit);
    interactiveObjects.push(laptopHit);

    scene.add(laptopGroup);

    // 8b. DOOR OPEN/CLOSE SIGN
    const signMesh = new THREE.Mesh(
      new THREE.BoxGeometry(1.2, 0.6, 0.1),
      new THREE.MeshStandardMaterial({
        color: gameState.isStoreOpen ? '#10b981' : '#ef4444',
        roughness: 0.3,
        emissive: gameState.isStoreOpen ? '#059669' : '#b91c1c',
        emissiveIntensity: 0.4,
      })
    );
    signMesh.position.set(STORE_SIGN_POSITION[0], STORE_SIGN_POSITION[1], STORE_SIGN_POSITION[2]);
    signMesh.userData = { type: 'sign' };
    scene.add(signMesh);
    interactiveObjects.push(signMesh);

    // 8c. RECYCLING TRASH BIN
    const trashMesh = new THREE.Mesh(
      new THREE.CylinderGeometry(0.35, 0.3, 0.9, 16),
      new THREE.MeshStandardMaterial({ color: '#164e63', roughness: 0.4 })
    );
    trashMesh.position.set(TRASH_BIN_POSITION[0], 0.45, TRASH_BIN_POSITION[2]);
    trashMesh.userData = { type: 'trash' };
    scene.add(trashMesh);
    interactiveObjects.push(trashMesh);

    // 9. STOCK BOXES IN BACKROOM / STORE
    gameState.stockBoxes.forEach((box) => {
      if (box.isHeldByPlayer) return;

      const product = productsMap.get(box.productId);
      const boxTex = createCardboardBoxTexture(
        product?.name || 'SUPERMARKET ITEMS',
        box.count || product?.boxQuantity || 10,
        product?.color || '#b45309'
      );

      const boxMat = new THREE.MeshStandardMaterial({
        map: boxTex,
        roughness: 0.8,
      });

      const boxMesh = new THREE.Mesh(
        new THREE.BoxGeometry(0.55, 0.36, 0.45),
        boxMat
      );
      boxMesh.position.set(box.position[0], box.position[1], box.position[2]);
      boxMesh.userData = { type: 'box', boxId: box.id, product };
      scene.add(boxMesh);
      interactiveObjects.push(boxMesh);
    });

    // 10. CUSTOMERS
    gameState.customers.forEach((cust) => {
      const custGroup = new THREE.Group();
      custGroup.position.set(cust.position[0], cust.position[1], cust.position[2]);

      const head = new THREE.Mesh(
        new THREE.SphereGeometry(0.18, 16, 16),
        new THREE.MeshStandardMaterial({ color: '#fed7aa', roughness: 0.6 })
      );
      head.position.set(0, 1.5, 0);
      custGroup.add(head);

      const body = new THREE.Mesh(
        new THREE.CylinderGeometry(0.2, 0.24, 0.7, 16),
        new THREE.MeshStandardMaterial({ color: cust.avatarColor, roughness: 0.5 })
      );
      body.position.set(0, 1.0, 0);
      custGroup.add(body);

      scene.add(custGroup);
    });

    // 11. GREEN SELECTION BOX HIGHLIGHT
    const selectionBoxGeo = new THREE.BoxGeometry(0.72, 0.42, 0.52);
    const selectionBoxEdges = new THREE.EdgesGeometry(selectionBoxGeo);
    const selectionBoxMat = new THREE.LineBasicMaterial({ color: '#22c55e', linewidth: 3 });
    const selectionHighlightMesh = new THREE.LineSegments(selectionBoxEdges, selectionBoxMat);
    selectionHighlightMesh.visible = false;
    scene.add(selectionHighlightMesh);

    // 12. FIRST-PERSON HELD CARDBOARD BOX IN HANDS
    const heldBoxGroup = new THREE.Group();
    if (gameState.heldBoxId) {
      const heldBoxData = gameState.stockBoxes.find((b) => b.id === gameState.heldBoxId);
      const product = heldBoxData?.productId ? productsMap.get(heldBoxData.productId) : null;

      // Cardboard box outer body
      const boxTex = createCardboardBoxTexture(
        product?.name || 'SUPERMARKET ITEMS',
        heldBoxData?.count || 10,
        product?.color || '#b45309'
      );
      const boxMat = new THREE.MeshStandardMaterial({ map: boxTex, roughness: 0.8 });

      // Main box frame
      const boxBody = new THREE.Mesh(new THREE.BoxGeometry(0.6, 0.35, 0.45), boxMat);
      heldBoxGroup.add(boxBody);

      // Open Flaps at top
      const flapMat = new THREE.MeshStandardMaterial({ color: '#c28544', roughness: 0.8 });
      const flap1 = new THREE.Mesh(new THREE.BoxGeometry(0.6, 0.02, 0.15), flapMat);
      flap1.position.set(0, 0.2, -0.26);
      flap1.rotation.x = -Math.PI / 4;
      heldBoxGroup.add(flap1);

      const flap2 = new THREE.Mesh(new THREE.BoxGeometry(0.6, 0.02, 0.15), flapMat);
      flap2.position.set(0, 0.2, 0.26);
      flap2.rotation.x = Math.PI / 4;
      heldBoxGroup.add(flap2);

      // Inside items stacked inside open box
      if (product && heldBoxData) {
        const itemCount = Math.min(heldBoxData.count, 6);
        for (let i = 0; i < itemCount; i++) {
          const col = i % 3;
          const row = Math.floor(i / 3);
          const px = (col - 1) * 0.18;
          const pz = (row - 0.5) * 0.18;

          const pMesh = createProduct3DMesh(product.id, product.shape, product.color, product.name);
          pMesh.scale.set(0.85, 0.85, 0.85);
          pMesh.position.set(px, 0.02, pz);
          heldBoxGroup.add(pMesh);
        }
      }

      heldBoxGroup.position.set(0.1, -0.32, -0.65);
      heldBoxGroup.rotation.set(0.15, -0.1, 0);
      camera.add(heldBoxGroup);
      scene.add(camera);
    }

    // 13. MOUSE CONTROLS & RAYCASTING
    const raycaster = new THREE.Raycaster();
    const mouse = new THREE.Vector2();

    const onMouseDown = (e: MouseEvent) => {
      if (e.button === 0) {
        isDraggingMouseRef.current = true;
        lastMousePosRef.current = { x: e.clientX, y: e.clientY };
      }
    };

    const onMouseMove = (e: MouseEvent) => {
      if (isDraggingMouseRef.current && gameState.cameraMode === 'first_person') {
        const deltaX = e.clientX - lastMousePosRef.current.x;
        const deltaY = e.clientY - lastMousePosRef.current.y;

        playerYawRef.current -= deltaX * 0.003;
        playerPitchRef.current = Math.max(-Math.PI / 3, Math.min(Math.PI / 3, playerPitchRef.current - deltaY * 0.003));

        lastMousePosRef.current = { x: e.clientX, y: e.clientY };
      }

      // Raycast for hover cursor text
      const rect = container.getBoundingClientRect();
      mouse.x = ((e.clientX - rect.left) / container.clientWidth) * 2 - 1;
      mouse.y = -((e.clientY - rect.top) / container.clientHeight) * 2 + 1;

      raycaster.setFromCamera(mouse, camera);
      const intersects = raycaster.intersectObjects(interactiveObjects, true);

      if (intersects.length > 0) {
        const obj = intersects[0].object;
        const data = obj.userData;
        if (data.type === 'slot') {
          // Position green highlight box over targeted slot
          const worldPos = new THREE.Vector3();
          obj.getWorldPosition(worldPos);
          selectionHighlightMesh.position.copy(worldPos);
          selectionHighlightMesh.visible = true;

          if (gameState.heldBoxId) {
            setHoverText('クリックして商品を棚に補給・陳列');
          } else if (data.product) {
            setHoverText(`${data.product.name} (クリックで棚操作)`);
          } else {
            setHoverText('空き棚スロット (段ボールを持ってクリックで補充)');
          }
        } else {
          selectionHighlightMesh.visible = false;
          if (data.type === 'box') {
            setHoverText(`段ボール箱 [${data.product?.name || '商品'}] (クリックして持ち上げる)`);
          } else if (data.type === 'register') {
            setHoverText('レジスター会計画面を開く (クリック)');
          } else if (data.type === 'laptop') {
            setHoverText('発注・経営用PCを開く (クリック)');
          } else if (data.type === 'sign') {
            setHoverText(`店舗看板 (クリックで ${gameState.isStoreOpen ? '閉店' : '開店'} に変更)`);
          } else if (data.type === 'trash') {
            setHoverText('ダンボール回収ゴミ箱 (空箱を持ってクリックで処分)');
          }
        }
      } else {
        selectionHighlightMesh.visible = false;
        setHoverText(null);
      }
    };

    const onMouseUp = () => {
      isDraggingMouseRef.current = false;
    };

    // Helper function to perform raycast interact at center crosshair or mouse
    const triggerCenterInteract = () => {
      mouse.x = 0;
      mouse.y = 0; // Center crosshair
      raycaster.setFromCamera(mouse, camera);
      const intersects = raycaster.intersectObjects(interactiveObjects, true);

      if (intersects.length > 0) {
        const data = intersects[0].object.userData;
        if (data.type === 'slot') {
          soundManager.playBoxThud();
          onSlotClick(data.shelfId, data.tierIndex, data.slotIndex);
        } else if (data.type === 'box') {
          soundManager.playBoxThud();
          onBoxClick(data.boxId);
        } else if (data.type === 'register') {
          soundManager.playDoorChime();
          onOpenRegister();
        } else if (data.type === 'laptop') {
          soundManager.playDoorChime();
          onOpenLaptop();
        } else if (data.type === 'sign') {
          soundManager.playDoorChime();
          onToggleStoreOpen();
        } else if (data.type === 'trash') {
          soundManager.playBoxThud();
          onTrashBox();
        }
      }
    };

    interactRef.current = triggerCenterInteract;

    const onClick = (e: MouseEvent) => {
      const rect = container.getBoundingClientRect();
      mouse.x = ((e.clientX - rect.left) / container.clientWidth) * 2 - 1;
      mouse.y = -((e.clientY - rect.top) / container.clientHeight) * 2 + 1;

      raycaster.setFromCamera(mouse, camera);
      const intersects = raycaster.intersectObjects(interactiveObjects, true);

      if (intersects.length > 0) {
        const data = intersects[0].object.userData;
        if (data.type === 'slot') {
          soundManager.playBoxThud();
          onSlotClick(data.shelfId, data.tierIndex, data.slotIndex);
        } else if (data.type === 'box') {
          soundManager.playBoxThud();
          onBoxClick(data.boxId);
        } else if (data.type === 'register') {
          soundManager.playDoorChime();
          onOpenRegister();
        } else if (data.type === 'laptop') {
          soundManager.playDoorChime();
          onOpenLaptop();
        } else if (data.type === 'sign') {
          soundManager.playDoorChime();
          onToggleStoreOpen();
        } else if (data.type === 'trash') {
          soundManager.playBoxThud();
          onTrashBox();
        }
      }
    };

    const onKeyDown = (e: KeyboardEvent) => {
      keysRef.current[e.code] = true;
    };

    const onKeyUp = (e: KeyboardEvent) => {
      keysRef.current[e.code] = false;
    };

    window.addEventListener('keydown', onKeyDown);
    window.addEventListener('keyup', onKeyUp);
    container.addEventListener('mousedown', onMouseDown);
    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('mouseup', onMouseUp);
    container.addEventListener('click', onClick);

    // 12. GAMEPAD & ANIMATION LOOP
    let animId: number;

    const animate = () => {
      animId = requestAnimationFrame(animate);

      // Gamepad Input Polling (Nintendo Switch / Joy-Con / Controller)
      const gamepads = navigator.getGamepads ? navigator.getGamepads() : [];
      let activeGp: Gamepad | null = null;
      for (let i = 0; i < gamepads.length; i++) {
        if (gamepads[i] && gamepads[i]?.connected) {
          activeGp = gamepads[i];
          break;
        }
      }

      if (activeGp) {
        if (!gamepadConnected) {
          setGamepadConnected(true);
          setGamepadName(activeGp.id);
        }

        // Stick & Button Mapping
        const deadzone = 0.18;

        // Left Stick (Axes 0, 1) or D-Pad (Buttons 12, 13, 14, 15) for Movement
        let gpMoveX = 0;
        let gpMoveZ = 0;

        if (Math.abs(activeGp.axes[0]) > deadzone) gpMoveX = activeGp.axes[0];
        if (Math.abs(activeGp.axes[1]) > deadzone) gpMoveZ = activeGp.axes[1];

        // D-Pad override
        if (activeGp.buttons[14]?.pressed) gpMoveX = -1; // Left
        if (activeGp.buttons[15]?.pressed) gpMoveX = 1;  // Right
        if (activeGp.buttons[12]?.pressed) gpMoveZ = -1; // Up
        if (activeGp.buttons[13]?.pressed) gpMoveZ = 1;  // Down

        if (gpMoveX !== 0 || gpMoveZ !== 0) {
          const speed = 0.08;
          const moveDir = new THREE.Vector3(gpMoveX, 0, gpMoveZ);
          moveDir.normalize();
          moveDir.applyAxisAngle(new THREE.Vector3(0, 1, 0), playerYawRef.current);

          playerPosRef.current.x = Math.max(-4.5, Math.min(4.5, playerPosRef.current.x + moveDir.x * speed));
          playerPosRef.current.z = Math.max(-3.5, Math.min(6.5, playerPosRef.current.z + moveDir.z * speed));
        }

        // Right Stick (Axes 2, 3) for Camera Rotation
        if (activeGp.axes.length >= 4) {
          const rotateX = Math.abs(activeGp.axes[2]) > deadzone ? activeGp.axes[2] : 0;
          const rotateY = Math.abs(activeGp.axes[3]) > deadzone ? activeGp.axes[3] : 0;

          if (rotateX !== 0 || rotateY !== 0) {
            playerYawRef.current -= rotateX * 0.04;
            playerPitchRef.current = Math.max(-Math.PI / 3, Math.min(Math.PI / 3, playerPitchRef.current - rotateY * 0.04));
          }
        }

        // Button A (0): Action / Interact
        if (activeGp.buttons[0]?.pressed && !prevButtonsRef.current[0]) {
          triggerCenterInteract();
        }

        // Button X (2) or Y (3): Camera Toggle
        if ((activeGp.buttons[2]?.pressed && !prevButtonsRef.current[2]) || (activeGp.buttons[3]?.pressed && !prevButtonsRef.current[3])) {
          onToggleCamera();
        }

        // Button L (4) / R (5) / Plus (9) / Minus (8): Open Register / Laptop
        if (activeGp.buttons[4]?.pressed && !prevButtonsRef.current[4]) {
          onOpenRegister();
        }
        if (activeGp.buttons[5]?.pressed && !prevButtonsRef.current[5]) {
          onOpenLaptop();
        }

        // Save button states for press debounce
        activeGp.buttons.forEach((btn, idx) => {
          prevButtonsRef.current[idx] = btn.pressed;
        });
      } else if (gamepadConnected) {
        setGamepadConnected(false);
      }

      // Camera positioning & keyboard / virtual joystick movement
      if (!gameState.isStoreNameConfigured) {
        // Exterior view focusing on the store entrance & sign board
        camera.position.set(0, 2.5, 10.5);
        camera.lookAt(0, 3.2, 6);
      } else if (gameState.cameraMode === 'first_person') {
        const speed = 0.08;
        const moveDir = new THREE.Vector3();

        // Keyboard WASD
        if (keysRef.current['KeyW'] || keysRef.current['ArrowUp']) moveDir.z -= 1;
        if (keysRef.current['KeyS'] || keysRef.current['ArrowDown']) moveDir.z += 1;
        if (keysRef.current['KeyA'] || keysRef.current['ArrowLeft']) moveDir.x -= 1;
        if (keysRef.current['KeyD'] || keysRef.current['ArrowRight']) moveDir.x += 1;

        // Virtual Touch Joystick input
        if (touchMoveRef.current.x !== 0 || touchMoveRef.current.y !== 0) {
          moveDir.x += touchMoveRef.current.x;
          moveDir.z += touchMoveRef.current.y;
        }

        if (moveDir.lengthSq() > 0) {
          moveDir.normalize();
          moveDir.applyAxisAngle(new THREE.Vector3(0, 1, 0), playerYawRef.current);

          playerPosRef.current.x = Math.max(-4.5, Math.min(4.5, playerPosRef.current.x + moveDir.x * speed));
          playerPosRef.current.z = Math.max(-3.5, Math.min(6.5, playerPosRef.current.z + moveDir.z * speed));
        }

        camera.position.copy(playerPosRef.current);

        const targetLook = new THREE.Vector3(
          playerPosRef.current.x + Math.sin(playerYawRef.current) * Math.cos(playerPitchRef.current),
          playerPosRef.current.y + Math.sin(playerPitchRef.current),
          playerPosRef.current.z - Math.cos(playerYawRef.current) * Math.cos(playerPitchRef.current)
        );
        camera.lookAt(targetLook);
      } else {
        // Overhead camera view
        camera.position.set(0, 9, 7);
        camera.lookAt(0, 0, 1);
      }

      renderer.render(scene, camera);
    };

    animate();

    // Resize handler
    const onResize = () => {
      if (!container) return;
      const w = container.clientWidth;
      const h = container.clientHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };
    window.addEventListener('resize', onResize);

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('keydown', onKeyDown);
      window.removeEventListener('keyup', onKeyUp);
      container.removeEventListener('mousedown', onMouseDown);
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mouseup', onMouseUp);
      container.removeEventListener('click', onClick);
      window.removeEventListener('resize', onResize);
      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
    };
  }, [gameState, productsMap, onSlotClick, onBoxClick, onOpenRegister, onOpenLaptop, onToggleCamera]);

  return (
    <div className="relative w-full h-full overflow-hidden select-none">
      <div ref={mountRef} className="w-full h-full cursor-crosshair" />

      {/* Hover Information Tooltip Overlay */}
      {hoverText && (
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 translate-y-8 bg-slate-900/90 text-white text-xs md:text-sm font-medium px-4 py-2 rounded-xl border border-sky-400/30 shadow-xl backdrop-blur-sm pointer-events-none transition-all duration-150 max-w-[90vw] text-center">
          ✨ {hoverText}
        </div>
      )}

      {/* Center Reticle Crosshair for First-Person */}
      {gameState.cameraMode === 'first_person' && (
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none flex items-center justify-center">
          <div className="w-2.5 h-2.5 rounded-full bg-sky-400 border border-white shadow-md opacity-90" />
        </div>
      )}

      {/* Touch & Gamepad On-Screen Controls */}
      <TouchController
        onMove={(dir) => {
          touchMoveRef.current = dir;
        }}
        onRotateCamera={(delta) => {
          playerYawRef.current -= delta.x;
          playerPitchRef.current = Math.max(-Math.PI / 3, Math.min(Math.PI / 3, playerPitchRef.current - delta.y));
        }}
        onActionClick={() => {
          if (interactRef.current) interactRef.current();
        }}
        onToggleCamera={onToggleCamera}
        isFirstPerson={gameState.cameraMode === 'first_person'}
        gamepadConnected={gamepadConnected}
        gamepadName={gamepadName}
      />
    </div>
  );
};

// Helper function to create procedural product geometries for 3D render
function createProductMesh(shape: string, color: string): THREE.Group {
  const group = new THREE.Group();
  const mat = new THREE.MeshStandardMaterial({ color, roughness: 0.3 });

  if (shape === 'carton') {
    const box = new THREE.Mesh(new THREE.BoxGeometry(0.1, 0.22, 0.1), mat);
    box.position.set(0, 0.11, 0);
    group.add(box);
  } else if (shape === 'bottle' || shape === 'can') {
    const cyl = new THREE.Mesh(new THREE.CylinderGeometry(0.045, 0.045, 0.18, 12), mat);
    cyl.position.set(0, 0.09, 0);
    group.add(cyl);
  } else if (shape === 'fruit') {
    const sphere = new THREE.Mesh(new THREE.SphereGeometry(0.06, 12, 12), mat);
    sphere.position.set(0, 0.06, 0);
    group.add(sphere);
  } else {
    const box = new THREE.Mesh(new THREE.BoxGeometry(0.14, 0.18, 0.08), mat);
    box.position.set(0, 0.09, 0);
    group.add(box);
  }

  return group;
}
