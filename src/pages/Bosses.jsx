import { useState, useMemo } from 'react'
import { Link } from 'react-router-dom'
import { useData } from '../hooks/useData'
import LoadingSpinner from '../components/LoadingSpinner'

function ResistCell({ value }) {
  if (value === null || value === undefined) return <span className="text-zinc-600">—</span>
  if (value === 'Immune') return <span className="text-red-400 font-medium text-xs">Immune</span>
  const num = Number(value)
  if (num > 0) return <span className="text-green-400 text-xs">{num}</span>
  if (num < 0) return <span className="text-red-400 text-xs">{num}</span>
  return <span className="text-zinc-400 text-xs">{num}</span>
}

function HPCell({ value }) {
  if (!value) return <span className="text-zinc-600 text-xs">—</span>
  return <span className="text-zinc-200 text-xs font-mono">{Math.round(value).toLocaleString()}</span>
}

export default function Bosses() {
  const { data, loading } = useData('/data/bosses.json')
  const [search, setSearch] = useState('')

  const filtered = useMemo(() => {
    if (!data) return []
    if (!search.trim()) return data
    const q = search.toLowerCase()
    return data.filter(b => b.name.toLowerCase().includes(q))
  }, [data, search])

  if (loading) return <LoadingSpinner />

  return (
    <div>
      <div className="page-header">
        <h1 className="page-title">Bosses</h1>
        <p className="page-subtitle">HP tables and elemental resistances for all {data?.length} bosses (Standard &amp; DLC)</p>
      </div>

      <div className="mb-4">
        <input
          className="input max-w-sm"
          placeholder="Search bosses…"
          value={search}
          onChange={e => setSearch(e.target.value)}
        />
      </div>

      <div className="overflow-x-auto rounded-xl border border-zinc-800">
        <table className="table-base min-w-[900px]">
          <thead>
            <tr>
              <th className="text-left">Boss</th>
              <th>Solo HP</th>
              <th>Duo HP</th>
              <th>Trio HP</th>
              <th>DLC Solo</th>
              <th>DLC Duo</th>
              <th>DLC Trio</th>
              <th>Phys Neg</th>
              <th>Magic Neg</th>
              <th>Fire Neg</th>
              <th>Ltng Neg</th>
              <th>Holy Neg</th>
              <th>Poison</th>
              <th>Madness</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {filtered.map(boss => (
              <tr key={boss.name}>
                <td>
                  <Link
                    to={`/bosses/${encodeURIComponent(boss.name)}`}
                    className="font-medium text-zinc-100 hover:text-brand-400 transition-colors"
                  >
                    {boss.name}
                  </Link>
                </td>
                <td className="text-center"><HPCell value={boss.hp.standard_solo} /></td>
                <td className="text-center"><HPCell value={boss.hp.standard_duo} /></td>
                <td className="text-center"><HPCell value={boss.hp.standard_trio} /></td>
                <td className="text-center"><HPCell value={boss.hp.dlc_solo} /></td>
                <td className="text-center"><HPCell value={boss.hp.dlc_duo} /></td>
                <td className="text-center"><HPCell value={boss.hp.dlc_trio} /></td>
                <td className="text-center"><ResistCell value={boss.resistances.phys_mod} /></td>
                <td className="text-center"><ResistCell value={boss.resistances.magic_mod} /></td>
                <td className="text-center"><ResistCell value={boss.resistances.fire_mod} /></td>
                <td className="text-center"><ResistCell value={boss.resistances.lightning_mod} /></td>
                <td className="text-center"><ResistCell value={boss.resistances.holy_mod} /></td>
                <td className="text-center"><ResistCell value={boss.resistances.poison} /></td>
                <td className="text-center"><ResistCell value={boss.resistances.madness} /></td>
                <td>
                  <Link to={`/bosses/${encodeURIComponent(boss.name)}`} className="btn-ghost text-xs px-2 py-1">
                    Details →
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="mt-3 flex gap-4 text-xs text-zinc-500">
        <span className="flex items-center gap-1"><span className="inline-block w-3 h-3 rounded bg-green-900" /> Positive modifier (more damage)</span>
        <span className="flex items-center gap-1"><span className="inline-block w-3 h-3 rounded bg-red-900" /> Negative / Immune (less damage)</span>
      </div>
    </div>
  )
}
