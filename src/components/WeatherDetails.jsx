import { FiSunrise, FiSunset, FiWind, FiEye } from 'react-icons/fi'
import { BsSun } from 'react-icons/bs'
import { WiBarometer } from 'react-icons/wi'

export default function WeatherDetails({ weather, windDir, visibilityKm, sunrise, sunset, uvIndex, uvLevel, unit, theme }) {
  if (!weather) return null

  const tc = theme === 'dark' ? 'text-white' : 'text-gray-900'
  const tcm = theme === 'dark' ? 'text-white/60' : 'text-gray-500'
  const bg = theme === 'dark' ? 'bg-white/10' : 'bg-white/70'
  const border = theme === 'dark' ? 'border-white/10' : 'border-white/80'

  const windUnit = unit === 'metric' ? 'm/s' : 'mph'
  const pressureUnit = 'hPa'

  const details = [
    { icon: <FiSunrise size={18} />, label: 'Sunrise', value: sunrise },
    { icon: <FiSunset size={18} />, label: 'Sunset', value: sunset },
    { icon: <FiWind size={18} />, label: 'Wind', value: `${weather.wind.speed} ${windUnit} ${windDir}` },
    { icon: <WiBarometer size={22} />, label: 'Pressure', value: `${weather.main.pressure} ${pressureUnit}` },
    { icon: <FiEye size={18} />, label: 'Visibility', value: `${visibilityKm} km` },
    { icon: <BsSun size={16} />, label: 'UV Index', value: uvIndex !== null ? `${uvIndex} (${uvLevel.label})` : '—' },
  ]

  return (
    <div className="w-full mt-6">
      <div className={`grid grid-cols-2 sm:grid-cols-3 gap-3`}>
        {details.map((d) => (
          <div
            key={d.label}
            className={`flex items-center gap-3 p-3 rounded-xl backdrop-blur shadow-sm border ${bg} ${border} transition`}
          >
            <span className={tcm}>{d.icon}</span>
            <div>
              <p className={`text-xs ${tcm}`}>{d.label}</p>
              <p className={`text-sm font-medium ${uvIndex !== null && d.label === 'UV Index' ? uvLevel.color : tc}`}>{d.value}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
