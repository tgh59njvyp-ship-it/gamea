import * as THREE from 'three';

// Cache generated textures so we don't recreate canvases repeatedly
const textureCache = new Map<string, THREE.CanvasTexture>();

/**
 * Creates procedural 2D canvas texture for authentic Supermarket Simulator product labels
 */
export function createProductLabelTexture(
  productName: string,
  brandColor: string,
  bgColor: string = '#ffffff',
  accentColor: string = '#0284c7',
  iconSymbol: string = '★'
): THREE.CanvasTexture {
  const cacheKey = `label_${productName}_${brandColor}_${bgColor}_${accentColor}`;
  if (textureCache.has(cacheKey)) {
    return textureCache.get(cacheKey)!;
  }

  const canvas = document.createElement('canvas');
  canvas.width = 512;
  canvas.height = 512;
  const ctx = canvas.getContext('2d');

  if (ctx) {
    ctx.fillStyle = bgColor;
    ctx.fillRect(0, 0, 512, 512);

    if (productName.includes('SUSU') || productName.includes('砂糖') || productName.includes('Sugar')) {
      // SUSU Sucre en Poudre Brand (Green/Red/White)
      ctx.fillStyle = '#15803d'; // Green Top Header
      ctx.fillRect(0, 0, 512, 180);

      ctx.fillStyle = '#ffffff';
      ctx.font = 'extrabold 90px sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText('SUSU', 256, 120);

      ctx.font = 'bold 28px sans-serif';
      ctx.fillText('SINCE 1865', 256, 160);

      ctx.fillStyle = '#dc2626'; // Red Fruit Ribbon
      ctx.fillRect(0, 180, 512, 50);

      ctx.fillStyle = '#ffffff';
      ctx.font = 'bold 26px sans-serif';
      ctx.fillText('Sucre en Poudre', 256, 215);

      // Sugar graphic circles / berries
      ctx.fillStyle = '#ef4444';
      ctx.beginPath();
      ctx.arc(180, 320, 40, 0, Math.PI * 2);
      ctx.arc(256, 300, 50, 0, Math.PI * 2);
      ctx.arc(330, 320, 40, 0, Math.PI * 2);
      ctx.fill();

      ctx.fillStyle = '#0f172a';
      ctx.font = 'black 36px sans-serif';
      ctx.fillText('FINE SUGAR 1kg', 256, 420);
    } else if (productName.includes('PANZATI') || productName.includes('スパゲッティ') || productName.includes('Penne')) {
      // PANZATI Penne Pasta Brand (Bright Red Bag)
      ctx.fillStyle = '#dc2626'; // Vibrant Red
      ctx.fillRect(0, 0, 512, 512);

      // Green & Yellow Oval Logo Badge
      ctx.fillStyle = '#16a34a';
      ctx.beginPath();
      ctx.ellipse(256, 160, 180, 80, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.strokeStyle = '#facc15';
      ctx.lineWidth = 12;
      ctx.stroke();

      ctx.fillStyle = '#ffffff';
      ctx.font = 'black 64px sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText('PANZATI', 256, 180);

      ctx.fillStyle = '#fef08a';
      ctx.font = 'bold 42px sans-serif';
      ctx.fillText('Penne Rigate', 256, 310);

      // Pasta Silhouette graphics
      ctx.fillStyle = '#fde047';
      for (let i = 0; i < 6; i++) {
        ctx.fillRect(120 + i * 50, 360, 24, 70);
      }
    } else if (productName.includes('CHOKIPIK') || productName.includes('シリアル') || productName.includes('Cereal')) {
      // CHOKIPIK Chocolate Cereal Brand (Purple/Brown with Bear)
      ctx.fillStyle = '#581c87'; // Deep Purple
      ctx.fillRect(0, 0, 512, 512);

      ctx.fillStyle = '#ffffff';
      ctx.font = 'black 72px sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText('CHOKIPIK', 256, 120);

      ctx.fillStyle = '#fef08a';
      ctx.font = 'bold 28px sans-serif';
      ctx.fillText('STRONG CHOCOLATE CEREAL', 256, 160);

      // Cute Bear Character Face
      ctx.fillStyle = '#78350f';
      ctx.beginPath();
      ctx.arc(256, 300, 90, 0, Math.PI * 2); // Head
      ctx.arc(180, 220, 35, 0, Math.PI * 2); // Left Ear
      ctx.arc(332, 220, 35, 0, Math.PI * 2); // Right Ear
      ctx.fill();

      // Snout
      ctx.fillStyle = '#fde047';
      ctx.beginPath();
      ctx.arc(256, 320, 40, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = '#1e1b4b';
      ctx.beginPath();
      ctx.arc(256, 305, 15, 0, Math.PI * 2); // Nose
      ctx.fill();

      // Chocolate Cereal Balls
      ctx.fillStyle = '#451a03';
      for (let x = 120; x <= 390; x += 45) {
        ctx.beginPath();
        ctx.arc(x, 440, 20, 0, Math.PI * 2);
        ctx.fill();
      }
    } else if (productName.includes('MASTER') || productName.includes('小麦粉') || productName.includes('Flour')) {
      // MASTER FLOUR Brand (Blue/Cyan Bag with Wheat ears)
      ctx.fillStyle = '#0284c7'; // Cyan/Blue
      ctx.fillRect(0, 0, 512, 512);

      ctx.fillStyle = '#ffffff';
      ctx.font = 'black 58px sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText('MASTER FLOUR', 256, 130);

      // Wheat ears graphic
      ctx.fillStyle = '#facc15';
      ctx.font = 'bold 60px sans-serif';
      ctx.fillText('🌾 🌾 🌾', 256, 230);

      ctx.fillStyle = '#e0f2fe';
      ctx.font = 'bold 36px sans-serif';
      ctx.fillText('CLASSIC WHITE FLOUR', 256, 340);
      ctx.fillText('NET WT 1KG', 256, 420);
    } else {
      // Generic High-Quality Brand Label
      ctx.fillStyle = brandColor;
      ctx.fillRect(0, 0, 512, 140);

      ctx.fillStyle = accentColor;
      ctx.fillRect(0, 440, 512, 72);

      ctx.strokeStyle = brandColor;
      ctx.lineWidth = 12;
      ctx.strokeRect(8, 8, 496, 496);

      ctx.fillStyle = '#ffffff';
      ctx.font = 'black 52px sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText(productName.substring(0, 14), 256, 90);

      ctx.fillStyle = '#0f172a';
      ctx.font = 'black 48px sans-serif';
      ctx.fillText(productName.split('(')[0] || productName, 256, 260);

      ctx.fillStyle = '#475569';
      ctx.font = 'bold 28px sans-serif';
      ctx.fillText('PREMIUM QUALITY', 256, 320);
    }

    // Barcode at bottom
    ctx.fillStyle = '#0f172a';
    const barY = 460;
    const barWidths = [4, 2, 6, 3, 2, 8, 3, 2, 5, 6, 3, 2, 5, 3, 6, 2, 4];
    let currX = 100;
    for (let w of barWidths) {
      ctx.fillRect(currX, barY, w, 40);
      currX += w + 4;
    }
  }

  const texture = new THREE.CanvasTexture(canvas);
  textureCache.set(cacheKey, texture);
  return texture;
}

/**
 * Creates procedural 2D canvas texture for Yellow Shelf Price Tags
 */
export function createShelfTagTexture(
  priceFormatted: string = '$ 3.50',
  itemCount: number = 12
): THREE.CanvasTexture {
  const cacheKey = `shelf_tag_${priceFormatted}_${itemCount}`;
  if (textureCache.has(cacheKey)) {
    return textureCache.get(cacheKey)!;
  }

  const canvas = document.createElement('canvas');
  canvas.width = 256;
  canvas.height = 128;
  const ctx = canvas.getContext('2d');

  if (ctx) {
    // Yellow Tag Base Background
    ctx.fillStyle = '#facc15';
    ctx.fillRect(0, 0, 256, 128);

    // Black Border
    ctx.strokeStyle = '#000000';
    ctx.lineWidth = 6;
    ctx.strokeRect(3, 3, 250, 122);

    // Left Quantity Box
    ctx.fillStyle = '#000000';
    ctx.fillRect(8, 8, 56, 112);

    ctx.fillStyle = '#ffffff';
    ctx.font = 'black 36px sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(`${itemCount}`, 36, 64);

    // Price Display
    ctx.fillStyle = '#000000';
    ctx.font = 'black 38px sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText(priceFormatted, 150, 50);

    // Barcode Graphic
    const barY = 85;
    const widths = [2, 1, 3, 2, 1, 4, 2, 1, 3, 2, 4, 1, 2, 3];
    let cx = 80;
    for (let w of widths) {
      ctx.fillRect(cx, barY, w, 28);
      cx += w + 2;
    }
  }

  const texture = new THREE.CanvasTexture(canvas);
  textureCache.set(cacheKey, texture);
  return texture;
}

/**
 * Creates a procedural 2D canvas texture for cardboard delivery boxes
 */
export function createCardboardBoxTexture(
  productName: string = 'SUPERMARKET ITEMS',
  boxQuantity: number = 10,
  colorHex: string = '#b45309'
): THREE.CanvasTexture {
  const cacheKey = `box_${productName}_${boxQuantity}_${colorHex}`;
  if (textureCache.has(cacheKey)) {
    return textureCache.get(cacheKey)!;
  }

  const canvas = document.createElement('canvas');
  canvas.width = 512;
  canvas.height = 512;
  const ctx = canvas.getContext('2d');

  if (ctx) {
    // Kraft Brown Base Paper Texture
    ctx.fillStyle = '#c28544';
    ctx.fillRect(0, 0, 512, 512);

    // Cardboard Fiber Texture noise
    ctx.fillStyle = '#a86f34';
    for (let i = 0; i < 600; i++) {
      const rx = Math.random() * 512;
      const ry = Math.random() * 512;
      const rw = Math.random() * 8 + 2;
      ctx.fillRect(rx, ry, rw, 1.5);
    }

    // Top Flap Crease & Center Packing Tape
    ctx.fillStyle = '#d9a76a'; // Tape
    ctx.fillRect(0, 240, 512, 32);
    ctx.strokeStyle = '#825222';
    ctx.lineWidth = 3;
    ctx.strokeRect(2, 2, 508, 508);
    ctx.beginPath();
    ctx.moveTo(0, 256);
    ctx.lineTo(512, 256);
    ctx.stroke();

    // White Shipping & Product Label Sticker
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(30, 60, 220, 140);
    ctx.strokeStyle = '#334155';
    ctx.lineWidth = 2;
    ctx.strokeRect(30, 60, 220, 140);

    // Product Title on Box Label
    ctx.fillStyle = '#0f172a';
    ctx.font = 'extrabold 18px sans-serif';
    ctx.textAlign = 'left';
    ctx.fillText(productName.substring(0, 12), 42, 92);

    // Quantity Badge
    ctx.fillStyle = '#0284c7';
    ctx.font = 'bold 14px sans-serif';
    ctx.fillText(`QTY: ${boxQuantity} PCS`, 42, 118);

    // Barcode on Sticker
    ctx.fillStyle = '#000000';
    const barX = 42;
    const barY = 135;
    const widths = [2, 1, 3, 4, 1, 2, 5, 1, 3, 2, 4, 1, 3, 2];
    let cx = barX;
    for (let w of widths) {
      ctx.fillRect(cx, barY, w, 35);
      cx += w + 2;
    }

    // Handle With Care & Fragile Arrow Symbols on Right Side
    ctx.fillStyle = '#7c2d12';
    ctx.font = 'bold 28px sans-serif';
    ctx.fillText('⬆ ⬆', 360, 120);
    ctx.font = 'bold 12px sans-serif';
    ctx.fillText('THIS SIDE UP', 340, 145);
    ctx.fillText('SUPERMARKET SIM', 320, 175);
  }

  const texture = new THREE.CanvasTexture(canvas);
  textureCache.set(cacheKey, texture);
  return texture;
}

/**
 * Builds realistic, elaborate 3D product meshes with custom geometry & labels
 */
export function createProduct3DMesh(
  productId: string,
  shape: string,
  colorHex: string,
  productName: string = ''
): THREE.Group {
  const group = new THREE.Group();
  const labelTex = createProductLabelTexture(productName || productId, colorHex);

  const mainMat = new THREE.MeshStandardMaterial({
    color: colorHex,
    roughness: 0.3,
    metalness: 0.1,
  });

  const labelMat = new THREE.MeshStandardMaterial({
    map: labelTex,
    roughness: 0.2,
  });

  switch (productId) {
    case 'prod_bread': {
      // Sliced Bread in plastic wrapper with twist clip
      const loafGeo = new THREE.BoxGeometry(0.12, 0.14, 0.22);
      const breadMat = new THREE.MeshStandardMaterial({ color: '#fef08a', roughness: 0.8 });
      const loaf = new THREE.Mesh(loafGeo, breadMat);
      loaf.position.set(0, 0.08, 0);
      group.add(loaf);

      // Plastic Wrapper with label
      const wrapGeo = new THREE.BoxGeometry(0.124, 0.144, 0.224);
      const wrapMat = new THREE.MeshStandardMaterial({
        color: '#ffffff',
        transparent: true,
        opacity: 0.5,
        map: labelTex,
      });
      const wrap = new THREE.Mesh(wrapGeo, wrapMat);
      wrap.position.set(0, 0.08, 0);
      group.add(wrap);

      // Twist Clip at End
      const clip = new THREE.Mesh(
        new THREE.BoxGeometry(0.04, 0.04, 0.02),
        new THREE.MeshStandardMaterial({ color: '#ef4444' })
      );
      clip.position.set(0, 0.08, 0.12);
      group.add(clip);
      break;
    }

    case 'prod_flour':
    case 'prod_sugar': {
      // Paper Sack with top paper folds
      const sackGeo = new THREE.BoxGeometry(0.11, 0.18, 0.08);
      const materials = [
        mainMat,
        mainMat,
        mainMat,
        mainMat,
        labelMat, // Front Label
        mainMat,
      ];
      const sack = new THREE.Mesh(sackGeo, materials);
      sack.position.set(0, 0.09, 0);
      group.add(sack);

      // Folded Pinch Top
      const foldTop = new THREE.Mesh(
        new THREE.BoxGeometry(0.09, 0.025, 0.04),
        new THREE.MeshStandardMaterial({ color: '#cbd5e1', roughness: 0.6 })
      );
      foldTop.position.set(0, 0.19, 0);
      group.add(foldTop);
      break;
    }

    case 'prod_spaghetti': {
      // Spaghetti Pasta Box
      const boxGeo = new THREE.BoxGeometry(0.08, 0.05, 0.28);
      const materials = [
        mainMat,
        mainMat,
        labelMat, // Top
        mainMat,
        mainMat,
        mainMat,
      ];
      const pastaBox = new THREE.Mesh(boxGeo, materials);
      pastaBox.position.set(0, 0.025, 0);
      group.add(pastaBox);
      break;
    }

    case 'prod_cereal': {
      // Tall Cereal Box
      const cerealGeo = new THREE.BoxGeometry(0.14, 0.22, 0.06);
      const materials = [
        mainMat,
        mainMat,
        mainMat,
        mainMat,
        labelMat, // Front
        mainMat,
      ];
      const cerealBox = new THREE.Mesh(cerealGeo, materials);
      cerealBox.position.set(0, 0.11, 0);
      group.add(cerealBox);
      break;
    }

    case 'prod_water': {
      // Water Bottle with ribs & blue cap
      const bottleGeo = new THREE.CylinderGeometry(0.04, 0.04, 0.18, 16);
      const waterMat = new THREE.MeshStandardMaterial({
        color: '#38bdf8',
        transparent: true,
        opacity: 0.7,
        roughness: 0.1,
      });
      const bottle = new THREE.Mesh(bottleGeo, waterMat);
      bottle.position.set(0, 0.09, 0);
      group.add(bottle);

      // Label Band
      const band = new THREE.Mesh(
        new THREE.CylinderGeometry(0.041, 0.041, 0.07, 16),
        labelMat
      );
      band.position.set(0, 0.09, 0);
      group.add(band);

      // Cap
      const cap = new THREE.Mesh(
        new THREE.CylinderGeometry(0.022, 0.022, 0.025, 12),
        new THREE.MeshStandardMaterial({ color: '#0284c7' })
      );
      cap.position.set(0, 0.19, 0);
      group.add(cap);
      break;
    }

    case 'prod_soda': {
      // Aluminum Soda Can with Pull Tab
      const canGeo = new THREE.CylinderGeometry(0.042, 0.042, 0.14, 16);
      const canMat = new THREE.MeshStandardMaterial({
        color: '#ef4444',
        metalness: 0.8,
        roughness: 0.2,
      });
      const sodaCan = new THREE.Mesh(canGeo, canMat);
      sodaCan.position.set(0, 0.07, 0);
      group.add(sodaCan);

      // Label Band
      const band = new THREE.Mesh(
        new THREE.CylinderGeometry(0.043, 0.043, 0.09, 16),
        labelMat
      );
      band.position.set(0, 0.07, 0);
      group.add(band);

      // Metallic Top & Pull Tab
      const topDisk = new THREE.Mesh(
        new THREE.CylinderGeometry(0.04, 0.042, 0.01, 16),
        new THREE.MeshStandardMaterial({ color: '#94a3b8', metalness: 0.9 })
      );
      topDisk.position.set(0, 0.145, 0);
      group.add(topDisk);
      break;
    }

    case 'prod_milk': {
      // Milk Carton with Gable-top Peak
      const body = new THREE.Mesh(
        new THREE.BoxGeometry(0.1, 0.18, 0.1),
        [mainMat, mainMat, mainMat, mainMat, labelMat, mainMat]
      );
      body.position.set(0, 0.09, 0);
      group.add(body);

      // Peak Roof
      const roof = new THREE.Mesh(
        new THREE.ConeGeometry(0.075, 0.06, 4),
        new THREE.MeshStandardMaterial({ color: '#0284c7' })
      );
      roof.position.set(0, 0.21, 0);
      roof.rotation.y = Math.PI / 4;
      group.add(roof);
      break;
    }

    case 'prod_oil':
    case 'prod_detergent': {
      // Bottle with Handle & Nozzle Cap
      const body = new THREE.Mesh(
        new THREE.CylinderGeometry(0.05, 0.055, 0.2, 16),
        [mainMat, labelMat, mainMat]
      );
      body.position.set(0, 0.1, 0);
      group.add(body);

      const cap = new THREE.Mesh(
        new THREE.CylinderGeometry(0.02, 0.025, 0.03, 12),
        new THREE.MeshStandardMaterial({ color: '#ffffff' })
      );
      cap.position.set(0, 0.215, 0);
      group.add(cap);
      break;
    }

    case 'prod_apple': {
      // 3D Apple with Stem and Leaf
      const appleMat = new THREE.MeshStandardMaterial({
        color: '#dc2626',
        roughness: 0.2,
      });
      const apple = new THREE.Mesh(new THREE.SphereGeometry(0.055, 16, 16), appleMat);
      apple.position.set(0, 0.055, 0);
      apple.scale.set(1, 0.9, 1);
      group.add(apple);

      // Stem
      const stem = new THREE.Mesh(
        new THREE.CylinderGeometry(0.003, 0.003, 0.02, 8),
        new THREE.MeshStandardMaterial({ color: '#451a03' })
      );
      stem.position.set(0, 0.105, 0);
      group.add(stem);

      // Leaf
      const leaf = new THREE.Mesh(
        new THREE.BoxGeometry(0.02, 0.002, 0.01),
        new THREE.MeshStandardMaterial({ color: '#16a34a' })
      );
      leaf.position.set(0.01, 0.108, 0);
      group.add(leaf);
      break;
    }

    case 'prod_banana': {
      // Curved Banana Bundle (3 bananas joined together)
      const bananaMat = new THREE.MeshStandardMaterial({
        color: '#facc15',
        roughness: 0.4,
      });

      [-0.02, 0, 0.02].forEach((xOff, idx) => {
        const b = new THREE.Mesh(new THREE.CylinderGeometry(0.018, 0.018, 0.16, 8), bananaMat);
        b.position.set(xOff, 0.06, (idx % 2) * 0.01);
        b.rotation.z = (idx - 1) * 0.25;
        b.rotation.x = 0.2;
        group.add(b);
      });

      // Stem Joining Crown
      const crown = new THREE.Mesh(
        new THREE.BoxGeometry(0.06, 0.02, 0.03),
        new THREE.MeshStandardMaterial({ color: '#15803d' })
      );
      crown.position.set(0, 0.13, 0.01);
      group.add(crown);
      break;
    }

    default: {
      // General Box Product
      const genBox = new THREE.Mesh(
        new THREE.BoxGeometry(0.12, 0.18, 0.08),
        [mainMat, mainMat, mainMat, mainMat, labelMat, mainMat]
      );
      genBox.position.set(0, 0.09, 0);
      group.add(genBox);
      break;
    }
  }

  return group;
}
