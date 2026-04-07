import { describe, expect, it } from 'vitest'
import type { Note, NotesState } from '../domain/note.types'
import { initialNotesState, notesReducer } from './notesReducer'

function createSeedState(noteOverrides: Partial<Note> = {}): NotesState {
  const note: Note = {
    id: 'note-1',
    rect: { x: 10, y: 20, width: 200, height: 150 },
    content: 'hello',
    zIndex: 1,
    createdAt: 100,
    updatedAt: 100,
    ...noteOverrides,
  }

  return {
    notes: { [note.id]: note },
    order: [note.id],
    activeId: note.id,
    nextZIndex: 2,
  }
}

describe('notesReducer', () => {
  it('creates a note with provided geometry and updates active/stack info', () => {
    const state = notesReducer(initialNotesState, {
      type: 'create',
      payload: { x: 24, y: 32, width: 210, height: 170, content: 'new note' },
    })

    expect(state.order).toHaveLength(1)
    expect(state.activeId).toBeTruthy()
    expect(state.nextZIndex).toBe(2)

    const createdId = state.order[0]
    const created = state.notes[createdId]

    expect(created.rect).toEqual({ x: 24, y: 32, width: 210, height: 170 })
    expect(created.content).toBe('new note')
    expect(created.zIndex).toBe(1)
  })

  it('moves a note by updating x and y coordinates', () => {
    const baseState = createSeedState()

    const state = notesReducer(baseState, {
      type: 'move',
      payload: { id: 'note-1', x: 120, y: 180 },
    })

    expect(state.notes['note-1'].rect).toEqual({
      x: 120,
      y: 180,
      width: 200,
      height: 150,
    })
  })

  it('resizes a note by updating width and height', () => {
    const baseState = createSeedState()

    const state = notesReducer(baseState, {
      type: 'resize',
      payload: { id: 'note-1', width: 260, height: 220 },
    })

    expect(state.notes['note-1'].rect).toEqual({
      x: 10,
      y: 20,
      width: 260,
      height: 220,
    })
  })

  it('set-active brings selected note to front', () => {
    const stateWithTwoNotes: NotesState = {
      notes: {
        'note-1': {
          id: 'note-1',
          rect: { x: 0, y: 0, width: 200, height: 150 },
          content: 'one',
          zIndex: 1,
          createdAt: 1,
          updatedAt: 1,
        },
        'note-2': {
          id: 'note-2',
          rect: { x: 40, y: 40, width: 200, height: 150 },
          content: 'two',
          zIndex: 2,
          createdAt: 2,
          updatedAt: 2,
        },
      },
      order: ['note-1', 'note-2'],
      activeId: 'note-2',
      nextZIndex: 3,
    }

    const state = notesReducer(stateWithTwoNotes, {
      type: 'set-active',
      payload: { id: 'note-1' },
    })

    expect(state.activeId).toBe('note-1')
    expect(state.notes['note-1'].zIndex).toBe(3)
    expect(state.nextZIndex).toBe(4)
  })

  it('hydrates notes from persistence and restores z-index sequence', () => {
    const hydratedNotes: Note[] = [
      {
        id: 'a',
        rect: { x: 0, y: 0, width: 120, height: 100 },
        content: 'A',
        zIndex: 4,
        createdAt: 1,
        updatedAt: 1,
      },
      {
        id: 'b',
        rect: { x: 10, y: 10, width: 120, height: 100 },
        content: 'B',
        zIndex: 9,
        createdAt: 2,
        updatedAt: 2,
      },
    ]

    const state = notesReducer(initialNotesState, {
      type: 'hydrate',
      payload: { notes: hydratedNotes },
    })

    expect(state.order).toEqual(['a', 'b'])
    expect(state.activeId).toBe('b')
    expect(state.nextZIndex).toBe(10)
  })

  it('ignores move action for unknown note id', () => {
    const baseState = createSeedState()

    const state = notesReducer(baseState, {
      type: 'move',
      payload: { id: 'missing-id', x: 999, y: 999 },
    })

    expect(state).toEqual(baseState)
  })

  it('ignores resize action for unknown note id', () => {
    const baseState = createSeedState()

    const state = notesReducer(baseState, {
      type: 'resize',
      payload: { id: 'missing-id', width: 999, height: 999 },
    })

    expect(state).toEqual(baseState)
  })

  it('keeps state unchanged when hydrating with an empty list', () => {
    const baseState = createSeedState()

    const state = notesReducer(baseState, {
      type: 'hydrate',
      payload: { notes: [] },
    })

    expect(state).toEqual(baseState)
  })
})
