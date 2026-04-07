import { useState } from 'react'
import type { FormEvent } from 'react'
import { NOTE_LIMITS } from '../domain/note.constants'
import type { CreateNoteInput } from '../domain/note.types'

type CreateNoteFormProps = {
  onCreate: (input: CreateNoteInput) => void
}

type FormState = {
  x: string
  y: string
  width: string
  height: string
}

const initialFormState: FormState = {
  x: '24',
  y: '24',
  width: `${NOTE_LIMITS.defaultWidth}`,
  height: `${NOTE_LIMITS.defaultHeight}`,
}

export function CreateNoteForm({ onCreate }: CreateNoteFormProps) {
  const [form, setForm] = useState<FormState>(initialFormState)
  const [error, setError] = useState<string | null>(null)

  const onChangeField = (key: keyof FormState, value: string) => {
    setForm((current) => ({ ...current, [key]: value }))
  }

  const onSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    const x = Number(form.x)
    const y = Number(form.y)
    const width = Number(form.width)
    const height = Number(form.height)

    const hasInvalidValue = [x, y, width, height].some(
      (value) => Number.isNaN(value) || value < 0,
    )

    if (hasInvalidValue || width < NOTE_LIMITS.minWidth || height < NOTE_LIMITS.minHeight) {
      setError(
        `Use valid values. Min width: ${NOTE_LIMITS.minWidth}px, min height: ${NOTE_LIMITS.minHeight}px.`,
      )
      return
    }

    onCreate({ x, y, width, height })
    setError(null)
  }

  return (
    <form
      className="grid gap-3 rounded-xl border border-slate-200 bg-white p-4 shadow-sm md:grid-cols-5"
      onSubmit={onSubmit}
    >
      {(['x', 'y', 'width', 'height'] as const).map((field) => (
        <label key={field} htmlFor={`create-note-${field}`} className="flex flex-col gap-1 text-sm text-slate-700">
          <span className="font-medium uppercase tracking-wide text-slate-500">{field}</span>
          <input
            id={`create-note-${field}`}
            name={field}
            type="number"
            inputMode="numeric"
            autoComplete="off"
            min={field === 'width' ? NOTE_LIMITS.minWidth : field === 'height' ? NOTE_LIMITS.minHeight : 0}
            value={form[field]}
            onChange={(event) => onChangeField(field, event.target.value)}
            className="rounded-md border border-slate-300 px-2 py-1.5 outline-none ring-indigo-500/60 focus:ring-2"
          />
        </label>
      ))}

      <div className="flex items-end">
        <button
          type="submit"
          className="h-9 w-full rounded-md bg-slate-900 px-3 text-sm font-medium text-white hover:bg-slate-700 focus-visible:ring-2 focus-visible:ring-indigo-500/70 focus-visible:outline-none"
        >
          Create note
        </button>
      </div>

      {error ? (
        <p aria-live="polite" className="md:col-span-5 text-sm text-red-600">
          {error}
        </p>
      ) : null}
    </form>
  )
}
