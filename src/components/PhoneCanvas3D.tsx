"use client";

import { Suspense, useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Environment, Float } from "@react-three/drei";
import * as THREE from "three";

function PhoneMesh() {
    const groupRef = useRef<THREE.Group>(null);

    useFrame((state) => {
        if (!groupRef.current) return;
        const t = state.clock.elapsedTime;
        // Slow, elegant auto-rotation on idle
        groupRef.current.rotation.y = Math.sin(t * 0.3) * 0.25;
        groupRef.current.rotation.x = Math.sin(t * 0.2) * 0.06;
    });

    return (
        <group ref={groupRef}>
            {/* Main body */}
            <mesh castShadow receiveShadow>
                <boxGeometry args={[1.1, 2.2, 0.12]} />
                <meshPhysicalMaterial
                    color="#1a1a1a"
                    metalness={0.95}
                    roughness={0.05}
                    reflectivity={1}
                    clearcoat={1}
                    clearcoatRoughness={0.1}
                />
            </mesh>
            {/* Screen face */}
            <mesh position={[0, 0, 0.065]}>
                <boxGeometry args={[0.95, 1.95, 0.01]} />
                <meshPhysicalMaterial color="#050505" metalness={0.1} roughness={0.6} />
            </mesh>
            {/* Screen glow plane */}
            <mesh position={[0, 0.1, 0.072]}>
                <planeGeometry args={[0.88, 1.55]} />
                <meshBasicMaterial color="#c8782a" opacity={0.18} transparent />
            </mesh>
            {/* Camera island */}
            <mesh position={[-0.25, 0.85, 0.07]}>
                <cylinderGeometry args={[0.09, 0.09, 0.03, 32]} />
                <meshPhysicalMaterial color="#111" metalness={0.9} roughness={0.1} />
            </mesh>
            <mesh position={[0.02, 0.85, 0.07]}>
                <cylinderGeometry args={[0.07, 0.07, 0.03, 32]} />
                <meshPhysicalMaterial color="#111" metalness={0.9} roughness={0.1} />
            </mesh>
            {/* Side rail */}
            <mesh position={[0.565, 0, 0]}>
                <boxGeometry args={[0.03, 2.18, 0.1]} />
                <meshPhysicalMaterial color="#2a2a2a" metalness={0.98} roughness={0.03} clearcoat={1} />
            </mesh>
            <mesh position={[-0.565, 0, 0]}>
                <boxGeometry args={[0.03, 2.18, 0.1]} />
                <meshPhysicalMaterial color="#2a2a2a" metalness={0.98} roughness={0.03} clearcoat={1} />
            </mesh>
        </group>
    );
}

export default function PhoneCanvas3D({ className, style }: { className?: string; style?: React.CSSProperties }) {
    return (
        <div className={className} style={{ width: "100%", height: "100%", ...style }} aria-hidden="true">
            <Canvas
                camera={{ position: [0, 0, 4], fov: 42 }}
                gl={{ antialias: true, alpha: true }}
                style={{ background: "transparent" }}
                shadows
            >
                <Suspense fallback={null}>
                    <ambientLight intensity={0.15} />
                    <directionalLight position={[5, 5, 5]} intensity={1.6} color="#ffffff" castShadow />
                    <pointLight position={[-3, 2, 2]} intensity={0.9} color="#c8782a" />
                    <pointLight position={[3, -2, 3]} intensity={0.45} color="#4466ff" />
                    <Environment preset="city" environmentIntensity={0.7} />
                    <Float speed={1.4} rotationIntensity={0.08} floatIntensity={0.25}>
                        <PhoneMesh />
                    </Float>
                </Suspense>
            </Canvas>
        </div>
    );
}
