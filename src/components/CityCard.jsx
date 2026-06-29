import { FiX, FiClock } from 'react-icons/fi'

function toF(c) {
  return Math.round(c * 9 / 5 + 32)
}

function getLocalTimeOffset(data) {
  const now = Date.now()
  const d = new Date(now + data.timezone * 1000 + new Date().getTimezoneOffset() * 60000)
  return d.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })
}

export default function CityCard({ data, unit, isActive, onSelect, onRemove }) {
  const temp = unit === 'metric' ? Math.round(data.main.temp) : toF(data.main.temp)
  const deg = unit === 'metric' ? '°' : '°'
  const time = getLocalTimeOffset(data)

  return (
    <div
      onClick={() => onSelect(data.name)}
      className={`relative flex-shrink-0 w-36 sm:w-40 p-3 rounded-xl backdrop-blur cursor-pointer transition border text-left
        ${isActive
          ? 'bg-white/25 border-white/40 shadow-lg'
          : 'bg-white/10 border-white/10 hover:bg-white/20'
        }
      `}
    >
      <button
        onClick={(e) => { e.stopPropagation(); onRemove(data.name) }}
        className="absolute -top-1.5 -right-1.5 p-0.5 rounded-full bg-red-500/80 text-white hover:bg-red-500 transition"
        title="Remove city"
      >
        <FiX size={12} />
      </button>
      <p className="text-sm font-semibold truncate pr-3 text-white">{data.name}</p>
      <div className="flex items-center gap-1 text-xs text-white/60 mt-0.5">
        <FiClock size={10} />
        <span>{time}</span>
      </div>
      <div className="flex items-center gap-1 mt-1">
        <img
          src={`https://openweathermap.org/img/wn/${data.weather[0].icon}.png`}
          alt=""
          width={28}
          height={28}
          className="-ml-1"
        />
        <span className="text-lg font-bold text-white">{temp}{deg}</span>
      </div>
      <p className="text-xs text-white/70 capitalize truncate">{data.weather[0].description}</p>
    </div>
  )
}
