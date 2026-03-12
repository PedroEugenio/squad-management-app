'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Plus, Pencil, Trash2, Eye, MoreVertical } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Dialog, DialogContent, DialogHeader, DialogTitle,
  DialogFooter, DialogClose,
} from '@/components/ui/dialog'
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from '@/components/ui/select'
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { usePlayers, useCreatePlayer, useUpdatePlayer, useDeletePlayer } from '@/lib/queries'
import { playerSchema, type PlayerFormValues } from '@/schemas/player'
import type { Player, PlayerPosition } from '@/lib/types'
import type { BadgeProps } from '@/components/ui/badge'
import { Skeleton } from '@/components/ui/skeleton'

const STATUS_VARIANT: Record<string, BadgeProps['variant']> = {
  Fit: 'default', Injured: 'destructive', Suspended: 'secondary', Doubtful: 'outline',
}

const POSITIONS = [
  'Goalkeeper', 'Right Back', 'Left Back', 'Centre Back',
  'Defensive Mid', 'Central Mid', 'Attacking Mid',
  'Right Winger', 'Left Winger', 'Striker',
]

const EMPTY_DEFAULTS: PlayerFormValues = {
  number: 0, name: '', position: 'Striker', nationality: '', age: 18, status: 'Fit',
}

export default function SquadPage() {
  const router = useRouter()
  const { data: players = [], isLoading } = usePlayers()
  const createPlayer = useCreatePlayer()
  const updatePlayer = useUpdatePlayer()
  const deletePlayer = useDeletePlayer()

  const [open, setOpen] = useState(false)
  const [editing, setEditing] = useState<Player | null>(null)
  const [preview, setPreview] = useState<Player | null>(null)

  const { register, handleSubmit, reset, setValue, watch, formState: { errors } } = useForm<PlayerFormValues>({
    resolver: zodResolver(playerSchema),
    defaultValues: EMPTY_DEFAULTS,
  })

  function openCreate() {
    setEditing(null)
    reset(EMPTY_DEFAULTS)
    setOpen(true)
  }

  function openEdit(p: Player) {
    setEditing(p)
    reset({ number: p.number, name: p.name, position: p.position, nationality: p.nationality, age: p.age, status: p.status })
    setOpen(true)
  }

  async function onSubmit(values: PlayerFormValues) {
    if (editing) {
      await updatePlayer.mutateAsync({ id: editing.id, data: values })
    } else {
      await createPlayer.mutateAsync(values)
    }
    setOpen(false)
  }

  const isSaving = createPlayer.isPending || updatePlayer.isPending

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Squad</h1>
          <p className="text-muted-foreground">Manage your registered players</p>
        </div>
        <Button size="icon" className="rounded-full sm:hidden" onClick={openCreate}>
          <Plus className="h-5 w-5" />
        </Button>
        <Button className="hidden sm:flex" onClick={openCreate}>
          <Plus className="mr-2 h-4 w-4" /> Add Player
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Players <Badge className="ml-2">{players.length}</Badge></CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b text-muted-foreground text-xs uppercase tracking-wider">
                    <th className="text-left py-2 px-3 w-10">#</th>
                    <th className="text-left py-2 px-3">Name</th>
                    <th className="text-left py-2 px-3 hidden md:table-cell">Position</th>
                    <th className="text-left py-2 px-3 hidden lg:table-cell">Nationality</th>
                    <th className="text-left py-2 px-3 hidden lg:table-cell">Age</th>
                    <th className="text-left py-2 px-3">Status</th>
                    <th className="py-2 px-3"></th>
                  </tr>
                </thead>
                <tbody>
                  {Array.from({ length: 8 }).map((_, i) => (
                    <tr key={i} className="border-b last:border-0">
                      <td className="py-2.5 px-3"><Skeleton className="h-4 w-6" /></td>
                      <td className="py-2.5 px-3"><Skeleton className="h-4 w-36" /></td>
                      <td className="py-2.5 px-3 hidden md:table-cell"><Skeleton className="h-4 w-28" /></td>
                      <td className="py-2.5 px-3 hidden lg:table-cell"><Skeleton className="h-4 w-20" /></td>
                      <td className="py-2.5 px-3 hidden lg:table-cell"><Skeleton className="h-4 w-8" /></td>
                      <td className="py-2.5 px-3"><Skeleton className="h-5 w-14 rounded-full" /></td>
                      <td className="py-2.5 px-3"><Skeleton className="h-7 w-7 rounded-md" /></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b text-muted-foreground text-xs uppercase tracking-wider">
                    <th className="text-left py-2 px-3 w-10">#</th>
                    <th className="text-left py-2 px-3">Name</th>
                    <th className="text-left py-2 px-3 hidden md:table-cell">Position</th>
                    <th className="text-left py-2 px-3 hidden lg:table-cell">Nationality</th>
                    <th className="text-left py-2 px-3 hidden lg:table-cell">Age</th>
                    <th className="text-left py-2 px-3">Status</th>
                    <th className="py-2 px-3"></th>
                  </tr>
                </thead>
                <tbody>
                  {[...players].sort((a, b) => a.number - b.number).map((p) => (
                    <tr key={p.id} className="border-b last:border-0 hover:bg-muted/40 transition-colors cursor-pointer" onClick={() => setPreview(p)}>
                      <td className="py-2.5 px-3 font-bold text-muted-foreground">{p.number}</td>
                      <td className="py-2.5 px-3 font-medium">{p.name}</td>
                      <td className="py-2.5 px-3 hidden md:table-cell text-muted-foreground">{p.position}</td>
                      <td className="py-2.5 px-3 hidden lg:table-cell text-muted-foreground">{p.nationality}</td>
                      <td className="py-2.5 px-3 hidden lg:table-cell text-muted-foreground">{p.age}</td>
                      <td className="py-2.5 px-3">
                        <Badge variant={STATUS_VARIANT[p.status]}>{p.status}</Badge>
                      </td>
                      <td className="py-2.5 px-3 text-right" onClick={(e) => e.stopPropagation()}>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon">
                              <MoreVertical className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem onClick={() => { router.push(`/squad/${p.id}`) }}>
                              <Eye className="h-4 w-4 mr-2" /> View Profile
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => openEdit(p)}>
                              <Pencil className="h-4 w-4 mr-2" /> Edit
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              className="text-destructive focus:text-destructive"
                              onClick={() => deletePlayer.mutate(p.id)}
                            >
                              <Trash2 className="h-4 w-4 mr-2" /> Delete
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Preview */}
      <Dialog open={!!preview} onOpenChange={(v) => !v && setPreview(null)}>
        {preview && (
          <DialogContent className="sm:max-w-sm">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <span className="text-2xl font-black text-muted-foreground w-8 text-center">#{preview.number}</span>
                {preview.name}
              </DialogTitle>
            </DialogHeader>
            <div className="space-y-3 py-1">
              <div className="grid grid-cols-2 gap-2 text-sm">
                <div className="space-y-0.5">
                  <p className="text-xs text-muted-foreground uppercase tracking-wider">Position</p>
                  <p className="font-medium">{preview.position}</p>
                </div>
                <div className="space-y-0.5">
                  <p className="text-xs text-muted-foreground uppercase tracking-wider">Age</p>
                  <p className="font-medium">{preview.age}</p>
                </div>
                <div className="space-y-0.5">
                  <p className="text-xs text-muted-foreground uppercase tracking-wider">Nationality</p>
                  <p className="font-medium">{preview.nationality}</p>
                </div>
                <div className="space-y-0.5">
                  <p className="text-xs text-muted-foreground uppercase tracking-wider">Status</p>
                  <Badge variant={STATUS_VARIANT[preview.status]}>{preview.status}</Badge>
                </div>
              </div>
            </div>
            <DialogFooter className="flex-col sm:flex-row gap-2">
              <DialogClose asChild>
                <Button variant="outline" className="flex-1">Close</Button>
              </DialogClose>
              <Button variant="outline" className="flex-1" onClick={() => { openEdit(preview); setPreview(null) }}>
                <Pencil className="h-3.5 w-3.5 mr-1" /> Edit
              </Button>
              <Button className="flex-1" onClick={() => router.push(`/squad/${preview.id}`)}>
                <Eye className="h-3.5 w-3.5 mr-1" /> View Profile
              </Button>
            </DialogFooter>
          </DialogContent>
        )}
      </Dialog>

      {/* Create / Edit */}
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>{editing ? 'Edit Player' : 'Add Player'}</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit(onSubmit)} className="grid gap-4 py-2">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label htmlFor="number">Squad Number</Label>
                <Input id="number" type="number" placeholder="e.g. 9" {...register('number', { valueAsNumber: true })} />
                {errors.number && <p className="text-sm text-destructive">{errors.number.message}</p>}
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="age">Age</Label>
                <Input id="age" type="number" placeholder="e.g. 24" {...register('age', { valueAsNumber: true })} />
                {errors.age && <p className="text-sm text-destructive">{errors.age.message}</p>}
              </div>
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="name">Full Name</Label>
              <Input id="name" placeholder="e.g. Paulo Neves" {...register('name')} />
              {errors.name && <p className="text-sm text-destructive">{errors.name.message}</p>}
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="nationality">Nationality</Label>
              <Input id="nationality" placeholder="e.g. 🇵🇹 Portugal" {...register('nationality')} />
              {errors.nationality && <p className="text-sm text-destructive">{errors.nationality.message}</p>}
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label>Position</Label>
                <Select value={watch('position')} onValueChange={(v) => setValue('position', v as PlayerPosition)}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {POSITIONS.map((pos) => <SelectItem key={pos} value={pos}>{pos}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-1.5">
                <Label>Status</Label>
                <Select value={watch('status')} onValueChange={(v) => setValue('status', v as PlayerFormValues['status'])}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Fit">Fit</SelectItem>
                    <SelectItem value="Injured">Injured</SelectItem>
                    <SelectItem value="Suspended">Suspended</SelectItem>
                    <SelectItem value="Doubtful">Doubtful</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <DialogFooter>
              <DialogClose asChild>
                <Button type="button" variant="outline">Cancel</Button>
              </DialogClose>
              <Button type="submit" disabled={isSaving}>
                {isSaving ? 'Saving…' : (editing ? 'Save Changes' : 'Add Player')}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  )
}
