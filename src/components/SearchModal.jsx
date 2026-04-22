import { useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'

export default function SearchModal({ query, setQuery, results, open, setOpen }) {
  const inputRef = useRef(null)
  const navigate = useNavigate()

  useEffect(() => {
    if (open) setTimeout(() => inputRef.current?.focus(), 50)
  }, [open])

  if (!open) return null

  const categoryColors = {
    Talisman: 'bg-yellow-900/40 text-yellow-400',
    Relic: 'bg-blue-900/40 text-blue-400',
    'Dormant Power': 'bg-purple-900/40 text-purple-400',
    Consumable: 'bg-green-900/40 text-green-400',
    Boss: 'bg-red-900/40 text-red-400',
    Character: 'bg-brand-900/40 text-brand-400',
  }

  const go = (link) => {
    setOpen(false)
    setQuery('')
    navigate(link)
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-start justify-center pt-[15vh] px-4"
      onClick={() => setOpen(false)}
    >
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />
      <div
        className="relative w-full max-w-xl rounded-xl border border-zinc-700 bg-zinc-900 shadow-2xl"
        onClick={e => e.stopPropagation()}
      >
        <div className="flex items-center gap-3 border-b border-zinc-700 px-4 py-3">
          <svg className="h-4 w-4 shrink-0 text-zinc-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <input
            ref={inputRef}
            className="flex-1 bg-transparent text-sm text-zinc-100 placeholder-zinc-500 focus:outline-none"
            placeholder="Search talismans, relics, bosses, characters…"
            value={query}
            onChange={e => setQuery(e.target.value)}
          />
          <kbd className="rounded border border-zinc-700 px-1.5 py-0.5 text-xs text-zinc-500">Esc</kbd>
        </div>

        {results.length > 0 && (
          <ul className="max-h-80 overflow-y-auto py-2">
            {results.map((r, i) => (
              <li key={i}>
                <button
                  className="flex w-full items-center gap-3 px-4 py-2.5 text-left hover:bg-zinc-800 transition-colors"
                  onClick={() => go(r.link)}
                >
                  <span className={`badge shrink-0 ${categoryColors[r.type] || 'bg-zinc-700 text-zinc-300'}`}>
                    {r.type}
                  </span>
                  <span className="flex-1 min-w-0">
                    <span className="block truncate text-sm text-zinc-100">{r.name}</span>
                    {r.subtitle && (
                      <span className="block truncate text-xs text-zinc-400">{r.subtitle}</span>
                    )}
                  </span>
                </button>
              </li>
            ))}
          </ul>
        )}

        {query && results.length === 0 && (
          <p className="px-4 py-6 text-center text-sm text-zinc-500">No results for "{query}"</p>
        )}

        {!query && (
          <p className="px-4 py-6 text-center text-sm text-zinc-500">
            Start typing to search across all data
          </p>
        )}
      </div>
    </div>
  )
}
