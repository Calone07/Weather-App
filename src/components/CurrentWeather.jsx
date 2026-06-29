import WeatherIcon from './WeatherIcon'
import WeatherDetails from './WeatherDetails'
import { FiClock } from 'react-icons/fi'

function toF(c) {
  return Math.round(c * 9 / 5 + 32)
}

export default function CurrentWeather({ weather, unit, glowColor, theme, localTime, windDir, visibilityKm, sunrise, sunset, uvIndex, uvLevel }) {
  if (!weather) return null

  const temp = unit === 'metric' ? Math.round(weather.main.temp) : toF(weather.main.temp)
  const feelsLike = unit === 'metric' ? Math.round(weather.main.feels_like) : toF(weather.main.feels_like)
  const deg = unit === 'metric' ? '°C' : '°F'

  const tc = theme === 'dark' ? 'text-white' : 'text-gray-900'
  const tcs = theme === 'dark' ? 'text-white/80' : 'text-gray-600'
  const tcm = theme === 'dark' ? 'text-white/70' : 'text-gray-500'
  const tcl = theme === 'dark' ? 'text-white/60' : 'text-gray-400'

  return (
    <div className={`text-center ${tc}`}>
      <h2 className="text-3xl font-semibold mb-1">{weather.name}, {weather.sys.country}</h2>
      <div className={`flex items-center justify-center gap-1.5 ${tcm} mb-1`}>
        <FiClock size={14} />
        <span className="text-sm">{localTime}</span>
      </div>
      <p className={`text-lg capitalize ${tcs} mb-4`}>{weather.weather[0].description}</p>
      <div className="flex items-center justify-center gap-2">
        <div className="relative">
          <div
            className="glow-pulse absolute inset-0 rounded-full"
            style={{
              background: `radial-gradient(circle, rgba(${glowColor}, ${theme === 'dark' ? 0.4 : 0.25}) 0%, transparent 70%)`,
              width: 120,
              height: 120,
              left: '50%',
              top: '50%',
              transform: 'translate(-50%, -50%)',
            }}
          />
          <WeatherIcon icon={weather.weather[0].icon} size={100} />
        </div>
        <span className={`text-7xl font-bold ${tc}`}>{temp}{deg}</span>
      </div>
      <p className={`${tcm} mt-2`}>Feels like {feelsLike}{deg}</p>
      <div className="flex justify-center gap-8 mt-6 text-sm">
        <div>
          <p className={tcl}>Humidity</p>
          <p className={`text-lg font-medium ${tc}`}>{weather.main.humidity}%</p>
        </div>
        <div>
          <p className={tcl}>Wind</p>
          <p className={`text-lg font-medium ${tc}`}>{weather.wind.speed} {unit === 'metric' ? 'm/s' : 'mph'}</p>
        </div>
      </div>

      <WeatherDetails
        weather={weather}
        windDir={windDir}
        visibilityKm={visibilityKm}
        sunrise={sunrise}
        sunset={sunset}
        uvIndex={uvIndex}
        uvLevel={uvLevel}
        unit={unit}
        theme={theme}
      />
    </div>
  )
}
