export function SkipLink({ label }: { label: string }) {
  return (
    <a
      href="#main"
      className="sr-only-focusable fixed top-3 left-3 z-[100] rounded-sm bg-accent px-4 py-3 font-semibold text-accent-fg"
    >
      {label}
    </a>
  )
}
