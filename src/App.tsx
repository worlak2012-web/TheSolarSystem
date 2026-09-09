import { useState, useEffect, useRef, useCallback, useMemo } from 'react';

interface PlanetData {
  name: string;
  nameRu: string;
  diameter: number;
  distanceFromSun: number;
  orbitalPeriod: number;
  color: string;
  glowColor: string;
  size: number;
  orbitRadius: number;
  description: string;
  texture: string;
  ringColor?: string;
}

const planets: PlanetData[] = [
  {
    name: 'Mercury',
    nameRu: 'Меркурий',
    diameter: 4879,
    distanceFromSun: 57.9,
    orbitalPeriod: 88,
    color: '#b5b5b5',
    glowColor: '#8a8a8a',
    size: 18,
    orbitRadius: 80,
    description: 'Самая маленькая и ближайшая к Солнцу планета. Поверхность покрыта кратерами, напоминает Луну.',
    texture: 'radial-gradient(circle at 35% 35%, #d4d4d4 0%, #b5b5b5 30%, #7a7a7a 70%, #4a4a4a 100%)',
  },
  {
    name: 'Venus',
    nameRu: 'Венера',
    diameter: 12104,
    distanceFromSun: 108.2,
    orbitalPeriod: 225,
    color: '#e8cda0',
    glowColor: '#ffcc66',
    size: 28,
    orbitRadius: 130,
    description: 'Самая горячая планета из-за парникового эффекта. Плотная атмосфера из углекислого газа скрывает поверхность.',
    texture: 'radial-gradient(circle at 35% 30%, #fff0cc 0%, #e8cda0 25%, #c9a060 60%, #8a6530 100%)',
  },
  {
    name: 'Earth',
    nameRu: 'Земля',
    diameter: 12756,
    distanceFromSun: 149.6,
    orbitalPeriod: 365,
    color: '#4da6ff',
    glowColor: '#4488ff',
    size: 30,
    orbitRadius: 185,
    description: 'Наш дом. Единственная известная планета с жизнью. 71% поверхности покрыт водой.',
    texture: 'radial-gradient(circle at 35% 30%, #8fd4ff 0%, #4da6ff 20%, #2277cc 50%, #1a5588 75%, #0d3355 100%)',
  },
  {
    name: 'Mars',
    nameRu: 'Марс',
    diameter: 6792,
    distanceFromSun: 227.9,
    orbitalPeriod: 687,
    color: '#e07050',
    glowColor: '#ff6644',
    size: 22,
    orbitRadius: 240,
    description: 'Красная планета. Имеет самый высокий вулкан — Олимп (21 км) и гигантский каньон Долины Маринер.',
    texture: 'radial-gradient(circle at 35% 30%, #ff9977 0%, #e07050 30%, #aa4430 65%, #662211 100%)',
  },
  {
    name: 'Jupiter',
    nameRu: 'Юпитер',
    diameter: 142984,
    distanceFromSun: 778.6,
    orbitalPeriod: 4333,
    color: '#d4a574',
    glowColor: '#cc8844',
    size: 56,
    orbitRadius: 320,
    description: 'Самая большая планета. Газовый гигант с Большим Красным Пятном — штормом, бушующим уже 400 лет.',
    texture: 'radial-gradient(circle at 40% 35%, #f0d4a8 0%, #d4a574 20%, #b88050 45%, #8a5530 75%, #5a3018 100%)',
  },
  {
    name: 'Saturn',
    nameRu: 'Сатурн',
    diameter: 120536,
    distanceFromSun: 1433.5,
    orbitalPeriod: 10759,
    color: '#f0d890',
    glowColor: '#ddbb55',
    size: 48,
    orbitRadius: 400,
    description: 'Знаменита своими кольцами из льда и камней. Плотность меньше воды — мог бы плавать в океане!',
    texture: 'radial-gradient(circle at 40% 35%, #fff4cc 0%, #f0d890 20%, #c8a850 50%, #8a7030 80%, #5a4818 100%)',
    ringColor: '#e8d090',
  },
  {
    name: 'Uranus',
    nameRu: 'Уран',
    diameter: 51118,
    distanceFromSun: 2872.5,
    orbitalPeriod: 30687,
    color: '#7de8e8',
    glowColor: '#44cccc',
    size: 38,
    orbitRadius: 460,
    description: 'Ледяной гигант, вращающийся «на боку». Ось наклонена на 98°. Имеет тонкие тёмные кольца.',
    texture: 'radial-gradient(circle at 38% 32%, #b0ffff 0%, #7de8e8 25%, #44aaaa 55%, #226666 85%, #113838 100%)',
  },
  {
    name: 'Neptune',
    nameRu: 'Нептун',
    diameter: 49528,
    distanceFromSun: 4495.1,
    orbitalPeriod: 60190,
    color: '#4466ff',
    glowColor: '#3355ee',
    size: 36,
    orbitRadius: 520,
    description: 'Самая далёкая планета. Ветры достигают 2100 км/ч — самые сильные в Солнечной системе.',
    texture: 'radial-gradient(circle at 38% 32%, #8899ff 0%, #4466ff 25%, #2244cc 55%, #112288 85%, #081144 100%)',
  },
];

// Seeded random for consistent star positions
function seededRandom(seed: number) {
  const x = Math.sin(seed * 9301 + 49297) * 49297;
  return x - Math.floor(x);
}

function App() {
  const [isPlaying, setIsPlaying] = useState(true);
  const [speed, setSpeed] = useState(1);
  const [selectedPlanet, setSelectedPlanet] = useState<PlanetData | null>(null);
  const [angles, setAngles] = useState<number[]>(() => planets.map((_, i) => (i * Math.PI * 2) / planets.length + seededRandom(i) * 1.5));
  const [scale, setScale] = useState(0.7);
  const [showIntro, setShowIntro] = useState(true);
  const animationRef = useRef<number | null>(null);
  const lastTimeRef = useRef<number>(0);

  // Generate stars once
  const stars = useMemo(() => {
    return Array.from({ length: 350 }, (_, i) => ({
      x: seededRandom(i * 3 + 1) * 100,
      y: seededRandom(i * 3 + 2) * 100,
      size: seededRandom(i * 3 + 3) * 2.5 + 0.5,
      opacity: seededRandom(i * 7) * 0.7 + 0.3,
      duration: seededRandom(i * 11) * 4 + 2,
      delay: seededRandom(i * 13) * 6,
      isColored: seededRandom(i * 17) > 0.85,
      color: ['#aaccff', '#ffddaa', '#ffaaaa', '#aaffcc'][Math.floor(seededRandom(i * 19) * 4)],
    }));
  }, []);

  // Nebula clouds
  const nebulae = useMemo(() => {
    return Array.from({ length: 6 }, (_, i) => ({
      x: seededRandom(i * 5 + 100) * 100,
      y: seededRandom(i * 5 + 101) * 100,
      size: seededRandom(i * 5 + 102) * 400 + 200,
      color: ['#1a0033', '#001a33', '#0a1a00', '#1a0011', '#00111a', '#0d001a'][i],
      opacity: 0.15 + seededRandom(i * 5 + 103) * 0.1,
    }));
  }, []);

  // Intro animation
  useEffect(() => {
    const timer = setTimeout(() => setShowIntro(false), 2500);
    return () => clearTimeout(timer);
  }, []);

  // Responsive scaling
  useEffect(() => {
    const updateScale = () => {
      const w = window.innerWidth;
      const h = window.innerHeight - 120;
      const minDim = Math.min(w, h);
      setScale(Math.min(1.1, minDim / 1100));
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
          const baseSpeed = (2 * Math.PI) / (planets[i].orbitalPeriod / 8);
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

  const centerX = 550;
  const centerY = 550;

  return (
    <div className="min-h-screen bg-black text-white overflow-hidden relative select-none">
      {/* Intro overlay */}
      <div
        className={`fixed inset-0 z-[100] bg-black flex items-center justify-center transition-opacity duration-1000 pointer-events-none ${
          showIntro ? 'opacity-100' : 'opacity-0'
        }`}
      >
        <div className="text-center">
          <h1
            className="text-5xl md:text-7xl font-thin tracking-[0.3em] uppercase text-white/90"
            style={{ fontFamily: "'Inter', sans-serif", letterSpacing: '0.3em' }}
          >
            Солнечная
          </h1>
          <h1
            className="text-5xl md:text-7xl font-thin tracking-[0.3em] uppercase text-white/90 mt-2"
            style={{ fontFamily: "'Inter', sans-serif", letterSpacing: '0.3em' }}
          >
            Система
          </h1>
          <div className="mt-8 w-48 h-[1px] bg-gradient-to-r from-transparent via-amber-400/60 to-transparent mx-auto" />
        </div>
      </div>

      {/* Deep space background */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_#0a0a1a_0%,_#050510_40%,_#000000_100%)]" />

      {/* Nebula clouds */}
      {nebulae.map((n, i) => (
        <div
          key={`nebula-${i}`}
          className="absolute rounded-full pointer-events-none"
          style={{
            width: `${n.size}px`,
            height: `${n.size}px`,
            left: `${n.x}%`,
            top: `${n.y}%`,
            background: `radial-gradient(circle, ${n.color}${Math.round(n.opacity * 255).toString(16).padStart(2, '0')} 0%, transparent 70%)`,
            transform: 'translate(-50%, -50%)',
            filter: 'blur(40px)',
          }}
        />
      ))}

      {/* Stars */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {stars.map((star, i) => (
          <div
            key={i}
            className="absolute rounded-full"
            style={{
              width: star.size,
              height: star.size,
              left: `${star.x}%`,
              top: `${star.y}%`,
              backgroundColor: star.isColored ? star.color : 'white',
              opacity: star.opacity,
              animation: `twinkle ${star.duration}s ease-in-out infinite`,
              animationDelay: `${star.delay}s`,
              boxShadow: star.size > 2 ? `0 0 ${star.size * 2}px ${star.isColored ? star.color : 'white'}40` : 'none',
            }}
          />
        ))}
      </div>

      {/* Vignette */}
      <div
        className="absolute inset-0 pointer-events-none z-[5]"
        style={{
          background: 'radial-gradient(ellipse at center, transparent 40%, rgba(0,0,0,0.6) 100%)',
        }}
      />

      {/* Cinematic letterbox bars */}
      <div className="absolute top-0 left-0 right-0 h-[3vh] bg-gradient-to-b from-black to-transparent z-[6] pointer-events-none" />
      <div className="absolute bottom-0 left-0 right-0 h-[3vh] bg-gradient-to-t from-black to-transparent z-[6] pointer-events-none" />

      {/* Header */}
      <header className="relative z-10 text-center pt-[4vh] pb-2">
        <h1
          className="text-2xl md:text-3xl font-extralight tracking-[0.25em] uppercase text-white/80"
          style={{ textShadow: '0 0 30px rgba(255,200,100,0.3)' }}
        >
          Солнечная система
        </h1>
        <div className="mt-2 w-32 h-[1px] bg-gradient-to-r from-transparent via-amber-400/40 to-transparent mx-auto" />
        <p className="text-white/30 text-xs mt-2 tracking-widest uppercase">
          Нажмите на планету для информации
        </p>
      </header>

      {/* Solar System Visualization */}
      <div className="relative flex items-center justify-center" style={{ height: 'calc(100vh - 140px)' }}>
        <div
          className="relative"
          style={{
            width: '1100px',
            height: '1100px',
            transform: `scale(${scale})`,
            transformOrigin: 'center center',
          }}
        >
          {/* Sun corona */}
          <div
            className="absolute rounded-full"
            style={{
              width: '200px',
              height: '200px',
              left: `${centerX - 100}px`,
              top: `${centerY - 100}px`,
              background: 'radial-gradient(circle, rgba(255,150,0,0.15) 0%, transparent 70%)',
              animation: 'coronaPulse 4s ease-in-out infinite',
            }}
          />
          <div
            className="absolute rounded-full"
            style={{
              width: '300px',
              height: '300px',
              left: `${centerX - 150}px`,
              top: `${centerY - 150}px`,
              background: 'radial-gradient(circle, rgba(255,100,0,0.08) 0%, transparent 70%)',
              animation: 'coronaPulse 6s ease-in-out infinite reverse',
            }}
          />

          {/* Sun */}
          <div
            className="absolute rounded-full"
            style={{
              width: '80px',
              height: '80px',
              left: `${centerX - 40}px`,
              top: `${centerY - 40}px`,
              background: 'radial-gradient(circle at 40% 40%, #ffffff 0%, #fff700 15%, #ffaa00 40%, #ff6600 70%, #cc3300 100%)',
              boxShadow: '0 0 30px 5px #ff8800, 0 0 60px 10px #ff660080, 0 0 100px 20px #ff440040, 0 0 200px 40px #ff220020',
              animation: 'sunPulse 3s ease-in-out infinite',
            }}
          />

          {/* Lens flare from sun */}
          <div
            className="absolute pointer-events-none"
            style={{
              width: '4px',
              height: '200px',
              left: `${centerX - 2}px`,
              top: `${centerY - 100}px`,
              background: 'linear-gradient(to bottom, transparent, rgba(255,200,100,0.1), transparent)',
              animation: 'flareRotate 20s linear infinite',
              transformOrigin: 'center center',
            }}
          />
          <div
            className="absolute pointer-events-none"
            style={{
              width: '200px',
              height: '4px',
              left: `${centerX - 100}px`,
              top: `${centerY - 2}px`,
              background: 'linear-gradient(to right, transparent, rgba(255,200,100,0.1), transparent)',
              animation: 'flareRotate 20s linear infinite',
              transformOrigin: 'center center',
            }}
          />

          {/* Orbits */}
          {planets.map((planet, i) => (
            <div
              key={`orbit-${i}`}
              className="absolute rounded-full"
              style={{
                width: `${planet.orbitRadius * 2}px`,
                height: `${planet.orbitRadius * 2}px`,
                left: `${centerX - planet.orbitRadius}px`,
                top: `${centerY - planet.orbitRadius}px`,
                border: `1px solid rgba(255,255,255,${selectedPlanet?.name === planet.name ? 0.15 : 0.05})`,
                transition: 'border-color 0.5s ease',
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
                className={`absolute cursor-pointer transition-all duration-300 ease-out ${
                  isSelected ? 'scale-125' : 'hover:scale-110'
                }`}
                style={{
                  width: `${planet.size}px`,
                  height: `${planet.size}px`,
                  left: `${x - planet.size / 2}px`,
                  top: `${y - planet.size / 2}px`,
                  zIndex: isSelected ? 20 : 10,
                }}
                onClick={() => setSelectedPlanet(isSelected ? null : planet)}
                title={planet.nameRu}
              >
                {/* Planet glow */}
                <div
                  className="absolute rounded-full"
                  style={{
                    width: `${planet.size * 2.5}px`,
                    height: `${planet.size * 2.5}px`,
                    left: `${-(planet.size * 0.75)}px`,
                    top: `${-(planet.size * 0.75)}px`,
                    background: `radial-gradient(circle, ${planet.glowColor}20 0%, transparent 70%)`,
                    opacity: isSelected ? 1 : 0.5,
                    transition: 'opacity 0.3s',
                  }}
                />

                {/* Planet body */}
                <div
                  className="absolute rounded-full w-full h-full"
                  style={{
                    background: planet.texture,
                    boxShadow: isSelected
                      ? `0 0 ${planet.size * 0.8}px ${planet.glowColor}80, 0 0 ${planet.size * 1.5}px ${planet.glowColor}40, inset -${planet.size * 0.15}px -${planet.size * 0.1}px ${planet.size * 0.3}px rgba(0,0,0,0.6)`
                      : `0 0 ${planet.size * 0.4}px ${planet.glowColor}30, inset -${planet.size * 0.12}px -${planet.size * 0.08}px ${planet.size * 0.25}px rgba(0,0,0,0.5)`,
                    transition: 'box-shadow 0.3s',
                  }}
                />

                {/* Planet atmosphere rim light */}
                <div
                  className="absolute rounded-full w-full h-full"
                  style={{
                    background: `radial-gradient(circle at 25% 25%, rgba(255,255,255,0.15) 0%, transparent 50%)`,
                  }}
                />

                {/* Saturn's rings */}
                {planet.name === 'Saturn' && (
                  <>
                    <div
                      className="absolute rounded-full"
                      style={{
                        width: `${planet.size * 2.2}px`,
                        height: `${planet.size * 0.6}px`,
                        left: `${-(planet.size * 0.6)}px`,
                        top: `${planet.size * 0.2}px`,
                        transform: 'rotate(-15deg)',
                        border: `3px solid ${planet.ringColor}60`,
                        boxShadow: `0 0 8px ${planet.ringColor}30, inset 0 0 4px ${planet.ringColor}20`,
                      }}
                    />
                    <div
                      className="absolute rounded-full"
                      style={{
                        width: `${planet.size * 1.9}px`,
                        height: `${planet.size * 0.5}px`,
                        left: `${-(planet.size * 0.45)}px`,
                        top: `${planet.size * 0.25}px`,
                        transform: 'rotate(-15deg)',
                        border: `2px solid ${planet.ringColor}40`,
                      }}
                    />
                  </>
                )}

                {/* Earth's moon hint */}
                {planet.name === 'Earth' && (
                  <div
                    className="absolute rounded-full"
                    style={{
                      width: '6px',
                      height: '6px',
                      right: '-10px',
                      top: '2px',
                      background: 'radial-gradient(circle at 40% 40%, #ddd, #888)',
                      boxShadow: '0 0 4px rgba(200,200,200,0.3)',
                    }}
                  />
                )}

                {/* Jupiter bands */}
                {planet.name === 'Jupiter' && (
                  <div
                    className="absolute rounded-full overflow-hidden"
                    style={{
                      width: '100%',
                      height: '100%',
                      top: 0,
                      left: 0,
                    }}
                  >
                    <div className="absolute w-full" style={{ top: '30%', height: '8%', background: 'rgba(180,100,50,0.3)' }} />
                    <div className="absolute w-full" style={{ top: '45%', height: '12%', background: 'rgba(200,120,60,0.25)' }} />
                    <div className="absolute w-full" style={{ top: '62%', height: '6%', background: 'rgba(160,80,40,0.3)' }} />
                    {/* Great Red Spot */}
                    <div
                      className="absolute rounded-full"
                      style={{
                        width: '20%',
                        height: '12%',
                        left: '55%',
                        top: '50%',
                        background: 'radial-gradient(ellipse, #cc4422 0%, #aa3311 50%, transparent 100%)',
                      }}
                    />
                  </div>
                )}

                {/* Planet label */}
                <div
                  className="absolute whitespace-nowrap pointer-events-none"
                  style={{
                    left: '50%',
                    top: `${planet.size + 8}px`,
                    transform: 'translateX(-50%)',
                    fontSize: '11px',
                    fontWeight: 300,
                    letterSpacing: '0.1em',
                    color: isSelected ? planet.color : 'rgba(255,255,255,0.5)',
                    textShadow: `0 0 10px ${planet.glowColor}60, 0 1px 3px rgba(0,0,0,0.8)`,
                    textTransform: 'uppercase',
                    transition: 'color 0.3s',
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
      <div
        className={`fixed top-[50%] right-4 z-50 transition-all duration-500 ease-out ${
          selectedPlanet ? 'translate-x-0 opacity-100' : 'translate-x-[120%] opacity-0'
        }`}
        style={{ transform: selectedPlanet ? 'translateY(-50%)' : 'translateY(-50%) translateX(120%)' }}
      >
        {selectedPlanet && (
          <div
            className="relative rounded-2xl overflow-hidden"
            style={{
              background: 'linear-gradient(135deg, rgba(15,15,30,0.95) 0%, rgba(5,5,15,0.98) 100%)',
              backdropFilter: 'blur(20px)',
              border: `1px solid ${selectedPlanet.glowColor}20`,
              boxShadow: `0 0 40px ${selectedPlanet.glowColor}10, 0 20px 60px rgba(0,0,0,0.5)`,
              width: '320px',
            }}
          >
            {/* Top accent line */}
            <div
              className="absolute top-0 left-0 right-0 h-[1px]"
              style={{
                background: `linear-gradient(90deg, transparent, ${selectedPlanet.color}60, transparent)`,
              }}
            />

            <button
              onClick={() => setSelectedPlanet(null)}
              className="absolute top-3 right-3 w-7 h-7 rounded-full flex items-center justify-center text-white/40 hover:text-white hover:bg-white/10 transition-all z-10"
            >
              ✕
            </button>

            <div className="p-6">
              {/* Planet header */}
              <div className="flex items-center gap-4 mb-5">
                <div
                  className="rounded-full flex-shrink-0"
                  style={{
                    width: '56px',
                    height: '56px',
                    background: selectedPlanet.texture,
                    boxShadow: `0 0 20px ${selectedPlanet.glowColor}50, 0 0 40px ${selectedPlanet.glowColor}20`,
                  }}
                />
                <div>
                  <h2
                    className="text-2xl font-light tracking-wider uppercase"
                    style={{ color: selectedPlanet.color, textShadow: `0 0 20px ${selectedPlanet.glowColor}40` }}
                  >
                    {selectedPlanet.nameRu}
                  </h2>
                  <p className="text-white/30 text-xs tracking-widest uppercase">{selectedPlanet.name}</p>
                </div>
              </div>

              <p className="text-white/60 text-sm leading-relaxed mb-5 font-light">
                {selectedPlanet.description}
              </p>

              {/* Stats */}
              <div className="grid grid-cols-2 gap-2.5">
                <StatCard
                  label="Диаметр"
                  value={`${selectedPlanet.diameter.toLocaleString()} км`}
                  color={selectedPlanet.color}
                />
                <StatCard
                  label="До Солнца"
                  value={`${selectedPlanet.distanceFromSun} млн км`}
                  color={selectedPlanet.color}
                />
                <StatCard
                  label="Год"
                  value={formatPeriod(selectedPlanet.orbitalPeriod)}
                  color={selectedPlanet.color}
                />
                <StatCard
                  label="Расст. (а.е.)"
                  value={`${(selectedPlanet.distanceFromSun / 149.6).toFixed(2)} а.е.`}
                  color={selectedPlanet.color}
                />
              </div>
            </div>

            {/* Bottom accent */}
            <div
              className="absolute bottom-0 left-0 right-0 h-[1px]"
              style={{
                background: `linear-gradient(90deg, transparent, ${selectedPlanet.color}30, transparent)`,
              }}
            />
          </div>
        )}
      </div>

      {/* Controls */}
      <div
        className="fixed bottom-0 left-0 right-0 z-50 px-4 py-3"
        style={{
          background: 'linear-gradient(to top, rgba(0,0,0,0.9) 0%, rgba(0,0,0,0.7) 60%, transparent 100%)',
        }}
      >
        <div className="max-w-3xl mx-auto flex items-center justify-center gap-6 flex-wrap">
          {/* Play/Pause */}
          <button
            onClick={() => setIsPlaying(!isPlaying)}
            className="group flex items-center gap-2.5 px-5 py-2.5 rounded-full transition-all duration-300"
            style={{
              background: isPlaying ? 'rgba(255,255,255,0.05)' : 'rgba(255,200,100,0.1)',
              border: `1px solid ${isPlaying ? 'rgba(255,255,255,0.1)' : 'rgba(255,200,100,0.3)'}`,
              boxShadow: isPlaying ? 'none' : '0 0 20px rgba(255,200,100,0.1)',
            }}
          >
            <span className="text-base transition-transform group-hover:scale-110">
              {isPlaying ? '⏸' : '▶'}
            </span>
            <span className="text-xs tracking-widest uppercase text-white/60 font-light">
              {isPlaying ? 'Пауза' : 'Старт'}
            </span>
          </button>

          {/* Speed Control */}
          <div className="flex items-center gap-2">
            <span className="text-[10px] tracking-widest uppercase text-white/30 mr-1">Скорость</span>
            <div className="flex gap-1">
              {[0.25, 0.5, 1, 2, 5, 10].map((s) => (
                <button
                  key={s}
                  onClick={() => setSpeed(s)}
                  className="px-3 py-1.5 rounded-full text-[11px] font-light tracking-wider transition-all duration-300"
                  style={{
                    background: speed === s ? 'rgba(255,200,100,0.15)' : 'rgba(255,255,255,0.03)',
                    border: `1px solid ${speed === s ? 'rgba(255,200,100,0.4)' : 'rgba(255,255,255,0.08)'}`,
                    color: speed === s ? '#ffcc66' : 'rgba(255,255,255,0.4)',
                    boxShadow: speed === s ? '0 0 10px rgba(255,200,100,0.1)' : 'none',
                  }}
                >
                  {s}×
                </button>
              ))}
            </div>
          </div>

          {/* Reset */}
          <button
            onClick={() => {
              setAngles(planets.map((_, i) => (i * Math.PI * 2) / planets.length));
              setSpeed(1);
              setIsPlaying(true);
            }}
            className="flex items-center gap-2 px-5 py-2.5 rounded-full transition-all duration-300"
            style={{
              background: 'rgba(255,255,255,0.03)',
              border: '1px solid rgba(255,255,255,0.08)',
            }}
          >
            <span className="text-base">↺</span>
            <span className="text-xs tracking-widest uppercase text-white/40 font-light">Сброс</span>
          </button>
        </div>
      </div>

      {/* CSS Animations */}
      <style>{`
        @keyframes twinkle {
          0%, 100% { opacity: 0.2; transform: scale(1); }
          50% { opacity: 1; transform: scale(1.3); }
        }
        @keyframes sunPulse {
          0%, 100% { 
            transform: scale(1);
            box-shadow: 0 0 30px 5px #ff8800, 0 0 60px 10px #ff660080, 0 0 100px 20px #ff440040, 0 0 200px 40px #ff220020;
          }
          50% { 
            transform: scale(1.03);
            box-shadow: 0 0 40px 8px #ff8800, 0 0 80px 15px #ff660080, 0 0 130px 30px #ff440040, 0 0 250px 50px #ff220020;
          }
        }
        @keyframes coronaPulse {
          0%, 100% { transform: scale(1); opacity: 0.6; }
          50% { transform: scale(1.1); opacity: 1; }
        }
        @keyframes flareRotate {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
        @keyframes slideIn {
          from { transform: translateX(100%); opacity: 0; }
          to { transform: translateX(0); opacity: 1; }
        }
      `}</style>
    </div>
  );
}

function formatPeriod(days: number): string {
  if (days < 365) return `${days} дней`;
  const years = (days / 365.25).toFixed(1);
  return `${years} лет`;
}

function StatCard({ label, value, color }: { label: string; value: string; color: string }) {
  return (
    <div
      className="rounded-xl p-3"
      style={{
        background: 'rgba(255,255,255,0.03)',
        border: '1px solid rgba(255,255,255,0.06)',
      }}
    >
      <p className="text-[10px] tracking-widest uppercase text-white/30 mb-1">{label}</p>
      <p className="text-sm font-light" style={{ color: `${color}dd` }}>
        {value}
      </p>
    </div>
  );
}

export default App;
