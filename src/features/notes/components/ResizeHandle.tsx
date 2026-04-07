import type { PointerEvent } from 'react'

type ResizeHandleProps = {
  onPointerDown: (event: PointerEvent<HTMLButtonElement>) => void
  onPointerMove: (event: PointerEvent<HTMLButtonElement>) => void
  onPointerUp: (event: PointerEvent<HTMLButtonElement>) => void
  onPointerCancel: (event: PointerEvent<HTMLButtonElement>) => void
}

export function ResizeHandle(props: ResizeHandleProps) {
  return (
    <button
      type="button"
      className="absolute bottom-1.5 right-1.5 h-4 w-4 cursor-se-resize rounded-sm border border-amber-900/30 bg-amber-100/80 focus-visible:ring-2 focus-visible:ring-indigo-500/70 focus-visible:outline-none"
      aria-label="Resize note"
      {...props}
    />
  )
}
