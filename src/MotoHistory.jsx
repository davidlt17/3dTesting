import { Canvas, useFrame } from '@react-three/fiber';
import { useGLTF, OrbitControls, Environment } from '@react-three/drei';
import { useRef, useState, useEffect } from 'react';

function PiaggioSiModel() {
  const [modelError, setModelError] = useState(null);
  const { scene, error } = useGLTF('/renders/piaggio_si_scooter.glb'); // Ruta absoluta para depuración
  const ref = useRef();

  useEffect(() => {
    if (error) {
      console.error('Error loading model:', error);
      setModelError(error.message);
    }
  }, [error]);

  useFrame(() => {
    if (ref.current) {
      ref.current.rotation.y += 0.001; // Rotación muy lenta
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

  return <primitive ref={ref} object={scene} scale={[0.02, 0.02, 0.02]} position={[0, 0, 0]} />;
}

export default function MotoHistory() {
  return (
    <section className="flex flex-col lg:flex-row items-center justify-center gap-8 p-8 bg-white rounded shadow ">
      {/* Apartado de historia */}
      <div className="max-w-xl">
        <h2 className="text-3xl font-bold mb-4 font-serif">Historia de las Motos</h2>
        <p className="text-gray-700 text-lg">
          Las motocicletas han transformado la movilidad personal desde finales del siglo XIX.
          Con marcas como Piaggio liderando la innovación, los scooters como el Piaggio Sì y la icónica Vespa
          revolucionaron el transporte urbano, combinando estilo, eficiencia y accesibilidad.
          Desde los primeros modelos de dos tiempos hasta las modernas scooters eléctricas,
          las motos siguen siendo un símbolo de libertad y practicidad.
        </p>
      </div>
      {/* Render 3D de la scooter */}
      <div className="w-full h-[300px] md:w-[700px] md:h-[400px] z-50 ">
        <Canvas
          className="w-full h-full z-50"
          camera={{ position: [0, 2, 5], fov: 50 }} // Cámara explícita
        >
          <ambientLight intensity={1} />
          <directionalLight position={[0, 10, 5]} intensity={1} />
          <pointLight position={[2, 5, 5]} intensity={0.5} />
          <Environment preset="studio" intensity={0.5} /> {/* Iluminación ambiental */}
          <PiaggioSiModel className=" z-50"/>
          <OrbitControls enablePan={false} minDistance={3} maxDistance={10} />
        </Canvas>
      </div>
    </section>
  );
}