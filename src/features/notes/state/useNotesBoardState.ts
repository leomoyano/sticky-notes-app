import { useCallback, useMemo, useReducer } from 'react'
import type { CreateNoteInput, Note } from '../domain/note.types'
import { initialNotesState, notesReducer } from './notesReducer'

export function useNotesBoardState() {
  const [state, dispatch] = useReducer(notesReducer, initialNotesState)

  const notes = useMemo(
    () =>
      state.order
        .map((id) => state.notes[id])
        .filter((note): note is Note => Boolean(note))
        .sort((a, b) => a.zIndex - b.zIndex),
    [state.notes, state.order],
  )

  const createNote = useCallback((input: CreateNoteInput) => {
    dispatch({ type: 'create', payload: input })
  }, [])

  const setActiveNote = useCallback((id: string) => {
    dispatch({ type: 'set-active', payload: { id } })
  }, [])

  const moveNote = useCallback((id: string, x: number, y: number) => {
    dispatch({ type: 'move', payload: { id, x, y } })
  }, [])

  const resizeNote = useCallback((id: string, width: number, height: number) => {
    dispatch({ type: 'resize', payload: { id, width, height } })
  }, [])

  const updateNoteContent = useCallback((id: string, content: string) => {
    dispatch({ type: 'update-content', payload: { id, content } })
  }, [])

  const hydrateNotes = useCallback((notes: Note[]) => {
    dispatch({ type: 'hydrate', payload: { notes } })
  }, [])

  return {
    notes,
    activeId: state.activeId,
    createNote,
    setActiveNote,
    moveNote,
    resizeNote,
    updateNoteContent,
    hydrateNotes,
  }
}
