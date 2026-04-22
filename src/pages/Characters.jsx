import { Link } from 'react-router-dom'
import { useData } from '../hooks/useData'
import LoadingSpinner from '../components/LoadingSpinner'

const STAT_DISPLAY = ['vigor', 'mind', 'endurance', 'strength', 'dexterity', 'intelligence', 'faith', 'arcane']
const STAT_LABELS = {
  vigor: 'Vig', mind: 'Mnd', endurance: 'End', strength: 'Str',
  dexterity: 'Dex', intelligence: 'Int', faith: 'Fth', arcane: 'Arc',
}

function StatBar({ value, max = 70, label }) {
  const pct = Math.min((value / max) * 100, 100)
  return (
    <div className="flex items-center gap-2 text-xs">
      <span className="w-6 text-zinc-500 shrink-0">{label}</span>
      <div className="flex-1 h-1.5 rounded-full bg-zinc-800">
        <div className="h-full rounded-full bg-brand-500" style={{ width: `${pct}%` }} />
      </div>
      <span className="w-6 text-right text-zinc-300">{value}</span>
    </div>
  )
}

function CharacterCard({ character }) {
  const stats = character.base_stats
  return (
    <Link
      to={`/characters/${character.name.toLowerCase()}`}
      className="card group hover:border-zinc-600 hover:bg-zinc-800/60 transition-all space-y-3"
    >
      <div className="flex items-center gap-3">
        <div className="h-10 w-10 rounded-full bg-zinc-800 border border-zinc-700 flex items-center justify-center text-lg font-bold text-brand-400">
          {character.name[0]}
        </div>
        <div>
          <div className="font-semibold text-zinc-100 group-hover:text-brand-400 transition-colors">
            {character.name}
          </div>
          <div className="text-xs text-zinc-400">
            HP {stats.base_hp} · FP {stats.base_fp} · Stam {stats.base_stamina}
          </div>
        </div>
      </div>
      <div className="space-y-1">
        {STAT_DISPLAY.map(s => (
          <StatBar key={s} label={STAT_LABELS[s]} value={stats[s]} />
        ))}
      </div>
    </Link>
  )
}

export default function Characters() {
  const { data, loading } = useData('/data/characters.json')

  if (loading) return <LoadingSpinner />

  return (
    <div>
      <div className="page-header">
        <h1 className="page-title">Characters</h1>
        <p className="page-subtitle">Base stats and level-up progression for all {data?.length} characters</p>
      </div>
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {data?.map(c => <CharacterCard key={c.name} character={c} />)}
      </div>
    </div>
  )
}
