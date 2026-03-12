import { useState } from 'react'
import { ChevronLeft, ChevronRight, Trophy, CalendarDays } from 'lucide-react'
import { Dialog, DialogContent } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import type { Practice, PracticeType } from '@/pages/PracticesPage'
import type { Match, MatchResult } from '@/pages/MatchesPage'

// ─── Colour maps ──────────────────────────────────────────────────────────────
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

// ─── Helpers ─────────────────────────────────────────────────────────────────
function toISO(d: Date) { return d.toISOString().slice(0, 10) }

function addDays(d: Date, n: number): Date {
  const r = new Date(d); r.setDate(r.getDate() + n); return r
}

/** First Monday on or before the 1st of the given month */
function getGridStart(year: number, month: number): Date {
  const first = new Date(year, month, 1)
  const dow = first.getDay()
  const diff = dow === 0 ? -6 : 1 - dow
  const d = new Date(first); d.setDate(1 + diff); return d
}

// ─── Unified event type ───────────────────────────────────────────────────────
type CalEvent =
  | { kind: 'practice'; data: Practice }
  | { kind: 'match';    data: Match }

function eventTime(e: CalEvent) { return e.kind === 'practice' ? e.data.time : e.data.time }

const DAY_NAMES_FULL = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
const MONTH_NAMES = ['January','February','March','April','May','June','July','August','September','October','November','December']

const MAX_VISIBLE = 3

interface MonthCalendarModalProps {
  open: boolean
  onClose: () => void
  practices: Practice[]
  matches: Match[]
  onSessionClick?: (p: Practice) => void
  onMatchClick?: (m: Match) => void
}

export default function MonthCalendarModal({
  open, onClose, practices, matches, onSessionClick, onMatchClick,
}: MonthCalendarModalProps) {
  const today = new Date(); today.setHours(0,0,0,0)
  const [year, setYear] = useState(today.getFullYear())
  const [month, setMonth] = useState(today.getMonth())

  function prevMonth() {
    if (month === 0) { setYear(y => y - 1); setMonth(11) }
    else setMonth(m => m - 1)
  }
  function nextMonth() {
    if (month === 11) { setYear(y => y + 1); setMonth(0) }
    else setMonth(m => m + 1)
  }
  function goToday() {
    setYear(today.getFullYear()); setMonth(today.getMonth())
  }

  // Build grid: always 6 rows × 7 cols
  const gridStart = getGridStart(year, month)
  const cells = Array.from({ length: 42 }, (_, i) => addDays(gridStart, i))

  // Index all events by ISO date
  const byDate: Record<string, CalEvent[]> = {}
  for (const p of practices) {
    const key = p.date
    if (!byDate[key]) byDate[key] = []
    byDate[key].push({ kind: 'practice', data: p })
  }
  for (const m of matches) {
    const key = m.date
    if (!byDate[key]) byDate[key] = []
    byDate[key].push({ kind: 'match', data: m })
  }
  // Sort by time within each day
  for (const evs of Object.values(byDate)) {
    evs.sort((a, b) => eventTime(a).localeCompare(eventTime(b)))
  }

  const isCurrentMonthYear = year === today.getFullYear() && month === today.getMonth()

  return (
    <Dialog open={open} onOpenChange={(v) => !v && onClose()}>
      <DialogContent className="max-w-5xl w-full p-0 gap-0 overflow-hidden">
        {/* Header */}
        <div className="flex items-center gap-3 px-5 py-4 border-b pr-12">
          <CalendarDays className="h-5 w-5 text-muted-foreground shrink-0" />
          <Button variant="outline" size="icon" className="h-7 w-7 shrink-0" onClick={prevMonth}>
            <ChevronLeft className="h-3.5 w-3.5" />
          </Button>
          <div className="flex items-center gap-2 min-w-0">
            <h2 className="text-lg font-semibold whitespace-nowrap">
              {MONTH_NAMES[month]} {year}
            </h2>
            {!isCurrentMonthYear && (
              <Button variant="ghost" size="sm" className="h-7 text-xs" onClick={goToday}>
                Today
              </Button>
            )}
          </div>
          <Button variant="outline" size="icon" className="h-7 w-7 shrink-0" onClick={nextMonth}>
            <ChevronRight className="h-3.5 w-3.5" />
          </Button>
        </div>

        {/* Day-of-week header */}
        <div className="grid grid-cols-7 border-b bg-muted/30">
          {DAY_NAMES_FULL.map((d, i) => (
            <div
              key={d}
              className={`py-2 text-center text-xs font-semibold uppercase tracking-wider ${
                i >= 5 ? 'text-muted-foreground/60' : 'text-muted-foreground'
              }`}
            >
              {d}
            </div>
          ))}
        </div>

        {/* Grid */}
        <div className="grid grid-cols-7 divide-x overflow-y-auto" style={{ maxHeight: '70vh' }}>
          {cells.map((day, idx) => {
            const iso = toISO(day)
            const isToday = iso === toISO(today)
            const inMonth = day.getMonth() === month
            const isWeekend = idx % 7 >= 5
            const events = byDate[iso] ?? []
            const visible = events.slice(0, MAX_VISIBLE)
            const overflow = events.length - MAX_VISIBLE

            return (
              <div
                key={iso}
                className={`min-h-24 flex flex-col border-b p-1.5 gap-1 ${
                  !inMonth ? 'bg-muted/20 opacity-50' : ''
                } ${isWeekend && inMonth ? 'bg-muted/10' : ''}`}
              >
                {/* Day number */}
                <div className="flex justify-center mb-0.5">
                  <span
                    className={`text-xs font-semibold leading-none w-6 h-6 flex items-center justify-center rounded-full ${
                      isToday
                        ? 'bg-primary text-primary-foreground font-bold'
                        : inMonth
                        ? 'text-foreground'
                        : 'text-muted-foreground'
                    }`}
                  >
                    {day.getDate()}
                  </span>
                </div>

                {/* Events */}
                {visible.map((ev) => {
                  if (ev.kind === 'practice') {
                    const p = ev.data
                    return (
                      <button
                        key={`p-${p.id}`}
                        type="button"
                        onClick={() => onSessionClick?.(p)}
                        className={`w-full text-left rounded border px-1 py-0.5 text-[10px] leading-tight truncate transition-opacity hover:opacity-75 ${
                          onSessionClick ? 'cursor-pointer' : 'cursor-default'
                        } ${PRACTICE_COLORS[p.type]}`}
                        title={`${p.type} · ${p.time} · ${p.location}`}
                      >
                        {p.type}
                      </button>
                    )
                  } else {
                    const m = ev.data
                    return (
                      <button
                        key={`m-${m.id}`}
                        type="button"
                        onClick={() => onMatchClick?.(m)}
                        className={`w-full text-left rounded border px-1 py-0.5 text-[10px] leading-tight truncate transition-opacity hover:opacity-75 flex items-center gap-0.5 ${
                          onMatchClick ? 'cursor-pointer' : 'cursor-default'
                        } ${MATCH_COLORS[m.result]}`}
                        title={`${m.opponent} · ${m.competition} · ${m.time}`}
                      >
                        <Trophy className="h-2.5 w-2.5 shrink-0" />
                        <span className="truncate">vs {m.opponent}</span>
                      </button>
                    )
                  }
                })}

                {overflow > 0 && (
                  <span className="text-[10px] text-muted-foreground pl-1">+{overflow} more</span>
                )}
              </div>
            )
          })}
        </div>

        {/* Legend */}
        <div className="flex flex-wrap items-center gap-3 px-5 py-3 border-t bg-muted/20">
          <span className="text-xs text-muted-foreground font-medium">Legend:</span>
          {(Object.entries(PRACTICE_COLORS) as [PracticeType, string][]).map(([type, cls]) => (
            <span key={type} className={`inline-flex items-center gap-1 rounded border px-1.5 py-0.5 text-[10px] font-medium ${cls}`}>
              {type}
            </span>
          ))}
          <span className="inline-flex items-center gap-1 rounded border px-1.5 py-0.5 text-[10px] font-medium bg-sky-100 text-sky-700 border-sky-200">
            <Trophy className="h-2.5 w-2.5" /> Match
          </span>
        </div>
      </DialogContent>
    </Dialog>
  )
}
