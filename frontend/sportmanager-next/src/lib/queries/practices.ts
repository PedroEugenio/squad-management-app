import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import {
  getPractices,
  getPractice,
  createPractice,
  updatePractice,
  deletePractice,
} from '@/lib/api/practices'
import type { Practice } from '@/lib/types'
import { toast } from 'sonner'

export function usePractices() {
  return useQuery({ queryKey: ['practices'], queryFn: getPractices })
}

export function usePractice(id: number) {
  return useQuery({ queryKey: ['practices', id], queryFn: () => getPractice(id) })
}

export function useCreatePractice() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (data: Omit<Practice, 'id'>) => createPractice(data),
    onSuccess: (newItem) => {
      qc.setQueryData<Practice[]>(['practices'], (old = []) => [newItem, ...old])
      toast.success('Session created')
    },
  })
}

export function useUpdatePractice() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: Omit<Practice, 'id'> }) =>
      updatePractice(id, data),
    onSuccess: (updated) => {
      qc.setQueryData<Practice[]>(['practices'], (old = []) =>
        old.map((p) => (p.id === updated.id ? updated : p)),
      )
      qc.setQueryData(['practices', updated.id], updated)
      toast.success('Session updated')
    },
  })
}

export function useDeletePractice() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (id: number) => deletePractice(id),
    onSuccess: (_, id) => {
      qc.setQueryData<Practice[]>(['practices'], (old = []) => old.filter((p) => p.id !== id))
      toast.success('Session deleted')
    },
  })
}
