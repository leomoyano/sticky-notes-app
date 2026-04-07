import { memo } from 'react'
import type { RefObject } from 'react'
import type { Note } from '../domain/note.types'
import { useNoteDrag } from '../hooks/useNoteDrag'
import { useNoteResize } from '../hooks/useNoteResize'
import { ResizeHandle } from './ResizeHandle'

type NoteCardProps = {
  note: Note
  isActive: boolean
  boardRef: RefObject<HTMLDivElement | null>
  onActivate: (id: string) => void
  onMove: (id: string, x: number, y: number) => void
  onResize: (id: string, width: number, height: number) => void
  onChangeContent: (id: string, content: string) => void
}

function NoteCardComponent({
  note,
  isActive,
  boardRef,
  onActivate,
  onMove,
  onResize,
  onChangeContent,
}: NoteCardProps) {
  const dragBindings = useNoteDrag({
    noteId: note.id,
    rect: note.rect,
    boardRef,
    onActivate,
    onMove,
  })

  const resizeBindings = useNoteResize({
    noteId: note.id,
    rect: note.rect,
    boardRef,
    onActivate,
    onResize,
  })

  return (
    <article
      className={`absolute rounded-md border border-amber-200 bg-amber-200/90 shadow-md transition-shadow ${
        isActive ? 'shadow-lg ring-2 ring-indigo-500/40' : ''
      }`}
      style={{
        width: note.rect.width,
        height: note.rect.height,
        transform: `translate(${note.rect.x}px, ${note.rect.y}px)`,
        zIndex: note.zIndex,
      }}
      onMouseDown={() => onActivate(note.id)}
    >
      <div
        className="flex cursor-grab select-none items-center justify-between border-b border-amber-900/20 px-3 py-2 active:cursor-grabbing"
        {...dragBindings}
      >
        <p className="text-xs font-semibold uppercase tracking-wide text-amber-900/70">
          Sticky note
        </p>
      </div>

      <textarea
        className="h-[calc(100%-38px)] w-full resize-none bg-transparent px-3 py-2 text-sm text-slate-800 focus-visible:ring-2 focus-visible:ring-indigo-500/60 focus-visible:outline-none"
        placeholder="Type your note here…"
        value={note.content}
        onFocus={() => onActivate(note.id)}
        onChange={(event) => onChangeContent(note.id, event.target.value)}
      />

      <ResizeHandle {...resizeBindings} />
    </article>
  )
}

export const NoteCard = memo(NoteCardComponent)
