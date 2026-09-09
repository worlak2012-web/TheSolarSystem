import { useState, useEffect, useRef, useCallback } from 'react';

interface PlanetData {
  name: string;
  nameRu: string;
  diameter: number; // km
  distanceFromSun: number; // million km
  orbitalPeriod: number; // Earth days
  color: string;
  size: number; // visual size in px
  orbitRadius: number; // visual orbit radius in px
  description: string;
}

const planets: PlanetData[] = [
  {
    name: 'Mercury',
    nameRu: 'Меркурий',
    diameter: 4879,
    distanceFromSun: 57.9,
    orbitalPeriod: 88,
    color: '#b5b5b5',
    size: 8,
    orbitRadius: 70,
    description: 'Самая маленькая и ближайшая к Солнцу планета. Поверхность покрыта кратерами.',
  },
  {
    name: 'Venus',
    nameRu: 'Венера',
    diameter: 12104,
    distanceFromSun: 108.2,
    orbitalPeriod: 225,
    color: '#e8cda0',
    size: 14,
    orbitRadius: 110,
    description: 'Самая горячая планета из-за парникового эффекта. Вращается в обратном направлении.',
  },
  {
    name: 'Earth',
    nameRu: 'Земля',
    diameter: 12756,
    distanceFromSun: 149.6,
    orbitalPeriod: 365,
    color: '#4da6ff',
    size: 15,
    orbitRadius: 155,
    description: 'Наш дом. Единственная известная планета с жизнью. Имеет один спутник — Луну.',
  },
  {
    name: 'Mars',
    nameRu: 'Марс',
    diameter: 6792,
    distanceFromSun: 227.9,
    orbitalPeriod: 687,
    color: '#e07050',
    size: 11,
    orbitRadius: 200,
    description: 'Красная планета. Имеет самый высокий вулкан в Солнечной системе — Олимп.',
  },
  {
    name: 'Jupiter',
    nameRu: 'Юпитер',
    diameter: 142984,
    distanceFromSun: 778.6,
    orbitalPeriod: 4333,
    color: '#d4a574',
    size: 32,
    orbitRadius: 270,
    description: 'Самая большая планета. Газовый гигант с Большим Красным Пятном — огромным штормом.',
  },
  {
    name: 'Saturn',
    nameRu: 'Сатурн',
    diameter: 120536,
    distanceFromSun: 1433.5,
    orbitalPeriod: 10759,
    color: '#f0d890',
    size: 28,
    orbitRadius: 340,
    description: 'Знаменита своими кольцами из льда и камней. Плотность меньше воды.',
  },
  {
    name: 'Uranus',
    nameRu: 'Уран',
    diameter: 51118,
    distanceFromSun: 2872.5,
    orbitalPeriod: 30687,
    color: '#7de8e8',
    size: 22,
    orbitRadius: 400,
    description: 'Ледяной гигант, вращающийся «на боку». Имеет тонкие кольца.',
  },
  {
    name: 'Neptune',
    nameRu: 'Нептун',
    diameter: 49528,
    distanceFromSun: 4495.1,
    orbitalPeriod: 60190,
    color: '#4466ff',
    size: 21,
    orbitRadius: 455,
    description: 'Самая далёкая планета. Самые сильные ветры в Солнечной системе — до 2100 км/ч.',
  },
];

function App() {
  const [isPlaying, setIsPlaying] = useState(true);
  const [speed, setSpeed] = useState(1);
  const [selectedPlanet, setSelectedPlanet] = useState<PlanetData | null>(null);
  const [angles, setAngles] = useState<number[]>(planets.map(() => Math.random() * Math.PI * 2));
  const [scale, setScale] = useState(0.7);
  const animationRef = useRef<number | null>(null);
  const lastTimeRef = useRef<number>(0);

  // Responsive scaling
  useEffect(() => {
    const updateScale = () => {
      const w = window.innerWidth;
      const h = window.innerHeight - 200;
      const minDim = Math.min(w, h);
      setScale(Math.min(1, minDim / 1050));
    };
    updateScale();
    window.addEventListener('resize', updateScale);
    return () => window.removeEventListener('resize', updateScale);
  }, []);

  const animate = useCallback((timestamp: number) => {
    if (!lastTimeRef.current) lastTimeRef.current = timestamp;
    const delta = (timestamp - lastTimeRef.current) / 1000;
    lastTimeRef.current = timestamp;

    if (isPlaying) {
      setAngles((prev) =>
        prev.map((angle, i) => {
          const baseSpeed = (2 * Math.PI) / (planets[i].orbitalPeriod / 10);
          return angle + baseSpeed * speed * delta;
        })
      );
    }

    animationRef.current = requestAnimationFrame(animate);
  }, [isPlaying, speed]);

  useEffect(() => {
    animationRef.current = requestAnimationFrame(animate);
    return () => {
      if (animationRef.current) cancelAnimationFrame(animationRef.current);
    };
  }, [animate]);

  const centerX = 500;
  const centerY = 500;

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-950 via-gray-900 to-black text-white overflow-hidden relative">
      {/* Stars background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {Array.from({ length: 200 }).map((_, i) => (
          <div
            key={i}
            className="absolute rounded-full bg-white"
            style={{
              width: Math.random() * 2 + 1,
              height: Math.random() * 2 + 1,
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              opacity: Math.random() * 0.8 + 0.2,
              animation: `twinkle ${Math.random() * 3 + 2}s ease-in-out infinite`,
              animationDelay: `${Math.random() * 5}s`,
            }}
          />
        ))}
      </div>

      {/* Header */}
      <header className="relative z-10 text-center pt-4 pb-2">
        <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-yellow-300 via-orange-300 to-yellow-400 bg-clip-text text-transparent">
          ☀️ Солнечная система
        </h1>
        <p className="text-gray-400 text-sm mt-1">Нажмите на планету для получения информации</p>
      </header>

      {/* Solar System Visualization */}
      <div className="relative flex items-center justify-center" style={{ height: 'calc(100vh - 200px)' }}>
        <div
          className="relative"
          style={{
            width: '1000px',
            height: '1000px',
            transform: `scale(${scale})`,
            transformOrigin: 'center center',
          }}
        >
          {/* Sun */}
          <div
            className="absolute rounded-full cursor-pointer"
            style={{
              width: '60px',
              height: '60px',
              left: `${centerX - 30}px`,
              top: `${centerY - 30}px`,
              background: 'radial-gradient(circle, #fff700 0%, #ff8c00 50%, #ff4500 100%)',
              boxShadow: '0 0 40px #ff8c00, 0 0 80px #ff6600, 0 0 120px #ff4500',
              animation: 'pulse 3s ease-in-out infinite',
            }}
          />

          {/* Orbits */}
          {planets.map((planet, i) => (
            <div
              key={`orbit-${i}`}
              className="absolute rounded-full border border-gray-700/40"
              style={{
                width: `${planet.orbitRadius * 2}px`,
                height: `${planet.orbitRadius * 2}px`,
                left: `${centerX - planet.orbitRadius}px`,
                top: `${centerY - planet.orbitRadius}px`,
              }}
            />
          ))}

          {/* Planets */}
          {planets.map((planet, i) => {
            const x = centerX + Math.cos(angles[i]) * planet.orbitRadius;
            const y = centerY + Math.sin(angles[i]) * planet.orbitRadius;
            const isSelected = selectedPlanet?.name === planet.name;

            return (
              <div
                key={`planet-${i}`}
                className={`absolute rounded-full cursor-pointer transition-transform duration-200 ${
                  isSelected ? 'scale-150' : 'hover:scale-125'
                }`}
                style={{
                  width: `${planet.size}px`,
                  height: `${planet.size}px`,
                  left: `${x - planet.size / 2}px`,
                  top: `${y - planet.size / 2}px`,
                  background: `radial-gradient(circle at 30% 30%, ${planet.color}, ${adjustColor(planet.color, -40)})`,
                  boxShadow: isSelected
                    ? `0 0 15px ${planet.color}, 0 0 30px ${planet.color}`
                    : `0 0 8px ${planet.color}40`,
                  zIndex: isSelected ? 20 : 10,
                }}
                onClick={() => setSelectedPlanet(isSelected ? null : planet)}
                title={planet.nameRu}
              >
                {/* Saturn's rings */}
                {planet.name === 'Saturn' && (
                  <div
                    className="absolute rounded-full border-2 border-yellow-200/60"
                    style={{
                      width: `${planet.size * 1.8}px`,
                      height: `${planet.size * 0.5}px`,
                      left: `${-(planet.size * 0.4)}px`,
                      top: `${planet.size * 0.25}px`,
                      transform: 'rotate(-20deg)',
                    }}
                  />
                )}
                {/* Planet label */}
                <div
                  className="absolute text-xs text-gray-300 whitespace-nowrap pointer-events-none"
                  style={{
                    left: '50%',
                    top: `${planet.size + 4}px`,
                    transform: 'translateX(-50%)',
                    fontSize: '10px',
                    textShadow: '0 0 4px black',
                  }}
                >
                  {planet.nameRu}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Info Panel */}
      {selectedPlanet && (
        <div className="fixed top-4 right-4 z-50 bg-gray-900/95 backdrop-blur-md border border-gray-700 rounded-xl p-5 max-w-sm shadow-2xl">
          <button
            onClick={() => setSelectedPlanet(null)}
            className="absolute top-2 right-3 text-gray-400 hover:text-white text-xl"
          >
            ✕
          </button>
          <div className="flex items-center gap-3 mb-3">
            <div
              className="rounded-full"
              style={{
                width: '40px',
                height: '40px',
                background: `radial-gradient(circle at 30% 30%, ${selectedPlanet.color}, ${adjustColor(selectedPlanet.color, -40)})`,
                boxShadow: `0 0 15px ${selectedPlanet.color}80`,
              }}
            />
            <div>
              <h2 className="text-xl font-bold text-white">{selectedPlanet.nameRu}</h2>
              <p className="text-gray-400 text-xs">{selectedPlanet.name}</p>
            </div>
          </div>
          <p className="text-gray-300 text-sm mb-4">{selectedPlanet.description}</p>
          <div className="grid grid-cols-2 gap-3">
            <InfoCard label="Диаметр" value={`${selectedPlanet.diameter.toLocaleString()} км`} icon="📏" />
            <InfoCard
              label="Расстояние"
              value={`${selectedPlanet.distanceFromSun} млн км`}
              icon="🌍"
            />
            <InfoCard
              label="Орбитальный период"
              value={formatPeriod(selectedPlanet.orbitalPeriod)}
              icon="🔄"
            />
            <InfoCard
              label="Расстояние (а.е.)"
              value={`${(selectedPlanet.distanceFromSun / 149.6).toFixed(2)} а.е.`}
              icon="📐"
            />
          </div>
        </div>
      )}

      {/* Controls */}
      <div className="fixed bottom-0 left-0 right-0 z-50 bg-gray-900/90 backdrop-blur-md border-t border-gray-700 px-4 py-3">
        <div className="max-w-2xl mx-auto flex items-center justify-between gap-4 flex-wrap">
          {/* Play/Pause */}
          <button
            onClick={() => setIsPlaying(!isPlaying)}
            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-gray-800 hover:bg-gray-700 border border-gray-600 transition-colors"
          >
            {isPlaying ? (
              <>
                <span className="text-lg">⏸️</span>
                <span className="text-sm">Пауза</span>
              </>
            ) : (
              <>
                <span className="text-lg">▶️</span>
                <span className="text-sm">Воспроизвести</span>
              </>
            )}
          </button>

          {/* Speed Control */}
          <div className="flex items-center gap-3">
            <span className="text-sm text-gray-400">Скорость:</span>
            <div className="flex gap-1">
              {[0.25, 0.5, 1, 2, 5, 10].map((s) => (
                <button
                  key={s}
                  onClick={() => setSpeed(s)}
                  className={`px-3 py-1.5 rounded text-xs font-medium transition-colors ${
                    speed === s
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-800 text-gray-300 hover:bg-gray-700 border border-gray-600'
                  }`}
                >
                  {s}x
                </button>
              ))}
            </div>
          </div>

          {/* Reset */}
          <button
            onClick={() => {
              setAngles(planets.map(() => Math.random() * Math.PI * 2));
              setSpeed(1);
              setIsPlaying(true);
            }}
            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-gray-800 hover:bg-gray-700 border border-gray-600 transition-colors"
          >
            <span className="text-lg">🔄</span>
            <span className="text-sm">Сброс</span>
          </button>
        </div>
      </div>

      {/* CSS Animations */}
      <style>{`
        @keyframes twinkle {
          0%, 100% { opacity: 0.3; }
          50% { opacity: 1; }
        }
        @keyframes pulse {
          0%, 100% { transform: scale(1); box-shadow: 0 0 40px #ff8c00, 0 0 80px #ff6600, 0 0 120px #ff4500; }
          50% { transform: scale(1.05); box-shadow: 0 0 50px #ff8c00, 0 0 100px #ff6600, 0 0 150px #ff4500; }
        }
      `}</style>
    </div>
  );
}

function InfoCard({ label, value, icon }: { label: string; value: string; icon: string }) {
  return (
    <div className="bg-gray-800/80 rounded-lg p-2.5 border border-gray-700">
      <div className="flex items-center gap-1.5 mb-1">
        <span className="text-sm">{icon}</span>
        <span className="text-xs text-gray-400">{label}</span>
      </div>
      <p className="text-sm font-semibold text-white">{value}</p>
    </div>
  );
}

function adjustColor(hex: string, amount: number): string {
  const num = parseInt(hex.replace('#', ''), 16);
  const r = Math.max(0, Math.min(255, ((num >> 16) & 0xff) + amount));
  const g = Math.max(0, Math.min(255, ((num >> 8) & 0xff) + amount));
  const b = Math.max(0, Math.min(255, (num & 0xff) + amount));
  return `#${((r << 16) | (g << 8) | b).toString(16).padStart(6, '0')}`;
}

function formatPeriod(days: number): string {
  if (days < 365) return `${days} дней`;
  const years = (days / 365.25).toFixed(1);
  return `${years} лет`;
}

export default App;
