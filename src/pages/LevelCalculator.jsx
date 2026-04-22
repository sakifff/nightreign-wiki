import { useState, useMemo } from 'react'
import { useData } from '../hooks/useData'
import LoadingSpinner from '../components/LoadingSpinner'

export default function LevelCalculator() {
  const { data, loading } = useData('/data/level_costs.json')
  const [fromLevel, setFromLevel] = useState(1)
  const [toLevel, setToLevel] = useState(15)

  const result = useMemo(() => {
    if (!data) return null
    const from = Math.max(1, Math.min(15, Number(fromLevel)))
    const to = Math.max(1, Math.min(15, Number(toLevel)))
    if (from >= to) return null

    const rows = data.filter(r => r.level >= from && r.level < to)
    const totalRunes = rows.reduce((sum, r) => sum + (r.runes_to_next || 0), 0)

    return { rows, totalRunes, from, to }
  }, [data, fromLevel, toLevel])

  if (loading) return <LoadingSpinner />

  return (
    <div className="max-w-2xl">
      <div className="page-header">
        <h1 className="page-title">Rune Calculator</h1>
        <p className="page-subtitle">Calculate the runes needed to level up</p>
      </div>

      <div className="card mb-6">
        <div className="flex flex-wrap gap-6 items-end">
          <div>
            <label className="block text-xs text-zinc-400 mb-1">Current Level</label>
            <input
              type="number"
              min="1" max="14"
              className="input w-28"
              value={fromLevel}
              onChange={e => setFromLevel(e.target.value)}
            />
          </div>
          <div>
            <label className="block text-xs text-zinc-400 mb-1">Target Level</label>
            <input
              type="number"
              min="2" max="15"
              className="input w-28"
              value={toLevel}
              onChange={e => setToLevel(e.target.value)}
            />
          </div>
          {result && (
            <div className="flex-1">
              <div className="text-xs text-zinc-400">Total Runes Needed</div>
              <div className="text-3xl font-bold text-brand-400 font-mono">
                {Math.round(result.totalRunes).toLocaleString()}
              </div>
            </div>
          )}
        </div>
        {!result && fromLevel >= toLevel && (
          <p className="mt-3 text-sm text-red-400">Target level must be higher than current level.</p>
        )}
      </div>

      {result && (
        <div className="overflow-x-auto rounded-xl border border-zinc-800">
          <table className="table-base min-w-full">
            <thead>
              <tr>
                <th>Level</th>
                <th className="text-right">Runes to Next</th>
                <th className="text-right">Cost Increase</th>
                <th className="text-right">Cumulative</th>
              </tr>
            </thead>
            <tbody>
              {result.rows.map(r => (
                <tr key={r.level}>
                  <td className="font-medium text-zinc-100">{r.level} → {r.level + 1}</td>
                  <td className="text-right font-mono text-zinc-200">
                    {r.runes_to_next?.toLocaleString() ?? '—'}
                  </td>
                  <td className="text-right font-mono text-zinc-400">
                    {r.cost_increase != null ? `+${Math.round(r.cost_increase).toLocaleString()}` : '—'}
                  </td>
                  <td className="text-right font-mono text-zinc-300">
                    {r.total_runes?.toLocaleString() ?? '—'}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Full table */}
      <div className="mt-8">
        <h2 className="font-semibold text-zinc-100 mb-3">Full Level Cost Table</h2>
        <div className="overflow-x-auto rounded-xl border border-zinc-800">
          <table className="table-base min-w-full">
            <thead>
              <tr>
                <th>Level</th>
                <th className="text-right">Runes to Next</th>
                <th className="text-right">Cumulative Total</th>
              </tr>
            </thead>
            <tbody>
              {data?.map(r => (
                <tr key={r.level}>
                  <td className="font-medium text-zinc-100">{r.level}</td>
                  <td className="text-right font-mono text-zinc-200">
                    {r.runes_to_next?.toLocaleString() ?? '—'}
                  </td>
                  <td className="text-right font-mono text-zinc-400">
                    {r.total_runes?.toLocaleString() ?? '—'}
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
