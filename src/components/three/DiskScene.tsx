import { useRef, useMemo } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls, Text } from "@react-three/drei";
import * as THREE from "three";
import { AlgorithmResult } from "@/lib/algorithms/types";

interface DiskSceneProps {
  result: AlgorithmResult | null;
  currentStep: number;
  totalTracks: number;
  isPlaying: boolean;
}

// Enhanced particle trail following head
function ParticleTrail({
  position,
  totalTracks,
}: {
  position: number;
  totalTracks: number;
}) {
  const particlesRef = useRef<THREE.Points>(null);
  const particleCount = 50;
  const positions = useMemo(() => new Float32Array(particleCount * 3), []);
  const sizes = useMemo(() => new Float32Array(particleCount).fill(0.06), []);

  const radius = 0.3 + (position / totalTracks) * 2.2;

  useFrame(() => {
    if (!particlesRef.current) return;

    // Shift particles for trail effect
    for (let i = particleCount - 1; i > 0; i--) {
      positions[i * 3] = positions[(i - 1) * 3];
      positions[i * 3 + 1] = positions[(i - 1) * 3 + 1];
      positions[i * 3 + 2] = positions[(i - 1) * 3 + 2];
    }

    // New particle at head with enhanced glow
    positions[0] = radius;
    positions[1] = 0.02;
    positions[2] = (Math.random() - 0.5) * 0.08;

    particlesRef.current.geometry.attributes.position.needsUpdate = true;
  });

  return (
    <points ref={particlesRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={particleCount}
          array={positions}
          itemSize={3}
        />
        <bufferAttribute
          attach="attributes-size"
          count={particleCount}
          array={sizes}
          itemSize={1}
        />
      </bufferGeometry>
      <pointsMaterial
        color="#FF6B35"
        size={0.06}
        transparent
        opacity={0.9}
        sizeAttenuation
        blending={THREE.AdditiveBlending}
      />
    </points>
  );
}

// Static CD disk viewed from top
function CDPlatter({ totalTracks }: { totalTracks: number }) {
  const groupRef = useRef<THREE.Group>(null);

  // Track groove rings
  const rings = useMemo(() => {
    const ringArray: JSX.Element[] = [];
    const trackInterval = Math.max(1, Math.floor(totalTracks / 35));

    for (let i = 0; i <= totalTracks; i += trackInterval) {
      const radius = 0.3 + (i / totalTracks) * 2.2;
      ringArray.push(
        <mesh key={i} rotation-x={-Math.PI / 2} position-y={0.002}>
          <ringGeometry args={[radius - 0.005, radius + 0.005, 128]} />
          <meshBasicMaterial
            color="#60A5FA"
            transparent
            opacity={0.15}
            side={THREE.DoubleSide}
          />
        </mesh>
      );
    }
    return ringArray;
  }, [totalTracks]);

  return (
    <group ref={groupRef}>
      {/* Main CD surface - flat disk */}
      <mesh rotation-x={-Math.PI / 2}>
        <circleGeometry args={[2.6, 128]} />
        <meshStandardMaterial
          color="#1E293B"
          metalness={0.9}
          roughness={0.15}
        />
      </mesh>

      {/* Iridescent data layer */}
      <mesh rotation-x={-Math.PI / 2} position-y={0.001}>
        <ringGeometry args={[0.35, 2.5, 128]} />
        <meshStandardMaterial
          color="#3B82F6"
          metalness={0.95}
          roughness={0.1}
          transparent
          opacity={0.3}
        />
      </mesh>

      {/* Center label area */}
      <mesh rotation-x={-Math.PI / 2} position-y={0.003}>
        <ringGeometry args={[0.15, 0.35, 64]} />
        <meshStandardMaterial color="#F1F5F9" metalness={0.2} roughness={0.5} />
      </mesh>

      {/* Center hole */}
      <mesh rotation-x={-Math.PI / 2} position-y={0.003}>
        <circleGeometry args={[0.15, 64]} />
        <meshStandardMaterial color="#0F172A" metalness={0.8} roughness={0.2} />
      </mesh>

      {/* Outer glow ring */}
      <mesh rotation-x={-Math.PI / 2} position-y={0.001}>
        <ringGeometry args={[2.5, 2.6, 128]} />
        <meshBasicMaterial color="#06B6D4" transparent opacity={0.4} />
      </mesh>

      {/* Track rings */}
      {rings}
    </group>
  );
}

function DiskHead({
  position,
  totalTracks,
}: {
  position: number;
  totalTracks: number;
}) {
  const headRef = useRef<THREE.Group>(null);
  const glowRef = useRef<THREE.PointLight>(null);

  // Calculate target radius based on track position
  const targetRadius = useMemo(
    () => 0.3 + (position / totalTracks) * 2.2,
    [position, totalTracks]
  );

  useFrame((state, delta) => {
    if (headRef.current) {
      // Smooth movement to target position - sync with marker rotation speed
      const currentX = headRef.current.position.x;
      const currentZ = headRef.current.position.z;
      const targetX = targetRadius;
      const targetZ = 0;

      // Use same lerp factor as markers (0.12) for synced movement
      headRef.current.position.x = THREE.MathUtils.lerp(
        currentX,
        targetX,
        0.12
      );
      headRef.current.position.z = THREE.MathUtils.lerp(
        currentZ,
        targetZ,
        0.12
      );
    }
    if (glowRef.current) {
      // Pulsing glow effect
      glowRef.current.intensity =
        1.0 + Math.sin(state.clock.elapsedTime * 8) * 0.4;
    }
  });

  return (
    <group ref={headRef}>
      {/* Enhanced read/write head with better visual */}
      <mesh position={[0, 0.05, 0]}>
        <coneGeometry args={[0.08, 0.15, 8]} />
        <meshStandardMaterial
          color="#F97316"
          emissive="#F97316"
          emissiveIntensity={1.0}
          metalness={0.8}
          roughness={0.2}
        />
      </mesh>

      {/* Head base */}
      <mesh position={[0, 0.02, 0]}>
        <cylinderGeometry args={[0.06, 0.08, 0.04, 16]} />
        <meshStandardMaterial color="#EA580C" metalness={0.9} roughness={0.1} />
      </mesh>

      {/* Enhanced head glow */}
      <pointLight
        ref={glowRef}
        color="#F97316"
        intensity={1.0}
        distance={0.8}
      />

      {/* Additional glow sphere */}
      <mesh position={[0, 0.08, 0]}>
        <sphereGeometry args={[0.03, 16, 16]} />
        <meshBasicMaterial color="#FBBF24" transparent opacity={0.6} />
      </mesh>
    </group>
  );
}

function TrackMarkers({
  requests,
  totalTracks,
  visitedTracks,
  currentStep,
}: {
  requests: number[];
  totalTracks: number;
  visitedTracks: Set<number>;
  currentStep: number;
}) {
  const markerRef = useRef<THREE.Group>(null);

  useFrame(() => {
    if (markerRef.current) {
      // Calculate the angle of the current step's DESTINATION marker (+1 offset)
      // When currentStep=0, head is at steps[0].to which is sequence[1]
      const stepIndex = Math.max(
        0,
        Math.min(currentStep + 1, requests.length - 1)
      );
      const currentMarkerAngle =
        (stepIndex / Math.max(1, requests.length - 1)) * Math.PI * 0.6;

      // Rotate the group so current marker aligns with head
      const targetRotation = currentMarkerAngle;

      markerRef.current.rotation.y = THREE.MathUtils.lerp(
        markerRef.current.rotation.y,
        targetRotation,
        0.12
      );
    }
  });

  // Calculate marker positions for drawing lines
  const getMarkerPosition = (index: number) => {
    const track = requests[index];
    const radius = 0.3 + (track / totalTracks) * 2.2;
    const angle = (index / Math.max(1, requests.length - 1)) * Math.PI * 0.6;
    return { x: Math.cos(angle) * radius, z: Math.sin(angle) * radius };
  };

  // Create connecting lines between visited markers (include current step)
  const connectingLines: JSX.Element[] = [];
  for (let i = 0; i < Math.min(currentStep + 1, requests.length - 1); i++) {
    const from = getMarkerPosition(i);
    const to = getMarkerPosition(i + 1);
    const t = i / Math.max(1, requests.length - 1);
    const color = new THREE.Color().lerpColors(
      new THREE.Color("#FF6B35"),
      new THREE.Color("#FBBF24"),
      t
    );

    connectingLines.push(
      <line key={`line-${i}`}>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            count={2}
            array={new Float32Array([from.x, 0.025, from.z, to.x, 0.025, to.z])}
            itemSize={3}
          />
        </bufferGeometry>
        <lineBasicMaterial
          color={color}
          transparent
          opacity={0.9}
          linewidth={2}
        />
      </line>
    );
  }

  return (
    <group ref={markerRef}>
      {/* Connecting lines between markers - rotates with markers */}
      {connectingLines}

      {requests.map((track, index) => {
        const radius = 0.3 + (track / totalTracks) * 2.2;
        // Position markers in a wider arc for better spacing
        const angle =
          (index / Math.max(1, requests.length - 1)) * Math.PI * 0.6;
        const x = Math.cos(angle) * radius;
        const z = Math.sin(angle) * radius;
        const isVisited = visitedTracks.has(track);

        return (
          <group key={index} position={[x, 0.03, z]}>
            {/* Enhanced marker with glow */}
            <mesh>
              <sphereGeometry args={[0.05, 16, 16]} />
              <meshStandardMaterial
                color={isVisited ? "#10B981" : "#06B6D4"}
                emissive={isVisited ? "#10B981" : "#06B6D4"}
                emissiveIntensity={0.7}
              />
            </mesh>

            {/* Track label - billboard style facing up */}
            <Text
              position={[0, 0.15, 0]}
              fontSize={0.1}
              color={isVisited ? "#10B981" : "#06B6D4"}
              anchorX="center"
              anchorY="middle"
              fontWeight="bold"
              rotation={[-Math.PI / 2, 0, 0]}
            >
              {track}
            </Text>

            {/* Additional glow effect for visited tracks */}
            {isVisited && (
              <mesh position={[0, 0.02, 0]}>
                <ringGeometry args={[0.08, 0.12, 16]} />
                <meshBasicMaterial color="#10B981" transparent opacity={0.4} />
              </mesh>
            )}
          </group>
        );
      })}
    </group>
  );
}

function Scene({
  result,
  currentStep,
  totalTracks,
  isPlaying,
}: DiskSceneProps) {
  const headPosition = useMemo(() => {
    if (!result || currentStep < 0) return result?.sequence?.[0] ?? 50;
    if (currentStep >= result.steps.length)
      return result.sequence[result.sequence.length - 1];
    return result.steps[currentStep]?.to ?? result.sequence[0] ?? 50;
  }, [result, currentStep]);

  const visitedTracks = useMemo(() => {
    if (!result) return new Set<number>();
    const visited = new Set<number>();
    for (let i = 0; i <= Math.min(currentStep, result.steps.length - 1); i++) {
      visited.add(result.steps[i].to);
    }
    return visited;
  }, [result, currentStep]);

  const requests = result?.sequence ?? [];

  return (
    <group>
      {/* Ambient lighting */}
      <ambientLight intensity={0.4} />
      <directionalLight position={[5, 5, 5]} intensity={0.6} />

      {/* CD Disk */}
      <CDPlatter totalTracks={totalTracks} />

      {/* Head axis line - subtle indicator showing fixed radial path */}
      <line>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            count={2}
            array={new Float32Array([0.3, 0.015, 0, 2.6, 0.015, 0])}
            itemSize={3}
          />
        </bufferGeometry>
        <lineBasicMaterial
          color="#F97316"
          transparent
          opacity={0.25}
          linewidth={1}
        />
      </line>

      {/* Track Markers with connecting lines */}
      <TrackMarkers
        requests={requests}
        totalTracks={totalTracks}
        visitedTracks={visitedTracks}
        currentStep={currentStep}
      />

      {/* Disk Head - Properly positioned */}
      <DiskHead position={headPosition} totalTracks={totalTracks} />

      {/* Particle Trail */}
      <ParticleTrail position={headPosition} totalTracks={totalTracks} />
    </group>
  );
}

export function DiskScene(props: DiskSceneProps) {
  return (
    <div className="w-full h-full min-h-[300px] rounded-xl overflow-hidden bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900 light:from-slate-100 light:via-slate-50 light:to-slate-100">
      <Canvas
        camera={{ position: [0, 3.5, 0.5], fov: 32 }}
        gl={{ antialias: true, alpha: true }}
      >
        <OrbitControls
          enablePan={false}
          enableZoom={true}
          enableRotate={true}
          minDistance={2}
          maxDistance={8}
          minPolarAngle={Math.PI / 6}
          maxPolarAngle={Math.PI / 3}
          autoRotate={false}
          target={[0, 0, 0]}
        />
        <Scene {...props} />
      </Canvas>
    </div>
  );
}
