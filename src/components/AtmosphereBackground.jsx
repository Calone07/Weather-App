import { useRef, useEffect, useState } from 'react'

const ATMOSPHERE_CONFIG = {
  'Clear-d':    { clouds: 1, rain: 0, lightning: 0, snow: false },
  'Clear-n':    { clouds: 1, rain: 0, lightning: 0, snow: false },
  Clouds:       { clouds: 3, rain: 0,   lightning: 0, snow: false },
  Rain:         { clouds: 4, rain: 200, lightning: 1, snow: false },
  Drizzle:      { clouds: 3, rain: 100, lightning: 0, snow: false },
  Thunderstorm: { clouds: 5, rain: 350, lightning: 3, snow: false },
  Snow:         { clouds: 4, rain: 0,   lightning: 0, snow: true  },
  Mist:         { clouds: 2, rain: 0,   lightning: 0, snow: false },
}

function getConfig(weather) {
  if (!weather) return { clouds: 2, rain: 0, lightning: 0, snow: false }
  const main = weather.weather[0].main
  const icon = weather.weather[0].icon
  const key = main === 'Clear' ? `Clear-${icon.endsWith('n') ? 'n' : 'd'}` : main
  return ATMOSPHERE_CONFIG[key] || { clouds: 2, rain: 0, lightning: 0, snow: false }
}

const CLOUD_CLUSTERS = [
  {
    top: '5%', speed: 'slow',
    puffs: [
      { w: 280, h: 80, blur: 28, opacity: 0.10 },
      { w: 200, h: 120, blur: 28, opacity: 0.12, ml: -60 },
      { w: 180, h: 60, blur: 28, opacity: 0.10, ml: -40 },
    ],
  },
  {
    top: '14%', speed: 'medium',
    puffs: [
      { w: 240, h: 70, blur: 24, opacity: 0.09 },
      { w: 180, h: 100, blur: 24, opacity: 0.11, ml: -55 },
      { w: 160, h: 55, blur: 24, opacity: 0.09, ml: -35 },
    ],
  },
  {
    top: '26%', speed: 'fast',
    puffs: [
      { w: 220, h: 60, blur: 20, opacity: 0.12 },
      { w: 160, h: 90, blur: 20, opacity: 0.14, ml: -50 },
      { w: 140, h: 50, blur: 20, opacity: 0.12, ml: -30 },
    ],
  },
  {
    top: '38%', speed: 'slow',
    puffs: [
      { w: 200, h: 55, blur: 18, opacity: 0.11 },
      { w: 150, h: 80, blur: 18, opacity: 0.13, ml: -45 },
      { w: 130, h: 45, blur: 18, opacity: 0.11, ml: -30 },
    ],
  },
  {
    top: '52%', speed: 'faster',
    puffs: [
      { w: 180, h: 50, blur: 15, opacity: 0.12 },
      { w: 130, h: 70, blur: 15, opacity: 0.15, ml: -40 },
      { w: 110, h: 40, blur: 15, opacity: 0.12, ml: -25 },
    ],
  },
  {
    top: '68%', speed: 'fast',
    puffs: [
      { w: 150, h: 40, blur: 14, opacity: 0.10 },
      { w: 110, h: 60, blur: 14, opacity: 0.12, ml: -35 },
      { w: 100, h: 35, blur: 14, opacity: 0.10, ml: -20 },
    ],
  },
]

const speedClass = {
  slow: 'animate-drift-slow',
  medium: 'animate-drift-medium',
  fast: 'animate-drift-fast',
  faster: 'animate-drift-faster',
}

export default function AtmosphereBackground({ weather, theme }) {
  const cfg = getConfig(weather)
  const canvasRef = useRef(null)
  const [flashOpacity, setFlashOpacity] = useState(0)
  const isDark = theme === 'dark'
  const isSnow = cfg.snow
  const particleCount = isSnow ? 150 : cfg.rain

  // Rain/Snow canvas
  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas || particleCount === 0) return
    const ctx = canvas.getContext('2d')
    let animId
    let particles = []

    const setSize = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
    }
    setSize()
    window.addEventListener('resize', setSize)

    class Raindrop {
      constructor() { this.reset() }
      reset() {
        this.x = Math.random() * canvas.width
        this.y = Math.random() * canvas.height * -1
        this.len = 15 + Math.random() * 30
        this.speed = 300 + Math.random() * 500
        this.wind = -0.3 + Math.random() * 0.6
        this.opacity = 0.2 + Math.random() * 0.3
      }
      update(dt) {
        this.y += this.speed * dt
        this.x += this.wind * 60 * dt
        if (this.y > canvas.height + this.len) this.reset()
      }
      draw() {
        ctx.beginPath()
        ctx.moveTo(this.x, this.y)
        ctx.lineTo(this.x - this.wind * 3, this.y - this.len)
        ctx.strokeStyle = isDark
          ? `rgba(160, 190, 255, ${this.opacity})`
          : `rgba(100, 130, 180, ${this.opacity * 0.7})`
        ctx.lineWidth = 1.5
        ctx.stroke()
      }
    }

    class Snowflake {
      constructor() { this.reset() }
      reset() {
        this.x = Math.random() * canvas.width
        this.y = Math.random() * canvas.height * -1
        this.size = 1.5 + Math.random() * 3.5
        this.speed = 40 + Math.random() * 120
        this.wind = -0.3 + Math.random() * 0.6
        this.phase = Math.random() * Math.PI * 2
        this.amp = 0.5 + Math.random() * 2
        this.opacity = 0.3 + Math.random() * 0.5
      }
      update(dt) {
        this.y += this.speed * dt
        this.x += this.wind * 20 * dt + Math.sin(this.phase) * this.amp * dt * 25
        this.phase += dt * 2.5
        if (this.y > canvas.height + 10) this.reset()
      }
      draw() {
        ctx.beginPath()
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2)
        ctx.fillStyle = `rgba(255, 255, 255, ${this.opacity})`
        ctx.fill()
      }
    }

    const Particle = isSnow ? Snowflake : Raindrop

    for (let i = 0; i < particleCount; i++) {
      const p = new Particle()
      p.y = Math.random() * canvas.height
      particles.push(p)
    }

    let lastTime = performance.now()
    const animate = (time) => {
      const dt = Math.min((time - lastTime) / 1000, 0.05)
      lastTime = time
      ctx.clearRect(0, 0, canvas.width, canvas.height)
      for (const p of particles) { p.update(dt); p.draw() }
      animId = requestAnimationFrame(animate)
    }
    animId = requestAnimationFrame(animate)

    return () => {
      cancelAnimationFrame(animId)
      window.removeEventListener('resize', setSize)
    }
  }, [particleCount, isSnow, isDark])

  // Lightning
  useEffect(() => {
    if (cfg.lightning === 0) return
    let timeout

    const schedule = () => {
      const delay = cfg.lightning >= 3
        ? 3000 + Math.random() * 7000
        : 10000 + Math.random() * 15000

      timeout = setTimeout(() => {
        setFlashOpacity(isDark ? 0.85 : 0.5)
        setTimeout(() => setFlashOpacity(0), 250)
        if (Math.random() > 0.4) {
          setTimeout(() => {
            setFlashOpacity(isDark ? 0.7 : 0.4)
            setTimeout(() => setFlashOpacity(0), 180)
          }, 120 + Math.random() * 100)
        }
        schedule()
      }, delay)
    }

    schedule()
    return () => clearTimeout(timeout)
  }, [cfg.lightning, isDark])

  const clusters = CLOUD_CLUSTERS.slice(0, cfg.clouds)

  return (
    <div className="fixed inset-0 overflow-hidden pointer-events-none" style={{ zIndex: 0 }}>
      {/* Sky base */}
      <div className={`absolute inset-0 bg-gradient-to-b ${isDark ? 'from-gray-950 via-slate-900 to-blue-950' : 'from-slate-300 via-blue-200 to-slate-200'}`} />

      {/* Clouds */}
      {clusters.map((cluster, i) => (
        <div key={i} style={{ position: 'absolute', top: cluster.top, left: 0 }} className={speedClass[cluster.speed]}>
          <div className="flex items-center">
            {cluster.puffs.map((puff, j) => (
              <div
                key={j}
                className="rounded-full"
                style={{
                  width: puff.w,
                  height: puff.h,
                  marginLeft: puff.ml || 0,
                  background: `radial-gradient(ellipse at center, rgba(255,255,255,${puff.opacity}) 0%, rgba(255,255,255,${puff.opacity * 0.5}) 40%, transparent 100%)`,
                  filter: `blur(${puff.blur}px)`,
                }}
              />
            ))}
          </div>
        </div>
      ))}

      {/* Rain/Snow canvas */}
      {particleCount > 0 && (
        <canvas ref={canvasRef} className="absolute inset-0" style={{ zIndex: 5 }} />
      )}

      {/* Lightning flash */}
      {cfg.lightning > 0 && (
        <div
          className="absolute inset-0 transition-opacity duration-300"
          style={{
            backgroundColor: isDark ? 'rgba(200, 215, 255, 0.9)' : 'rgba(200, 215, 255, 0.6)',
            opacity: flashOpacity,
            zIndex: 10,
          }}
        />
      )}
    </div>
  )
}
