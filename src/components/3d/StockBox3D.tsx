import React from 'react';
import { StockBoxData, ProductItem } from '../../types/game';

interface StockBox3DProps {
  box: StockBoxData;
  product?: ProductItem;
  onBoxClick?: (boxId: string) => void;
}

export const StockBox3D: React.FC<StockBox3DProps> = ({
  box,
  product,
  onBoxClick,
}) => {
  const { id, position, count, isHeldByPlayer } = box;

  if (isHeldByPlayer) return null; // Held box rendered attached to player camera view

  return (
    <group
      position={position}
      onClick={(e) => {
        e.stopPropagation();
        if (onBoxClick) onBoxClick(id);
      }}
    >
      {/* Cardboard Box Body */}
      <mesh castShadow receiveShadow position={[0, 0.18, 0]}>
        <boxGeometry args={[0.55, 0.36, 0.45]} />
        <meshStandardMaterial color="#b45309" roughness={0.9} />
      </mesh>

      {/* Box Top Tape Strip */}
      <mesh position={[0, 0.361, 0]}>
        <planeGeometry args={[0.12, 0.45]} />
        <meshStandardMaterial color="#fef08a" roughness={0.3} rotation={[-Math.PI / 2, 0, 0]} />
      </mesh>

      {/* Side Label Tag */}
      <mesh position={[0.276, 0.18, 0]} rotation={[0, Math.PI / 2, 0]}>
        <planeGeometry args={[0.3, 0.2]} />
        <meshStandardMaterial color="#f8fafc" roughness={0.2} />
      </mesh>

      {/* Product Color Band on Box */}
      {product && (
        <mesh position={[0.277, 0.24, 0]} rotation={[0, Math.PI / 2, 0]}>
          <planeGeometry args={[0.28, 0.05]} />
          <meshBasicMaterial color={product.color} />
        </mesh>
      )}
    </group>
  );
};
