import { useState, useCallback, useEffect } from 'react'

const API_KEY = import.meta.env.VITE_OWM_API_KEY
const BASE = 'https://api.openweathermap.org/data/2.5'

function groupByDay(list) {
  const days = {}
  list.forEach((item) => {
    const date = item.dt_txt.split(' ')[0]
    if (!days[date]) {
      days[date] = { temps: [], icons: [], descriptions: [] }
    }
    days[date].temps.push(item.main.temp)
    days[date].icons.push(item.weather[0].icon)
    days[date].descriptions.push(item.weather[0].description)
  })
  return Object.entries(days).map(([date, data]) => ({
    date,
    temp_min: Math.min(...data.temps),
    temp_max: Math.max(...data.temps),
    icon: data.icons[Math.floor(data.icons.length / 2)],
    description: data.descriptions[Math.floor(data.descriptions.length / 2)],
  }))
}

function degToCompass(deg) {
  const dirs = ['N', 'NNE', 'NE', 'ENE', 'E', 'ESE', 'SE', 'SSE', 'S', 'SSW', 'SW', 'WSW', 'W', 'WNW', 'NW', 'NNW']
  return dirs[Math.round(deg / 22.5) % 16]
}

function formatUnixTime(ts, timezoneOffset) {
  const d = new Date((ts + timezoneOffset) * 1000)
  return d.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', timeZone: 'UTC' })
}

function getLocalTime(timezoneOffset) {
  const now = Date.now()
  const d = new Date(now + timezoneOffset * 1000 + new Date().getTimezoneOffset() * 60000)
  return d.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })
}

function getUVIndexLevel(uvi) {
  if (uvi <= 2) return { label: 'Low', color: 'text-green-400' }
  if (uvi <= 5) return { label: 'Moderate', color: 'text-yellow-400' }
  if (uvi <= 7) return { label: 'High', color: 'text-orange-400' }
  if (uvi <= 10) return { label: 'Very High', color: 'text-red-400' }
  return { label: 'Extreme', color: 'text-purple-400' }
}

function fetchWeatherAPI(params) {
  const q = new URLSearchParams({ ...params, appid: API_KEY, units: 'metric' })
  return fetch(`${BASE}/weather?${q}`)
}

function fetchAirPollution(lat, lon) {
  const q = new URLSearchParams({ lat, lon, appid: API_KEY })
  return fetch(`${BASE}/air_pollution?${q}`)
}

export function useWeather() {
  const [weather, setWeather] = useState(null)
  const [forecast, setForecast] = useState(null)
  const [airQuality, setAirQuality] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [unit, setUnit] = useState('metric')
  const [city, setCity] = useState('')
  const [savedCities, setSavedCities] = useState(() => {
    try { return JSON.parse(localStorage.getItem('savedCities')) || [] } catch { return [] }
  })
  const [citySummaries, setCitySummaries] = useState([])

  const fetchData = useCallback(async (params) => {
    setLoading(true)
    setError(null)
    try {
      const q = new URLSearchParams({ ...params, appid: API_KEY, units: 'metric' })
      const [weatherRes, forecastRes] = await Promise.all([
        fetch(`${BASE}/weather?${q}`),
        fetch(`${BASE}/forecast?${q}`),
      ])
      if (!weatherRes.ok || !forecastRes.ok) {
        const err = await weatherRes.json()
        throw new Error(err.message || 'City not found')
      }
      const w = await weatherRes.json()
      const f = await forecastRes.json()
      setWeather(w)
      setForecast(groupByDay(f.list.slice(0, 40)))
      setCity(w.name)

      try {
        const apRes = await fetchAirPollution(w.coord.lat, w.coord.lon)
        if (apRes.ok) {
          const ap = await apRes.json()
          setAirQuality(ap.list[0])
        }
      } catch { /* skip air pollution errors */ }

    } catch (e) {
      setError(e.message)
      setWeather(null)
      setForecast(null)
      setAirQuality(null)
    } finally {
      setLoading(false)
    }
  }, [])

  const searchCity = useCallback((name) => {
    setCity(name)
    fetchData({ q: name })
  }, [fetchData])

  const fetchByCoords = useCallback((lat, lon) => {
    fetchData({ lat, lon })
  }, [fetchData])

  const toggleUnit = useCallback(() => {
    setUnit((prev) => (prev === 'metric' ? 'imperial' : 'metric'))
  }, [])

  useEffect(() => {
    localStorage.setItem('savedCities', JSON.stringify(savedCities))
  }, [savedCities])

  const fetchCitySummaries = useCallback(async (cities) => {
    if (cities.length === 0) { setCitySummaries([]); return }
    const results = await Promise.allSettled(
      cities.map((cityName) =>
        fetchWeatherAPI({ q: cityName })
          .then((r) => r.ok ? r.json() : Promise.reject())
      )
    )
    setCitySummaries(
      results
        .filter((r) => r.status === 'fulfilled')
        .map((r) => r.value)
    )
  }, [])

  const addCity = useCallback((name) => {
    setSavedCities((prev) => {
      if (prev.some((c) => c.toLowerCase() === name.toLowerCase())) return prev
      const next = [...prev, name]
      fetchCitySummaries(next)
      return next
    })
  }, [fetchCitySummaries])

  const removeCity = useCallback((name) => {
    setSavedCities((prev) => {
      const next = prev.filter((c) => c.toLowerCase() !== name.toLowerCase())
      fetchCitySummaries(next)
      return next
    })
  }, [fetchCitySummaries])

  const localTime = weather ? getLocalTime(weather.timezone) : ''
  const windDir = weather ? degToCompass(weather.wind.deg) : ''
  const visibilityKm = weather ? (weather.visibility / 1000).toFixed(1) : ''
  const sunrise = weather ? formatUnixTime(weather.sys.sunrise, weather.timezone) : ''
  const sunset = weather ? formatUnixTime(weather.sys.sunset, weather.timezone) : ''
  const uvIndex = airQuality?.components?.uvi ?? null

  return {
    weather, forecast, airQuality, loading, error, unit, city,
    searchCity, fetchByCoords, toggleUnit,
    savedCities, addCity, removeCity, citySummaries,
    localTime, windDir, visibilityKm, sunrise, sunset, uvIndex,
    uvLevel: uvIndex !== null ? getUVIndexLevel(uvIndex) : null,
  }
}
