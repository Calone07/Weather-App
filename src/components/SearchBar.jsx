import { useState } from 'react'
import { FiSearch } from 'react-icons/fi'

export default function SearchBar({ onSearch, theme }) {
  const [query, setQuery] = useState('')

  const handleSubmit = (e) => {
    e.preventDefault()
    if (query.trim()) {
      onSearch(query.trim())
    }
  }

  return (
    <form onSubmit={handleSubmit} className="flex gap-2 w-full max-w-md">
      <input
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Search city..."
        className={`flex-1 px-4 py-3 rounded-lg backdrop-blur focus:outline-none focus:ring-2 transition ${theme === 'dark'
          ? 'bg-white/20 text-white placeholder-white/60 border border-white/30 focus:ring-white/50'
          : 'bg-white/70 text-gray-900 placeholder-gray-400 border border-white/80 focus:ring-gray-400'
        }`}
      />
      <button
        type="submit"
        className={`px-4 py-3 rounded-lg backdrop-blur transition ${theme === 'dark' ? 'bg-white/20 hover:bg-white/30 text-white' : 'bg-white/70 hover:bg-white/90 text-gray-700'}`}
      >
        <FiSearch size={20} />
      </button>
    </form>
  )
}
