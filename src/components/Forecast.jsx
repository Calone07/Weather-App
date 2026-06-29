import WeatherIcon from './WeatherIcon'
import { FiCalendar } from 'react-icons/fi'

function toF(c) {
  return Math.round(c * 9 / 5 + 32)
}

const DAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']

function formatDate(dateStr) {
  const d = new Date(dateStr + 'T12:00:00')
  return DAYS[d.getDay()]
}

export default function Forecast({ forecast, unit, theme }) {
  if (!forecast || forecast.length === 0) return null

  const tc = theme === 'dark' ? 'text-white' : 'text-gray-900'
  const tcs = theme === 'dark' ? 'text-white/80' : 'text-gray-600'
  const tcl = theme === 'dark' ? 'text-white/70' : 'text-gray-500'
  const tcm = theme === 'dark' ? 'text-white/50' : 'text-gray-400'

  return (
    <div className="w-full max-w-2xl mt-8">
      <div className={`flex items-center gap-2 ${tcs} mb-4`}>
        <FiCalendar />
        <h3 className="text-lg font-medium">5-Day Forecast</h3>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-5 gap-2 sm:gap-3">
        {forecast.slice(0, 5).map((day) => {
          const hi = unit === 'metric' ? Math.round(day.temp_max) : toF(day.temp_max)
          const lo = unit === 'metric' ? Math.round(day.temp_min) : toF(day.temp_min)
          const deg = unit === 'metric' ? '°' : '°'
          return (
            <div
              key={day.date}
              className={`flex flex-col items-center p-4 rounded-xl backdrop-blur shadow-lg transition ${theme === 'dark'
                ? 'bg-white/10 text-white shadow-white/5'
                : 'bg-white/70 text-gray-900 shadow-black/5'
              }`}
            >
              <span className={`text-sm font-medium ${tc}`}>{formatDate(day.date)}</span>
              <WeatherIcon icon={day.icon} size={50} />
              <span className={`text-xs capitalize ${tcl}`}>{day.description}</span>
              <div className="flex gap-2 mt-1 text-sm">
                <span className={`font-semibold ${tc}`}>{hi}{deg}</span>
                <span className={tcm}>{lo}{deg}</span>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
