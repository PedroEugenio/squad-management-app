import type { Player } from '@/lib/types'
import { MOCK_PLAYERS } from '@/lib/mock-data'
import { delay } from './utils'

export async function getPlayers(): Promise<Player[]> {
  await delay()
  return [...MOCK_PLAYERS]
}

export async function getPlayer(id: number): Promise<Player | undefined> {
  await delay()
  return MOCK_PLAYERS.find((p) => p.id === id)
}

export async function createPlayer(data: Omit<Player, 'id'>): Promise<Player> {
  await delay()
  return { ...data, id: Date.now() }
}

export async function updatePlayer(id: number, data: Omit<Player, 'id'>): Promise<Player> {
  await delay()
  return { ...data, id }
}

export async function deletePlayer(id: number): Promise<void> {
  await delay()
  void id
}
