import React from 'react';
import { CustomerData, CustomerState } from '../../types/game';

interface Customer3DProps {
  customer: CustomerData;
}

export const Customer3D: React.FC<Customer3DProps> = ({ customer }) => {
  const { position, avatarColor, mood, thought, state } = customer;

  return (
    <group position={position}>
      {/* 1. Customer Head */}
      <mesh position={[0, 1.5, 0]} castShadow>
        <sphereGeometry args={[0.18, 16, 16]} />
        <meshStandardMaterial color="#fed7aa" roughness={0.6} />
      </mesh>

      {/* Hair / Hat Accent */}
      <mesh position={[0, 1.62, 0]} castShadow>
        <sphereGeometry args={[0.185, 16, 12, 0, Math.PI * 2, 0, Math.PI / 2.5]} />
        <meshStandardMaterial color={avatarColor} roughness={0.4} />
      </mesh>

      {/* Eyes */}
      <mesh position={[0.06, 1.52, 0.16]}>
        <sphereGeometry args={[0.025, 8, 8]} />
        <meshBasicMaterial color="#0f172a" />
      </mesh>
      <mesh position={[-0.06, 1.52, 0.16]}>
        <sphereGeometry args={[0.025, 8, 8]} />
        <meshBasicMaterial color="#0f172a" />
      </mesh>

      {/* 2. Torso (Shirt) */}
      <mesh position={[0, 1.0, 0]} castShadow receiveShadow>
        <cylinderGeometry args={[0.2, 0.24, 0.7, 16]} />
        <meshStandardMaterial color={avatarColor} roughness={0.5} />
      </mesh>

      {/* 3. Arms holding shopping basket */}
      <mesh position={[0.24, 0.95, 0.15]} rotation={[0.4, 0, 0]} castShadow>
        <cylinderGeometry args={[0.05, 0.05, 0.45, 8]} />
        <meshStandardMaterial color={avatarColor} roughness={0.5} />
      </mesh>
      <mesh position={[-0.24, 0.95, 0.15]} rotation={[0.4, 0, 0]} castShadow>
        <cylinderGeometry args={[0.05, 0.05, 0.45, 8]} />
        <meshStandardMaterial color={avatarColor} roughness={0.5} />
      </mesh>

      {/* 4. Shopping Basket in hands */}
      <group position={[0, 0.75, 0.35]}>
        <mesh castShadow receiveShadow>
          <boxGeometry args={[0.4, 0.22, 0.3]} />
          <meshStandardMaterial color="#ef4444" roughness={0.4} wireframe={false} />
        </mesh>
        {/* Wireframe overlay to look like plastic mesh basket */}
        <mesh>
          <boxGeometry args={[0.402, 0.222, 0.302]} />
          <meshBasicMaterial color="#7f1d1d" wireframe />
        </mesh>
      </group>

      {/* 5. Legs */}
      <mesh position={[0.1, 0.35, 0]} castShadow>
        <cylinderGeometry args={[0.07, 0.07, 0.65, 12]} />
        <meshStandardMaterial color="#334155" roughness={0.6} />
      </mesh>
      <mesh position={[-0.1, 0.35, 0]} castShadow>
        <cylinderGeometry args={[0.07, 0.07, 0.65, 12]} />
        <meshStandardMaterial color="#334155" roughness={0.6} />
      </mesh>

      {/* 6. Emoji / Thought Bubble Indicator Above Head */}
      <group position={[0, 2.0, 0]}>
        {/* Floating Bubble Background */}
        <mesh>
          <sphereGeometry args={[0.22, 16, 16]} />
          <meshBasicMaterial color="#ffffff" transparent opacity={0.9} />
        </mesh>
        <mesh position={[0, -0.15, 0]} rotation={[0, 0, Math.PI / 4]}>
          <coneGeometry args={[0.08, 0.15, 4]} />
          <meshBasicMaterial color="#ffffff" transparent opacity={0.9} />
        </mesh>

        {/* Status ring color around bubble */}
        <mesh>
          <ringGeometry args={[0.22, 0.25, 24]} />
          <meshBasicMaterial
            color={
              mood === 'angry'
                ? '#ef4444'
                : mood === 'happy'
                ? '#10b981'
                : state === CustomerState.AT_REGISTER
                ? '#f59e0b'
                : '#3b82f6'
            }
          />
        </mesh>
      </group>
    </group>
  );
};
