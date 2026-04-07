import type { Note, NotesAction, NotesState } from '../domain/note.types'
import { createId } from '../domain/note.utils'

const INITIAL_Z_INDEX = 1

export const initialNotesState: NotesState = {
  notes: {},
  order: [],
  activeId: null,
  nextZIndex: INITIAL_Z_INDEX,
}

function sortByZIndex(notes: Note[]) {
  return notes.sort((a, b) => a.zIndex - b.zIndex)
}

export function notesReducer(state: NotesState, action: NotesAction): NotesState {
  switch (action.type) {
    case 'create': {
      const now = Date.now()
      const id = createId()
      const note: Note = {
        id,
        rect: {
          x: action.payload.x,
          y: action.payload.y,
          width: action.payload.width,
          height: action.payload.height,
        },
        content: action.payload.content ?? '',
        zIndex: state.nextZIndex,
        createdAt: now,
        updatedAt: now,
      }

      return {
        ...state,
        notes: {
          ...state.notes,
          [id]: note,
        },
        order: [...state.order, id],
        activeId: id,
        nextZIndex: state.nextZIndex + 1,
      }
    }

    case 'set-active': {
      const note = state.notes[action.payload.id]
      if (!note) return state

      if (note.zIndex === state.nextZIndex - 1) {
        return {
          ...state,
          activeId: note.id,
        }
      }

      return {
        ...state,
        notes: {
          ...state.notes,
          [note.id]: {
            ...note,
            zIndex: state.nextZIndex,
            updatedAt: Date.now(),
          },
        },
        activeId: note.id,
        nextZIndex: state.nextZIndex + 1,
      }
    }

    case 'move': {
      const note = state.notes[action.payload.id]
      if (!note) return state

      return {
        ...state,
        notes: {
          ...state.notes,
          [note.id]: {
            ...note,
            rect: {
              ...note.rect,
              x: action.payload.x,
              y: action.payload.y,
            },
            updatedAt: Date.now(),
          },
        },
      }
    }

    case 'resize': {
      const note = state.notes[action.payload.id]
      if (!note) return state

      return {
        ...state,
        notes: {
          ...state.notes,
          [note.id]: {
            ...note,
            rect: {
              ...note.rect,
              width: action.payload.width,
              height: action.payload.height,
            },
            updatedAt: Date.now(),
          },
        },
      }
    }

    case 'update-content': {
      const note = state.notes[action.payload.id]
      if (!note) return state

      return {
        ...state,
        notes: {
          ...state.notes,
          [note.id]: {
            ...note,
            content: action.payload.content,
            updatedAt: Date.now(),
          },
        },
      }
    }

    case 'hydrate': {
      if (!action.payload.notes.length) {
        return state
      }

      const orderedNotes = sortByZIndex(action.payload.notes)
      const notesMap = orderedNotes.reduce<Record<string, Note>>((acc, note) => {
        acc[note.id] = note
        return acc
      }, {})
      const maxZIndex = orderedNotes.reduce((max, note) => Math.max(max, note.zIndex), 0)

      return {
        ...state,
        notes: notesMap,
        order: orderedNotes.map((note) => note.id),
        activeId: orderedNotes[orderedNotes.length - 1]?.id ?? null,
        nextZIndex: maxZIndex + 1,
      }
    }

    default:
      return state
  }
}
