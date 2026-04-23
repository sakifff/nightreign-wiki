import { useState, useMemo } from 'react'
import { useData } from '../hooks/useData'
import DataTable from '../components/DataTable'
import FilterChips from '../components/FilterChips'
import LoadingSpinner from '../components/LoadingSpinner'

const CATEGORIES = ['Stat', 'Offensive', 'Defensive', 'Regen', 'Exploration', 'Curse']

const columns = [
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
        Curse: 'bg-zinc-800 text-zinc-400',
      }
      return <span className={`badge ${colors[cat] || 'bg-zinc-700 text-zinc-300'}`}>{cat}</span>
    },
  },
  {
    accessorKey: 'description',
    header: 'Effect Name',
    size: 240,
    cell: ({ getValue }) => <span className="text-zinc-200">{getValue()}</span>,
  },
  {
    accessorKey: 'effect',
    header: 'Effect',
    size: 300,
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
    size: 200,
    cell: ({ getValue }) => <span className="text-zinc-400 text-xs">{getValue() || '—'}</span>,
  },
]

export default function Talismans() {
  const { data, loading } = useData('/data/talismans.json')
  const [search, setSearch] = useState('')
  const [activeCategories, setActiveCategories] = useState([])
  const [stackableOnly, setStackableOnly] = useState(false)

  const toggleCategory = (cat) =>
    setActiveCategories(prev =>
      prev.includes(cat) ? prev.filter(c => c !== cat) : [...prev, cat]
    )

  const filtered = useMemo(() => {
    if (!data) return []
    const q = search.toLowerCase()
    return data.filter(t => {
      if (activeCategories.length && !activeCategories.includes(t.category)) return false
      if (stackableOnly && t.stackable !== 'Yes') return false
      if (q && !t.description.toLowerCase().includes(q) && !t.effect.toLowerCase().includes(q)) return false
      return true
    })
  }, [data, search, activeCategories, stackableOnly])

  if (loading) return <LoadingSpinner />

  return (
    <div>
      <div className="page-header">
        <h1 className="page-title">Talismans</h1>
        <p className="page-subtitle">Talisman effects with precise values</p>
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

      <div className="mb-3">
        <FilterChips options={CATEGORIES} active={activeCategories} onToggle={toggleCategory} label="Category" />
      </div>

      <p className="mb-2 text-xs text-zinc-500">{filtered.length} entries</p>
      <DataTable columns={columns} data={filtered} pageSize={100} />
    </div>
  )
}
