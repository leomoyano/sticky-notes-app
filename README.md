# Sticky Notes SPA (React + TypeScript)

Desktop-first sticky notes board built for a frontend take-home challenge.

## Implemented Features

- ✅ Create a note with explicit `x`, `y`, `width`, and `height`
- ✅ Move a note by dragging
- ✅ Resize a note by dragging a resize handle
- ✅ Inline text editing
- ✅ Persistence via `localStorage`

## Tech Stack

- React 19 + TypeScript
- Vite
- Tailwind CSS v4
- Pointer Events API (no drag-and-drop library)

## Run Locally

```bash
npm install
npm run dev
```

## Architecture Summary

The app uses a lightweight feature-first structure focused on one `notes` feature.

- `domain/`: typed entities and geometry helpers (`clampPosition`, `clampSize`)
- `state/`: typed reducer and action dispatchers
- `hooks/`: interaction hooks (`useNoteDrag`, `useNoteResize`) and persistence (`useLocalStorageNotes`)
- `components/`: board, note card, resize handle, create form

## Architecture Description

This single-page application is organized with a lightweight feature-first structure centered on `features/notes`, which keeps the scope small and easy to reason about during a timeboxed take-home. Domain types and geometry constraints are isolated from UI rendering, so note behavior remains predictable and statically typed. The state layer uses a typed reducer with explicit action unions (`create`, `move`, `resize`, `set-active`, `hydrate`) to make transitions auditable and straightforward to discuss in an interview.

Drag and resize interactions are implemented with the Pointer Events API and pointer capture, without external drag-and-drop libraries. High-frequency pointer data is handled through refs and animation-frame scheduling to avoid unnecessary rerenders while preserving responsiveness. Usability constraints (minimum note size, board bounds clamping, active note focus, and keyboard-visible focus states) are treated as first-class behavior rather than cosmetic details.

The delivered scope prioritizes the required core features for a 3-4 hour window: creating notes at explicit position/size, dragging to move, and dragging to resize. Bonus features with high value and low risk were added: inline text editing, bring-to-front behavior via z-index management, and localStorage persistence. The interface is desktop-first with a 1024px layout target, and the implementation is intended for the latest Chrome, Firefox, and Edge versions as requested.

### Core Decisions

1. **Typed reducer for persistent state**
   - predictable state transitions
   - clear action model for interview explanation

2. **Pointer events + pointer capture**
   - robust drag/resize behavior
   - no external DnD dependency

3. **Transient interaction data in refs**
   - avoids state updates on every pointer tick
   - helps reduce unnecessary rerenders

4. **Geometry constraints centralized in pure helpers**
   - min size enforcement
   - board bounds clamping

## Tradeoffs (Intentional)

- Did not implement trash-zone deletion to keep delivery risk low for timebox.
- Focused on high-quality core interactions over additional feature count.
- Kept architecture simple and explainable, avoiding overengineering.
