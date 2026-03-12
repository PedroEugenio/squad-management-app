import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import {
  getMatches,
  getMatch,
  createMatch,
  updateMatch,
  deleteMatch,
} from '@/lib/api/matches'
import type { Match } from '@/lib/types'
import { toast } from 'sonner'

export function useMatches() {
  return useQuery({ queryKey: ['matches'], queryFn: getMatches })
}

export function useMatch(id: number) {
  return useQuery({ queryKey: ['matches', id], queryFn: () => getMatch(id) })
}

export function useCreateMatch() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (data: Omit<Match, 'id'>) => createMatch(data),
    onSuccess: (newItem) => {
      qc.setQueryData<Match[]>(['matches'], (old = []) => [newItem, ...old])
      toast.success('Match added')
    },
  })
}

export function useUpdateMatch() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: Omit<Match, 'id'> }) =>
      updateMatch(id, data),
    onSuccess: (updated) => {
      qc.setQueryData<Match[]>(['matches'], (old = []) =>
        old.map((m) => (m.id === updated.id ? updated : m)),
      )
      qc.setQueryData(['matches', updated.id], updated)
      toast.success('Match updated')
    },
  })
}

export function useDeleteMatch() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (id: number) => deleteMatch(id),
    onSuccess: (_, id) => {
      qc.setQueryData<Match[]>(['matches'], (old = []) => old.filter((m) => m.id !== id))
      toast.success('Match removed')
    },
  })
}
