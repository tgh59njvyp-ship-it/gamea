import React from 'react';
import { ShelfData, ShelfType, ProductItem } from '../../types/game';
import { Product3D } from './Product3D';

interface Shelves3DProps {
  shelf: ShelfData;
  productsMap: Map<string, ProductItem>;
  onSlotClick?: (shelfId: string, tierIndex: number, slotIndex: number) => void;
}

export const Shelves3D: React.FC<Shelves3DProps> = ({
  shelf,
  productsMap,
  onSlotClick,
}) => {
  const { id, type, position, rotation, slots } = shelf;

  return (
    <group position={position} rotation={[0, rotation, 0]}>
      {/* 1. STANDARD RACK SHELF */}
      {type === ShelfType.STANDARD_RACK && (
        <group>
          {/* Back Wall of Shelf */}
          <mesh position={[0, 1.0, -0.28]} castShadow receiveShadow>
            <boxGeometry args={[1.8, 2.0, 0.04]} />
            <meshStandardMaterial color="#334155" roughness={0.5} />
          </mesh>

          {/* Left & Right Side Metal Posts */}
          <mesh position={[-0.9, 1.0, 0]} castShadow receiveShadow>
            <boxGeometry args={[0.06, 2.0, 0.6]} />
            <meshStandardMaterial color="#1e293b" roughness={0.3} metalness={0.6} />
          </mesh>
          <mesh position={[0.9, 1.0, 0]} castShadow receiveShadow>
            <boxGeometry args={[0.06, 2.0, 0.6]} />
            <meshStandardMaterial color="#1e293b" roughness={0.3} metalness={0.6} />
          </mesh>

          {/* Base Platform */}
          <mesh position={[0, 0.1, 0]} castShadow receiveShadow>
            <boxGeometry args={[1.8, 0.2, 0.6]} />
            <meshStandardMaterial color="#475569" roughness={0.4} />
          </mesh>

          {/* 3 Tier Wooden Shelves */}
          {[0.5, 1.0, 1.5].map((yHeight, tierIdx) => (
            <group key={`tier_${tierIdx}`}>
              {/* Shelf Plank */}
              <mesh position={[0, yHeight, 0]} castShadow receiveShadow>
                <boxGeometry args={[1.74, 0.04, 0.55]} />
                <meshStandardMaterial color="#e2e8f0" roughness={0.2} metalness={0.2} />
              </mesh>

              {/* Price Tag Rail */}
              <mesh position={[0, yHeight, 0.28]}>
                <boxGeometry args={[1.74, 0.03, 0.01]} />
                <meshStandardMaterial color="#ef4444" roughness={0.3} />
              </mesh>

              {/* Products placed on this tier */}
              {[-0.45, 0.45].map((xOffset, slotIdx) => {
                const slot = slots.find(
                  (s) => s.tierIndex === tierIdx && s.slotIndex === slotIdx
                );
                const product = slot?.productId ? productsMap.get(slot.productId) : null;

                return (
                  <group
                    key={`slot_${tierIdx}_${slotIdx}`}
                    position={[xOffset, yHeight + 0.02, 0]}
                    onClick={(e) => {
                      e.stopPropagation();
                      if (onSlotClick) onSlotClick(id, tierIdx, slotIdx);
                    }}
                  >
                    {/* Slot Highlight / Target zone */}
                    <mesh position={[0, 0.001, 0]} rotation={[-Math.PI / 2, 0, 0]}>
                      <planeGeometry args={[0.7, 0.45]} />
                      <meshBasicMaterial
                        color={product ? '#ffffff' : '#38bdf8'}
                        transparent
                        opacity={0.05}
                      />
                    </mesh>

                    {/* Render Stock items in neat rows */}
                    {product &&
                      Array.from({ length: Math.min(slot?.count || 0, 8) }).map((_, itemIdx) => {
                        const row = Math.floor(itemIdx / 2);
                        const col = itemIdx % 2;
                        const px = (col - 0.5) * 0.18;
                        const pz = (row - 1) * 0.12;

                        return (
                          <Product3D
                            key={`prod_${itemIdx}`}
                            shape={product.shape}
                            color={product.color}
                            position={[px, 0, pz]}
                            scale={0.9}
                          />
                        );
                      })}
                  </group>
                );
              })}
            </group>
          ))}
        </group>
      )}

      {/* 2. REFRIGERATOR DISPLAY */}
      {type === ShelfType.REFRIGERATOR && (
        <group>
          {/* Main Fridge Cabinet Frame */}
          <mesh position={[0, 1.1, 0]} castShadow receiveShadow>
            <boxGeometry args={[1.8, 2.2, 0.7]} />
            <meshStandardMaterial color="#0f172a" roughness={0.3} metalness={0.7} />
          </mesh>

          {/* Internal Cold Glowing Back Cavity */}
          <mesh position={[0, 1.1, 0.02]}>
            <boxGeometry args={[1.68, 2.08, 0.62]} />
            <meshStandardMaterial color="#f0f9ff" roughness={0.1} emissive="#0284c7" emissiveIntensity={0.2} />
          </mesh>

          {/* Internal LED Light Bar at Top */}
          <mesh position={[0, 2.1, 0.2]}>
            <boxGeometry args={[1.6, 0.04, 0.1]} />
            <meshStandardMaterial color="#ffffff" emissive="#e0f2fe" emissiveIntensity={1.0} />
          </mesh>

          {/* Glass Doors (Transparent) */}
          <mesh position={[0, 1.1, 0.35]}>
            <boxGeometry args={[1.72, 2.05, 0.02]} />
            <meshStandardMaterial
              color="#bae6fd"
              transparent
              opacity={0.25}
              roughness={0.05}
              metalness={0.9}
            />
          </mesh>

          {/* Door Handles */}
          <mesh position={[-0.05, 1.1, 0.38]}>
            <boxGeometry args={[0.03, 0.6, 0.03]} />
            <meshStandardMaterial color="#94a3b8" metalness={0.9} roughness={0.1} />
          </mesh>
          <mesh position={[0.05, 1.1, 0.38]}>
            <boxGeometry args={[0.03, 0.6, 0.03]} />
            <meshStandardMaterial color="#94a3b8" metalness={0.9} roughness={0.1} />
          </mesh>

          {/* 3 Metal Wire Shelves */}
          {[0.55, 1.05, 1.55].map((yHeight, tierIdx) => (
            <group key={`fridge_tier_${tierIdx}`}>
              <mesh position={[0, yHeight, 0]} castShadow receiveShadow>
                <boxGeometry args={[1.66, 0.02, 0.55]} />
                <meshStandardMaterial color="#38bdf8" roughness={0.1} metalness={0.8} />
              </mesh>

              {[-0.42, 0.42].map((xOffset, slotIdx) => {
                const slot = slots.find(
                  (s) => s.tierIndex === tierIdx && s.slotIndex === slotIdx
                );
                const product = slot?.productId ? productsMap.get(slot.productId) : null;

                return (
                  <group
                    key={`fridge_slot_${tierIdx}_${slotIdx}`}
                    position={[xOffset, yHeight + 0.02, 0]}
                    onClick={(e) => {
                      e.stopPropagation();
                      if (onSlotClick) onSlotClick(id, tierIdx, slotIdx);
                    }}
                  >
                    {product &&
                      Array.from({ length: Math.min(slot?.count || 0, 10) }).map((_, itemIdx) => {
                        const row = Math.floor(itemIdx / 2);
                        const col = itemIdx % 2;
                        const px = (col - 0.5) * 0.16;
                        const pz = (row - 1.5) * 0.11;

                        return (
                          <Product3D
                            key={`fridge_prod_${itemIdx}`}
                            shape={product.shape}
                            color={product.color}
                            position={[px, 0, pz]}
                            scale={0.88}
                          />
                        );
                      })}
                  </group>
                );
              })}
            </group>
          ))}
        </group>
      )}

      {/* 3. PRODUCE DISPLAY TABLE */}
      {type === ShelfType.PRODUCE_DISPLAY && (
        <group>
          {/* Wooden Table Base Legs */}
          <mesh position={[-0.8, 0.35, -0.3]} castShadow receiveShadow>
            <boxGeometry args={[0.08, 0.7, 0.08]} />
            <meshStandardMaterial color="#78350f" roughness={0.8} />
          </mesh>
          <mesh position={[0.8, 0.35, -0.3]} castShadow receiveShadow>
            <boxGeometry args={[0.08, 0.7, 0.08]} />
            <meshStandardMaterial color="#78350f" roughness={0.8} />
          </mesh>
          <mesh position={[-0.8, 0.35, 0.3]} castShadow receiveShadow>
            <boxGeometry args={[0.08, 0.7, 0.08]} />
            <meshStandardMaterial color="#78350f" roughness={0.8} />
          </mesh>
          <mesh position={[0.8, 0.35, 0.3]} castShadow receiveShadow>
            <boxGeometry args={[0.08, 0.7, 0.08]} />
            <meshStandardMaterial color="#78350f" roughness={0.8} />
          </mesh>

          {/* Angled Wooden Produce Bin Container */}
          <mesh position={[0, 0.75, 0]} rotation={[0.15, 0, 0]} castShadow receiveShadow>
            <boxGeometry args={[1.8, 0.22, 0.8]} />
            <meshStandardMaterial color="#a16207" roughness={0.7} />
          </mesh>

          {/* Divider Plank */}
          <mesh position={[0, 0.8, 0]} rotation={[0.15, 0, 0]}>
            <boxGeometry args={[0.04, 0.24, 0.78]} />
            <meshStandardMaterial color="#78350f" roughness={0.8} />
          </mesh>

          {/* Slots for Produce items */}
          {[-0.45, 0.45].map((xOffset, slotIdx) => {
            const slot = slots.find((s) => s.slotIndex === slotIdx);
            const product = slot?.productId ? productsMap.get(slot.productId) : null;

            return (
              <group
                key={`produce_slot_${slotIdx}`}
                position={[xOffset, 0.8, 0]}
                rotation={[0.15, 0, 0]}
                onClick={(e) => {
                  e.stopPropagation();
                  if (onSlotClick) onSlotClick(id, 0, slotIdx);
                }}
              >
                {product &&
                  Array.from({ length: Math.min(slot?.count || 0, 8) }).map((_, itemIdx) => {
                    const row = Math.floor(itemIdx / 3);
                    const col = itemIdx % 3;
                    const px = (col - 1) * 0.15;
                    const pz = (row - 0.5) * 0.16;

                    return (
                      <Product3D
                        key={`produce_prod_${itemIdx}`}
                        shape={product.shape}
                        color={product.color}
                        position={[px, 0.02, pz]}
                        scale={1.05}
                      />
                    );
                  })}
              </group>
            );
          })}
        </group>
      )}
    </group>
  );
};
