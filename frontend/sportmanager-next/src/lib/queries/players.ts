import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { getPlayers, getPlayer, createPlayer, updatePlayer, deletePlayer } from '@/lib/api/players'
import type { Player } from '@/lib/types'
import { toast } from 'sonner'

export function usePlayers() {
  return useQuery({ queryKey: ['players'], queryFn: getPlayers })
}

export function usePlayer(id: number) {
  return useQuery({ queryKey: ['players', id], queryFn: () => getPlayer(id) })
}

export function useCreatePlayer() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (data: Omit<Player, 'id'>) => createPlayer(data),
    onSuccess: (newPlayer) => {
      qc.setQueryData<Player[]>(['players'], (old = []) => [...old, newPlayer])
      toast.success('Player added')
    },
  })
}

export function useUpdatePlayer() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: Omit<Player, 'id'> }) =>
      updatePlayer(id, data),
    onSuccess: (updated) => {
      qc.setQueryData<Player[]>(['players'], (old = []) =>
        old.map((p) => (p.id === updated.id ? updated : p)),
      )
      qc.setQueryData(['players', updated.id], updated)
      toast.success('Player updated')
    },
  })
}

export function useDeletePlayer() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (id: number) => deletePlayer(id),
    onSuccess: (_, id) => {
      qc.setQueryData<Player[]>(['players'], (old = []) => old.filter((p) => p.id !== id))
      toast.success('Player removed')
    },
  })
}
