import type { Match } from '@/lib/types'
import { MOCK_MATCHES } from '@/lib/mock-data'
import { delay } from './utils'

export async function getMatches(): Promise<Match[]> {
  await delay()
  return [...MOCK_MATCHES]
}

export async function getMatch(id: number): Promise<Match | undefined> {
  await delay()
  return MOCK_MATCHES.find((m) => m.id === id)
}

export async function createMatch(data: Omit<Match, 'id'>): Promise<Match> {
  await delay()
  return { ...data, id: Date.now() }
}

export async function updateMatch(id: number, data: Omit<Match, 'id'>): Promise<Match> {
  await delay()
  return { ...data, id }
}

export async function deleteMatch(id: number): Promise<void> {
  await delay()
  void id
}
