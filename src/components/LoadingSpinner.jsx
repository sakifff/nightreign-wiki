export default function LoadingSpinner({ text = 'Loading…' }) {
  return (
    <div className="flex flex-col items-center justify-center py-24 gap-3">
      <div className="h-8 w-8 rounded-full border-2 border-zinc-700 border-t-brand-500 animate-spin" />
      <p className="text-sm text-zinc-500">{text}</p>
    </div>
  )
}
