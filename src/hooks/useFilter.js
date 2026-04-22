import { useState, useMemo } from 'react'

export function useFilter(items, filterFn) {
  const [filters, setFilters] = useState({})

  const filtered = useMemo(() => {
    if (!items) return []
    return items.filter(item => filterFn(item, filters))
  }, [items, filters, filterFn])

  return { filters, setFilters, filtered }
}
