export default function WeatherIcon({ icon, size = 80 }) {
  return (
    <img
      src={`https://openweathermap.org/img/wn/${icon}@2x.png`}
      alt="weather icon"
      width={size}
      height={size}
    />
  )
}
