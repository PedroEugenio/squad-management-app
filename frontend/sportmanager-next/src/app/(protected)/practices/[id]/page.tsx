'use client'

import { useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import {
  ArrowLeft, CalendarDays, Clock, MapPin, Users,
  Plus, BookOpen, CheckCircle2, ExternalLink,
} from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog'
import EvaluationSection from '@/components/evaluations/EvaluationSection'
import { usePractice, usePlayers, useDrills, useUpdatePractice } from '@/lib/queries'
import type { PracticeType, Drill } from '@/lib/types'
import { Skeleton } from '@/components/ui/skeleton'

const TYPE_VARIANT: Record<PracticeType, 'default' | 'secondary' | 'outline'> = {
  Tactical: 'default', Physical: 'secondary', Technical: 'outline',
  Recovery: 'outline', 'Set Pieces': 'secondary',
}

const TYPE_DESCRIPTION: Record<string, string> = {
  Tactical: 'Focus on team shape, pressing triggers, positional play and set-piece organisation.',
  Physical: 'High-intensity conditioning work targeting cardiovascular fitness, speed and explosive power.',
  Technical: 'Individual and small-group work on ball control, passing, finishing and positional skills.',
  Recovery: 'Low-intensity session designed to aid muscle recovery, reduce soreness and restore mobility.',
  'Set Pieces': 'Dedicated session for corner kicks, free-kicks, throw-ins and defensive set-piece organisation.',
}

function formatDate(d: string) {
  if (!d) return '—'
  return new Date(d + 'T00:00:00').toLocaleDateString('en-GB', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })
}

export default function PracticeDetailPage() {
  const params = useParams<{ id: string }>()
  const router = useRouter()
  const { data: practice, isLoading } = usePractice(Number(params.id))
  const { data: players = [] } = usePlayers()
  const { data: allDrills = [] } = useDrills()
  const updatePractice = useUpdatePractice()

  const [attachOpen, setAttachOpen] = useState(false)
  const [attachSelected, setAttachSelected] = useState<Set<number>>(new Set())

  function openAttach() {
    setAttachSelected(new Set(practice?.drillIds ?? []))
    setAttachOpen(true)
  }

  async function saveAttach() {
    if (!practice) return
    await updatePractice.mutateAsync({
      id: practice.id,
      data: { ...practice, drillIds: Array.from(attachSelected) },
    })
    setAttachOpen(false)
  }

  function toggleDrill(id: number) {
    setAttachSelected((prev) => {
      const next = new Set(prev)
      if (next.has(id)) next.delete(id)
      else next.add(id)
      return next
    })
  }

  if (isLoading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-9 w-44" />
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-5">
              <Skeleton className="h-16 w-16 rounded-xl shrink-0" />
              <div className="space-y-2 flex-1">
                <Skeleton className="h-6 w-56" />
                <Skeleton className="h-4 w-40" />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader><Skeleton className="h-5 w-36" /></CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="space-y-1">
                  <Skeleton className="h-3 w-24" />
                  <Skeleton className="h-5 w-40" />
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  if (!practice) {
    return (
      <div className="space-y-4">
        <Button variant="ghost" onClick={() => router.push('/practices')}>
          <ArrowLeft className="h-4 w-4 mr-2" /> Back to Practices
        </Button>
        <p className="text-muted-foreground">Training session not found.</p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <Button variant="ghost" className="-ml-2" onClick={() => router.push('/practices')}>
        <ArrowLeft className="h-4 w-4 mr-2" /> Back to Practices
      </Button>

      <Card>
        <CardContent className="pt-6">
          <div className="flex items-center gap-5">
            <div className="flex items-center justify-center h-16 w-16 rounded-xl bg-muted shrink-0">
              <CalendarDays className="h-7 w-7 text-muted-foreground" />
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap mb-1">
                <h1 className="text-2xl font-bold tracking-tight">{formatDate(practice.date)}</h1>
              </div>
              <div className="flex items-center gap-1.5 flex-wrap">
                <Badge variant={TYPE_VARIANT[practice.type]}>{practice.type}</Badge>
                <span className="text-sm text-muted-foreground flex items-center gap-1">
                  <Clock className="h-3.5 w-3.5" /> {practice.time} · {practice.duration}
                </span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Session Details</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
            <div className="flex items-start gap-3">
              <Clock className="h-4 w-4 text-muted-foreground mt-0.5 shrink-0" />
              <div>
                <p className="text-xs text-muted-foreground uppercase tracking-wider mb-0.5">Time & Duration</p>
                <p className="font-medium">{practice.time} · {practice.duration}</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <MapPin className="h-4 w-4 text-muted-foreground mt-0.5 shrink-0" />
              <div>
                <p className="text-xs text-muted-foreground uppercase tracking-wider mb-0.5">Location</p>
                <p className="font-medium">{practice.location}</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <Users className="h-4 w-4 text-muted-foreground mt-0.5 shrink-0" />
              <div>
                <p className="text-xs text-muted-foreground uppercase tracking-wider mb-0.5">Attendance</p>
                <p className="font-medium">{practice.attendance} players</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <CalendarDays className="h-4 w-4 text-muted-foreground mt-0.5 shrink-0" />
              <div>
                <p className="text-xs text-muted-foreground uppercase tracking-wider mb-0.5">Session Type</p>
                <Badge variant={TYPE_VARIANT[practice.type]}>{practice.type}</Badge>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Session Focus — {practice.type}</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground leading-relaxed">{TYPE_DESCRIPTION[practice.type]}</p>
        </CardContent>
      </Card>

      {practice.notes && (
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Coaching Notes</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground leading-relaxed">{practice.notes}</p>
          </CardContent>
        </Card>
      )}

      {/* ── Drills ── */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between gap-4">
            <CardTitle className="text-base flex items-center gap-1.5">
              <BookOpen className="h-4 w-4" /> Drills in This Session
            </CardTitle>
            <Button size="sm" variant="outline" onClick={openAttach}>
              <Plus className="h-3.5 w-3.5 mr-1" /> Attach Drills
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {(!practice.drillIds || practice.drillIds.length === 0) ? (
            <p className="text-sm text-muted-foreground">No drills attached. Click &ldquo;Attach Drills&rdquo; to add some.</p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {practice.drillIds.map((did) => {
                const drill = allDrills.find((d) => d.id === did)
                if (!drill) return null
                return (
                  <Link
                    key={did}
                    href={`/drills/${did}`}
                    className="flex items-center gap-3 p-3 rounded-lg border hover:bg-muted transition-colors group"
                  >
                    <div className="flex items-center justify-center h-9 w-9 rounded-lg bg-primary/10 shrink-0">
                      <BookOpen className="h-4 w-4 text-primary" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium truncate group-hover:underline">{drill.title}</p>
                      <p className="text-xs text-muted-foreground">{drill.category} · {drill.durationMins} min</p>
                    </div>
                    <ExternalLink className="h-3.5 w-3.5 text-muted-foreground shrink-0 opacity-0 group-hover:opacity-100 transition-opacity" />
                  </Link>
                )
              })}
            </div>
          )}
        </CardContent>
      </Card>

      {/* ── Attach Drills Dialog ── */}
      <Dialog open={attachOpen} onOpenChange={(v) => { if (!v) setAttachOpen(false) }}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Attach Drills</DialogTitle>
          </DialogHeader>
          <div className="space-y-1 max-h-72 overflow-y-auto">
            {allDrills.length === 0 && (
              <p className="text-sm text-muted-foreground py-4 text-center">No drills in library yet.</p>
            )}
            {allDrills.map((drill) => (
              <button
                key={drill.id}
                type="button"
                onClick={() => toggleDrill(drill.id)}
                className={`w-full flex items-center justify-between gap-3 px-3 py-2.5 rounded-lg text-sm transition-colors text-left ${
                  attachSelected.has(drill.id) ? 'bg-primary/10 text-primary' : 'hover:bg-muted'
                }`}
              >
                <div className="flex items-center gap-2 min-w-0">
                  <BookOpen className="h-4 w-4 shrink-0 text-muted-foreground" />
                  <span className="font-medium truncate">{drill.title}</span>
                  <span className="text-muted-foreground text-xs shrink-0">{drill.category}</span>
                </div>
                {attachSelected.has(drill.id) && <CheckCircle2 className="h-4 w-4 shrink-0" />}
              </button>
            ))}
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setAttachOpen(false)}>Cancel</Button>
            <Button onClick={saveAttach} disabled={updatePractice.isPending}>
              {updatePractice.isPending ? 'Saving…' : 'Save'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <div>
        <h2 className="text-lg font-semibold mb-4">Evaluations</h2>
        <EvaluationSection players={players} context="practice" />
      </div>
    </div>
  )
}
