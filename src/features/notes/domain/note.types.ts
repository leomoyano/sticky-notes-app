export type NoteId = string

export type Point = {
  x: number
  y: number
}

export type Size = {
  width: number
  height: number
}

export type Rect = Point & Size

export type Note = {
  id: NoteId
  rect: Rect
  content: string
  zIndex: number
  createdAt: number
  updatedAt: number
}

export type CreateNoteInput = Rect & {
  content?: string
}

export type NotesState = {
  notes: Record<NoteId, Note>
  order: NoteId[]
  activeId: NoteId | null
  nextZIndex: number
}

export type NotesAction =
  | { type: 'create'; payload: CreateNoteInput }
  | { type: 'move'; payload: { id: NoteId; x: number; y: number } }
  | { type: 'resize'; payload: { id: NoteId; width: number; height: number } }
  | { type: 'update-content'; payload: { id: NoteId; content: string } }
  | { type: 'set-active'; payload: { id: NoteId } }
  | { type: 'hydrate'; payload: { notes: Note[] } }
