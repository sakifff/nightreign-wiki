import { useData } from '../hooks/useData'
import LoadingSpinner from '../components/LoadingSpinner'

export default function Changelog() {
  const { data, loading } = useData('/data/changelog.json')

  if (loading) return <LoadingSpinner />

  return (
    <div className="max-w-2xl">
      <div className="page-header">
        <h1 className="page-title">Changelog</h1>
        <p className="page-subtitle">Data updates and patch notes</p>
      </div>

      <div className="space-y-6">
        {data?.map((entry, i) => (
          <div key={i} className="card">
            <div className="flex items-center gap-3 mb-3">
              <span className="badge bg-brand-900/60 text-brand-400">v{entry.version}</span>
              <span className="text-sm text-zinc-400">{entry.date}</span>
            </div>
            <ul className="space-y-1.5">
              {entry.notes?.map((note, j) => (
                <li key={j} className="flex gap-2 text-sm text-zinc-300">
                  <span className="text-brand-600 shrink-0 mt-0.5">·</span>
                  {note}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </div>
  )
}
