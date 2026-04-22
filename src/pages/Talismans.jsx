import { useState, useMemo } from 'react'
import { useData } from '../hooks/useData'
import DataTable from '../components/DataTable'
import LoadingSpinner from '../components/LoadingSpinner'

const columns = [
  {
    accessorKey: 'name',
    header: 'Name',
    size: 200,
    cell: ({ row }) => (
      <span className="font-medium text-zinc-100">{row.original.name}</span>
    ),
  },
  {
    accessorKey: 'effect_ingame',
    header: 'In-Game Description',
    size: 220,
    cell: ({ getValue }) => <span className="text-zinc-300">{getValue()}</span>,
  },
  {
    accessorKey: 'effect',
    header: 'Actual Effect',
    size: 260,
    cell: ({ getValue }) => <span className="text-zinc-200">{getValue()}</span>,
  },
  {
    accessorKey: 'notes',
    header: 'Notes',
    size: 180,
    cell: ({ getValue }) => <span className="text-zinc-400 text-xs">{getValue() || '—'}</span>,
  },
]

export default function Talismans() {
  const { data, loading } = useData('/data/talismans.json')
  const [search, setSearch] = useState('')

  const filtered = useMemo(() => {
    if (!data) return []
    const q = search.toLowerCase()
    if (!q) return data
    return data.filter(t =>
      t.name.toLowerCase().includes(q) ||
      t.effect.toLowerCase().includes(q) ||
      (t.effect_ingame || '').toLowerCase().includes(q)
    )
  }, [data, search])

  if (loading) return <LoadingSpinner />

  return (
    <div>
      <div className="page-header">
        <h1 className="page-title">Talismans</h1>
        <p className="page-subtitle">{data?.length} talismans with precise mechanical values</p>
      </div>

      <div className="mb-4">
        <input
          className="input max-w-sm"
          placeholder="Search talismans…"
          value={search}
          onChange={e => setSearch(e.target.value)}
        />
      </div>

      <DataTable columns={columns} data={filtered} pageSize={100} />
    </div>
  )
}
