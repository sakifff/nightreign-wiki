import { useState } from 'react'
import { NavLink } from 'react-router-dom'
import { useData } from '../hooks/useData'

const links = [
  { to: '/', label: 'Home', exact: true },
  { to: '/talismans', label: 'Talismans' },
  { to: '/relics', label: 'Relics' },
  { to: '/dormant-powers', label: 'Dormant Powers' },
  { to: '/consumables', label: 'Consumables' },
  { to: '/characters', label: 'Characters' },
  { to: '/bosses', label: 'Bosses' },
  { to: '/builds', label: 'Expeditions' },
  { to: '/level-calculator', label: 'Rune Calc' },
  { to: '/changelog', label: 'Changelog' },
]

export default function Nav({ onSearchOpen }) {
  const [menuOpen, setMenuOpen] = useState(false)
  const { data: meta } = useData('/data/meta.json')

  const linkClass = ({ isActive }) =>
    `text-sm font-medium transition-colors ${
      isActive ? 'text-brand-400' : 'text-zinc-400 hover:text-zinc-100'
    }`

  return (
    <header className="sticky top-0 z-40 border-b border-zinc-800 bg-zinc-950/90 backdrop-blur">
      <div className="mx-auto flex max-w-7xl items-center gap-4 px-4 py-3">
        <NavLink to="/" className="flex items-center gap-2 shrink-0">
          <span className="text-lg font-bold text-zinc-100">Nightreign</span>
          {meta && (
            <span className="badge bg-brand-900/60 text-brand-400 text-[10px]">
              v{meta.version}
            </span>
          )}
        </NavLink>

        {/* Desktop nav */}
        <nav className="hidden xl:flex items-center gap-5 ml-4">
          {links.slice(1).map(l => (
            <NavLink key={l.to} to={l.to} className={linkClass}>
              {l.label}
            </NavLink>
          ))}
        </nav>

        <div className="flex-1" />

        {/* Search button */}
        <button
          onClick={onSearchOpen}
          className="flex items-center gap-2 rounded-md border border-zinc-700 bg-zinc-800/60 px-3 py-1.5 text-sm text-zinc-400 hover:border-zinc-600 hover:text-zinc-200 transition-colors"
          aria-label="Open search"
        >
          <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <span className="hidden sm:inline">Search</span>
          <kbd className="hidden sm:inline rounded border border-zinc-600 px-1 py-0.5 text-[10px]">⌘K</kbd>
        </button>

        {/* Mobile hamburger */}
        <button
          className="xl:hidden btn-ghost p-1.5"
          onClick={() => setMenuOpen(o => !o)}
          aria-label="Toggle menu"
        >
          <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            {menuOpen
              ? <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              : <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            }
          </svg>
        </button>
      </div>

      {/* Mobile menu */}
      {menuOpen && (
        <nav className="xl:hidden border-t border-zinc-800 bg-zinc-950 px-4 py-3 grid grid-cols-2 gap-2">
          {links.map(l => (
            <NavLink
              key={l.to}
              to={l.to}
              className={({ isActive }) =>
                `block rounded-md px-3 py-2 text-sm font-medium ${
                  isActive ? 'bg-zinc-800 text-brand-400' : 'text-zinc-400 hover:bg-zinc-800 hover:text-zinc-100'
                }`
              }
              onClick={() => setMenuOpen(false)}
            >
              {l.label}
            </NavLink>
          ))}
        </nav>
      )}
    </header>
  )
}
