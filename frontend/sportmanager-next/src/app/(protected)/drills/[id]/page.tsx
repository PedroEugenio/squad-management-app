'use client'

import { useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import {
  ArrowLeft,
  Clock,
  Users,
  Maximize2,
  Youtube,
  Image as ImageIcon,
  BookOpen,
  CalendarDays,
  CheckCircle2,
} from 'lucide-react'

import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog'

import { useDrill, usePractices, useUpdatePractice } from '@/lib/queries'
import type { Practice } from '@/lib/types'
import { Skeleton } from '@/components/ui/skeleton'

// ─── Level colour map ──────────────────────────────────────────────────────────
const LEVEL_VARIANT: Record<string, 'default' | 'secondary' | 'outline' | 'destructive'> = {
  Beginner:     'outline',
  Intermediate: 'secondary',
  Advanced:     'default',
  Elite:        'destructive',
}

const CATEGORY_COLOUR: Record<string, string> = {
  Tactical:    'bg-blue-500/10 text-blue-700 dark:text-blue-300 border-blue-300',
  Technical:   'bg-green-500/10 text-green-700 dark:text-green-300 border-green-300',
  Physical:    'bg-orange-500/10 text-orange-700 dark:text-orange-300 border-orange-300',
  'Warm-up':   'bg-yellow-500/10 text-yellow-700 dark:text-yellow-300 border-yellow-300',
  Goalkeeping: 'bg-purple-500/10 text-purple-700 dark:text-purple-300 border-purple-300',
}

function formatDate(d: string) {
  if (!d) return '—'
  return new Date(d + 'T00:00:00').toLocaleDateString('en-GB', {
    day: 'numeric', month: 'short', year: 'numeric',
  })
}

// ─── Add-to-Practice Dialog ────────────────────────────────────────────────────
function AddToPracticeDialog({
  open,
  drillId,
  practices,
  onClose,
}: {
  open: boolean
  drillId: number
  practices: Practice[]
  onClose: () => void
}) {
  const update = useUpdatePractice()
  const [selected, setSelected] = useState<Set<number>>(
    () => new Set(practices.filter((p) => p.drillIds?.includes(drillId)).map((p) => p.id)),
  )

  function toggle(id: number) {
    setSelected((prev) => {
      const next = new Set(prev)
      if (next.has(id)) next.delete(id)
      else next.add(id)
      return next
    })
  }

  async function save() {
    // For each practice, reconcile drillIds
    await Promise.all(
      practices.map((p) => {
        const had      = p.drillIds?.includes(drillId) ?? false
        const nowHas   = selected.has(p.id)
        if (had === nowHas) return null
        const drillIds = nowHas
          ? [...(p.drillIds ?? []), drillId]
          : (p.drillIds ?? []).filter((id) => id !== drillId)
        return update.mutateAsync({ id: p.id, data: { ...p, drillIds } })
      }),
    )
    onClose()
  }

  return (
    <Dialog open={open} onOpenChange={(v) => { if (!v) onClose() }}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Add to Practice</DialogTitle>
        </DialogHeader>

        <div className="space-y-1 max-h-72 overflow-y-auto">
          {practices.length === 0 && (
            <p className="text-sm text-muted-foreground py-4 text-center">No practices found.</p>
          )}
          {practices.map((p) => (
            <button
              key={p.id}
              type="button"
              onClick={() => toggle(p.id)}
              className={`w-full flex items-center justify-between gap-3 px-3 py-2.5 rounded-lg text-sm transition-colors text-left ${selected.has(p.id) ? 'bg-primary/10 text-primary' : 'hover:bg-muted'}`}
            >
              <div className="flex items-center gap-2">
                <CalendarDays className="h-4 w-4 shrink-0 text-muted-foreground" />
                <span className="font-medium">{formatDate(p.date)}</span>
                <span className="text-muted-foreground">· {p.type}</span>
              </div>
              {selected.has(p.id) && <CheckCircle2 className="h-4 w-4 shrink-0" />}
            </button>
          ))}
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose}>Cancel</Button>
          <Button onClick={save} disabled={update.isPending}>
            {update.isPending ? 'Saving…' : 'Save'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

// ─── Page ──────────────────────────────────────────────────────────────────────
export default function DrillDetailPage() {
  const params = useParams<{ id: string }>()
  const router = useRouter()
  const { data: drill, isLoading } = useDrill(Number(params.id))
  const { data: practices = [] } = usePractices()

  const [fullscreen, setFullscreen]   = useState(false)
  const [addDialog, setAddDialog]     = useState(false)

  if (isLoading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-9 w-24" />
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
          <div className="lg:col-span-2 space-y-4">
            <Skeleton className="h-64 w-full rounded-xl" />
            <Skeleton className="aspect-video w-full rounded-xl" />
          </div>
          <div className="lg:col-span-3 space-y-4">
            <div className="space-y-2">
              <Skeleton className="h-5 w-24 rounded-full" />
              <Skeleton className="h-8 w-2/3" />
            </div>
            <Card>
              <CardContent className="pt-4 pb-4">
                <div className="grid grid-cols-3 gap-4">
                  {Array.from({ length: 3 }).map((_, i) => (
                    <div key={i} className="space-y-1">
                      <Skeleton className="h-3 w-16" />
                      <Skeleton className="h-5 w-20" />
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader><Skeleton className="h-5 w-32" /></CardHeader>
              <CardContent className="space-y-2">
                {Array.from({ length: 4 }).map((_, i) => (
                  <div key={i} className="flex gap-3">
                    <Skeleton className="h-5 w-5 rounded-full shrink-0" />
                    <Skeleton className="h-4 flex-1" />
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    )
  }

  if (!drill) {
    return (
      <div className="space-y-4">
        <Button variant="ghost" onClick={() => router.back()}>
          <ArrowLeft className="h-4 w-4 mr-2" /> Back
        </Button>
        <p className="text-muted-foreground">Drill not found.</p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between gap-4">
        <Button variant="ghost" className="-ml-2" onClick={() => router.back()}>
          <ArrowLeft className="h-4 w-4 mr-2" /> Back
        </Button>
        <Button onClick={() => setAddDialog(true)}>
          <CalendarDays className="h-4 w-4 mr-1.5" /> Add to Practice
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
        {/* ── Left: visuals ── */}
        <div className="lg:col-span-2 space-y-4">
          {/* Image */}
          <Card className="overflow-hidden">
            {drill.imageUrl ? (
              <div className="relative group">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={drill.imageUrl}
                  alt={drill.title}
                  className="w-full object-cover max-h-64"
                />
                <button
                  onClick={() => setFullscreen(true)}
                  className="absolute top-2 right-2 bg-black/50 hover:bg-black/70 text-white rounded-md p-1.5 opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <Maximize2 className="h-4 w-4" />
                </button>
              </div>
            ) : (
              <div className="h-48 flex flex-col items-center justify-center gap-2 text-muted-foreground bg-muted">
                <ImageIcon className="h-8 w-8" />
                <span className="text-xs">No image available</span>
              </div>
            )}
          </Card>

          {/* YouTube */}
          {drill.youtubeId && (
            <Card className="overflow-hidden">
              <CardContent className="p-0">
                <div className="flex items-center gap-1.5 px-4 py-2.5 border-b text-sm font-medium">
                  <Youtube className="h-4 w-4 text-red-500" /> Video
                </div>
                <div className="aspect-video">
                  <iframe
                    src={`https://www.youtube.com/embed/${drill.youtubeId}`}
                    title={drill.title}
                    className="w-full h-full"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  />
                </div>
              </CardContent>
            </Card>
          )}
        </div>

        {/* ── Right: info ── */}
        <div className="lg:col-span-3 space-y-4">
          {/* Header */}
          <div>
            <div className="flex flex-wrap items-center gap-2 mb-2">
              <span className={`text-xs px-2.5 py-0.5 rounded-full border font-medium ${CATEGORY_COLOUR[drill.category] ?? ''}`}>
                {drill.category}
              </span>
              <Badge variant={LEVEL_VARIANT[drill.level]}>{drill.level}</Badge>
            </div>
            <h1 className="text-2xl font-bold tracking-tight">{drill.title}</h1>
          </div>

          {/* Meta grid */}
          <Card>
            <CardContent className="pt-4 pb-4">
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 text-sm">
                <div>
                  <p className="text-xs text-muted-foreground uppercase tracking-wider mb-0.5">Duration</p>
                  <p className="font-medium flex items-center gap-1"><Clock className="h-3.5 w-3.5" />{drill.durationMins} min</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground uppercase tracking-wider mb-0.5">Players</p>
                  <p className="font-medium flex items-center gap-1"><Users className="h-3.5 w-3.5" />{drill.playersMin}–{drill.playersMax}</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground uppercase tracking-wider mb-0.5">Space</p>
                  <p className="font-medium">{drill.space}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Objectives */}
          <Card>
            <CardHeader className="pb-2 pt-4">
              <CardTitle className="text-sm">Objectives</CardTitle>
            </CardHeader>
            <CardContent className="pb-4">
              <div className="flex flex-wrap gap-1.5">
                {drill.objectives.map((o) => (
                  <Badge key={o} variant="secondary">{o}</Badge>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Equipment */}
          <Card>
            <CardHeader className="pb-2 pt-4">
              <CardTitle className="text-sm">Equipment</CardTitle>
            </CardHeader>
            <CardContent className="pb-4">
              {drill.equipment.length === 0 ? (
                <p className="text-sm text-muted-foreground">None required</p>
              ) : (
                <div className="flex flex-wrap gap-1.5">
                  {drill.equipment.map((e) => (
                    <Badge key={e} variant="outline">{e}</Badge>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Description */}
          <Card>
            <CardHeader className="pb-2 pt-4">
              <CardTitle className="text-sm">Description</CardTitle>
            </CardHeader>
            <CardContent className="pb-4">
              <p className="text-sm text-muted-foreground leading-relaxed">{drill.description}</p>
            </CardContent>
          </Card>

          {/* Coaching points */}
          <Card>
            <CardHeader className="pb-2 pt-4">
              <CardTitle className="text-sm flex items-center gap-1.5">
                <BookOpen className="h-4 w-4" /> Coaching Points
              </CardTitle>
            </CardHeader>
            <CardContent className="pb-4">
              <ol className="space-y-2">
                {drill.coachingPoints.map((point, idx) => (
                  <li key={idx} className="flex gap-3 text-sm">
                    <span className="shrink-0 flex items-center justify-center h-5 w-5 rounded-full bg-primary/10 text-primary text-xs font-bold">
                      {idx + 1}
                    </span>
                    <span className="text-muted-foreground leading-snug">{point}</span>
                  </li>
                ))}
              </ol>
            </CardContent>
          </Card>

          {/* Tags */}
          {drill.tags.length > 0 && (
            <div className="flex flex-wrap gap-1.5">
              {drill.tags.map((tag) => (
                <span key={tag} className="text-xs px-2 py-0.5 rounded-full bg-muted text-muted-foreground">
                  #{tag}
                </span>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Fullscreen image */}
      <Dialog open={fullscreen} onOpenChange={setFullscreen}>
        <DialogContent className="max-w-4xl p-0 overflow-hidden">
          {drill.imageUrl && (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={drill.imageUrl} alt={drill.title} className="w-full h-auto object-contain" />
          )}
        </DialogContent>
      </Dialog>

      {/* Add-to-Practice */}
      <AddToPracticeDialog
        open={addDialog}
        drillId={drill.id}
        practices={practices}
        onClose={() => setAddDialog(false)}
      />
    </div>
  )
}
