import { useParams, Link } from 'react-router-dom'
import { useMemo } from 'react'
import { useData } from '../hooks/useData'
import LoadingSpinner from '../components/LoadingSpinner'

const HP_ROWS = [
  ['Standard — Solo', 'standard_solo'],
  ['Standard — Duo', 'standard_duo'],
  ['Standard — Trio', 'standard_trio'],
  ['DLC — Solo', 'dlc_solo'],
  ['DLC — Duo', 'dlc_duo'],
  ['DLC — Trio', 'dlc_trio'],
]

const RESIST_ROWS = [
  ['Physical', 'phys_mod'],
  ['Strike', 'strike_mod'],
  ['Slash', 'slash_mod'],
  ['Pierce', 'pierce_mod'],
  ['Magic', 'magic_mod'],
  ['Fire', 'fire_mod'],
  ['Lightning', 'lightning_mod'],
  ['Holy', 'holy_mod'],
]

const STATUS_ROWS = [
  ['Poison', 'poison'], ['Scarlet Rot', 'rot'], ['Hemorrhage', 'bleed'],
  ['Frostbite', 'frost'], ['Sleep', 'sleep'], ['Madness', 'madness'], ['Death Blight', 'blight'],
]

function ResistBadge({ value, isStatus = false }) {
  if (value === null || value === undefined) return <span className="text-zinc-600">—</span>
  if (value === 'Immune') return (
    <span className="badge bg-red-900/40 text-red-400">Immune</span>
  )
  const num = Number(value)
  if (isStatus) {
    return <span className="text-zinc-200 font-mono text-sm">{Math.round(num)}</span>
  }
  if (num > 0) return <span className="badge bg-green-900/40 text-green-400">+{num}</span>
  if (num < 0) return <span className="badge bg-red-900/40 text-red-400">{num}</span>
  return <span className="text-zinc-400">{num}</span>
}

export default function BossDetail() {
  const { name } = useParams()
  const { data: allBosses, loading } = useData('/data/bosses.json')

  const boss = useMemo(() =>
    allBosses?.find(b => b.name === decodeURIComponent(name)),
    [allBosses, name]
  )

  if (loading) return <LoadingSpinner />
  if (!boss) return (
    <div className="py-24 text-center">
      <p className="text-zinc-400">Boss not found.</p>
      <Link to="/bosses" className="mt-4 inline-block btn-ghost">← Back to Bosses</Link>
    </div>
  )

  return (
    <div className="space-y-8">
      <div className="flex items-center gap-4">
        <Link to="/bosses" className="btn-ghost">← Bosses</Link>
        <div>
          <h1 className="page-title">{boss.name}</h1>
          {boss.game_id && <p className="page-subtitle">ID: {boss.game_id}</p>}
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* HP Table */}
        <div className="card">
          <h2 className="font-semibold text-zinc-100 mb-3">HP by Mode</h2>
          <table className="w-full text-sm">
            <tbody>
              {HP_ROWS.map(([label, key]) => (
                <tr key={key} className="border-b border-zinc-800/50 last:border-0">
                  <td className="py-2 text-zinc-400">{label}</td>
                  <td className="py-2 text-right font-mono text-zinc-100">
                    {boss.hp[key] ? Math.round(boss.hp[key]).toLocaleString() : '—'}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Damage Negation */}
        <div className="card">
          <h2 className="font-semibold text-zinc-100 mb-3">Damage Modifiers</h2>
          <p className="text-xs text-zinc-500 mb-3">Positive = takes more damage from that type</p>
          <table className="w-full text-sm">
            <tbody>
              {RESIST_ROWS.map(([label, key]) => (
                <tr key={key} className="border-b border-zinc-800/50 last:border-0">
                  <td className="py-2 text-zinc-400">{label}</td>
                  <td className="py-2 text-right">
                    <ResistBadge value={boss.resistances[key]} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Status Resistances */}
        <div className="card">
          <h2 className="font-semibold text-zinc-100 mb-3">Status Resistances</h2>
          <table className="w-full text-sm">
            <tbody>
              {STATUS_ROWS.map(([label, key]) => (
                <tr key={key} className="border-b border-zinc-800/50 last:border-0">
                  <td className="py-2 text-zinc-400">{label}</td>
                  <td className="py-2 text-right">
                    <ResistBadge value={boss.resistances[key]} isStatus />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
