/**
 * TanStack Query hooks — barrel file.
 * Import from here to access all query hooks, or import directly from
 * the individual entity file (e.g. '@/lib/queries/players').
 *
 * Query key conventions:
 *   ['players']       → list   |  ['players', id]   → single item
 *   ['practices']     → list   |  ['practices', id] → single item
 *   ['matches']       → list   |  ['matches', id]   → single item
 *   ['reports']       → list   |  ['reports', id]   → single item
 *   ['staff']         → list   |  ['staff', id]     → single item
 *   ['drills']        → list   |  ['drills', id]    → single item
 */

export * from './players'
export * from './practices'
export * from './matches'
export * from './reports'
export * from './staff'
export * from './drills'
