import { Canvas, useFrame } from "@react-three/fiber";
import { useMemo, useRef } from "react";
import * as THREE from "three";

function Particles({ count = 800 }: { count?: number }) {
  const ref = useRef<THREE.Points>(null);
  const positions = useMemo(() => {
    const arr = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      arr[i * 3] = (Math.random() - 0.5) * 14;
      arr[i * 3 + 1] = (Math.random() - 0.5) * 8;
      arr[i * 3 + 2] = (Math.random() - 0.5) * 6;
    }
    return arr;
  }, [count]);

  useFrame(({ clock, mouse }) => {
    if (!ref.current) return;
    const t = clock.getElapsedTime();
    ref.current.rotation.y = t * 0.04 + mouse.x * 0.2;
    ref.current.rotation.x = mouse.y * 0.15;
  });

  return (
    <points ref={ref}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          args={[positions, 3]}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.022}
        color="#8fd9ff"
        transparent
        opacity={0.7}
        sizeAttenuation
        depthWrite={false}
        blending={THREE.AdditiveBlending}
      />
    </points>
  );
}

function Aurora() {
  const ref = useRef<THREE.Mesh>(null);
  useFrame(({ clock }) => {
    if (!ref.current) return;
    const t = clock.getElapsedTime();
    const m = ref.current.material as THREE.ShaderMaterial;
    m.uniforms.uTime.value = t;
  });

  const uniforms = useMemo(
    () => ({
      uTime: { value: 0 },
      uColorA: { value: new THREE.Color("#3b9ee0") },
      uColorB: { value: new THREE.Color("#8b6dff") },
    }),
    [],
  );

  return (
    <mesh ref={ref} position={[0, 0, -2]}>
      <planeGeometry args={[20, 12, 32, 32]} />
      <shaderMaterial
        transparent
        depthWrite={false}
        uniforms={uniforms}
        vertexShader={`
          varying vec2 vUv;
          void main() {
            vUv = uv;
            gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
          }
        `}
        fragmentShader={`
          uniform float uTime;
          uniform vec3 uColorA;
          uniform vec3 uColorB;
          varying vec2 vUv;
          void main() {
            vec2 p = vUv - 0.5;
            float d = length(p);
            float n =
              sin(p.x * 4.0 + uTime * 0.3) * 0.5 +
              cos(p.y * 5.0 - uTime * 0.4) * 0.5;
            float a = smoothstep(0.7, 0.0, d) * (0.45 + n * 0.18);
            vec3 col = mix(uColorA, uColorB, vUv.x + n * 0.2);
            gl_FragColor = vec4(col, a * 0.55);
          }
        `}
      />
    </mesh>
  );
}

export default function HeroScene() {
  return (
    <Canvas
      gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }}
      dpr={[1, 1.6]}
      camera={{ position: [0, 0, 5], fov: 55 }}
      style={{ position: "absolute", inset: 0 }}
    >
      <Aurora />
      <Particles count={700} />
    </Canvas>
  );
}
