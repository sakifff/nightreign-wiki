import { useParams, Link } from 'react-router-dom'
import { useMemo } from 'react'
import { useData } from '../hooks/useData'
import LoadingSpinner from '../components/LoadingSpinner'
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer
} from 'recharts'

const BASE_STAT_ROWS = [
  ['HP', 'base_hp'], ['FP', 'base_fp'], ['Stamina', 'base_stamina'],
  ['Vigor', 'vigor'], ['Mind', 'mind'], ['Endurance', 'endurance'],
  ['Strength', 'strength'], ['Dexterity', 'dexterity'],
  ['Intelligence', 'intelligence'], ['Faith', 'faith'], ['Arcane', 'arcane'],
  ['Poise', 'poise'],
]

const NEG_ROWS = [
  ['Physical', 'phys_neg'], ['Slash', 'slash_neg'], ['Strike', 'strike_neg'],
  ['Thrust', 'thrust_neg'], ['Magic', 'magic_neg'], ['Fire', 'fire_neg'],
  ['Lightning', 'lightning_neg'], ['Holy', 'holy_neg'],
]

const RESIST_ROWS = [
  ['Poison', 'poison_resist'], ['Scarlet Rot', 'rot_resist'],
  ['Hemorrhage', 'bleed_resist'], ['Frostbite', 'frost_resist'],
  ['Sleep', 'sleep_resist'], ['Madness', 'madness_resist'],
  ['Death Blight', 'blight_resist'],
]

const CHART_STATS = [
  { key: 'vigor', color: '#ef4444', label: 'Vigor' },
  { key: 'mind', color: '#3b82f6', label: 'Mind' },
  { key: 'endurance', color: '#22c55e', label: 'Endurance' },
  { key: 'strength', color: '#f59e0b', label: 'Strength' },
  { key: 'dexterity', color: '#a78bfa', label: 'Dexterity' },
]

function StatRow({ label, value }) {
  return (
    <tr>
      <td className="px-3 py-2 text-sm text-zinc-400 border-b border-zinc-800/50">{label}</td>
      <td className="px-3 py-2 text-sm text-zinc-100 font-medium border-b border-zinc-800/50 text-right">
        {typeof value === 'number' && value < 1 && value > 0
          ? `${(value * 100).toFixed(1)}%`
          : value ?? '—'}
      </td>
    </tr>
  )
}

export default function CharacterDetail() {
  const { name } = useParams()
  const { data: allChars, loading } = useData('/data/characters.json')
  const { data: allRelics } = useData('/data/relics.json')

  const character = useMemo(() =>
    allChars?.find(c => c.name.toLowerCase() === name.toLowerCase()),
    [allChars, name]
  )

  const charRelics = useMemo(() => {
    if (!allRelics || !character) return []
    return allRelics.filter(r => r.character?.toLowerCase() === character.name.toLowerCase())
  }, [allRelics, character])

  if (loading) return <LoadingSpinner />
  if (!character) return (
    <div className="py-24 text-center">
      <p className="text-zinc-400">Character "{name}" not found.</p>
      <Link to="/characters" className="mt-4 inline-block btn-ghost">← Back to Characters</Link>
    </div>
  )

  const levelData = character.level_stats.map(ls => ({ level: ls.level, ...ls }))
  const hasLevelData = levelData.length > 0

  return (
    <div className="space-y-8">
      <div className="flex items-center gap-4">
        <Link to="/characters" className="btn-ghost">← Characters</Link>
        <div>
          <h1 className="page-title">{character.name}</h1>
          <p className="page-subtitle">
            HP {character.base_stats.base_hp} · FP {character.base_stats.base_fp} · Stamina {character.base_stats.base_stamina}
          </p>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Base stats */}
        <div className="card">
          <h2 className="font-semibold text-zinc-100 mb-3">Base Stats (Lv 15)</h2>
          <table className="w-full">
            <tbody>
              {BASE_STAT_ROWS.map(([label, key]) => (
                <StatRow key={key} label={label} value={character.base_stats[key]} />
              ))}
            </tbody>
          </table>
        </div>

        {/* Damage negations */}
        <div className="card">
          <h2 className="font-semibold text-zinc-100 mb-3">Damage Negation</h2>
          <table className="w-full">
            <tbody>
              {NEG_ROWS.map(([label, key]) => (
                <StatRow key={key} label={label} value={character.base_stats[key]} />
              ))}
            </tbody>
          </table>
          <h2 className="font-semibold text-zinc-100 mb-3 mt-4">Status Resistances</h2>
          <table className="w-full">
            <tbody>
              {RESIST_ROWS.map(([label, key]) => (
                <StatRow key={key} label={label} value={character.base_stats[key]} />
              ))}
            </tbody>
          </table>
        </div>

        {/* Character relics */}
        <div className="card">
          <h2 className="font-semibold text-zinc-100 mb-3">Character Relics ({charRelics.length})</h2>
          {charRelics.length === 0
            ? <p className="text-sm text-zinc-500">No character-specific relics found.</p>
            : (
              <ul className="space-y-3">
                {charRelics.map((r, i) => (
                  <li key={i} className="border-b border-zinc-800 pb-3 last:border-0 last:pb-0">
                    <div className="text-sm font-medium text-zinc-100">{r.description}</div>
                    <div className="text-xs text-zinc-400 mt-0.5">{r.effect}</div>
                    {r.stackable && (
                      <div className="text-xs text-zinc-600 mt-0.5">Stackable: {r.stackable}</div>
                    )}
                  </li>
                ))}
              </ul>
            )}
        </div>
      </div>

      {/* Level progression chart */}
      {hasLevelData && (
        <div className="card">
          <h2 className="font-semibold text-zinc-100 mb-4">Stat Progression (Levels 1–{levelData.length})</h2>
          <ResponsiveContainer width="100%" height={280}>
            <LineChart data={levelData} margin={{ top: 4, right: 8, left: 0, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#27272a" />
              <XAxis dataKey="level" tick={{ fontSize: 11, fill: '#a1a1aa' }} />
              <YAxis tick={{ fontSize: 11, fill: '#a1a1aa' }} />
              <Tooltip
                contentStyle={{ background: '#18181b', border: '1px solid #3f3f46', borderRadius: 8, fontSize: 12 }}
                labelStyle={{ color: '#e4e4e7' }}
              />
              <Legend wrapperStyle={{ fontSize: 12 }} />
              {CHART_STATS.map(s => (
                <Line key={s.key} type="monotone" dataKey={s.key} stroke={s.color} name={s.label} dot={false} strokeWidth={2} />
              ))}
            </LineChart>
          </ResponsiveContainer>
        </div>
      )}

      {!hasLevelData && (
        <div className="card text-center py-8">
          <p className="text-sm text-zinc-500">Per-level stat progression not available for {character.name}.</p>
          <p className="text-xs text-zinc-600 mt-1">(DLC character — only level 15 stats are recorded)</p>
        </div>
      )}
    </div>
  )
}
