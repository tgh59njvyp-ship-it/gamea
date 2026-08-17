import React from 'react';
import { CustomerData, ProductItem } from '../../types/game';
import { Product3D } from './Product3D';

interface CheckoutCounter3DProps {
  position: [number, number, number];
  customer: CustomerData | null;
  productsMap: Map<string, ProductItem>;
  scannedItemIndex: number; // How many items scanned so far
  onScanItem?: () => void;
  onRegisterClick?: () => void;
}

export const CheckoutCounter3D: React.FC<CheckoutCounter3DProps> = ({
  position,
  customer,
  productsMap,
  scannedItemIndex,
  onScanItem,
  onRegisterClick,
}) => {
  return (
    <group position={position}>
      {/* Main Checkout Counter Desk */}
      <mesh position={[0, 0.45, 0]} castShadow receiveShadow>
        <boxGeometry args={[2.2, 0.9, 1.1]} />
        <meshStandardMaterial color="#1e293b" roughness={0.4} />
      </mesh>

      {/* Counter Top Surface (Black Matte Plastic) */}
      <mesh position={[0, 0.91, 0]} receiveShadow>
        <boxGeometry args={[2.22, 0.04, 1.12]} />
        <meshStandardMaterial color="#0f172a" roughness={0.2} metalness={0.2} />
      </mesh>

      {/* Moving Conveyor Belt Area */}
      <mesh position={[-0.4, 0.93, 0]}>
        <boxGeometry args={[1.1, 0.01, 0.7]} />
        <meshStandardMaterial color="#334155" roughness={0.9} />
      </mesh>

      {/* Silver Edge Trim on Conveyor */}
      <mesh position={[-0.4, 0.935, 0.36]}>
        <boxGeometry args={[1.1, 0.02, 0.02]} />
        <meshStandardMaterial color="#94a3b8" metalness={0.8} roughness={0.1} />
      </mesh>

      {/* POS Register Terminal Monitor Stand */}
      <mesh position={[0.6, 1.1, 0.2]} castShadow>
        <cylinderGeometry args={[0.04, 0.05, 0.4, 16]} />
        <meshStandardMaterial color="#475569" metalness={0.6} roughness={0.3} />
      </mesh>

      {/* POS Monitor Screen */}
      <group
        position={[0.6, 1.35, 0.2]}
        rotation={[0, -0.4, 0.2]}
        onClick={(e) => {
          e.stopPropagation();
          if (onRegisterClick) onRegisterClick();
        }}
      >
        <mesh castShadow>
          <boxGeometry args={[0.45, 0.35, 0.05]} />
          <meshStandardMaterial color="#0f172a" roughness={0.2} />
        </mesh>
        {/* Glowing POS Screen Display */}
        <mesh position={[0, 0, 0.026]}>
          <planeGeometry args={[0.4, 0.3]} />
          <meshStandardMaterial
            color="#0284c7"
            emissive="#0369a1"
            emissiveIntensity={0.6}
          />
        </mesh>
      </group>

      {/* Barcode Scanner Unit embedded in counter */}
      <group
        position={[0.1, 0.935, 0]}
        onClick={(e) => {
          e.stopPropagation();
          if (onScanItem) onScanItem();
        }}
      >
        {/* Glass Scan Window */}
        <mesh>
          <boxGeometry args={[0.22, 0.01, 0.22]} />
          <meshStandardMaterial
            color="#ef4444"
            emissive="#dc2626"
            emissiveIntensity={0.8}
          />
        </mesh>

        {/* Laser Beam Projection */}
        <mesh position={[0, 0.15, 0]}>
          <cylinderGeometry args={[0.002, 0.15, 0.3, 16]} />
          <meshBasicMaterial color="#ff0000" transparent opacity={0.4} />
        </mesh>
      </group>

      {/* Handheld Scanner Gun Resting on Dock */}
      <group position={[0.3, 0.98, -0.2]} rotation={[0, 0.5, 0.3]}>
        <mesh castShadow>
          <boxGeometry args={[0.06, 0.18, 0.08]} />
          <meshStandardMaterial color="#f97316" roughness={0.4} />
        </mesh>
      </group>

      {/* Cash Drawer underneath */}
      <mesh position={[0.6, 0.7, -0.2]}>
        <boxGeometry args={[0.5, 0.12, 0.45]} />
        <meshStandardMaterial color="#334155" metalness={0.7} roughness={0.3} />
      </mesh>

      {/* Payment Terminal (Card Swiper) */}
      <group position={[0.7, 0.95, -0.3]} rotation={[0, -0.3, 0.1]}>
        <mesh castShadow>
          <boxGeometry args={[0.15, 0.08, 0.22]} />
          <meshStandardMaterial color="#1e293b" roughness={0.3} />
        </mesh>
        {/* PinPad screen */}
        <mesh position={[0, 0.041, -0.04]}>
          <planeGeometry args={[0.1, 0.08]} />
          <meshStandardMaterial color="#10b981" emissive="#059669" emissiveIntensity={0.5} />
        </mesh>
      </group>

      {/* Customer items placed on conveyor belt waiting to be scanned */}
      {customer && (
        <group>
          {customer.cart.map((cartItem, idx) => {
            const product = productsMap.get(cartItem.productId);
            if (!product) return null;

            const isScanned = idx < scannedItemIndex;
            // Unscanned items sit on conveyor belt on the left; scanned items move to the right
            const posX = isScanned ? 0.4 + idx * 0.12 : -0.7 + (idx - scannedItemIndex) * 0.15;
            const posZ = (idx % 2 === 0 ? 0.1 : -0.1);

            return (
              <Product3D
                key={`checkout_item_${idx}`}
                shape={product.shape}
                color={product.color}
                position={[posX, 0.94, posZ]}
                scale={0.95}
              />
            );
          })}
        </group>
      )}
    </group>
  );
};
