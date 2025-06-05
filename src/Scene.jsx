import { Canvas } from '@react-three/fiber';
import { OrbitControls, useGLTF } from '@react-three/drei';

function CRTModel() {
  const { scene } = useGLTF('/renders/crt-tv.glb');
  return <primitive object={scene} scale={[0.5, 0.5, 0.5]} position={[2, 0, 0]} />;
}

function MercedesModel() {
  const { scene } = useGLTF('/renders/2002_mercedes-benz_e320_w210_4matic_sedan.glb');
  return <primitive object={scene} scale={[100, 100, 100]} position={[-2, 0, 0]} />;
}

function MopedModel() {
  const { scene } = useGLTF('/renders/moped_1978_puch_moped_hero.glb');
  return <primitive object={scene} scale={[0.05, 0.05, 0.05]} position={[0, 0, 1]} />;
}

function Scene() {
  return (
    <Canvas style={{ width: '800px', height: '600px' , margin: '0 auto' }}>
      <ambientLight intensity={1} />
      <pointLight position={[100, 10, 10]} />
      <MercedesModel />
      <CRTModel />
      <MopedModel />
      <OrbitControls />
    </Canvas>
  );
}

export default Scene;