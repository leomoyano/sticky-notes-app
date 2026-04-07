import { useCallback, useRef } from 'react'
import type { PointerEvent, RefObject } from 'react'
import { NOTE_LIMITS } from '../domain/note.constants'
import type { Rect } from '../domain/note.types'
import { clampSize } from '../domain/note.utils'

type UseNoteResizeParams = {
  noteId: string
  rect: Rect
  boardRef: RefObject<HTMLDivElement | null>
  onActivate: (id: string) => void
  onResize: (id: string, width: number, height: number) => void
}

export function useNoteResize({
  noteId,
  rect,
  boardRef,
  onActivate,
  onResize,
}: UseNoteResizeParams) {
  const resizeRef = useRef<{
    pointerId: number
    startClientX: number
    startClientY: number
    startWidth: number
    startHeight: number
    boardWidth: number
    boardHeight: number
  } | null>(null)

  const frameRef = useRef<number | null>(null)
  const latestSizeRef = useRef<{ width: number; height: number } | null>(null)

  const flushSize = useCallback(() => {
    if (!latestSizeRef.current) return
    onResize(noteId, latestSizeRef.current.width, latestSizeRef.current.height)
    frameRef.current = null
  }, [noteId, onResize])

  const queueSize = useCallback(
    (width: number, height: number) => {
      latestSizeRef.current = { width, height }

      if (frameRef.current) return
      frameRef.current = requestAnimationFrame(flushSize)
    },
    [flushSize],
  )

  const onPointerDown = useCallback(
    (event: PointerEvent<HTMLButtonElement>) => {
      event.stopPropagation()

      const board = boardRef.current
      if (!board) return

      onActivate(noteId)
      const boardRect = board.getBoundingClientRect()

      resizeRef.current = {
        pointerId: event.pointerId,
        startClientX: event.clientX,
        startClientY: event.clientY,
        startWidth: rect.width,
        startHeight: rect.height,
        boardWidth: boardRect.width,
        boardHeight: boardRect.height,
      }

      event.currentTarget.setPointerCapture(event.pointerId)
    },
    [boardRef, noteId, onActivate, rect.height, rect.width],
  )

  const onPointerMove = useCallback(
    (event: PointerEvent<HTMLButtonElement>) => {
      const resize = resizeRef.current
      if (!resize || resize.pointerId !== event.pointerId) return

      const deltaX = event.clientX - resize.startClientX
      const deltaY = event.clientY - resize.startClientY

      const nextRect = {
        ...rect,
        width: resize.startWidth + deltaX,
        height: resize.startHeight + deltaY,
      }

      const clamped = clampSize(
        nextRect,
        resize.boardWidth,
        resize.boardHeight,
        NOTE_LIMITS.minWidth,
        NOTE_LIMITS.minHeight,
      )

      queueSize(clamped.width, clamped.height)
    },
    [queueSize, rect],
  )

  const endResize = useCallback(
    (pointerId: number, currentTarget: EventTarget & HTMLButtonElement) => {
      if (resizeRef.current?.pointerId !== pointerId) return

      resizeRef.current = null
      latestSizeRef.current = null
      if (frameRef.current) {
        cancelAnimationFrame(frameRef.current)
        frameRef.current = null
      }
      currentTarget.releasePointerCapture(pointerId)
    },
    [],
  )

  const onPointerUp = useCallback(
    (event: PointerEvent<HTMLButtonElement>) => {
      endResize(event.pointerId, event.currentTarget)
    },
    [endResize],
  )

  const onPointerCancel = useCallback(
    (event: PointerEvent<HTMLButtonElement>) => {
      endResize(event.pointerId, event.currentTarget)
    },
    [endResize],
  )

  return {
    onPointerDown,
    onPointerMove,
    onPointerUp,
    onPointerCancel,
  }
}
