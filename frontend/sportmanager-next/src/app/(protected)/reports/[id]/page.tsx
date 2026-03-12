'use client'

import { useParams, useRouter } from 'next/navigation'
import { ArrowLeft, Download, FileText, Loader2 } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { useReports } from '@/lib/queries'
import type { ReportType, ReportStatus } from '@/lib/types'
import type { BadgeProps } from '@/components/ui/badge'

const STATUS_VARIANT: Record<ReportStatus, BadgeProps['variant']> = {
  Ready: 'default', Processing: 'secondary',
}

const TYPE_VARIANT: Record<ReportType, BadgeProps['variant']> = {
  Match: 'default', Training: 'secondary', Medical: 'destructive',
  Scouting: 'outline', Planning: 'outline', Performance: 'secondary',
}

interface Section { title: string; content: string | React.ReactNode }

type ContentFn = (id: number) => Section[]

const REPORT_CONTENT: Record<number, ContentFn> = {
  1: () => ([
    { title: 'Match Summary', content: 'Dominant 2-0 win at home against FC Porto. Strong pressing in the first half led to two early goals — Diogo Costa from a corner and Tiago Silva with a strike from outside the box.' },
    { title: 'Tactical Notes', content: '4-3-3 press worked excellently in the first 30 minutes. Porto struggled to build from the back.\n\nSecond-half was more defensive but controlled. Transition counters posed some risk but were handled well by the centre-backs.' },
    { title: 'Key Statistics', content: 'Possession: 54% | Shots on Target: 8 | Shots Total: 15 | Pass Accuracy: 87% | Corners: 7 | Yellow Cards: 1 | Distance Covered: 112 km' },
    { title: 'Player Highlights', content: 'Diogo Costa (GK) — Critical saves in the 67th and 78th minute.\nTiago Silva (CM) — Goal + assist. Best player on the pitch. Covered 13 km.\nNuno Mendes (LB) — Excellent defensive work, blocked two key crosses.' },
  ]),
  2: () => ([
    { title: 'Training Overview', content: 'High-intensity tactical session focused on pressing triggers and defensive shape. 18 of 23 players participated. 3 players on light work due to minor fatigue.' },
    { title: 'Attendance', content: '18/23 · 5 players on load management (post-match recovery protocol)' },
    { title: 'Objectives', content: '1. Reinforce press triggers from 4-3-3 shape\n2. Practice transition attacks with 3v2 and 4v3 drills\n3. Set piece review — corner and free kick defensive organisation' },
    { title: 'Coach Notes', content: 'Intensity was very good for a day-after match session. Press looked sharp in the second half drill. Defensive transitions need more work — players were passive in the 5-minute transition sequence.' },
  ]),
  3: () => ([
    { title: 'Player Status Update', content: 'João Lima — Grade 1 hamstring strain (right). Expected return: 2 weeks. Not recommended for selection until cleared by physio review.' },
    { title: 'Availability', content: '4 players currently in rehabilitation:\n• João Lima — hamstring (2 weeks)\n• Pedro Alves — knee (4 weeks)\n• Marcos Ferreira — ankle (cleared next session)\n• Bruno Carvalho — illness (1–2 days)' },
    { title: 'Fitness Targets for Squad', content: 'Pre-match HRV average: 68ms. Target HRV: 72ms. Current sprint load vs peak: 91%. Recovery ratings above target for 17/23 players.' },
  ]),
  4: () => ([
    { title: 'Scout Report', content: 'Full analysis of opposing team tactical setup, key players, and set piece patterns observed over last 5 matches.' },
    { title: 'Key Players to Watch', content: 'Striker #9 — high pressing, strong in the air. Average 4.2 shots per game.\nLAM #11 — quick on the turn, prefers inside cut. 7 key passes last 5 games.\nCDM #6 — ball-playing pivot, 89% pass accuracy. Target him with high press.' },
    { title: 'Set Pieces', content: 'Corners — prefer near-post delivery. Route 1 to target #9. Block runners on far post.\nFree kicks — double wall, curling delivery. Goalkeeper to command box.' },
    { title: 'Recommended Tactical Adjustments', content: 'Push left winger higher to deny their RB overlap. Use zonal marking on corners. Trigger press when their pivot receives ball under pressure.' },
  ]),
  5: () => ([
    { title: 'Match Schedule', content: 'Next 4 fixtures overview:\n• Jun 15 — FC Porto (Home, Liga)\n• Jun 22 — Sporting (Away, Liga)\n• Jun 29 — Benfica (Home, Liga)\n• Jul 5 — Dragons (Home, Cup)' },
    { title: 'Training Plan', content: 'Planned intensity for the upcoming micro-cycle:\n• Day 1: Recovery\n• Day 2: Tactical (low intensity)\n• Day 3: Technical drills\n• Day 4: Match prep (high intensity)\n• Day 5: Set pieces + light session\n• Day 6: Rest\n• Day 7: Match day' },
    { title: 'Squad Availability Forecast', content: '19 players available for FC Porto. 2 uncertain (monitoring). 2 confirmed out.' },
  ]),
  6: () => ([
    { title: 'Season Overview', content: 'Current form: W4 D1 L1 over last 6 matches. Liga position: 3rd. 8 points behind leader with 7 games remaining.' },
    { title: 'Top Performers', content: '#10 Tiago Silva — 8 goals, 6 assists, 92% pass accuracy\n#9 João Lima — 12 goals (injured weeks 15–17)\n#1 Diogo Costa — 9 clean sheets in 24 Liga matches' },
    { title: 'Areas for Development', content: '• Aerial challenges — won 48% vs league average 56%\n• Crosses delivered — 72% accuracy target not met (66%)\n• Second-half press intensity drops after 70th min — physical data shows 8% sprint drop' },
    { title: 'Next Steps', content: 'Focus remaining sessions on aerial work and sustained high press to minute 90. Individual development plans issued to 6 players.' },
  ]),
}

export default function ReportDetailPage() {
  const params = useParams<{ id: string }>()
  const router = useRouter()
  const id = Number(params.id)
  const { data: reports = [], isLoading } = useReports()
  const report = reports.find((r) => r.id === id)

  if (isLoading) return <div className="flex items-center gap-2 p-6"><Loader2 className="h-4 w-4 animate-spin" /><p className="text-sm text-muted-foreground">Loading…</p></div>
  if (!report) return (
    <div className="space-y-4 text-center py-16">
      <p className="text-lg font-semibold">Report not found</p>
      <Button variant="ghost" onClick={() => router.push('/reports')}><ArrowLeft className="h-4 w-4 mr-2" /> Back to Reports</Button>
    </div>
  )

  const sections: Section[] = REPORT_CONTENT[id]?.(id) ?? []

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <Button variant="ghost" size="icon" onClick={() => router.push('/reports')}>
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <div className="flex-1 min-w-0">
          <h1 className="text-2xl font-bold tracking-tight truncate">{report.name}</h1>
          <p className="text-muted-foreground">{report.date}</p>
        </div>
        {report.status === 'Ready' && (
          <Button variant="outline">
            <Download className="h-4 w-4 mr-2" /> Download PDF
          </Button>
        )}
      </div>

      {/* Hero */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex items-center gap-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-muted">
              <FileText className="h-5 w-5 text-muted-foreground" />
            </div>
            <div className="flex flex-wrap items-center gap-2">
              <Badge variant={TYPE_VARIANT[report.type]}>{report.type} Report</Badge>
              <Badge variant={STATUS_VARIANT[report.status]}>{report.status}</Badge>
            </div>
          </div>
          {report.status === 'Processing' && (
            <p className="mt-4 flex items-center gap-2 text-sm text-muted-foreground">
              <Loader2 className="h-4 w-4 animate-spin" />
              This report is being generated. Refresh in a few minutes.
            </p>
          )}
        </CardContent>
      </Card>

      {/* Sections */}
      {sections.map((s) => (
        <Card key={s.title}>
          <CardHeader><CardTitle className="text-base">{s.title}</CardTitle></CardHeader>
          <CardContent>
            {typeof s.content === 'string' ? (
              <p className="text-sm whitespace-pre-line">{s.content}</p>
            ) : (
              s.content
            )}
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
