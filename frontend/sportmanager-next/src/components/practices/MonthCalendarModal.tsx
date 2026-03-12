'use client'

import { useState } from 'react'
import { ChevronLeft, ChevronRight, Trophy, CalendarDays, Clock, MapPin, Eye, Pencil } from 'lucide-react'
import { Dialog, DialogContent, DialogTitle, DialogHeader, DialogFooter, DialogClose } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import type { Practice, PracticeType, Match, MatchResult } from '@/lib/types'

const PRACTICE_COLORS: Record<PracticeType, string> = {
  Tactical:     'bg-blue-100   text-blue-700   border-blue-200',
  Physical:     'bg-orange-100 text-orange-700 border-orange-200',
  Technical:    'bg-purple-100 text-purple-700 border-purple-200',
  Recovery:     'bg-green-100  text-green-700  border-green-200',
  'Set Pieces': 'bg-amber-100  text-amber-700  border-amber-200',
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

function toISO(d: Date) {
  const y = d.getFullYear()
  const m = String(d.getMonth() + 1).padStart(2, '0')
  const day = String(d.getDate()).padStart(2, '0')
  return `${y}-${m}-${day}`
}

function addDays(d: Date, n: number): Date {
  const r = new Date(d); r.setDate(r.getDate() + n); return r
}

function getGridStart(year: number, month: number): Date {
  const first = new Date(year, month, 1)
  const dow = first.getDay()
  const diff = dow === 0 ? -6 : 1 - dow
  const d = new Date(first); d.setDate(1 + diff); return d
}

function formatDate(d: string) {
  if (!d) return '—'
  return new Date(d + 'T00:00:00').toLocaleDateString('en-GB', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })
}

type CalEvent = { kind: 'practice'; data: Practice } | { kind: 'match'; data: Match }
function eventTime(e: CalEvent) { return e.data.time }

const DAY_NAMES_FULL = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
const MONTH_NAMES = ['January','February','March','April','May','June','July','August','September','October','November','December']
const MAX_VISIBLE = 3

interface MonthCalendarModalProps {
  open: boolean
  onClose: () => void
  practices: Practice[]
  matches: Match[]
  onViewSession?: (p: Practice) => void
  onEditSession?: (p: Practice) => void
  onViewMatch?: (m: Match) => void
}

export default function MonthCalendarModal({ open, onClose, practices, matches, onViewSession, onEditSession, onViewMatch }: MonthCalendarModalProps) {
  const today = new Date(); today.setHours(0, 0, 0, 0)
  const [year, setYear] = useState(today.getFullYear())
  const [month, setMonth] = useState(today.getMonth())
  const [selected, setSelected] = useState<CalEvent | null>(null)
  const [expandedDay, setExpandedDay] = useState<string | null>(null)

  function prevMonth() {
    setSelected(null)
    setExpandedDay(null)
    if (month === 0) { setYear(y => y - 1); setMonth(11) }
    else setMonth(m => m - 1)
  }
  function nextMonth() {
    setSelected(null)
    setExpandedDay(null)
    if (month === 11) { setYear(y => y + 1); setMonth(0) }
    else setMonth(m => m + 1)
  }

  const gridStart = getGridStart(year, month)
  const cells = Array.from({ length: 42 }, (_, i) => addDays(gridStart, i))

  const byDate: Record<string, CalEvent[]> = {}
  for (const p of practices) {
    if (!byDate[p.date]) byDate[p.date] = []
    byDate[p.date].push({ kind: 'practice', data: p })
  }
  for (const m of matches) {
    if (!byDate[m.date]) byDate[m.date] = []
    byDate[m.date].push({ kind: 'match', data: m })
  }
  for (const evs of Object.values(byDate)) {
    evs.sort((a, b) => eventTime(a).localeCompare(eventTime(b)))
  }

  const isCurrentMonthYear = year === today.getFullYear() && month === today.getMonth()

  return (
    <Dialog open={open} onOpenChange={(v) => { if (!v) { setSelected(null); onClose() } }}>
      <DialogContent className="max-w-5xl w-full p-0 gap-0 overflow-hidden">
        {/* Header */}
        <div className="flex items-center gap-3 px-5 py-4 border-b pr-12">
          <CalendarDays className="h-5 w-5 text-muted-foreground shrink-0" />
          <Button variant="outline" size="icon" className="h-7 w-7 shrink-0" onClick={prevMonth}>
            <ChevronLeft className="h-3.5 w-3.5" />
          </Button>
          <div className="flex items-center gap-2 min-w-0">
            <DialogTitle className="text-lg font-semibold whitespace-nowrap">{MONTH_NAMES[month]} {year}</DialogTitle>
            {!isCurrentMonthYear && (
              <Button variant="ghost" size="sm" className="h-7 text-xs" onClick={() => { setYear(today.getFullYear()); setMonth(today.getMonth()) }}>
                Today
              </Button>
            )}
          </div>
          <Button variant="outline" size="icon" className="h-7 w-7 shrink-0" onClick={nextMonth}>
            <ChevronRight className="h-3.5 w-3.5" />
          </Button>
        </div>

        {/* Day name row */}
        <div className="grid grid-cols-7 border-b bg-muted/30">
          {DAY_NAMES_FULL.map((d, i) => (
            <div key={d} className={`py-2 text-center text-xs font-semibold uppercase tracking-wider ${i >= 5 ? 'text-muted-foreground/60' : 'text-muted-foreground'}`}>
              {d}
            </div>
          ))}
        </div>

        {/* Calendar grid */}
        <div className="grid grid-cols-7 divide-x overflow-y-auto" style={{ maxHeight: '70vh' }}>
            {cells.map((day, idx) => {
              const iso = toISO(day)
              const isToday = iso === toISO(today)
              const inMonth = day.getMonth() === month
              const isWeekend = idx % 7 >= 5
              const events = byDate[iso] ?? []
              const isExpanded = expandedDay === iso
              const visible = isExpanded ? events : events.slice(0, MAX_VISIBLE)
              const overflow = events.length - MAX_VISIBLE

              return (
                <div key={iso} className={`min-h-24 flex flex-col border-b p-1.5 gap-1 ${!inMonth ? 'bg-muted/20 opacity-50' : ''} ${isWeekend && inMonth ? 'bg-muted/10' : ''}`}>
                  <div className="flex justify-center mb-0.5">
                    <span className={`text-xs font-semibold leading-none w-6 h-6 flex items-center justify-center rounded-full ${isToday ? 'bg-primary text-primary-foreground font-bold' : inMonth ? 'text-foreground' : 'text-muted-foreground'}`}>
                      {day.getDate()}
                    </span>
                  </div>
                  {visible.map((ev) => {
                    if (ev.kind === 'practice') {
                      const p = ev.data
                      return (
                        <button key={`p-${p.id}`} type="button" onClick={() => setSelected(ev)}
                          className={`w-full text-left rounded border px-1 py-0.5 text-[10px] leading-tight truncate transition-opacity hover:opacity-75 cursor-pointer ${PRACTICE_COLORS[p.type]}`}
                          title={`${p.type} · ${p.time} · ${p.location}`}>
                          {p.type}
                        </button>
                      )
                    } else {
                      const m = ev.data
                      return (
                        <button key={`m-${m.id}`} type="button" onClick={() => setSelected(ev)}
                          className={`w-full text-left rounded border px-1 py-0.5 text-[10px] leading-tight truncate transition-opacity hover:opacity-75 flex items-center gap-0.5 cursor-pointer ${MATCH_COLORS[m.result]}`}
                          title={`${m.opponent} · ${m.competition} · ${m.time}`}>
                          <Trophy className="h-2.5 w-2.5 shrink-0" />
                          <span className="truncate">vs {m.opponent}</span>
                        </button>
                      )
                    }
                  })}
                  {overflow > 0 && !isExpanded && (
                    <button
                      type="button"
                      onClick={() => setExpandedDay(iso)}
                      className="text-[10px] text-muted-foreground hover:text-foreground pl-1 text-left transition-colors"
                    >
                      +{overflow} more
                    </button>
                  )}
                </div>
              )
            })}
        </div>

        {/* Event detail — centered dialog on top of the month modal */}
        <Dialog open={!!selected} onOpenChange={(v) => !v && setSelected(null)}>
          {selected?.kind === 'practice' && (() => {
            const p = selected.data
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
                      <p className="font-medium flex items-center gap-1">
                        <Clock className="h-3 w-3" />{p.time} · {p.duration}
                      </p>
                    </div>
                    <div className="space-y-0.5">
                      <p className="text-xs text-muted-foreground uppercase tracking-wider">Location</p>
                      <p className="font-medium flex items-center gap-1"><MapPin className="h-3 w-3" />{p.location}</p>
                    </div>
                    <div className="space-y-0.5">
                      <p className="text-xs text-muted-foreground uppercase tracking-wider">Attendance</p>
                      <p className="font-medium">{p.attendance} players</p>
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
                    <Button variant="outline" className="flex-1" onClick={() => { setSelected(null); onClose(); onEditSession(p) }}>
                      <Pencil className="h-3.5 w-3.5 mr-1" /> Edit
                    </Button>
                  )}
                  {onViewSession && (
                    <Button className="flex-1" onClick={() => { setSelected(null); onClose(); onViewSession(p) }}>
                      <Eye className="h-3.5 w-3.5 mr-1" /> View Session
                    </Button>
                  )}
                </DialogFooter>
              </DialogContent>
            )
          })()}

          {selected?.kind === 'match' && (() => {
            const m = selected.data
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
                      <p className="font-medium flex items-center gap-1">
                        <Clock className="h-3 w-3" />{m.time}
                      </p>
                    </div>
                    <div className="space-y-0.5">
                      <p className="text-xs text-muted-foreground uppercase tracking-wider">Venue</p>
                      <p className="font-medium">{m.venue}</p>
                    </div>
                    <div className="col-span-2 space-y-0.5">
                      <p className="text-xs text-muted-foreground uppercase tracking-wider">Competition</p>
                      <p className="font-medium">{m.competition}</p>
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
                    <Button className="flex-1" onClick={() => { setSelected(null); onClose(); onViewMatch(m) }}>
                      <Eye className="h-3.5 w-3.5 mr-1" /> View Match
                    </Button>
                  )}
                </DialogFooter>
              </DialogContent>
            )
          })()}
        </Dialog>

        {/* Legend */}
        <div className="flex flex-wrap items-center gap-3 px-5 py-3 border-t bg-muted/20">
          <span className="text-xs text-muted-foreground font-medium">Legend:</span>
          {(Object.entries(PRACTICE_COLORS) as [PracticeType, string][]).map(([type, cls]) => (
            <span key={type} className={`inline-flex items-center gap-1 rounded border px-1.5 py-0.5 text-[10px] font-medium ${cls}`}>{type}</span>
          ))}
          <span className="inline-flex items-center gap-1 rounded border px-1.5 py-0.5 text-[10px] font-medium bg-sky-100 text-sky-700 border-sky-200">
            <Trophy className="h-2.5 w-2.5" /> Match
          </span>
        </div>
      </DialogContent>
    </Dialog>
  )
}

