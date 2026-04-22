import { useState, useMemo } from 'react'
import { useData } from '../hooks/useData'
import DataTable from '../components/DataTable'
import FilterChips from '../components/FilterChips'
import LoadingSpinner from '../components/LoadingSpinner'

const SOURCE_TABS = ['generic_relic', 'weapon_passive', 'deep_relic', 'deep_weapon', 'dormant_power']
const SOURCE_LABELS = {
  generic_relic: 'Generic Relics',
  weapon_passive: 'Weapon Passives',
  deep_relic: 'Deep Relics',
  deep_weapon: 'Deep Weapon Passives',
  dormant_power: 'Dormant Powers',
}

const CHARACTERS = ['Wylder', 'Guardian', 'Ironeye', 'Duchess', 'Raider', 'Revenant', 'Recluse', 'Executor', 'Scholar', 'Undertaker']
const RELIC_CATEGORIES = ['Stat', 'Offensive', 'Defensive', 'Regen', 'Exploration', 'Character', 'Start of game', 'Curse']
const DORMANT_CATEGORIES = ['Stat', 'Offensive', 'Defensive', 'Regen', 'Exploration']

const relicColumns = [
  {
    accessorKey: 'category',
    header: 'Category',
    size: 110,
    cell: ({ getValue }) => {
      const cat = getValue()
      const colors = {
        Stat: 'bg-blue-900/40 text-blue-400',
        Offensive: 'bg-red-900/40 text-red-400',
        Defensive: 'bg-green-900/40 text-green-400',
        Regen: 'bg-emerald-900/40 text-emerald-400',
        Exploration: 'bg-purple-900/40 text-purple-400',
        Character: 'bg-brand-900/40 text-brand-400',
        'Start of game': 'bg-yellow-900/40 text-yellow-400',
        Curse: 'bg-zinc-800 text-zinc-400',
      }
      return <span className={`badge ${colors[cat] || 'bg-zinc-700 text-zinc-300'}`}>{cat}</span>
    },
  },
  {
    accessorKey: 'description',
    header: 'Name',
    size: 220,
    cell: ({ row }) => (
      <div>
        <span className="text-zinc-200">{row.original.description}</span>
        {row.original.character && (
          <span className="ml-2 badge bg-brand-900/40 text-brand-400">{row.original.character}</span>
        )}
      </div>
    ),
  },
  {
    accessorKey: 'effect',
    header: 'Effect',
    size: 280,
    cell: ({ getValue }) => <span className="text-zinc-200">{getValue()}</span>,
  },
  {
    accessorKey: 'stackable',
    header: 'Stackable',
    size: 90,
    cell: ({ getValue }) => {
      const v = getValue()
      if (!v) return <span className="text-zinc-600">—</span>
      return <span className={v === 'Yes' ? 'text-green-400' : 'text-zinc-400'}>{v}</span>
    },
  },
  {
    accessorKey: 'notes',
    header: 'Notes',
    size: 180,
    cell: ({ getValue }) => <span className="text-zinc-400 text-xs">{getValue() || '—'}</span>,
  },
]

const dormantColumns = [
  {
    accessorKey: 'category',
    header: 'Category',
    size: 110,
    cell: ({ getValue }) => {
      const cat = getValue()
      const colors = {
        Stat: 'bg-blue-900/40 text-blue-400',
        Offensive: 'bg-red-900/40 text-red-400',
        Defensive: 'bg-green-900/40 text-green-400',
        Regen: 'bg-emerald-900/40 text-emerald-400',
        Exploration: 'bg-purple-900/40 text-purple-400',
      }
      return <span className={`badge ${colors[cat] || 'bg-zinc-700 text-zinc-300'}`}>{cat}</span>
    },
  },
  {
    accessorKey: 'name',
    header: 'Name',
    size: 220,
    cell: ({ getValue }) => <span className="text-zinc-200">{getValue()}</span>,
  },
  {
    accessorKey: 'description_ingame',
    header: 'In-Game Description',
    size: 200,
    cell: ({ getValue }) => <span className="text-zinc-400 italic text-sm">{getValue() || '—'}</span>,
  },
  {
    accessorKey: 'effect',
    header: 'Effect',
    size: 280,
    cell: ({ getValue }) => <span className="text-zinc-200">{getValue()}</span>,
  },
  {
    accessorKey: 'stackable',
    header: 'Stackable',
    size: 90,
    cell: ({ getValue }) => {
      const v = getValue()
      if (!v) return <span className="text-zinc-600">—</span>
      return <span className={v === 'Yes' ? 'text-green-400' : 'text-zinc-400'}>{v}</span>
    },
  },
  {
    accessorKey: 'notes',
    header: 'Notes',
    size: 180,
    cell: ({ getValue }) => <span className="text-zinc-400 text-xs">{getValue() || '—'}</span>,
  },
]

export default function Relics() {
  const { data: relicsData, loading: relicsLoading } = useData('/data/relics.json')
  const { data: dormantData, loading: dormantLoading } = useData('/data/dormant_powers.json')
  const [activeSource, setActiveSource] = useState('generic_relic')
  const [search, setSearch] = useState('')
  const [activeCategories, setActiveCategories] = useState([])
  const [activeChar, setActiveChar] = useState(null)
  const [stackableOnly, setStackableOnly] = useState(false)

  const isDormant = activeSource === 'dormant_power'
  const loading = isDormant ? dormantLoading : relicsLoading

  const toggleCategory = (cat) => {
    setActiveCategories(prev =>
      prev.includes(cat) ? prev.filter(c => c !== cat) : [...prev, cat]
    )
  }

  const resetFilters = () => {
    setSearch('')
    setActiveCategories([])
    setActiveChar(null)
    setStackableOnly(false)
  }

  const filtered = useMemo(() => {
    const q = search.toLowerCase()
    if (isDormant) {
      if (!dormantData) return []
      return dormantData.filter(r => {
        if (activeCategories.length && !activeCategories.includes(r.category)) return false
        if (stackableOnly && r.stackable !== 'Yes') return false
        if (q && !r.name.toLowerCase().includes(q) && !r.effect.toLowerCase().includes(q)) return false
        return true
      })
    }
    if (!relicsData) return []
    return relicsData.filter(r => {
      if (r.source !== activeSource) return false
      if (activeCategories.length && !activeCategories.includes(r.category)) return false
      if (activeChar && r.character !== activeChar) return false
      if (stackableOnly && r.stackable !== 'Yes') return false
      if (q && !r.description.toLowerCase().includes(q) && !r.effect.toLowerCase().includes(q)) return false
      return true
    })
  }, [relicsData, dormantData, activeSource, isDormant, search, activeCategories, activeChar, stackableOnly])

  const showCharFilter = !isDormant && (activeSource === 'weapon_passive' || activeSource === 'generic_relic')
  const categoryOptions = isDormant ? DORMANT_CATEGORIES : RELIC_CATEGORIES

  return (
    <div>
      <div className="page-header">
        <h1 className="page-title">Relics & Passives</h1>
        <p className="page-subtitle">Relic effects, weapon passives, deep variants, and dormant powers</p>
      </div>

      {/* Source tabs */}
      <div className="flex flex-wrap gap-2 mb-4 border-b border-zinc-800 pb-3">
        {SOURCE_TABS.map(src => (
          <button
            key={src}
            onClick={() => { setActiveSource(src); resetFilters() }}
            className={`px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${
              activeSource === src
                ? 'bg-zinc-800 text-zinc-100'
                : 'text-zinc-400 hover:text-zinc-200'
            }`}
          >
            {SOURCE_LABELS[src]}
          </button>
        ))}
      </div>

      <div className="mb-4 flex flex-wrap gap-3">
        <input
          className="input max-w-xs"
          placeholder="Search…"
          value={search}
          onChange={e => setSearch(e.target.value)}
        />
        <label className="flex items-center gap-2 text-sm text-zinc-400 cursor-pointer">
          <input type="checkbox" checked={stackableOnly} onChange={e => setStackableOnly(e.target.checked)} className="accent-brand-500" />
          Stackable only
        </label>
      </div>

      <div className="mb-3 flex flex-wrap gap-3">
        <FilterChips options={categoryOptions} active={activeCategories} onToggle={toggleCategory} label="Category" />
      </div>

      {showCharFilter && (
        <div className="mb-4 flex flex-wrap gap-2">
          <span className="text-xs text-zinc-500 font-medium self-center">Character:</span>
          <button
            className={`chip ${!activeChar ? 'chip-active' : 'chip-inactive'}`}
            onClick={() => setActiveChar(null)}
          >All</button>
          {CHARACTERS.map(c => (
            <button
              key={c}
              className={`chip ${activeChar === c ? 'chip-active' : 'chip-inactive'}`}
              onClick={() => setActiveChar(c === activeChar ? null : c)}
            >{c}</button>
          ))}
        </div>
      )}

      {loading
        ? <LoadingSpinner />
        : <>
            <p className="mb-2 text-xs text-zinc-500">{filtered.length} entries</p>
            <DataTable
              columns={isDormant ? dormantColumns : relicColumns}
              data={filtered}
              pageSize={80}
            />
          </>
      }
    </div>
  )
}
