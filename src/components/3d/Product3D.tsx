import React from 'react';

interface Product3DProps {
  shape: 'box' | 'carton' | 'can' | 'fruit' | 'bottle' | 'bag';
  color: string;
  name?: string;
  position?: [number, number, number];
  rotation?: [number, number, number];
  scale?: number;
}

export const Product3D: React.FC<Product3DProps> = ({
  shape,
  color,
  position = [0, 0, 0],
  rotation = [0, 0, 0],
  scale = 1,
}) => {
  // We construct Three.js JSX element primitives using standard react-three or React custom 3D element tags
  return (
    <group position={position} rotation={rotation} scale={[scale, scale, scale]}>
      {shape === 'carton' && (
        <group>
          {/* Main Milk/Juice Carton Body */}
          <mesh position={[0, 0.12, 0]} castShadow receiveShadow>
            <boxGeometry args={[0.1, 0.22, 0.1]} />
            <meshStandardMaterial color={color} roughness={0.3} metalness={0.1} />
          </mesh>
          {/* Top Slanted Fold */}
          <mesh position={[0, 0.25, 0]} rotation={[0, 0, 0]} castShadow>
            <coneGeometry args={[0.07, 0.06, 4]} />
            <meshStandardMaterial color={color} roughness={0.3} />
          </mesh>
        </group>
      )}

      {shape === 'bottle' && (
        <group>
          {/* Bottle Base */}
          <mesh position={[0, 0.1, 0]} castShadow receiveShadow>
            <cylinderGeometry args={[0.045, 0.045, 0.2, 16]} />
            <meshStandardMaterial color={color} roughness={0.2} transparent opacity={0.88} />
          </mesh>
          {/* Bottle Neck */}
          <mesh position={[0, 0.22, 0]} castShadow>
            <cylinderGeometry args={[0.02, 0.04, 0.06, 16]} />
            <meshStandardMaterial color={color} roughness={0.2} transparent opacity={0.88} />
          </mesh>
          {/* Bottle Cap */}
          <mesh position={[0, 0.26, 0]} castShadow>
            <cylinderGeometry args={[0.022, 0.022, 0.02, 16]} />
            <meshStandardMaterial color="#ffffff" roughness={0.5} />
          </mesh>
        </group>
      )}

      {shape === 'can' && (
        <group>
          <mesh position={[0, 0.08, 0]} castShadow receiveShadow>
            <cylinderGeometry args={[0.04, 0.04, 0.14, 16]} />
            <meshStandardMaterial color={color} roughness={0.2} metalness={0.7} />
          </mesh>
          {/* Can Top Rim */}
          <mesh position={[0, 0.151, 0]}>
            <cylinderGeometry args={[0.038, 0.038, 0.005, 16]} />
            <meshStandardMaterial color="#cccccc" roughness={0.1} metalness={0.9} />
          </mesh>
        </group>
      )}

      {shape === 'fruit' && (
        <group>
          <mesh position={[0, 0.06, 0]} castShadow receiveShadow>
            <sphereGeometry args={[0.06, 16, 16]} />
            <meshStandardMaterial color={color} roughness={0.6} />
          </mesh>
          {/* Small Stem */}
          <mesh position={[0, 0.12, 0]}>
            <cylinderGeometry args={[0.005, 0.005, 0.02, 8]} />
            <meshStandardMaterial color="#422006" roughness={0.9} />
          </mesh>
        </group>
      )}

      {shape === 'box' && (
        <mesh position={[0, 0.1, 0]} castShadow receiveShadow>
          <boxGeometry args={[0.14, 0.18, 0.08]} />
          <meshStandardMaterial color={color} roughness={0.4} />
        </mesh>
      )}

      {shape === 'bag' && (
        <group>
          <mesh position={[0, 0.1, 0]} castShadow receiveShadow>
            <cylinderGeometry args={[0.06, 0.05, 0.18, 12]} />
            <meshStandardMaterial color={color} roughness={0.5} />
          </mesh>
          {/* Top crimp */}
          <mesh position={[0, 0.19, 0]}>
            <boxGeometry args={[0.12, 0.02, 0.02]} />
            <meshStandardMaterial color={color} roughness={0.5} />
          </mesh>
        </group>
      )}
    </group>
  );
};
