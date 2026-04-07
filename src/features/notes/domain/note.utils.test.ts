import { describe, expect, it } from 'vitest'
import { clamp, clampPosition, clampSize } from './note.utils'

describe('note.utils', () => {
  it('clamp keeps value within min and max range', () => {
    expect(clamp(8, 0, 10)).toBe(8)
    expect(clamp(-4, 0, 10)).toBe(0)
    expect(clamp(20, 0, 10)).toBe(10)
    expect(clamp(0, 0, 10)).toBe(0)
    expect(clamp(10, 0, 10)).toBe(10)
  })

  it('clampPosition keeps note inside board bounds', () => {
    const result = clampPosition(
      {
        x: 400,
        y: -20,
        width: 120,
        height: 100,
      },
      450,
      300,
    )

    expect(result).toEqual({ x: 330, y: 0 })
  })

  it('clampSize enforces min dimensions and available board area', () => {
    const result = clampSize(
      {
        x: 380,
        y: 220,
        width: 20,
        height: 400,
      },
      500,
      300,
      120,
      100,
    )

    expect(result).toEqual({ width: 120, height: 100 })
  })

  it('clampPosition preserves already valid coordinates', () => {
    const result = clampPosition(
      {
        x: 100,
        y: 120,
        width: 150,
        height: 120,
      },
      600,
      500,
    )

    expect(result).toEqual({ x: 100, y: 120 })
  })

  it('clampSize preserves dimensions when already within constraints', () => {
    const result = clampSize(
      {
        x: 50,
        y: 40,
        width: 220,
        height: 180,
      },
      700,
      500,
      120,
      100,
    )

    expect(result).toEqual({ width: 220, height: 180 })
  })
})
