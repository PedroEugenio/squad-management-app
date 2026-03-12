import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import {
  getDrills,
  getDrill,
  createDrill,
  updateDrill,
  deleteDrill,
} from '@/lib/api/drills'
import type { Drill } from '@/lib/types'
import { toast } from 'sonner'

export function useDrills() {
  return useQuery({ queryKey: ['drills'], queryFn: getDrills })
}

export function useDrill(id: number) {
  return useQuery({ queryKey: ['drills', id], queryFn: () => getDrill(id) })
}

export function useCreateDrill() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (data: Omit<Drill, 'id'>) => createDrill(data),
    onSuccess: (newItem) => {
      qc.setQueryData<Drill[]>(['drills'], (old = []) => [newItem, ...old])
      toast.success('Drill created')
    },
  })
}

export function useUpdateDrill() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: Omit<Drill, 'id'> }) =>
      updateDrill(id, data),
    onSuccess: (updated) => {
      qc.setQueryData<Drill[]>(['drills'], (old = []) =>
        old.map((d) => (d.id === updated.id ? updated : d)),
      )
      qc.setQueryData(['drills', updated.id], updated)
      toast.success('Drill updated')
    },
  })
}

export function useDeleteDrill() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (id: number) => deleteDrill(id),
    onSuccess: (_, id) => {
      qc.setQueryData<Drill[]>(['drills'], (old = []) => old.filter((d) => d.id !== id))
      toast.success('Drill deleted')
    },
  })
}
