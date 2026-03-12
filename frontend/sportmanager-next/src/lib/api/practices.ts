import type { Practice } from '@/lib/types'
import { MOCK_PRACTICES } from '@/lib/mock-data'
import { delay } from './utils'

export async function getPractices(): Promise<Practice[]> {
  await delay()
  return [...MOCK_PRACTICES]
}

export async function getPractice(id: number): Promise<Practice | undefined> {
  await delay()
  return MOCK_PRACTICES.find((p) => p.id === id)
}

export async function createPractice(data: Omit<Practice, 'id'>): Promise<Practice> {
  await delay()
  return { ...data, id: Date.now() }
}

export async function updatePractice(id: number, data: Omit<Practice, 'id'>): Promise<Practice> {
  await delay()
  return { ...data, id }
}

export async function deletePractice(id: number): Promise<void> {
  await delay()
  void id
}
