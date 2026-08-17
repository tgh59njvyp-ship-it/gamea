import React from 'react';

interface SupermarketSceneProps {
  storeName: string;
  doorOpen: boolean;
}

export const SupermarketScene: React.FC<SupermarketSceneProps> = ({
  storeName,
  doorOpen,
}) => {
  return (
    <group>
      {/* 1. STORE FLOOR TILES (Main Sales Floor) */}
      <mesh position={[0, 0, 1]} receiveShadow rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[10, 10]} />
        <meshStandardMaterial color="#f8fafc" roughness={0.15} metalness={0.05} />
      </mesh>

      {/* Grid lines on tile floor */}
      <gridHelper args={[10, 10, '#cbd5e1', '#e2e8f0']} position={[0, 0.001, 1]} />

      {/* 2. BACKROOM STORAGE FLOOR (Industrial Concrete Grey) */}
      <mesh position={[0, 0, 5.5]} receiveShadow rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[10, 3]} />
        <meshStandardMaterial color="#64748b" roughness={0.7} />
      </mesh>

      {/* 3. WALLS */}
      {/* Back Wall (separates store from outside world) */}
      <mesh position={[0, 2.5, -4]} receiveShadow castShadow>
        <boxGeometry args={[10, 5, 0.2]} />
        <meshStandardMaterial color="#38bdf8" roughness={0.3} />
      </mesh>

      {/* Left Wall */}
      <mesh position={[-5, 2.5, 1]} receiveShadow castShadow>
        <boxGeometry args={[0.2, 5, 12]} />
        <meshStandardMaterial color="#f1f5f9" roughness={0.5} />
      </mesh>

      {/* Right Wall */}
      <mesh position={[5, 2.5, 1]} receiveShadow castShadow>
        <boxGeometry args={[0.2, 5, 12]} />
        <meshStandardMaterial color="#f1f5f9" roughness={0.5} />
      </mesh>

      {/* Partition Wall separating Sales Floor from Storage Backroom */}
      <mesh position={[-2.5, 2.0, 4]} receiveShadow castShadow>
        <boxGeometry args={[5, 4, 0.15]} />
        <meshStandardMaterial color="#cbd5e1" roughness={0.6} />
      </mesh>
      <mesh position={[2.5, 2.0, 4]} receiveShadow castShadow>
        <boxGeometry args={[3, 4, 0.15]} />
        <meshStandardMaterial color="#cbd5e1" roughness={0.6} />
      </mesh>

      {/* 4. ENTRANCE AUTOMATIC GLASS SLIDING DOORS (Front Window & Entrance at z = 6) */}
      {/* Front Glass Frame */}
      <mesh position={[-3, 2.0, 6]} castShadow>
        <boxGeometry args={[4, 4, 0.1]} />
        <meshStandardMaterial color="#0f172a" roughness={0.2} />
      </mesh>
      <mesh position={[3, 2.0, 6]} castShadow>
        <boxGeometry args={[4, 4, 0.1]} />
        <meshStandardMaterial color="#0f172a" roughness={0.2} />
      </mesh>

      {/* Top Store Signboard with Store Name */}
      <group position={[0, 4.2, 6.05]}>
        <mesh castShadow>
          <boxGeometry args={[5.5, 1.0, 0.15]} />
          <meshStandardMaterial color="#0284c7" roughness={0.2} />
        </mesh>
        {/* Neon Border */}
        <mesh position={[0, 0, 0.08]}>
          <boxGeometry args={[5.3, 0.8, 0.02]} />
          <meshStandardMaterial color="#38bdf8" emissive="#0284c7" emissiveIntensity={0.8} />
        </mesh>
      </group>

      {/* Left Glass Door Panel */}
      <mesh position={[doorOpen ? -1.8 : -0.55, 1.7, 6]} castShadow>
        <boxGeometry args={[1.1, 3.4, 0.05]} />
        <meshStandardMaterial color="#38bdf8" transparent opacity={0.3} roughness={0.1} />
      </mesh>

      {/* Right Glass Door Panel */}
      <mesh position={[doorOpen ? 1.8 : 0.55, 1.7, 6]} castShadow>
        <boxGeometry args={[1.1, 3.4, 0.05]} />
        <meshStandardMaterial color="#38bdf8" transparent opacity={0.3} roughness={0.1} />
      </mesh>

      {/* 5. BACKROOM LAPTOP DESK & TERMINAL */}
      <group position={[4, 0, 4.5]}>
        {/* Wooden Office Desk */}
        <mesh position={[0, 0.45, 0]} castShadow receiveShadow>
          <boxGeometry args={[1.4, 0.9, 0.8]} />
          <meshStandardMaterial color="#a16207" roughness={0.6} />
        </mesh>

        {/* Laptop Base */}
        <mesh position={[0, 0.91, 0]}>
          <boxGeometry args={[0.35, 0.02, 0.25]} />
          <meshStandardMaterial color="#334155" metalness={0.8} roughness={0.2} />
        </mesh>
        {/* Laptop Open Screen */}
        <mesh position={[0, 1.03, -0.1]} rotation={[-0.3, 0, 0]}>
          <boxGeometry args={[0.35, 0.24, 0.02]} />
          <meshStandardMaterial color="#0284c7" emissive="#0369a1" emissiveIntensity={0.8} />
        </mesh>
      </group>

      {/* 6. OUTSIDE STREET ENVIRONMENT */}
      {/* Sidewalk */}
      <mesh position={[0, -0.01, 8.5]} receiveShadow rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[20, 5]} />
        <meshStandardMaterial color="#94a3b8" roughness={0.8} />
      </mesh>

      {/* Asphalt Road */}
      <mesh position={[0, -0.02, 13]} receiveShadow rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[20, 8]} />
        <meshStandardMaterial color="#1e293b" roughness={0.9} />
      </mesh>

      {/* Yellow Road Stripe Lines */}
      <mesh position={[0, -0.015, 13]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[20, 0.2]} />
        <meshStandardMaterial color="#facc15" roughness={0.5} />
      </mesh>

      {/* 7. CEILING & LIGHT FIXTURES */}
      <mesh position={[0, 4.8, 1]} rotation={[Math.PI / 2, 0, 0]}>
        <planeGeometry args={[10, 10]} />
        <meshStandardMaterial color="#f8fafc" roughness={0.8} />
      </mesh>

      {/* Long Ceiling LED Light Panels */}
      {[-2, 2].map((xPos, idx) => (
        <group key={`ceiling_light_${idx}`} position={[xPos, 4.75, 1]}>
          <mesh>
            <boxGeometry args={[0.4, 0.05, 6]} />
            <meshStandardMaterial color="#ffffff" emissive="#ffffff" emissiveIntensity={1.0} />
          </mesh>
          <pointLight position={[0, -0.3, 0]} intensity={1.5} distance={10} color="#ffffff" />
        </group>
      ))}
    </group>
  );
};
