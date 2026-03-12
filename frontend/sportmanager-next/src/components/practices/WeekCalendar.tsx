import { useState } from 'react'
import { ChevronLeft, ChevronRight, Clock, MapPin, Maximize2, Trophy } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import type { Practice, PracticeType } from '@/pages/PracticesPage'
import type { Match, MatchResult } from '@/pages/MatchesPage'
import MonthCalendarModal from '@/components/practices/MonthCalendarModal'

// ─── Type colours ────────────────────────────────────────────────────────────
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

const DAY_NAMES = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']

// Return the Monday of the week that contains `base`, plus offset weeks.
function getWeekStart(base: Date, offset = 0): Date {
  const d = new Date(base)
  d.setHours(0, 0, 0, 0)
  const dow = d.getDay() // 0=Sun
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
  return d.toISOString().slice(0, 10)
}

function fmtMonthYear(d: Date): string {
  return d.toLocaleDateString('en-GB', { month: 'long', year: 'numeric' })
}

interface WeekCalendarProps {
  practices: Practice[]
  matches?: Match[]
  /** Compact display — smaller cells, no location/notes, used on Dashboard */
  compact?: boolean
  onSessionClick?: (p: Practice) => void
  onMatchClick?: (m: Match) => void
}

export default function WeekCalendar({ practices, matches = [], compact = false, onSessionClick, onMatchClick }: WeekCalendarProps) {
  const today = new Date()
  today.setHours(0, 0, 0, 0)

  const [offset, setOffset] = useState(0)
  const [monthOpen, setMonthOpen] = useState(false)
  const weekStart = getWeekStart(today, offset)
  const days = Array.from({ length: 7 }, (_, i) => addDays(weekStart, i))

  const isCurrentWeek = offset === 0

  // Index practices by ISO date
  const practicesByDate: Record<string, Practice[]> = {}
  for (const p of practices) {
    if (!practicesByDate[p.date]) practicesByDate[p.date] = []
    practicesByDate[p.date].push(p)
  }
  for (const sessions of Object.values(practicesByDate)) {
    sessions.sort((a, b) => a.time.localeCompare(b.time))
  }

  // Index matches by ISO date
  const matchesByDate: Record<string, Match[]> = {}
  for (const m of matches) {
    if (!matchesByDate[m.date]) matchesByDate[m.date] = []
    matchesByDate[m.date].push(m)
  }

  const totalThisWeek =
    days.reduce((sum, d) => {
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
            <Button
              variant="ghost"
              size="sm"
              className="h-7 text-xs gap-1"
              onClick={() => setMonthOpen(true)}
              title="Monthly view"
            >
              <Maximize2 className="h-3.5 w-3.5" />
              <span className="hidden sm:inline">Month</span>
            </Button>
            {!isCurrentWeek && (
              <Button
                variant="ghost"
                size="sm"
                className="h-7 text-xs"
                onClick={() => setOffset(0)}
              >
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
        {/* Horizontally scrollable on small screens */}
        <div className="overflow-x-auto">
          <div className="min-w-[560px] grid grid-cols-7 divide-x border-t">
            {days.map((day, idx) => {
              const iso = toISO(day)
              const sessions = practicesByDate[iso] ?? []
              const dayMatches = matchesByDate[iso] ?? []
              const isToday = iso === toISO(today)
              const isPast = day < today
              const isWeekend = idx >= 5 // Sat, Sun

              return (
                <div
                  key={iso}
                  className={`flex flex-col ${compact ? 'min-h-[110px]' : 'min-h-[140px]'} ${
                    isWeekend ? 'bg-muted/30' : ''
                  } ${isPast && !isToday ? 'opacity-70' : ''}`}
                >
                  {/* Day header */}
                  <div
                    className={`flex flex-col items-center justify-center py-2 gap-0.5 border-b ${
                      isToday ? 'bg-primary/10' : ''
                    }`}
                  >
                    <span className={`text-[11px] font-semibold uppercase tracking-wider ${
                      isToday ? 'text-primary' : 'text-muted-foreground'
                    }`}>
                      {DAY_NAMES[idx]}
                    </span>
                    <span
                      className={`text-sm font-bold leading-none w-7 h-7 flex items-center justify-center rounded-full ${
                        isToday
                          ? 'bg-primary text-primary-foreground'
                          : 'text-foreground'
                      }`}
                    >
                      {day.getDate()}
                    </span>
                  </div>

                  {/* Events */}
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
                            onClick={() => onSessionClick?.(p)}
                            className={`w-full text-left rounded border px-1.5 py-1 text-[11px] leading-tight transition-opacity hover:opacity-80 ${
                              onSessionClick ? 'cursor-pointer' : 'cursor-default'
                            } ${TYPE_COLORS[p.type]}`}
                          >
                            <p className="font-semibold truncate">{p.type}</p>
                            <p className="flex items-center gap-0.5 opacity-80">
                              <Clock className="h-2.5 w-2.5 shrink-0" />
                              {p.time}
                              {!compact && (
                                <span className="ml-0.5 opacity-70">· {p.duration}</span>
                              )}
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
                            onClick={() => onMatchClick?.(m)}
                            className={`w-full text-left rounded border px-1.5 py-1 text-[11px] leading-tight transition-opacity hover:opacity-80 ${
                              onMatchClick ? 'cursor-pointer' : 'cursor-default'
                            } ${MATCH_COLORS[m.result]}`}
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
      onSessionClick={onSessionClick}
      onMatchClick={onMatchClick}
    />
    </>
  )
}
