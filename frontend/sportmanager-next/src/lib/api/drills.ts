import type { Drill } from '@/lib/types'
import { MOCK_DRILLS } from '@/lib/mock-data'
import { delay } from './utils'

export async function getDrills(): Promise<Drill[]> {
  await delay()
  return [...MOCK_DRILLS]
}

export async function getDrill(id: number): Promise<Drill | undefined> {
  await delay()
  return MOCK_DRILLS.find((d) => d.id === id)
}

export async function createDrill(data: Omit<Drill, 'id'>): Promise<Drill> {
  await delay()
  return { ...data, id: Date.now() }
}

export async function updateDrill(id: number, data: Omit<Drill, 'id'>): Promise<Drill> {
  await delay()
  return { ...data, id }
}

export async function deleteDrill(id: number): Promise<void> {
  await delay()
  void id
}
