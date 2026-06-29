import { FiSun, FiMoon } from 'react-icons/fi'

export default function ThemeToggle({ theme, onToggle }) {
  return (
    <button
      onClick={onToggle}
      className="p-3 rounded-lg bg-white/20 hover:bg-white/30 backdrop-blur text-white transition"
      title={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
    >
      {theme === 'dark' ? <FiSun size={20} /> : <FiMoon size={20} />}
    </button>
  )
}
