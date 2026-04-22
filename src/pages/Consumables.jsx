import { useState, useMemo } from 'react'
import { useData } from '../hooks/useData'
import DataTable from '../components/DataTable'
import LoadingSpinner from '../components/LoadingSpinner'

const columns = [
  {
    accessorKey: 'name',
    header: 'Name',
    size: 180,
    cell: ({ getValue }) => <span className="font-medium text-zinc-100">{getValue()}</span>,
  },
  {
    accessorKey: 'effect_ingame',
    header: 'In-Game Description',
    size: 200,
    cell: ({ getValue }) => <span className="text-zinc-300">{getValue()}</span>,
  },
  {
    accessorKey: 'effect',
    header: 'Actual Effect',
    size: 300,
    cell: ({ getValue }) => <span className="text-zinc-200 whitespace-pre-line">{getValue()}</span>,
  },
  {
    accessorKey: 'duration',
    header: 'Duration',
    size: 90,
    cell: ({ getValue }) => {
      const v = getValue()
      if (!v) return <span className="text-zinc-600">—</span>
      return <span className={v === 'Infinite' ? 'text-green-400' : 'text-zinc-300'}>{v}</span>
    },
  },
  {
    accessorKey: 'notes',
    header: 'Notes',
    size: 200,
    cell: ({ getValue }) => <span className="text-zinc-400 text-xs">{getValue() || '—'}</span>,
  },
]

export default function Consumables() {
  const { data, loading } = useData('/data/consumables.json')
  const [search, setSearch] = useState('')

  const filtered = useMemo(() => {
    if (!data) return []
    const q = search.toLowerCase()
    if (!q) return data
    return data.filter(c =>
      c.name.toLowerCase().includes(q) ||
      c.effect.toLowerCase().includes(q) ||
      (c.effect_ingame || '').toLowerCase().includes(q)
    )
  }, [data, search])

  if (loading) return <LoadingSpinner />

  return (
    <div>
      <div className="page-header">
        <h1 className="page-title">Consumables & Status Effects</h1>
        <p className="page-subtitle">Aromatics, boluses, grease, pots, and status ailments</p>
      </div>

      <div className="mb-4">
        <input
          className="input max-w-sm"
          placeholder="Search consumables…"
          value={search}
          onChange={e => setSearch(e.target.value)}
        />
      </div>

      <DataTable columns={columns} data={filtered} pageSize={60} />
    </div>
  )
}
