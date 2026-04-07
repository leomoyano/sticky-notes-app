import type { Note, Rect } from './note.types'
import { NOTE_LIMITS } from './note.constants'

export function clamp(value: number, min: number, max: number) {
  return Math.max(min, Math.min(value, max))
}

export function clampPosition(rect: Rect, boardWidth: number, boardHeight: number) {
  const maxX = Math.max(0, boardWidth - rect.width)
  const maxY = Math.max(0, boardHeight - rect.height)

  return {
    x: clamp(rect.x, 0, maxX),
    y: clamp(rect.y, 0, maxY),
  }
}

export function clampSize(
  rect: Rect,
  boardWidth: number,
  boardHeight: number,
  minWidth = NOTE_LIMITS.minWidth,
  minHeight = NOTE_LIMITS.minHeight,
) {
  const maxWidth = Math.max(minWidth, boardWidth - rect.x)
  const maxHeight = Math.max(minHeight, boardHeight - rect.y)

  return {
    width: clamp(rect.width, minWidth, maxWidth),
    height: clamp(rect.height, minHeight, maxHeight),
  }
}

export function createId() {
  return `note-${crypto.randomUUID()}`
}

export function toSerializableNotes(notes: Note[]) {
  return notes.map((note) => ({
    ...note,
    rect: { ...note.rect },
  }))
}
