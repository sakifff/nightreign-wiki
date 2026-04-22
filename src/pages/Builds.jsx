import { useState, useMemo } from 'react'
import { useData } from '../hooks/useData'
import LoadingSpinner from '../components/LoadingSpinner'

const CHARACTERS = ['Generic', 'Wylder', 'Guardian', 'Ironeye', 'Duchess', 'Raider', 'Revenant', 'Recluse', 'Executor', 'Scholar', 'Undertaker']

export default function Builds() {
  const { data: expeditions, loading } = useData('/data/expeditions.json')
  const [activeChar, setActiveChar] = useState('Wylder')
  const [search, setSearch] = useState('')

  const filtered = useMemo(() => {
    if (!expeditions) return []
    if (!search) return expeditions
    const q = search.toLowerCase()
    return expeditions.filter(e => {
      if (e.name.toLowerCase().includes(q)) return true
      const relics = Object.values(e.relics).flat()
      return relics.some(r => r.toLowerCase().includes(q))
    })
  }, [expeditions, search])

  if (loading) return <LoadingSpinner />

  const copy = (text) => navigator.clipboard.writeText(text)

  return (
    <div>
      <div className="page-header">
        <h1 className="page-title">Expedition Relics</h1>
        <p className="page-subtitle">Guaranteed relics per expedition and character</p>
      </div>

      <div className="mb-4 flex flex-wrap gap-3">
        <input
          className="input max-w-xs"
          placeholder="Search expeditions or relics…"
          value={search}
          onChange={e => setSearch(e.target.value)}
        />
      </div>

      {/* Character filter */}
      <div className="mb-4 flex flex-wrap gap-2">
        {CHARACTERS.map(c => (
          <button
            key={c}
            className={`chip ${activeChar === c ? 'chip-active' : 'chip-inactive'}`}
            onClick={() => setActiveChar(c)}
          >
            {c}
          </button>
        ))}
      </div>

      <div className="space-y-3">
        {filtered.map(expedition => {
          const relics = expedition.relics[activeChar] || []
          const genericRelics = expedition.relics['Generic'] || []
          return (
            <div key={expedition.name} className="card">
              <div className="flex items-start justify-between gap-3 mb-3">
                <h3 className="font-semibold text-zinc-100">{expedition.name}</h3>
                <button
                  onClick={() => copy([...genericRelics, ...relics].join('\n'))}
                  className="btn-ghost text-xs shrink-0"
                  title="Copy to clipboard"
                >
                  Copy
                </button>
              </div>
              <div className="grid sm:grid-cols-2 gap-4">
                {genericRelics.length > 0 && (
                  <div>
                    <div className="text-xs font-medium text-zinc-500 mb-2">Generic (all characters)</div>
                    <ul className="space-y-1">
                      {genericRelics.map((r, i) => (
                        <li key={i} className="text-sm text-zinc-300 flex gap-2">
                          <span className="text-zinc-600 shrink-0">·</span>{r}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
                {relics.length > 0 && (
                  <div>
                    <div className="text-xs font-medium text-brand-400 mb-2">{activeChar}</div>
                    <ul className="space-y-1">
                      {relics.map((r, i) => (
                        <li key={i} className="text-sm text-zinc-200 flex gap-2">
                          <span className="text-brand-600 shrink-0">·</span>{r}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
                {relics.length === 0 && activeChar !== 'Generic' && (
                  <div className="text-sm text-zinc-500 italic">No specific relics for {activeChar}</div>
                )}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
