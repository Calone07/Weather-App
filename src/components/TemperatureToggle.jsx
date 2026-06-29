export default function TemperatureToggle({ unit, onToggle, theme }) {
  return (
    <button
      onClick={onToggle}
      className={`px-4 py-2 rounded-lg backdrop-blur font-medium transition ${theme === 'dark' ? 'bg-white/20 hover:bg-white/30 text-white' : 'bg-white/70 hover:bg-white/90 text-gray-700'}`}
    >
      {unit === 'metric' ? '°C' : '°F'}
    </button>
  )
}
