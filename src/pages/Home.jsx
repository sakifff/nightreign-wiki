import { Link } from 'react-router-dom'
import { useData } from '../hooks/useData'

const sections = [
  { to: '/talismans', label: 'Talismans', desc: 'All talisman effects and mechanical values', icon: '🔮', dataKey: 'talismans' },
  { to: '/relics', label: 'Relics & Passives', desc: 'Generic relics, weapon passives, deep relics', icon: '💠', dataKey: 'relics' },
  { to: '/dormant-powers', label: 'Dormant Powers', desc: 'Passive bonuses found on gear', icon: '✨', dataKey: 'dormant_powers' },
  { to: '/consumables', label: 'Consumables', desc: 'Status effects, aromatics, boluses, grease', icon: '⚗️', dataKey: 'consumables' },
  { to: '/characters', label: 'Characters', desc: 'Base stats and level-up progression', icon: '⚔️', dataKey: 'characters' },
  { to: '/bosses', label: 'Bosses', desc: 'HP tables, resistances, elemental weaknesses', icon: '🐉', dataKey: 'bosses' },
  { to: '/builds', label: 'Expeditions', desc: 'Guaranteed relics per expedition and character', icon: '🗺️', dataKey: 'expeditions' },
  { to: '/level-calculator', label: 'Rune Calculator', desc: 'Calculate rune cost between levels', icon: '📊', dataKey: null },
  { to: '/changelog', label: 'Changelog', desc: 'Patch notes and data updates', icon: '📋', dataKey: null },
]

function StatCard({ label, value }) {
  return (
    <div className="card text-center">
      <div className="text-2xl font-bold text-brand-400">{value ?? '—'}</div>
      <div className="mt-0.5 text-xs text-zinc-400">{label}</div>
    </div>
  )
}

export default function Home() {
  const { data: meta } = useData('/data/meta.json')
  const { data: talismans } = useData('/data/talismans.json')
  const { data: bosses } = useData('/data/bosses.json')
  const { data: characters } = useData('/data/characters.json')
  const { data: relics } = useData('/data/relics.json')

  return (
    <div className="space-y-10">
      {/* Hero */}
      <div className="text-center py-10">
        <h1 className="text-4xl font-bold text-zinc-100">Nightreign Wiki</h1>
        <p className="mt-3 text-zinc-400 max-w-xl mx-auto">
          Community reference for Elden Ring Nightreign — boss stats, relics, character builds, consumables, and more.
        </p>
        {meta && (
          <div className="mt-4 flex items-center justify-center gap-3">
            <span className="badge bg-brand-900/60 text-brand-400">v{meta.version}</span>
            {meta.dlc_included && <span className="badge bg-purple-900/40 text-purple-400">DLC Included</span>}
            <span className="text-xs text-zinc-600">Updated {meta.last_updated}</span>
          </div>
        )}
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <StatCard label="Talismans" value={talismans?.length} />
        <StatCard label="Relics & Passives" value={relics?.length} />
        <StatCard label="Bosses" value={bosses?.length} />
        <StatCard label="Characters" value={characters?.length} />
      </div>

      {/* Section cards */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {sections.map(s => (
          <Link
            key={s.to}
            to={s.to}
            className="card group hover:border-zinc-600 hover:bg-zinc-800/60 transition-all"
          >
            <div className="flex items-start gap-3">
              <span className="text-2xl">{s.icon}</span>
              <div>
                <div className="font-semibold text-zinc-100 group-hover:text-brand-400 transition-colors">
                  {s.label}
                </div>
                <div className="mt-0.5 text-sm text-zinc-400">{s.desc}</div>
              </div>
            </div>
          </Link>
        ))}
      </div>

      {/* Attribution */}
      {meta && (
        <p className="text-center text-xs text-zinc-600">
          {meta.source}
        </p>
      )}
    </div>
  )
}
