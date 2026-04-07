import { NotesBoard } from '../components/NotesBoard'
import { useLocalStorageNotes } from '../hooks/useLocalStorageNotes'
import { useNotesBoardState } from '../state/useNotesBoardState'

export function StickyNotesPage() {
  const {
    notes,
    activeId,
    createNote,
    setActiveNote,
    moveNote,
    resizeNote,
    updateNoteContent,
    hydrateNotes,
  } = useNotesBoardState()

  useLocalStorageNotes(notes, hydrateNotes)

  return (
    <main className="min-h-screen bg-slate-50 px-6 py-8 text-slate-900">
      <div className="mx-auto max-w-[1024px] space-y-4">
        <header>
          <p className="text-sm font-medium uppercase tracking-wide text-indigo-600">Take-home</p>
          <h1 className="text-3xl font-bold">Sticky Notes Board</h1>
          <p className="mt-1 text-sm text-slate-600">
            Core features: create notes by size/position, drag to move, drag handle to resize.
          </p>
        </header>

        <NotesBoard
          notes={notes}
          activeId={activeId}
          onCreate={createNote}
          onActivate={setActiveNote}
          onMove={moveNote}
          onResize={resizeNote}
          onChangeContent={updateNoteContent}
        />
      </div>
    </main>
  )
}
