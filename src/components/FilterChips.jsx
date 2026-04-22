export default function FilterChips({ options, active, onToggle, label }) {
  return (
    <div className="flex flex-wrap items-center gap-2">
      {label && <span className="text-xs text-zinc-500 font-medium">{label}:</span>}
      {options.map(opt => (
        <button
          key={opt}
          className={`chip ${active.includes(opt) ? 'chip-active' : 'chip-inactive'}`}
          onClick={() => onToggle(opt)}
        >
          {opt}
        </button>
      ))}
    </div>
  )
}
