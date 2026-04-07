import { useMemo, useRef } from 'react'
import { BOARD_LIMITS } from '../domain/note.constants'
import { clampPosition, clampSize } from '../domain/note.utils'
import type { CreateNoteInput, Note } from '../domain/note.types'
import { CreateNoteForm } from './CreateNoteForm'
import { NoteCard } from './NoteCard'

type NotesBoardProps = {
  notes: Note[]
  activeId: string | null
  onCreate: (input: CreateNoteInput) => void
  onActivate: (id: string) => void
  onMove: (id: string, x: number, y: number) => void
  onResize: (id: string, width: number, height: number) => void
  onChangeContent: (id: string, content: string) => void
}

export function NotesBoard({
  notes,
  activeId,
  onCreate,
  onActivate,
  onMove,
  onResize,
  onChangeContent,
}: NotesBoardProps) {
  const boardRef = useRef<HTMLDivElement>(null)

  const sortedNotes = useMemo(() => [...notes].sort((a, b) => a.zIndex - b.zIndex), [notes])

  const createClampedNote = (input: CreateNoteInput) => {
    const size = clampSize(
      { ...input },
      BOARD_LIMITS.width,
      BOARD_LIMITS.height,
    )
    const position = clampPosition(
      { ...input, width: size.width, height: size.height },
      BOARD_LIMITS.width,
      BOARD_LIMITS.height,
    )

    onCreate({
      x: position.x,
      y: position.y,
      width: size.width,
      height: size.height,
    })
  }

  return (
    <section className="space-y-4">
      <CreateNoteForm onCreate={createClampedNote} />

      <div
        ref={boardRef}
        className="relative overflow-hidden rounded-2xl border border-slate-300 bg-slate-100"
        style={{ width: BOARD_LIMITS.width, height: BOARD_LIMITS.height }}
      >
        {sortedNotes.length === 0 ? (
          <div className="flex h-full items-center justify-center text-slate-500">
            Create your first sticky note.
          </div>
        ) : null}

        {sortedNotes.map((note) => (
          <NoteCard
            key={note.id}
            note={note}
            isActive={activeId === note.id}
            boardRef={boardRef}
            onActivate={onActivate}
            onMove={onMove}
            onResize={onResize}
            onChangeContent={onChangeContent}
          />
        ))}
      </div>
    </section>
  )
}
