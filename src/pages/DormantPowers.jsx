import { useState, useMemo } from 'react'
import { useData } from '../hooks/useData'
import DataTable from '../components/DataTable'
import FilterChips from '../components/FilterChips'
import LoadingSpinner from '../components/LoadingSpinner'

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
        Utility: 'bg-yellow-900/40 text-yellow-400',
        Exploration: 'bg-purple-900/40 text-purple-400',
      }
      return <span className={`badge ${colors[cat] || 'bg-zinc-700 text-zinc-300'}`}>{cat}</span>
    },
  },
  {
    accessorKey: 'name',
    header: 'Power Name',
    size: 200,
    cell: ({ getValue }) => <span className="font-medium text-zinc-100">{getValue()}</span>,
  },
  {
    accessorKey: 'description_ingame',
    header: 'In-Game Description',
    size: 200,
    cell: ({ getValue }) => <span className="text-zinc-300">{getValue()}</span>,
  },
  {
    accessorKey: 'effect',
    header: 'Actual Effect',
    size: 260,
    cell: ({ getValue }) => <span className="text-zinc-200">{getValue()}</span>,
  },
  {
    accessorKey: 'stackable',
    header: 'Stackable',
    size: 90,
    cell: ({ getValue }) => {
      const v = getValue()
      if (!v) return <span className="text-zinc-600">—</span>
      return <span className={v === 'Yes' ? 'text-green-400' : 'text-red-400'}>{v}</span>
    },
  },
  {
    accessorKey: 'notes',
    header: 'Notes',
    size: 180,
    cell: ({ getValue }) => <span className="text-zinc-400 text-xs">{getValue() || '—'}</span>,
  },
]

export default function DormantPowers() {
  const { data, loading } = useData('/data/dormant_powers.json')
  const [search, setSearch] = useState('')
  const [activeCategories, setActiveCategories] = useState([])

  const categories = useMemo(() => {
    if (!data) return []
    return [...new Set(data.map(d => d.category).filter(Boolean))]
  }, [data])

  const filtered = useMemo(() => {
    if (!data) return []
    const q = search.toLowerCase()
    return data.filter(d => {
      if (activeCategories.length && !activeCategories.includes(d.category)) return false
      if (q && !d.name.toLowerCase().includes(q) && !d.effect.toLowerCase().includes(q)) return false
      return true
    })
  }, [data, search, activeCategories])

  const toggleCategory = (cat) => {
    setActiveCategories(prev =>
      prev.includes(cat) ? prev.filter(c => c !== cat) : [...prev, cat]
    )
  }

  if (loading) return <LoadingSpinner />

  return (
    <div>
      <div className="page-header">
        <h1 className="page-title">Dormant Powers</h1>
        <p className="page-subtitle">Passive bonuses found on equipment</p>
      </div>

      <div className="mb-4 flex flex-wrap gap-3">
        <input
          className="input max-w-xs"
          placeholder="Search dormant powers…"
          value={search}
          onChange={e => setSearch(e.target.value)}
        />
      </div>

      <div className="mb-4">
        <FilterChips
          options={categories}
          active={activeCategories}
          onToggle={toggleCategory}
          label="Category"
        />
      </div>

      <p className="mb-2 text-xs text-zinc-500">{filtered.length} entries</p>
      <DataTable columns={columns} data={filtered} pageSize={80} />
    </div>
  )
}
