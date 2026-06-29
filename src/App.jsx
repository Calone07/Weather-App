import { useEffect, useState } from 'react'
import { useWeather } from './hooks/useWeather'
import SearchBar from './components/SearchBar'
import CurrentWeather from './components/CurrentWeather'
import Forecast from './components/Forecast'
import TemperatureToggle from './components/TemperatureToggle'
import ThemeToggle from './components/ThemeToggle'
import MapDisplay from './components/MapDisplay'
import AtmosphereBackground from './components/AtmosphereBackground'
import CityManager from './components/CityManager'
import { FiMapPin, FiCloud, FiPlus } from 'react-icons/fi'

const GLOW_COLORS = {
  'Clear-d':    '251, 146, 60',
  'Clear-n':    '139, 92, 246',
  Clouds:       '148, 163, 184',
  Rain:         '96, 165, 250',
  Drizzle:      '96, 165, 250',
  Thunderstorm: '168, 85, 247',
  Snow:         '255, 255, 255',
  Mist:         '156, 163, 175',
}

function getWeatherGlow(weather) {
  if (!weather) return '56, 189, 248'
  const main = weather.weather[0].main
  const icon = weather.weather[0].icon
  const key = main === 'Clear' ? `Clear-${icon.endsWith('n') ? 'n' : 'd'}` : main
  return GLOW_COLORS[key] || '56, 189, 248'
}

export default function App() {
  const {
    weather, forecast, loading, error, unit, city,
    searchCity, fetchByCoords, toggleUnit,
    savedCities, addCity, removeCity, citySummaries,
    localTime, windDir, visibilityKm, sunrise, sunset, uvIndex, uvLevel,
  } = useWeather()

  const [theme, setTheme] = useState(() => localStorage.getItem('theme') || 'dark')

  useEffect(() => {
    localStorage.setItem('theme', theme)
  }, [theme])

  const toggleTheme = () => setTheme((prev) => (prev === 'dark' ? 'light' : 'dark'))

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => fetchByCoords(pos.coords.latitude, pos.coords.longitude),
        () => searchCity('London')
      )
    } else {
      searchCity('London')
    }
  }, [fetchByCoords, searchCity])

  return (
    <div className={`min-h-screen ${theme === 'dark' ? 'bg-gray-950' : 'bg-slate-300'} transition-colors duration-1000 flex flex-col items-center px-4 py-8 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
      <AtmosphereBackground weather={weather} theme={theme} />
      <div className="w-full max-w-3xl flex flex-col items-center gap-6 relative z-10">
        <div className="flex items-center gap-2 mb-2">
          <FiCloud size={28} className={theme === 'dark' ? 'text-white' : 'text-gray-900'} />
          <h1 className={`text-2xl font-bold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>Weather</h1>
        </div>

        <div className="flex items-center gap-3 w-full max-w-md">
          <SearchBar onSearch={searchCity} theme={theme} />
          <button
            onClick={() => {
              if (navigator.geolocation) {
                navigator.geolocation.getCurrentPosition(
                  (pos) => fetchByCoords(pos.coords.latitude, pos.coords.longitude)
                )
              }
            }}
            className={`p-3 rounded-lg backdrop-blur transition ${theme === 'dark' ? 'bg-white/20 hover:bg-white/30 text-white' : 'bg-white/70 hover:bg-white/90 text-gray-700 shadow-sm'}`}
            title="Use current location"
          >
            <FiMapPin size={20} />
          </button>
          <TemperatureToggle unit={unit} onToggle={toggleUnit} theme={theme} />
          <ThemeToggle theme={theme} onToggle={toggleTheme} />
        </div>

        {weather && !loading && (
          <button
            onClick={() => addCity(city)}
            className={`flex items-center gap-1.5 text-xs rounded-lg px-3 py-1.5 backdrop-blur transition ${theme === 'dark' ? 'bg-white/10 hover:bg-white/20 text-white/70' : 'bg-white/60 hover:bg-white/80 text-gray-600'}`}
            title="Save current city"
          >
            <FiPlus size={14} />
            <span>Save {city}</span>
          </button>
        )}

        <CityManager
          savedCities={savedCities}
          citySummaries={citySummaries}
          unit={unit}
          activeCity={city}
          onSelectCity={searchCity}
          onRemoveCity={removeCity}
          theme={theme}
        />

        {loading && (
          <div className={`flex items-center gap-2 mt-8 ${theme === 'dark' ? 'text-white/80' : 'text-gray-600'}`}>
            <div className={`w-5 h-5 border-2 rounded-full animate-spin ${theme === 'dark' ? 'border-white/30 border-t-white' : 'border-gray-300 border-t-gray-600'}`} />
            <span>Loading...</span>
          </div>
        )}

        {error && (
          <div className={`mt-8 px-6 py-3 rounded-lg backdrop-blur ${theme === 'dark' ? 'bg-red-500/30 text-white' : 'bg-red-100 text-red-800'}`}>
            {error}
          </div>
        )}

        {weather && !loading && (
          <div className="mt-4 w-full max-w-md">
            <CurrentWeather
              weather={weather}
              unit={unit}
              glowColor={getWeatherGlow(weather)}
              theme={theme}
              localTime={localTime}
              windDir={windDir}
              visibilityKm={visibilityKm}
              sunrise={sunrise}
              sunset={sunset}
              uvIndex={uvIndex}
              uvLevel={uvLevel}
            />
          </div>
        )}

        {forecast && !loading && (
          <Forecast forecast={forecast} unit={unit} theme={theme} />
        )}

        {weather && !loading && weather.coord && (
          <MapDisplay
            lat={weather.coord.lat}
            lon={weather.coord.lon}
            cityName={`${weather.name}, ${weather.sys.country}`}
            theme={theme}
          />
        )}
      </div>
    </div>
  )
}
