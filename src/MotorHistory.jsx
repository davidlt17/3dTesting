import { Canvas, useFrame } from '@react-three/fiber';
import { useGLTF, OrbitControls } from '@react-three/drei';
import { useRef } from 'react';

function V8EngineModel() {
  // Usa ruta relativa a public para producción y desarrollo
  const { scene } = useGLTF(import.meta.env.BASE_URL + 'renders/v8_engine.glb');
  const ref = useRef();
  useFrame(() => {
    if (ref.current) {
      ref.current.rotation.y += 0.001; // Rotación muy lenta
    }
  });
  return <primitive ref={ref} object={scene} scale={[5, 5, 5]} position={[0, 0, 0]} />;
}

export default function MotorHistory() {
  return (
    <section className="flex flex-col lg:flex-row items-center justify-center gap-8 p-8 bg-white rounded shadow mt-16">
      {/* Apartado de historia */}
      <div className="max-w-xl">
        <h2 className="text-3xl font-bold mb-4 font-serif">Historia del Motor</h2>
        <p className="text-gray-700 text-lg">
          El motor de combustión interna ha sido uno de los inventos más revolucionarios de la historia moderna.
          Desde los primeros diseños de Nikolaus Otto y Karl Benz hasta los potentes motores V8 actuales,
          la evolución del motor ha impulsado el desarrollo del automóvil y la industria del transporte.
        </p>
      </div>
      {/* Render 3D del motor */}
      <div className="w-full h-[300px] md:w-[500px] md:h-[400px]">
        <Canvas className="w-full h-full">
          <ambientLight intensity={2} />
          <directionalLight position={[0, 10, 5]} intensity={1.5} />
          <pointLight position={[2, 5, 5]} intensity={1} />
          <V8EngineModel />
          <OrbitControls /> {/* Permite al usuario girar el modelo */}
        </Canvas>
      </div>
    </section>
  );
}