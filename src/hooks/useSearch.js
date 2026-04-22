import { useState, useEffect, useCallback } from 'react'

export function useGlobalSearch() {
  const [query, setQuery] = useState('')
  const [results, setResults] = useState([])
  const [open, setOpen] = useState(false)

  useEffect(() => {
    const handler = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault()
        setOpen(o => !o)
      }
      if (e.key === 'Escape') setOpen(false)
    }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [])

  const search = useCallback(async (q) => {
    if (!q.trim()) { setResults([]); return }
    const lower = q.toLowerCase()

    const files = [
      { path: '/data/talismans.json', type: 'Talisman', nameKey: 'name', subtitleKey: 'effect_ingame', linkFn: () => '/talismans' },
      { path: '/data/relics.json', type: 'Relic', nameKey: 'description', subtitleKey: 'effect', linkFn: () => '/relics' },
      { path: '/data/dormant_powers.json', type: 'Dormant Power', nameKey: 'name', subtitleKey: 'effect', linkFn: () => '/dormant-powers' },
      { path: '/data/consumables.json', type: 'Consumable', nameKey: 'name', subtitleKey: 'effect_ingame', linkFn: () => '/consumables' },
      { path: '/data/bosses.json', type: 'Boss', nameKey: 'name', subtitleKey: null, linkFn: (item) => `/bosses/${encodeURIComponent(item.name)}` },
      { path: '/data/characters.json', type: 'Character', nameKey: 'name', subtitleKey: null, linkFn: (item) => `/characters/${item.name.toLowerCase()}` },
    ]

    const all = []
    await Promise.all(files.map(async ({ path, type, nameKey, subtitleKey, linkFn }) => {
      try {
        const data = await fetch(path).then(r => r.json())
        data.forEach(item => {
          const name = item[nameKey] || ''
          const subtitle = subtitleKey ? (item[subtitleKey] || '') : ''
          if (name.toLowerCase().includes(lower) || subtitle.toLowerCase().includes(lower)) {
            all.push({ type, name, subtitle, link: linkFn(item) })
          }
        })
      } catch { /* ignore */ }
    }))

    setResults(all.slice(0, 30))
  }, [])

  useEffect(() => {
    const t = setTimeout(() => search(query), 150)
    return () => clearTimeout(t)
  }, [query, search])

  return { query, setQuery, results, open, setOpen }
}
