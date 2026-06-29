import { FiPlus, FiBookmark } from 'react-icons/fi'
import CityCard from './CityCard'

export default function CityManager({ savedCities, citySummaries, unit, activeCity, onSelectCity, onRemoveCity, theme }) {
  const tcs = theme === 'dark' ? 'text-white/80' : 'text-gray-700'
  const tcm = theme === 'dark' ? 'text-white/60' : 'text-gray-500'

  if (savedCities.length === 0) {
    return (
      <div className="w-full max-w-2xl mt-4">
        <div className={`flex items-center gap-2 ${tcs} mb-2`}>
          <FiBookmark />
          <h3 className="text-lg font-medium">Saved Cities</h3>
        </div>
        <div className={`flex items-center gap-2 ${tcm} text-sm`}>
          <span>Search for a city and click</span>
          <FiPlus size={14} />
          <span>to save it</span>
        </div>
      </div>
    )
  }

  return (
    <div className="w-full max-w-2xl mt-4">
      <div className={`flex items-center gap-2 ${tcs} mb-3`}>
        <FiBookmark />
        <h3 className="text-lg font-medium">Saved Cities</h3>
      </div>
      <div className="flex gap-3 overflow-x-auto pb-2">
        {citySummaries.map((data) => (
          <CityCard
            key={data.id}
            data={data}
            unit={unit}
            isActive={data.name.toLowerCase() === activeCity?.toLowerCase()}
            onSelect={onSelectCity}
            onRemove={onRemoveCity}
          />
        ))}
      </div>
    </div>
  )
}
