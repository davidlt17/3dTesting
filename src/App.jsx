import Scene from './Scene';
import './index.css'; // Tailwind se importa aquí
import Header from './Header';
import Silk from './silk';
import MotorHistory from './MotorHistory';
import MotoHistory from './MotoHistory';

function App() {
  return (
    <div className="flex flex-col bg-gray-100">
      <Header />
<div className="flex items-center justify-center h-20 text-white z-10 relative p-2 mt-36 sm:mt-24">        <h1 className="text-4xl font-extrabold font-serif">
          Racing is life. Everything before or after is just waiting.” — Steve McQueen
        </h1>
      </div>
      <Scene />
      <Silk />
      <MotorHistory /> 
      <MotoHistory /> 
    </div>
  );
}

export default App;