/**
 * API service layer — barrel file.
 * Import from here to access all entity APIs, or import directly from
 * the individual entity file (e.g. '@/lib/api/players').
 *
 * To connect a real API: replace the body of each function in the entity
 * files with a fetch() call to your backend endpoint and remove the mock
 * import.
 *
 * Example real implementation:
 *   export async function getPlayers() {
 *     const res = await fetch(`${API_BASE}/players`, { cache: 'no-store' })
 *     if (!res.ok) throw new Error('Failed to fetch players')
 *     return res.json() as Promise<Player[]>
 *   }
 */

export * from './players'
export * from './practices'
export * from './matches'
export * from './reports'
export * from './staff'
export * from './drills'
export * from './reports'
export * from './staff'
