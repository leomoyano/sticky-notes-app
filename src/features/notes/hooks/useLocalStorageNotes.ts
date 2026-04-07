import { useEffect, useRef } from 'react'
import type { Note } from '../domain/note.types'
import { toSerializableNotes } from '../domain/note.utils'

const STORAGE_KEY = 'sticky-notes-v1'

export function useLocalStorageNotes(notes: Note[], onHydrate: (notes: Note[]) => void) {
  const isHydratedRef = useRef(false)

  useEffect(() => {
    const rawValue = localStorage.getItem(STORAGE_KEY)
    if (rawValue) {
      try {
        const parsed = JSON.parse(rawValue) as Note[]
        if (Array.isArray(parsed)) {
          onHydrate(parsed)
        }
      } catch {
        localStorage.removeItem(STORAGE_KEY)
      }
    }

    isHydratedRef.current = true
  }, [onHydrate])

  useEffect(() => {
    if (!isHydratedRef.current) return

    localStorage.setItem(STORAGE_KEY, JSON.stringify(toSerializableNotes(notes)))
  }, [notes])
}
