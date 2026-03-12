'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Plus, Pencil, Trash2, Trophy, MapPin, Eye, MoreVertical } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
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
import { useMatches, useCreateMatch, useUpdateMatch, useDeleteMatch } from '@/lib/queries'
import type { Match, MatchResult, MatchVenue } from '@/lib/types'
import type { BadgeProps } from '@/components/ui/badge'
import { Skeleton } from '@/components/ui/skeleton'

const matchFormSchema = z.object({
  date: z.string().min(1, 'Date is required'),
  time: z.string().min(1, 'Time is required'),
  competition: z.string().min(1, 'Competition is required'),
  opponent: z.string().min(2, 'Opponent name is required'),
  venue: z.enum(['Home', 'Away', 'Neutral']),
  location: z.string(),
  notes: z.string(),
  hasResult: z.boolean(),
  goalsFor: z.number().nullable(),
  goalsAgainst: z.number().nullable(),
  result: z.enum(['Win', 'Draw', 'Loss', 'Upcoming']),
})

type MatchFormValues = z.infer<typeof matchFormSchema>

const RESULT_VARIANT: Record<MatchResult, BadgeProps['variant']> = {
  Win: 'default', Draw: 'secondary', Loss: 'destructive', Upcoming: 'outline',
}

const EMPTY_DEFAULTS: MatchFormValues = {
  date: '', time: '15:00', competition: 'Primeira Liga', opponent: '',
  venue: 'Home', location: '', goalsFor: null, goalsAgainst: null,
  result: 'Upcoming', notes: '', hasResult: false,
}

function formatDate(d: string) {
  if (!d) return '—'
  return new Date(d + 'T00:00:00').toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })
}

function ScoreBadge({ m }: { m: Match }) {
  if (m.result === 'Upcoming') return null
  return (
    <span className={`text-base font-bold tabular-nums ${m.result === 'Win' ? 'text-green-600' : m.result === 'Loss' ? 'text-red-500' : 'text-yellow-600'}`}>
      {m.goalsFor} – {m.goalsAgainst}
    </span>
  )
}

function MatchList({ matches, onEdit, onDelete, onPreview }: { matches: Match[]; onEdit: (m: Match) => void; onDelete: (id: number) => void; onPreview: (m: Match) => void }) {
  return (
    <div className="space-y-3">
      {matches.map((m) => (
        <div key={m.id} className="flex items-start justify-between gap-4 rounded-lg border p-4 hover:bg-muted/40 transition-colors cursor-pointer" onClick={() => onPreview(m)}>
          <div className="flex items-start gap-3">
            <div className="flex flex-col items-center justify-center h-10 w-10 rounded-lg bg-muted shrink-0">
              <Trophy className="h-4 w-4 text-muted-foreground" />
            </div>
            <div className="space-y-0.5">
              <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
                <p className="font-semibold text-sm">{m.opponent}</p>
                <ScoreBadge m={m} />
                <Badge variant={RESULT_VARIANT[m.result]}>{m.result}</Badge>
                <Badge variant="outline">{m.venue}</Badge>
              </div>
              <p className="text-xs text-muted-foreground">{formatDate(m.date)} · {m.time} · {m.competition}</p>
              {m.location && (
                <p className="text-xs text-muted-foreground flex items-center gap-1">
                  <MapPin className="h-3 w-3" /> {m.location}
                </p>
              )}
              {m.notes && <p className="text-xs text-muted-foreground mt-1 max-w-lg">{m.notes}</p>}
            </div>
          </div>
          <div className="shrink-0" onClick={(e) => e.stopPropagation()}>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon">
                  <MoreVertical className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => onEdit(m)}>
                  <Pencil className="h-4 w-4 mr-2" /> Edit
                </DropdownMenuItem>
                <DropdownMenuItem
                  className="text-destructive focus:text-destructive"
                  onClick={() => onDelete(m.id)}
                >
                  <Trash2 className="h-4 w-4 mr-2" /> Delete
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      ))}
    </div>
  )
}

export default function MatchesPage() {
  const router = useRouter()
  const { data: matches = [], isLoading } = useMatches()
  const createMatch = useCreateMatch()
  const updateMatch = useUpdateMatch()
  const deleteMatch = useDeleteMatch()

  const [open, setOpen] = useState(false)
  const [editing, setEditing] = useState<Match | null>(null)
  const [preview, setPreview] = useState<Match | null>(null)

  const { register, handleSubmit, reset, setValue, watch, formState: { errors } } = useForm<MatchFormValues>({
    resolver: zodResolver(matchFormSchema),
    defaultValues: EMPTY_DEFAULTS,
  })

  const hasResult = watch('hasResult')

  function openCreate() {
    setEditing(null)
    reset(EMPTY_DEFAULTS)
    setOpen(true)
  }

  function openEdit(m: Match) {
    setEditing(m)
    reset({
      date: m.date, time: m.time, competition: m.competition, opponent: m.opponent,
      venue: m.venue, location: m.location, notes: m.notes,
      hasResult: m.result !== 'Upcoming',
      goalsFor: m.goalsFor, goalsAgainst: m.goalsAgainst,
      result: m.result === 'Upcoming' ? 'Win' : m.result,
    })
    setOpen(true)
  }

  async function onSubmit(values: MatchFormValues) {
    const data = {
      date: values.date, time: values.time, competition: values.competition,
      opponent: values.opponent, venue: values.venue, location: values.location, notes: values.notes,
      goalsFor: values.hasResult ? values.goalsFor : null,
      goalsAgainst: values.hasResult ? values.goalsAgainst : null,
      result: (values.hasResult ? values.result : 'Upcoming') as MatchResult,
    }
    if (editing) { await updateMatch.mutateAsync({ id: editing.id, data }) }
    else { await createMatch.mutateAsync(data) }
    setOpen(false)
  }

  const isSaving = createMatch.isPending || updateMatch.isPending
  const upcoming = matches.filter((m) => m.result === 'Upcoming').sort((a, b) => a.date.localeCompare(b.date))
  const past = matches.filter((m) => m.result !== 'Upcoming').sort((a, b) => b.date.localeCompare(a.date))

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Matches</h1>
          <p className="text-muted-foreground">Fixtures, results and match notes</p>
        </div>
        <Button size="icon" className="rounded-full sm:hidden" onClick={openCreate}>
          <Plus className="h-5 w-5" />
        </Button>
        <Button className="hidden sm:flex" onClick={openCreate}>
          <Plus className="mr-2 h-4 w-4" /> Add Match
        </Button>
      </div>

      {isLoading ? (
        <Card>
          <CardContent className="pt-6">
            <div className="space-y-3">
              {Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="flex items-center gap-3 rounded-lg border p-4">
                  <Skeleton className="h-10 w-10 rounded-lg shrink-0" />
                  <div className="flex-1 space-y-1.5">
                    <Skeleton className="h-4 w-48" />
                    <Skeleton className="h-3 w-36" />
                  </div>
                  <Skeleton className="h-5 w-16 rounded-full" />
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      ) : (
        <>
          {upcoming.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle>Upcoming <Badge variant="outline" className="ml-2">{upcoming.length}</Badge></CardTitle>
              </CardHeader>
              <CardContent>
                <MatchList matches={upcoming} onEdit={openEdit} onDelete={(id) => deleteMatch.mutate(id)} onPreview={setPreview} />
              </CardContent>
            </Card>
          )}
          <Card>
            <CardHeader>
              <CardTitle>Results <Badge className="ml-2">{past.length}</Badge></CardTitle>
            </CardHeader>
            <CardContent>
              <MatchList matches={past} onEdit={openEdit} onDelete={(id) => deleteMatch.mutate(id)} onPreview={setPreview} />
            </CardContent>
          </Card>
        </>
      )}

      {/* Create / Edit dialog */}
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>{editing ? 'Edit Match' : 'Add Match'}</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit(onSubmit)} className="grid gap-4 py-2">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label htmlFor="date">Date</Label>
                <Input id="date" type="date" {...register('date')} />
                {errors.date && <p className="text-sm text-destructive">{errors.date.message}</p>}
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="time">Kick-off Time</Label>
                <Input id="time" type="time" {...register('time')} />
              </div>
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="competition">Competition</Label>
              <Input id="competition" placeholder="e.g. Primeira Liga" {...register('competition')} />
              {errors.competition && <p className="text-sm text-destructive">{errors.competition.message}</p>}
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label htmlFor="opponent">Opponent</Label>
                <Input id="opponent" placeholder="e.g. FC Porto" {...register('opponent')} />
                {errors.opponent && <p className="text-sm text-destructive">{errors.opponent.message}</p>}
              </div>
              <div className="space-y-1.5">
                <Label>Venue</Label>
                <Select value={watch('venue')} onValueChange={(v) => setValue('venue', v as MatchVenue)}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Home">Home</SelectItem>
                    <SelectItem value="Away">Away</SelectItem>
                    <SelectItem value="Neutral">Neutral</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="location">Stadium / Location</Label>
              <Input id="location" placeholder="e.g. Estádio do Dragão" {...register('location')} />
            </div>
            <div className="flex items-center gap-2">
              <input id="has-result" type="checkbox" checked={hasResult} onChange={(e) => setValue('hasResult', e.target.checked)} className="h-4 w-4 accent-primary" />
              <Label htmlFor="has-result" className="cursor-pointer">Match has been played — enter result</Label>
            </div>
            {hasResult && (
              <div className="grid grid-cols-3 gap-4 items-end">
                <div className="space-y-1.5">
                  <Label htmlFor="goalsFor">Goals For</Label>
                  <Input id="goalsFor" type="number" min={0} {...register('goalsFor', { valueAsNumber: true })} />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="goalsAgainst">Goals Against</Label>
                  <Input id="goalsAgainst" type="number" min={0} {...register('goalsAgainst', { valueAsNumber: true })} />
                </div>
                <div className="space-y-1.5">
                  <Label>Result</Label>
                  <Select value={watch('result')} onValueChange={(v) => setValue('result', v as MatchResult)}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Win">Win</SelectItem>
                      <SelectItem value="Draw">Draw</SelectItem>
                      <SelectItem value="Loss">Loss</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            )}
            <div className="space-y-1.5">
              <Label htmlFor="notes">Notes</Label>
              <Textarea id="notes" placeholder="Match notes, key events, observations..." rows={3} {...register('notes')} />
            </div>
            <DialogFooter>
              <DialogClose asChild>
                <Button type="button" variant="outline">Cancel</Button>
              </DialogClose>
              <Button type="submit" disabled={isSaving}>
                {isSaving ? 'Saving…' : (editing ? 'Save Changes' : 'Add Match')}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Preview dialog */}
      <Dialog open={!!preview} onOpenChange={(v) => !v && setPreview(null)}>
        {preview && (
          <DialogContent className="sm:max-w-sm">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <Trophy className="h-4 w-4 text-muted-foreground" />
                {preview.opponent}
              </DialogTitle>
            </DialogHeader>
            <div className="space-y-3 py-1">
              <div className="grid grid-cols-2 gap-2 text-sm">
                <div className="space-y-0.5">
                  <p className="text-xs text-muted-foreground uppercase tracking-wider">Date</p>
                  <p className="font-medium">{formatDate(preview.date)} · {preview.time}</p>
                </div>
                <div className="space-y-0.5">
                  <p className="text-xs text-muted-foreground uppercase tracking-wider">Result</p>
                  <div className="flex items-center gap-1.5">
                    <ScoreBadge m={preview} />
                    <Badge variant={RESULT_VARIANT[preview.result]}>{preview.result}</Badge>
                  </div>
                </div>
                <div className="space-y-0.5">
                  <p className="text-xs text-muted-foreground uppercase tracking-wider">Competition</p>
                  <p className="font-medium">{preview.competition}</p>
                </div>
                <div className="space-y-0.5">
                  <p className="text-xs text-muted-foreground uppercase tracking-wider">Venue</p>
                  <Badge variant="outline">{preview.venue}</Badge>
                </div>
                {preview.location && (
                  <div className="space-y-0.5 col-span-2">
                    <p className="text-xs text-muted-foreground uppercase tracking-wider">Location</p>
                    <p className="font-medium flex items-center gap-1"><MapPin className="h-3 w-3" />{preview.location}</p>
                  </div>
                )}
              </div>
              {preview.notes && <div className="rounded-md bg-muted p-2.5 text-xs text-muted-foreground">{preview.notes}</div>}
            </div>
            <DialogFooter className="flex-col sm:flex-row gap-2">
              <DialogClose asChild>
                <Button variant="outline" className="flex-1">Close</Button>
              </DialogClose>
              <Button variant="outline" className="flex-1" onClick={() => { openEdit(preview); setPreview(null) }}>
                <Pencil className="h-3.5 w-3.5 mr-1" /> Edit
              </Button>
              <Button className="flex-1" onClick={() => router.push(`/matches/${preview.id}`)}>
                <Eye className="h-3.5 w-3.5 mr-1" /> View Report
              </Button>
            </DialogFooter>
          </DialogContent>
        )}
      </Dialog>
    </div>
  )
}
