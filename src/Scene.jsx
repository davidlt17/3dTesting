import { Canvas, useFrame } from '@react-three/fiber';
import { useRef, useEffect, useState } from 'react';
import { useGLTF } from '@react-three/drei';

function MclarenModel() {
  // Usa ruta relativa a public para producción y desarrollo
  const { scene } = useGLTF(import.meta.env.BASE_URL + 'renders/mclaren_mp45__formula_1.glb');
  const ref = useRef();
  const [scale, setScale] = useState([0.5, 0.5, 0.5]);

  useEffect(() => {
    function handleResize() {
      if (window.innerWidth >= 1024) {
        setScale([0.7, 0.7, 0.7]); // Más grande en PC (lg)
      } else {
        setScale([0.5, 0.5, 0.5]); // Normal en móvil/tablet
      }
    }
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useFrame(() => {
    if (ref.current) {
      ref.current.rotation.x += 0.001;
      ref.current.rotation.y += 0.001;
      ref.current.rotation.z -= 0.0005;
    }
  });
  return <primitive ref={ref} object={scene} scale={scale} position={[0, 0, 1]} />;
}

function CinematicCamera({ children }) {
  const cameraRef = useRef();

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime();

    // Movimiento orbital suave
    const radius = 10 - Math.sin(t * 0.2) * 5; // Zoom in/out suave
    const angle = t * 0.2;
    const x = Math.sin(angle) * radius;
    const z = Math.cos(angle) * radius;
    const y = 5 + Math.sin(t * 0.1) * 2;

    if (cameraRef.current) {
      cameraRef.current.position.set(x, y, z);
      cameraRef.current.lookAt(0, 0, 0);
      cameraRef.current.fov = 30 + Math.sin(t * 0.5) * 10; // Zoom in/out cinematográfico
      cameraRef.current.updateProjectionMatrix();
    }
  });

  return (
    <perspectiveCamera
      ref={cameraRef}
      makeDefault
      position={[0, 10, 5]}
      fov={30}
    />
  );
}

function Scene() {
  return (
    <div className="relative w-full h-[60vh] sm:h-[70vh] md:h-[80vh] lg:h-[95vh] z-10">
      <Canvas className="w-full h-full" style={{ zIndex: 10 }}>
        <CinematicCamera />
        <ambientLight intensity={1} />
        <pointLight position={[100, 10, 10]} />
        <MclarenModel />
      </Canvas>
    </div>
  );
}

export default Scene;