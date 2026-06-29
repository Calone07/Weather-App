import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet'
import L from 'leaflet'
import { FiMap } from 'react-icons/fi'

const icon = L.divIcon({
  className: 'bg-transparent',
  html: '<div style="width: 16px; height: 16px; background: #ef4444; border: 3px solid white; border-radius: 50%; box-shadow: 0 0 8px rgba(0,0,0,0.4);"></div>',
  iconSize: [16, 16],
  iconAnchor: [8, 8],
})

export default function MapDisplay({ lat, lon, cityName, theme }) {
  const tileUrl = theme === 'dark'
    ? 'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png'
    : 'https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png'

  const attribution = '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'

  return (
    <div className="w-full max-w-2xl mt-8">
      <div className={`flex items-center gap-2 mb-3 ${theme === 'dark' ? 'text-white/80' : 'text-gray-600'}`}>
        <FiMap />
        <h3 className="text-lg font-medium">Map</h3>
      </div>
      <div className={`rounded-xl overflow-hidden backdrop-blur shadow-lg ${theme === 'dark' ? 'shadow-white/5' : 'shadow-black/5'}`}>
        <MapContainer
          center={[lat, lon]}
          zoom={10}
          className="w-full h-48 sm:h-64"
          zoomControl={false}
        >
          <TileLayer url={tileUrl} attribution={attribution} />
          <Marker position={[lat, lon]} icon={icon}>
            <Popup>{cityName}</Popup>
          </Marker>
        </MapContainer>
      </div>
    </div>
  )
}
