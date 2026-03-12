'use client'

import { useState } from 'react'
import { ChevronLeft, ChevronRight, Clock, MapPin, Maximize2, Trophy, CalendarDays, Pencil, Eye } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogClose,
} from '@/components/ui/dialog'
import type { Practice, PracticeType, Match, MatchResult } from '@/lib/types'
import MonthCalendarModal from '@/components/practices/MonthCalendarModal'

const TYPE_COLORS: Record<PracticeType, string> = {
  Tactical:     'bg-blue-100   text-blue-700   border-blue-200   dark:bg-blue-900/40   dark:text-blue-300',
  Physical:     'bg-orange-100 text-orange-700 border-orange-200 dark:bg-orange-900/40 dark:text-orange-300',
  Technical:    'bg-purple-100 text-purple-700 border-purple-200 dark:bg-purple-900/40 dark:text-purple-300',
  Recovery:     'bg-green-100  text-green-700  border-green-200  dark:bg-green-900/40  dark:text-green-300',
  'Set Pieces': 'bg-amber-100  text-amber-700  border-amber-200  dark:bg-amber-900/40  dark:text-amber-300',
}

const MATCH_COLORS: Record<MatchResult, string> = {
  Upcoming: 'bg-sky-100    text-sky-700    border-sky-200',
  Win:      'bg-emerald-100 text-emerald-700 border-emerald-200',
  Draw:     'bg-slate-100  text-slate-600  border-slate-200',
  Loss:     'bg-red-100    text-red-700    border-red-200',
}

const TYPE_BADGE_VARIANT: Record<PracticeType, 'default' | 'secondary' | 'outline'> = {
  Tactical: 'default', Physical: 'secondary', Technical: 'outline',
  Recovery: 'outline', 'Set Pieces': 'secondary',
}

const RESULT_BADGE_VARIANT: Record<MatchResult, 'default' | 'secondary' | 'outline' | 'destructive'> = {
  Win: 'default', Draw: 'secondary', Loss: 'destructive', Upcoming: 'outline',
}

const DAY_NAMES = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']

function formatDate(d: string) {
  if (!d) return '—'
  return new Date(d + 'T00:00:00').toLocaleDateString('en-GB', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })
}

function getWeekStart(base: Date, offset = 0): Date {
  const d = new Date(base)
  d.setHours(0, 0, 0, 0)
  const dow = d.getDay()
  const diff = dow === 0 ? -6 : 1 - dow
  d.setDate(d.getDate() + diff + offset * 7)
  return d
}

function addDays(d: Date, n: number): Date {
  const result = new Date(d)
  result.setDate(d.getDate() + n)
  return result
}

function toISO(d: Date): string {
  const y = d.getFullYear()
  const m = String(d.getMonth() + 1).padStart(2, '0')
  const day = String(d.getDate()).padStart(2, '0')
  return `${y}-${m}-${day}`
}

function fmtMonthYear(d: Date): string {
  return d.toLocaleDateString('en-GB', { month: 'long', year: 'numeric' })
}

type CalPreview =
  | { kind: 'practice'; data: Practice }
  | { kind: 'match'; data: Match }

interface WeekCalendarProps {
  practices: Practice[]
  matches?: Match[]
  compact?: boolean
  onViewSession?: (p: Practice) => void
  onEditSession?: (p: Practice) => void
  onViewMatch?: (m: Match) => void
}

export default function WeekCalendar({ practices, matches = [], compact = false, onViewSession, onEditSession, onViewMatch }: WeekCalendarProps) {
  const today = new Date()
  today.setHours(0, 0, 0, 0)

  const [offset, setOffset] = useState(0)
  const [monthOpen, setMonthOpen] = useState(false)
  const [calPreview, setCalPreview] = useState<CalPreview | null>(null)
  const weekStart = getWeekStart(today, offset)
  const days = Array.from({ length: 7 }, (_, i) => addDays(weekStart, i))
  const isCurrentWeek = offset === 0

  const practicesByDate: Record<string, Practice[]> = {}
  for (const p of practices) {
    if (!practicesByDate[p.date]) practicesByDate[p.date] = []
    practicesByDate[p.date].push(p)
  }
  for (const sessions of Object.values(practicesByDate)) {
    sessions.sort((a, b) => a.time.localeCompare(b.time))
  }

  const matchesByDate: Record<string, Match[]> = {}
  for (const m of matches) {
    if (!matchesByDate[m.date]) matchesByDate[m.date] = []
    matchesByDate[m.date].push(m)
  }

  const totalThisWeek = days.reduce((sum, d) => {
    const iso = toISO(d)
    return sum + (practicesByDate[iso]?.length ?? 0) + (matchesByDate[iso]?.length ?? 0)
  }, 0)

  return (
    <>
      <Card>
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between gap-2 flex-wrap">
            <div className="flex items-center gap-2">
              <CardTitle className="text-base">
                {compact ? 'This Week' : 'Weekly Schedule'}
              </CardTitle>
              {totalThisWeek > 0 && (
                <Badge variant="secondary" className="text-xs">
                  {totalThisWeek} event{totalThisWeek !== 1 ? 's' : ''}
                </Badge>
              )}
            </div>
            <div className="flex items-center gap-1.5">
              <span className="text-xs text-muted-foreground hidden sm:block">
                {fmtMonthYear(weekStart)}
              </span>
              <Button variant="ghost" size="sm" className="h-7 text-xs gap-1" onClick={() => setMonthOpen(true)}>
                <Maximize2 className="h-3.5 w-3.5" />
                <span className="hidden sm:inline">Month</span>
              </Button>
              {!isCurrentWeek && (
                <Button variant="ghost" size="sm" className="h-7 text-xs" onClick={() => setOffset(0)}>
                  Today
                </Button>
              )}
              <Button variant="outline" size="icon" className="h-7 w-7" onClick={() => setOffset((o) => o - 1)}>
                <ChevronLeft className="h-3.5 w-3.5" />
              </Button>
              <Button variant="outline" size="icon" className="h-7 w-7" onClick={() => setOffset((o) => o + 1)}>
                <ChevronRight className="h-3.5 w-3.5" />
              </Button>
            </div>
          </div>
        </CardHeader>

        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <div className="min-w-[560px] grid grid-cols-7 divide-x border-t">
              {days.map((day, idx) => {
                const iso = toISO(day)
                const sessions = practicesByDate[iso] ?? []
                const dayMatches = matchesByDate[iso] ?? []
                const isToday = iso === toISO(today)
                const isPast = day < today
                const isWeekend = idx >= 5

                return (
                  <div
                    key={iso}
                    className={`flex flex-col ${compact ? 'min-h-[110px]' : 'min-h-[140px]'} ${
                      isWeekend ? 'bg-muted/30' : ''
                    } ${isPast && !isToday ? 'opacity-70' : ''}`}
                  >
                    <div className={`flex flex-col items-center justify-center py-2 gap-0.5 border-b ${isToday ? 'bg-primary/10' : ''}`}>
                      <span className={`text-[11px] font-semibold uppercase tracking-wider ${isToday ? 'text-primary' : 'text-muted-foreground'}`}>
                        {DAY_NAMES[idx]}
                      </span>
                      <span className={`text-sm font-bold leading-none w-7 h-7 flex items-center justify-center rounded-full ${isToday ? 'bg-primary text-primary-foreground' : 'text-foreground'}`}>
                        {day.getDate()}
                      </span>
                    </div>

                    <div className="flex-1 flex flex-col gap-1 p-1.5 overflow-hidden">
                      {sessions.length === 0 && dayMatches.length === 0 ? (
                        <div className="flex-1 flex items-center justify-center">
                          <span className="text-[10px] text-muted-foreground/40">—</span>
                        </div>
                      ) : (
                        <>
                          {sessions.map((p) => (
                            <button
                              key={p.id}
                              type="button"
                              onClick={() => setCalPreview({ kind: 'practice', data: p })}
                              className={`w-full text-left rounded border px-1.5 py-1 text-[11px] leading-tight transition-opacity hover:opacity-80 cursor-pointer ${TYPE_COLORS[p.type]}`}
                            >
                              <p className="font-semibold truncate">{p.type}</p>
                              <p className="flex items-center gap-0.5 opacity-80">
                                <Clock className="h-2.5 w-2.5 shrink-0" />
                                {p.time}
                                {!compact && <span className="ml-0.5 opacity-70">· {p.duration}</span>}
                              </p>
                              {!compact && (
                                <p className="flex items-center gap-0.5 opacity-70 truncate mt-0.5">
                                  <MapPin className="h-2.5 w-2.5 shrink-0" />
                                  {p.location}
                                </p>
                              )}
                            </button>
                          ))}
                          {dayMatches.map((m) => (
                            <button
                              key={m.id}
                              type="button"
                              onClick={() => setCalPreview({ kind: 'match', data: m })}
                              className={`w-full text-left rounded border px-1.5 py-1 text-[11px] leading-tight transition-opacity hover:opacity-80 cursor-pointer ${MATCH_COLORS[m.result]}`}
                            >
                              <p className="font-semibold truncate flex items-center gap-0.5">
                                <Trophy className="h-2.5 w-2.5 shrink-0" />
                                vs {m.opponent}
                              </p>
                              <p className="flex items-center gap-0.5 opacity-80">
                                <Clock className="h-2.5 w-2.5 shrink-0" />
                                {m.time}
                              </p>
                              {!compact && (
                                <p className="opacity-70 truncate mt-0.5 text-[10px]">{m.competition}</p>
                              )}
                            </button>
                          ))}
                        </>
                      )}
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        </CardContent>
      </Card>

      <MonthCalendarModal
        open={monthOpen}
        onClose={() => setMonthOpen(false)}
        practices={practices}
        matches={matches}
        onViewSession={onViewSession}
        onEditSession={onEditSession}
        onViewMatch={onViewMatch}
      />

      {/* ── Unified event preview dialog ── */}
      <Dialog open={!!calPreview} onOpenChange={(v) => !v && setCalPreview(null)}>
        {calPreview?.kind === 'practice' && (() => {
          const p = calPreview.data
          return (
            <DialogContent className="sm:max-w-sm">
              <DialogHeader>
                <DialogTitle className="flex items-center gap-2">
                  <CalendarDays className="h-4 w-4 text-muted-foreground" />
                  {formatDate(p.date)}
                </DialogTitle>
              </DialogHeader>
              <div className="space-y-3 py-1">
                <div className="grid grid-cols-2 gap-2 text-sm">
                  <div className="space-y-0.5">
                    <p className="text-xs text-muted-foreground uppercase tracking-wider">Type</p>
                    <Badge variant={TYPE_BADGE_VARIANT[p.type]}>{p.type}</Badge>
                  </div>
                  <div className="space-y-0.5">
                    <p className="text-xs text-muted-foreground uppercase tracking-wider">Time</p>
                    <p className="font-medium flex items-center gap-1 text-sm">
                      <Clock className="h-3 w-3" />{p.time} · {p.duration}
                    </p>
                  </div>
                  <div className="space-y-0.5">
                    <p className="text-xs text-muted-foreground uppercase tracking-wider">Location</p>
                    <p className="font-medium text-sm">{p.location}</p>
                  </div>
                  <div className="space-y-0.5">
                    <p className="text-xs text-muted-foreground uppercase tracking-wider">Attendance</p>
                    <p className="font-medium text-sm">{p.attendance} players</p>
                  </div>
                </div>
                {p.notes && (
                  <div className="rounded-md bg-muted p-2.5 text-xs text-muted-foreground">{p.notes}</div>
                )}
              </div>
              <DialogFooter className="flex-col sm:flex-row gap-2">
                <DialogClose asChild>
                  <Button variant="outline" className="flex-1">Close</Button>
                </DialogClose>
                {onEditSession && (
                  <Button variant="outline" className="flex-1" onClick={() => { setCalPreview(null); onEditSession(p) }}>
                    <Pencil className="h-3.5 w-3.5 mr-1" /> Edit
                  </Button>
                )}
                {onViewSession && (
                  <Button className="flex-1" onClick={() => { setCalPreview(null); onViewSession(p) }}>
                    <Eye className="h-3.5 w-3.5 mr-1" /> View Session
                  </Button>
                )}
              </DialogFooter>
            </DialogContent>
          )
        })()}

        {calPreview?.kind === 'match' && (() => {
          const m = calPreview.data
          return (
            <DialogContent className="sm:max-w-sm">
              <DialogHeader>
                <DialogTitle className="flex items-center gap-2">
                  <Trophy className="h-4 w-4 text-muted-foreground" />
                  vs {m.opponent}
                </DialogTitle>
              </DialogHeader>
              <div className="space-y-3 py-1">
                <div className="grid grid-cols-2 gap-2 text-sm">
                  <div className="space-y-0.5">
                    <p className="text-xs text-muted-foreground uppercase tracking-wider">Result</p>
                    <Badge variant={RESULT_BADGE_VARIANT[m.result]}>{m.result}</Badge>
                  </div>
                  <div className="space-y-0.5">
                    <p className="text-xs text-muted-foreground uppercase tracking-wider">Date</p>
                    <p className="font-medium text-sm">{formatDate(m.date)}</p>
                  </div>
                  <div className="space-y-0.5">
                    <p className="text-xs text-muted-foreground uppercase tracking-wider">Time</p>
                    <p className="font-medium flex items-center gap-1 text-sm">
                      <Clock className="h-3 w-3" />{m.time}
                    </p>
                  </div>
                  <div className="space-y-0.5">
                    <p className="text-xs text-muted-foreground uppercase tracking-wider">Venue</p>
                    <p className="font-medium text-sm">{m.venue}</p>
                  </div>
                  <div className="col-span-2 space-y-0.5">
                    <p className="text-xs text-muted-foreground uppercase tracking-wider">Competition</p>
                    <p className="font-medium text-sm">{m.competition}</p>
                  </div>
                  {m.result !== 'Upcoming' && m.goalsFor !== null && (
                    <div className="col-span-2 space-y-0.5">
                      <p className="text-xs text-muted-foreground uppercase tracking-wider">Score</p>
                      <p className="font-bold text-lg">{m.goalsFor} – {m.goalsAgainst}</p>
                    </div>
                  )}
                </div>
                {m.notes && (
                  <div className="rounded-md bg-muted p-2.5 text-xs text-muted-foreground">{m.notes}</div>
                )}
              </div>
              <DialogFooter className="flex-col sm:flex-row gap-2">
                <DialogClose asChild>
                  <Button variant="outline" className="flex-1">Close</Button>
                </DialogClose>
                {onViewMatch && (
                  <Button className="flex-1" onClick={() => { setCalPreview(null); onViewMatch(m) }}>
                    <Eye className="h-3.5 w-3.5 mr-1" /> View Match
                  </Button>
                )}
              </DialogFooter>
            </DialogContent>
          )
        })()}
      </Dialog>
    </>
  )
}
