import { useLocation, useParams, useNavigate } from 'react-router-dom'
import { ArrowLeft, Download, FileText, Activity, User, Map, BarChart2, Stethoscope } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'

// ─── Shared data (mirrors ReportsPage) ────────────────────────────────────
export interface Report {
  id: number
  name: string
  date: string
  status: 'Ready' | 'Processing'
  type: 'Match' | 'Training' | 'Medical' | 'Scouting' | 'Planning' | 'Performance'
}

export const ALL_REPORTS: Report[] = [
  { id: 1, name: 'Match Report — FC Porto 2:1', date: 'Mar 2, 2026', status: 'Ready', type: 'Match' },
  { id: 2, name: 'Weekly Training Load Summary', date: 'Mar 1, 2026', status: 'Ready', type: 'Training' },
  { id: 3, name: 'Injury Assessment — A. Costa', date: 'Feb 27, 2026', status: 'Processing', type: 'Medical' },
  { id: 4, name: 'Scouting — R. Oliveira (Braga)', date: 'Feb 24, 2026', status: 'Ready', type: 'Scouting' },
  { id: 5, name: 'March Fixture & Travel Plan', date: 'Feb 20, 2026', status: 'Ready', type: 'Planning' },
  { id: 6, name: 'Mid-Season Performance Review', date: 'Jan 31, 2026', status: 'Processing', type: 'Performance' },
]

const TYPE_ICON: Record<Report['type'], JSX.Element> = {
  Match: <Activity className="h-5 w-5 text-muted-foreground" />,
  Training: <BarChart2 className="h-5 w-5 text-muted-foreground" />,
  Medical: <Stethoscope className="h-5 w-5 text-muted-foreground" />,
  Scouting: <User className="h-5 w-5 text-muted-foreground" />,
  Planning: <Map className="h-5 w-5 text-muted-foreground" />,
  Performance: <BarChart2 className="h-5 w-5 text-muted-foreground" />,
}

// ─── Rich mock content per report ─────────────────────────────────────────
type Section = { title: string; content: React.ReactNode }

function matchReportContent(): Section[] {
  return [
    {
      title: 'Summary',
      content: (
        <div className="space-y-2 text-sm text-muted-foreground">
          <p>A hard-fought victory in the Primeira Liga at home. The team showed great resilience after conceding to Sporting CP in the 38th minute, turning the game around with two second-half strikes.</p>
          <p>Possession was nearly even (51% / 49%), but the team excelled in transitions and set-piece execution.</p>
        </div>
      ),
    },
    {
      title: 'Key Statistics',
      content: (
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-sm">
          {[
            { label: 'Possession', value: '51%' },
            { label: 'Shots on Target', value: '7' },
            { label: 'Passes (Acc.)', value: '487 (83%)' },
            { label: 'Duels Won', value: '58%' },
            { label: 'Distance Covered', value: '108 km' },
            { label: 'High Intensity Runs', value: '142' },
            { label: 'Corners', value: '6' },
            { label: 'Yellow Cards', value: '2' },
          ].map(({ label, value }) => (
            <div key={label} className="rounded-lg bg-muted p-3 text-center">
              <p className="text-lg font-bold">{value}</p>
              <p className="text-xs text-muted-foreground mt-0.5">{label}</p>
            </div>
          ))}
        </div>
      ),
    },
    {
      title: 'Goal Events',
      content: (
        <div className="space-y-2 text-sm">
          {[
            { time: "38'", player: 'Sporting CP — own forward', type: 'Goal Conceded', color: 'text-red-500' },
            { time: "52'", player: 'Paulo Neves', type: 'Goal Scored', color: 'text-green-600' },
            { time: "78'", player: 'Carlos Ramos', type: 'Goal Scored', color: 'text-green-600' },
          ].map((ev) => (
            <div key={ev.time} className="flex items-center gap-3">
              <span className="w-10 text-xs font-bold text-muted-foreground">{ev.time}</span>
              <span className={`font-medium ${ev.color}`}>{ev.type}</span>
              <span className="text-muted-foreground">— {ev.player}</span>
            </div>
          ))}
        </div>
      ),
    },
    {
      title: 'Tactical Analysis',
      content: (
        <div className="space-y-3 text-sm text-muted-foreground">
          <p><strong className="text-foreground">Shape — 4-3-3:</strong> Maintained compact defensive block with effective mid-block pressing. The defensive trio was solid throughout.</p>
          <p><strong className="text-foreground">Pressing:</strong> Expected goals against (xGA) was 0.7 — good containment despite opponent's technical quality.</p>
          <p><strong className="text-foreground">Transitions:</strong> Quick vertical play in second half exposed opponent's high defensive line on two occasions leading to both goals.</p>
        </div>
      ),
    },
    {
      title: 'Areas to Improve',
      content: (
        <ul className="space-y-1.5 text-sm text-muted-foreground">
          {[
            'First-half pressing intensity dropped below target threshold (66 PPDA vs target of 55)',
            'Two clearances in own box could have been handled by GK — communication needed',
            'Right flank exposed 3 times in wide transitions',
          ].map((item) => (
            <li key={item} className="flex items-start gap-2">
              <span className="mt-1.5 h-1.5 w-1.5 rounded-full bg-destructive shrink-0" />
              {item}
            </li>
          ))}
        </ul>
      ),
    },
  ]
}

function trainingLoadContent(): Section[] {
  const players = [
    { name: 'Diogo Alves', sessions: 5, load: 'Low', distance: '22 km', sprints: 34 },
    { name: 'Bruno Lopes', sessions: 5, load: 'High', distance: '51 km', sprints: 112 },
    { name: 'Paulo Neves', sessions: 4, load: 'Medium', distance: '38 km', sprints: 87 },
    { name: 'Rafael Costa', sessions: 5, load: 'High', distance: '49 km', sprints: 98 },
    { name: 'João Ferreira', sessions: 3, load: 'Low', distance: '24 km', sprints: 41 },
  ]
  return [
    {
      title: 'Weekly Overview',
      content: (
        <div className="text-sm text-muted-foreground space-y-1">
          <p>Week of 23 Feb – 1 Mar 2026 · 5 training sessions · 1 competitive match</p>
          <p>Squad average distance covered: <strong className="text-foreground">39.4 km</strong> · High-intensity runs: <strong className="text-foreground">84 avg</strong></p>
        </div>
      ),
    },
    {
      title: 'Player Load Summary',
      content: (
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b text-xs text-muted-foreground uppercase tracking-wider">
                <th className="text-left py-2 px-2">Player</th>
                <th className="text-left py-2 px-2">Sessions</th>
                <th className="text-left py-2 px-2">Load</th>
                <th className="text-left py-2 px-2">Distance</th>
                <th className="text-left py-2 px-2">Sprints</th>
              </tr>
            </thead>
            <tbody>
              {players.map((p) => (
                <tr key={p.name} className="border-b last:border-0">
                  <td className="py-2 px-2 font-medium">{p.name}</td>
                  <td className="py-2 px-2 text-muted-foreground">{p.sessions}</td>
                  <td className="py-2 px-2">
                    <Badge variant={p.load === 'High' ? 'destructive' : p.load === 'Medium' ? 'secondary' : 'outline'}>
                      {p.load}
                    </Badge>
                  </td>
                  <td className="py-2 px-2 text-muted-foreground">{p.distance}</td>
                  <td className="py-2 px-2 text-muted-foreground">{p.sprints}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ),
    },
    {
      title: 'Recommendations',
      content: (
        <ul className="space-y-1.5 text-sm text-muted-foreground">
          {[
            'Bruno Lopes and Rafael Costa approaching high-load threshold — reduce intensity next session',
            'João Ferreira missed 2 sessions (precautionary) — clear for full training on Mon',
            'Recovery session confirmed for Wednesday post-match',
          ].map((item) => (
            <li key={item} className="flex items-start gap-2">
              <span className="mt-1.5 h-1.5 w-1.5 rounded-full bg-primary shrink-0" />
              {item}
            </li>
          ))}
        </ul>
      ),
    },
  ]
}

function injuryContent(): Section[] {
  return [
    {
      title: 'Patient & Injury Details',
      content: (
        <div className="grid sm:grid-cols-2 gap-4 text-sm">
          {[
            { label: 'Player', value: 'André Costa' },
            { label: 'Date of Injury', value: '24 Feb 2026' },
            { label: 'Type', value: 'Grade II Hamstring Strain (Left)' },
            { label: 'Mechanism', value: 'Non-contact — sprint deceleration' },
            { label: 'Assessed By', value: 'Sofia Andrade (Team Doctor)' },
            { label: 'Est. Return', value: '3–4 weeks (25 Mar 2026)' },
          ].map(({ label, value }) => (
            <div key={label} className="space-y-0.5">
              <p className="text-xs text-muted-foreground uppercase tracking-wider">{label}</p>
              <p className="font-medium">{value}</p>
            </div>
          ))}
        </div>
      ),
    },
    {
      title: 'Recovery Timeline',
      content: (
        <div className="space-y-3 text-sm">
          {[
            { phase: 'Phase 1 (Days 1–5)', desc: 'Rest, ice, compression. No running.' },
            { phase: 'Phase 2 (Days 6–12)', desc: 'Pool sessions, stationary bike, gentle mobility.' },
            { phase: 'Phase 3 (Days 13–21)', desc: 'Straight-line running, progressive load increase.' },
            { phase: 'Phase 4 (Days 22–28)', desc: 'Change of direction, team training reintegration.' },
            { phase: 'Clearance (Day 28+)', desc: 'Full training, match availability subject to physio sign-off.' },
          ].map(({ phase, desc }) => (
            <div key={phase} className="flex gap-3">
              <div className="w-36 shrink-0 font-medium">{phase}</div>
              <div className="text-muted-foreground">{desc}</div>
            </div>
          ))}
        </div>
      ),
    },
    {
      title: 'Notes',
      content: (
        <p className="text-sm text-muted-foreground">Player is in good spirits. Daily check-in with physio Pedro Nunes from Day 3 onwards. No surgical intervention required. Recommended MRI on Day 14 to confirm tissue healing.</p>
      ),
    },
  ]
}

function scoutingContent(): Section[] {
  return [
    {
      title: 'Player Profile',
      content: (
        <div className="grid sm:grid-cols-2 gap-4 text-sm">
          {[
            { label: 'Name', value: 'Ricardo Oliveira' },
            { label: 'Current Club', value: 'SC Braga' },
            { label: 'Age', value: '22' },
            { label: 'Position', value: 'Central Midfielder' },
            { label: 'Nationality', value: '🇵🇹 Portugal' },
            { label: 'Contract Expires', value: 'June 2027' },
            { label: 'Market Value', value: '€3.5M (est.)' },
            { label: 'Scouted By', value: 'Carlos Mendes' },
          ].map(({ label, value }) => (
            <div key={label} className="space-y-0.5">
              <p className="text-xs text-muted-foreground uppercase tracking-wider">{label}</p>
              <p className="font-medium">{value}</p>
            </div>
          ))}
        </div>
      ),
    },
    {
      title: 'Season Statistics (2025/26)',
      content: (
        <div className="grid grid-cols-3 sm:grid-cols-6 gap-4 text-sm">
          {[
            { label: 'Appearances', value: 21 },
            { label: 'Goals', value: 4 },
            { label: 'Assists', value: 7 },
            { label: 'Pass Acc.', value: '89%' },
            { label: 'Duels Won', value: '61%' },
            { label: 'Km/Game', value: '10.8' },
          ].map(({ label, value }) => (
            <div key={label} className="rounded-lg bg-muted p-3 text-center">
              <p className="text-lg font-bold">{value}</p>
              <p className="text-xs text-muted-foreground mt-0.5">{label}</p>
            </div>
          ))}
        </div>
      ),
    },
    {
      title: 'Scout Assessment',
      content: (
        <div className="space-y-3 text-sm text-muted-foreground">
          <p><strong className="text-foreground">Strengths:</strong> Excellent passing range, high work rate, strong in duels for his size. Comfortable under pressure with the ball. Good positional sense — reads the game well.</p>
          <p><strong className="text-foreground">Weaknesses:</strong> Can be bypassed physically by stronger box-to-box midfielders. Set-piece delivery inconsistent. Tends to drift wide instead of staying central.</p>
          <p><strong className="text-foreground">Recommendation:</strong> <span className="font-semibold text-green-600">Pursue</span> — would suit our 4-3-3 as a box-to-box midfielder. Suitable for first-team squad with potential to become starting XI within 12 months.</p>
        </div>
      ),
    },
  ]
}

function planningContent(): Section[] {
  return [
    {
      title: 'March Fixtures',
      content: (
        <div className="space-y-2 text-sm">
          {[
            { date: '8 Mar', competition: 'Primeira Liga', opponent: 'FC Porto', venue: 'Away', location: 'Estádio do Dragão' },
            { date: '15 Mar', competition: 'Primeira Liga', opponent: 'Marítimo', venue: 'Home', location: 'Estádio Municipal' },
            { date: '22 Mar', competition: 'Taça de Portugal QF', opponent: 'Rio Ave', venue: 'Away', location: 'Estádio dos Arcos' },
            { date: '29 Mar', competition: 'Primeira Liga', opponent: 'Famalicão', venue: 'Home', location: 'Estádio Municipal' },
          ].map((f) => (
            <div key={f.date} className="flex items-center gap-3 rounded-lg border p-3">
              <span className="w-14 text-xs font-bold text-muted-foreground">{f.date}</span>
              <div className="flex-1">
                <p className="font-medium">{f.opponent}</p>
                <p className="text-xs text-muted-foreground">{f.competition} · {f.location}</p>
              </div>
              <Badge variant={f.venue === 'Home' ? 'default' : 'outline'}>{f.venue}</Badge>
            </div>
          ))}
        </div>
      ),
    },
    {
      title: 'Travel Details — FC Porto (8 Mar)',
      content: (
        <div className="grid sm:grid-cols-2 gap-4 text-sm">
          {[
            { label: 'Departure', value: '7 Mar · 14:00 — Coach from Stadium' },
            { label: 'Hotel', value: 'Hotel Porto Centro — 7-8 Mar' },
            { label: 'Pre-Match Training', value: '7 Mar · 17:30 — Estádio do Dragão (annex pitch)' },
            { label: 'Return', value: '8 Mar · 22:00 (post-match)' },
          ].map(({ label, value }) => (
            <div key={label} className="space-y-0.5">
              <p className="text-xs text-muted-foreground uppercase tracking-wider">{label}</p>
              <p className="font-medium">{value}</p>
            </div>
          ))}
        </div>
      ),
    },
  ]
}

function performanceContent(): Section[] {
  return [
    {
      title: 'Team Overview — Jan 2026',
      content: (
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-sm">
          {[
            { label: 'Matches', value: '18' },
            { label: 'Wins', value: '13' },
            { label: 'Draws', value: '3' },
            { label: 'Losses', value: '2' },
            { label: 'Goals For', value: '39' },
            { label: 'Goals Against', value: '14' },
            { label: 'Win Rate', value: '72%' },
            { label: 'Points', value: '42' },
          ].map(({ label, value }) => (
            <div key={label} className="rounded-lg bg-muted p-3 text-center">
              <p className="text-2xl font-bold">{value}</p>
              <p className="text-xs text-muted-foreground mt-0.5">{label}</p>
            </div>
          ))}
        </div>
      ),
    },
    {
      title: 'Top Performers',
      content: (
        <div className="space-y-2 text-sm">
          {[
            { name: 'Paulo Neves', contrib: '9 goals, 4 assists', highlight: 'Top scorer' },
            { name: 'Bruno Lopes', contrib: '6 goals, 7 assists', highlight: 'Most creative' },
            { name: 'Rafael Costa', contrib: '87% pass acc., 3 goals', highlight: 'Most consistent' },
            { name: 'Diogo Alves', contrib: '11 clean sheets', highlight: 'Goalkeeper' },
          ].map((p) => (
            <div key={p.name} className="flex items-center justify-between gap-4 rounded-lg border p-3">
              <div>
                <p className="font-medium">{p.name}</p>
                <p className="text-xs text-muted-foreground">{p.contrib}</p>
              </div>
              <Badge variant="secondary">{p.highlight}</Badge>
            </div>
          ))}
        </div>
      ),
    },
    {
      title: 'Second Half Objectives',
      content: (
        <ul className="space-y-1.5 text-sm text-muted-foreground">
          {[
            'Maintain or improve current win rate (72%) in remaining 20 fixtures',
            'Reduce goals conceded — target under 10 in second half of season',
            'Develop squad depth: give minutes to Ramos and Ferreira after returns',
            'Progress in Taça de Portugal — current target: Final',
          ].map((item) => (
            <li key={item} className="flex items-start gap-2">
              <span className="mt-1.5 h-1.5 w-1.5 rounded-full bg-primary shrink-0" />
              {item}
            </li>
          ))}
        </ul>
      ),
    },
  ]
}

const REPORT_CONTENT: Record<number, () => Section[]> = {
  1: matchReportContent,
  2: trainingLoadContent,
  3: injuryContent,
  4: scoutingContent,
  5: planningContent,
  6: performanceContent,
}

// ─── Page ──────────────────────────────────────────────────────────────────
export default function ReportDetailPage() {
  const { id } = useParams<{ id: string }>()
  const location = useLocation()
  const navigate = useNavigate()

  const report: Report | undefined =
    (location.state as { report?: Report })?.report ??
    ALL_REPORTS.find((r) => r.id === Number(id))

  if (!report) {
    return (
      <div className="space-y-4">
        <Button variant="ghost" onClick={() => navigate('/reports')}>
          <ArrowLeft className="h-4 w-4 mr-2" /> Back to Reports
        </Button>
        <p className="text-muted-foreground">Report not found.</p>
      </div>
    )
  }

  const sections = REPORT_CONTENT[report.id]?.() ?? []

  return (
    <div className="space-y-6">
      <Button variant="ghost" className="-ml-2" onClick={() => navigate('/reports')}>
        <ArrowLeft className="h-4 w-4 mr-2" /> Back to Reports
      </Button>

      {/* Hero */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex items-start gap-4 justify-between flex-wrap">
            <div className="flex items-start gap-4">
              <div className="flex items-center justify-center h-14 w-14 rounded-xl bg-muted shrink-0">
                {TYPE_ICON[report.type]}
              </div>
              <div>
                <h1 className="text-xl font-bold tracking-tight">{report.name}</h1>
                <div className="flex items-center gap-2 mt-1.5 flex-wrap">
                  <Badge variant="outline">{report.type}</Badge>
                  <Badge variant={report.status === 'Ready' ? 'default' : 'secondary'}>
                    {report.status}
                  </Badge>
                  <span className="text-sm text-muted-foreground">{report.date}</span>
                </div>
              </div>
            </div>
            {report.status === 'Ready' && (
              <Button variant="outline" size="sm">
                <Download className="h-4 w-4 mr-1.5" /> Download PDF
              </Button>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Processing state */}
      {report.status === 'Processing' && (
        <Card>
          <CardContent className="pt-6 pb-6 flex items-center gap-3 text-muted-foreground">
            <FileText className="h-5 w-5 shrink-0" />
            <p className="text-sm">This report is still being generated. Check back shortly — preview sections below may be incomplete.</p>
          </CardContent>
        </Card>
      )}

      {/* Sections */}
      {sections.map((s) => (
        <Card key={s.title}>
          <CardHeader className="pb-3">
            <CardTitle className="text-base">{s.title}</CardTitle>
          </CardHeader>
          <Separator />
          <CardContent className="pt-4">{s.content}</CardContent>
        </Card>
      ))}
    </div>
  )
}
