import { Canvas, useFrame } from '@react-three/fiber';
import { useRef, useEffect, useState } from 'react';
import { useGLTF, Environment } from '@react-three/drei';
import { EffectComposer, Vignette } from '@react-three/postprocessing';
import * as THREE from 'three';

const CAMERA_FOV = 50;
const CAMERA_RADIUS = 4;
const CAMERA_POSITION = [CAMERA_RADIUS, 1, 0];
const CAMERA_LOOKAT = [0, 0.5, 0];
const MODEL_POSITION = [0, -0.5, 0];

function MclarenModel({ parentHeight }) {
  const [modelError, setModelError] = useState(null);
  const { scene, error } = useGLTF('/renders/mclaren_mp45__formula_1.glb');
  const ref = useRef();
  const [scale, setScale] = useState([0.5, 0.5, 0.5]);

  useEffect(() => {
    if (error) {
      console.error('Error loading model:', error);
      setModelError(error.message);
      return;
    }

    // Optimizar texturas
    scene.traverse((child) => {
      if (child.isMesh && child.material.map) {
        child.material.map.anisotropy = 16;
        child.material.map.needsUpdate = true;
      }
    });

    // Escala dinámica basada en la altura del div padre
    const handleResize = () => {
      const baseScale = 1.5;
      const heightFactor = parentHeight ? parentHeight / 800 : 0.5; // Normalizar según altura del div
      setScale([baseScale * heightFactor, baseScale * heightFactor, baseScale * heightFactor]);
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [scene, error, parentHeight]);

  useFrame(() => {
    if (ref.current) {
      ref.current.rotation.y += 0.001;
    }
  });

  if (modelError) {
    return (
      <group>
        <mesh>
          <boxGeometry args={[1, 1, 1]} />
          <meshStandardMaterial color="red" />
        </mesh>
      </group>
    );
  }

  return <primitive ref={ref} object={scene} scale={scale} position={MODEL_POSITION} />;
}

function CinematicCamera() {
  const cameraRef = useRef();

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime();
    const angle = t * 0.18;
    const x = Math.sin(angle) * CAMERA_RADIUS;
    const z = Math.cos(angle) * CAMERA_RADIUS;

    cameraRef.current.position.set(x, 1, z);
    cameraRef.current.lookAt(...CAMERA_LOOKAT);
    cameraRef.current.fov = CAMERA_FOV;
    cameraRef.current.updateProjectionMatrix();
  });

  return (
    <perspectiveCamera
      ref={cameraRef}
      makeDefault
      fov={CAMERA_FOV}
      position={CAMERA_POSITION}
    />
  );
}

function Scene() {
  const canvasRef = useRef();
  const containerRef = useRef();
  const [parentHeight, setParentHeight] = useState(null);

  useEffect(() => {
    const handleResize = () => {
      if (canvasRef.current?.camera && containerRef.current) {
        const parent = containerRef.current;
        canvasRef.current.camera.aspect = parent.clientWidth / parent.clientHeight;
        canvasRef.current.camera.updateProjectionMatrix();
        setParentHeight(parent.clientHeight); // Actualizar altura del div padre
      }
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    window.addEventListener('fullscreenchange', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('fullscreenchange', handleResize);
    };
  }, []);

  return (
    <div className="relative w-full h-[80vh] z-20 " ref={containerRef}>
      
      <Canvas
        ref={canvasRef}
        gl={{
          antialias: true,
          toneMapping: THREE.LinearToneMapping,
          pixelRatio: Math.min(window.devicePixelRatio, 2),
          toneMappingExposure: 0.8,
        }}
        shadows
        camera={{ fov: CAMERA_FOV, near: 0.1, far: 1000 }}
        className="w-full h-full"
      >
        <CinematicCamera />
        <ambientLight intensity={0.3} />
        <directionalLight
          position={[10, 10, 5]}
          intensity={0.8}
          castShadow
          shadow-mapSize={[1024, 1024]}
        />
        <Environment preset="studio" intensity={0.5} />
        <MclarenModel parentHeight={parentHeight} />
        <EffectComposer>
          <Vignette eskil={false} offset={0.1} darkness={0.7} />
        </EffectComposer>
      </Canvas>
    </div>
  );
}

export default Scene;