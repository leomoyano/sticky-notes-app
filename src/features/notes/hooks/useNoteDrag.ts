import { useCallback, useRef } from 'react'
import type { PointerEvent, RefObject } from 'react'
import type { Rect } from '../domain/note.types'
import { clampPosition } from '../domain/note.utils'

type UseNoteDragParams = {
  noteId: string
  rect: Rect
  boardRef: RefObject<HTMLDivElement | null>
  onActivate: (id: string) => void
  onMove: (id: string, x: number, y: number) => void
}

export function useNoteDrag({ noteId, rect, boardRef, onActivate, onMove }: UseNoteDragParams) {
  const dragRef = useRef<{
    pointerId: number
    startClientX: number
    startClientY: number
    startX: number
    startY: number
    boardWidth: number
    boardHeight: number
  } | null>(null)
  const frameRef = useRef<number | null>(null)
  const latestPositionRef = useRef<{ x: number; y: number } | null>(null)

  const flushPosition = useCallback(() => {
    if (!latestPositionRef.current) return
    onMove(noteId, latestPositionRef.current.x, latestPositionRef.current.y)
    frameRef.current = null
  }, [noteId, onMove])

  const queuePosition = useCallback(
    (x: number, y: number) => {
      latestPositionRef.current = { x, y }

      if (frameRef.current) return
      frameRef.current = requestAnimationFrame(flushPosition)
    },
    [flushPosition],
  )

  const onPointerDown = useCallback(
    (event: PointerEvent<HTMLDivElement>) => {
      const board = boardRef.current
      if (!board) return

      onActivate(noteId)
      const boardRect = board.getBoundingClientRect()

      dragRef.current = {
        pointerId: event.pointerId,
        startClientX: event.clientX,
        startClientY: event.clientY,
        startX: rect.x,
        startY: rect.y,
        boardWidth: boardRect.width,
        boardHeight: boardRect.height,
      }

      event.currentTarget.setPointerCapture(event.pointerId)
    },
    [boardRef, noteId, onActivate, rect.x, rect.y],
  )

  const onPointerMove = useCallback(
    (event: PointerEvent<HTMLDivElement>) => {
      const drag = dragRef.current
      if (!drag || drag.pointerId !== event.pointerId) return

      const deltaX = event.clientX - drag.startClientX
      const deltaY = event.clientY - drag.startClientY

      const nextRect = {
        ...rect,
        x: drag.startX + deltaX,
        y: drag.startY + deltaY,
      }

      const clamped = clampPosition(nextRect, drag.boardWidth, drag.boardHeight)
      queuePosition(clamped.x, clamped.y)
    },
    [queuePosition, rect],
  )

  const endDrag = useCallback((pointerId: number, currentTarget: EventTarget & HTMLDivElement) => {
    if (dragRef.current?.pointerId !== pointerId) return

    dragRef.current = null
    latestPositionRef.current = null
    if (frameRef.current) {
      cancelAnimationFrame(frameRef.current)
      frameRef.current = null
    }
    currentTarget.releasePointerCapture(pointerId)
  }, [])

  const onPointerUp = useCallback(
    (event: PointerEvent<HTMLDivElement>) => {
      endDrag(event.pointerId, event.currentTarget)
    },
    [endDrag],
  )

  const onPointerCancel = useCallback(
    (event: PointerEvent<HTMLDivElement>) => {
      endDrag(event.pointerId, event.currentTarget)
    },
    [endDrag],
  )

  return {
    onPointerDown,
    onPointerMove,
    onPointerUp,
    onPointerCancel,
  }
}
