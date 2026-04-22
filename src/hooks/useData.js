import { useState, useEffect } from 'react'

const cache = {}

export function useData(path) {
  const [data, setData] = useState(cache[path] ?? null)
  const [loading, setLoading] = useState(!cache[path])
  const [error, setError] = useState(null)

  useEffect(() => {
    if (cache[path]) {
      setData(cache[path])
      setLoading(false)
      return
    }
    setLoading(true)
    fetch(path)
      .then(r => r.json())
      .then(d => {
        cache[path] = d
        setData(d)
        setLoading(false)
      })
      .catch(e => {
        setError(e.message)
        setLoading(false)
      })
  }, [path])

  return { data, loading, error }
}
