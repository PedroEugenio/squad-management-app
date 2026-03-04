import {
  LineChart, Line, BarChart, Bar,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
} from 'recharts'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'

const METRICS = [
  { label: 'Win Rate', value: '72%', change: '+4%' },
  { label: 'Goals Scored', value: '47', change: '+6' },
  { label: 'Goals Conceded', value: '21', change: '-3' },
  { label: 'Avg. Pass Accuracy', value: '84.3%', change: '+1.2%' },
]

const MATCH_GOALS = [
  { match: 'GW1', scored: 3, conceded: 1 },
  { match: 'GW2', scored: 1, conceded: 1 },
  { match: 'GW3', scored: 2, conceded: 0 },
  { match: 'GW4', scored: 0, conceded: 2 },
  { match: 'GW5', scored: 4, conceded: 1 },
  { match: 'GW6', scored: 2, conceded: 2 },
  { match: 'GW7', scored: 3, conceded: 0 },
  { match: 'GW8', scored: 1, conceded: 1 },
  { match: 'GW9', scored: 2, conceded: 1 },
  { match: 'GW10', scored: 3, conceded: 2 },
]

const RESULTS = [
  { match: 'GW1', wins: 1, draws: 0, losses: 0 },
  { match: 'GW2', wins: 0, draws: 1, losses: 0 },
  { match: 'GW3', wins: 1, draws: 0, losses: 0 },
  { match: 'GW4', wins: 0, draws: 0, losses: 1 },
  { match: 'GW5', wins: 1, draws: 0, losses: 0 },
  { match: 'GW6', wins: 0, draws: 1, losses: 0 },
  { match: 'GW7', wins: 1, draws: 0, losses: 0 },
  { match: 'GW8', wins: 0, draws: 1, losses: 0 },
  { match: 'GW9', wins: 1, draws: 0, losses: 0 },
  { match: 'GW10', wins: 1, draws: 0, losses: 0 },
]

const PASS_ACC = [
  { match: 'GW1', accuracy: 81 },
  { match: 'GW2', accuracy: 83 },
  { match: 'GW3', accuracy: 85 },
  { match: 'GW4', accuracy: 79 },
  { match: 'GW5', accuracy: 87 },
  { match: 'GW6', accuracy: 84 },
  { match: 'GW7', accuracy: 88 },
  { match: 'GW8', accuracy: 82 },
  { match: 'GW9', accuracy: 86 },
  { match: 'GW10', accuracy: 89 },
]

const POSSESSION = [
  { match: 'GW1', us: 54, them: 46 },
  { match: 'GW2', us: 48, them: 52 },
  { match: 'GW3', us: 61, them: 39 },
  { match: 'GW4', us: 43, them: 57 },
  { match: 'GW5', us: 58, them: 42 },
  { match: 'GW6', us: 50, them: 50 },
  { match: 'GW7', us: 63, them: 37 },
  { match: 'GW8', us: 55, them: 45 },
  { match: 'GW9', us: 57, them: 43 },
  { match: 'GW10', us: 60, them: 40 },
]

const TOOLTIP_STYLE = {
  background: 'hsl(var(--card))',
  border: '1px solid hsl(var(--border))',
  borderRadius: '8px',
  fontSize: 12,
}

export default function AnalyticsPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Performance Analytics</h1>
          <p className="text-muted-foreground">Team performance overview — Season 2025/26</p>
        </div>
        <Badge>Live</Badge>
      </div>

      {/* KPI Cards */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {METRICS.map((m) => (
          <Card key={m.label}>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">{m.label}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{m.value}</div>
              <p className={`text-xs mt-1 font-medium ${m.change.startsWith('+') ? 'text-green-500' : 'text-red-500'}`}>
                {m.change} vs last period
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Row 1: Goals + Results */}
      <div className="grid gap-4 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Goals Scored vs Conceded</CardTitle>
            <CardDescription>Per matchweek — current season</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={220}>
              <LineChart data={MATCH_GOALS} margin={{ top: 5, right: 16, left: -10, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis dataKey="match" tick={{ fontSize: 11 }} />
                <YAxis tick={{ fontSize: 11 }} allowDecimals={false} />
                <Tooltip contentStyle={TOOLTIP_STYLE} />
                <Legend wrapperStyle={{ fontSize: 12 }} />
                <Line type="monotone" dataKey="scored" stroke="#22c55e" strokeWidth={2} dot={{ r: 3 }} name="Scored" />
                <Line type="monotone" dataKey="conceded" stroke="#ef4444" strokeWidth={2} dot={{ r: 3 }} name="Conceded" />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Results Breakdown</CardTitle>
            <CardDescription>Wins, draws and losses per matchweek</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={220}>
              <BarChart data={RESULTS} margin={{ top: 5, right: 16, left: -10, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis dataKey="match" tick={{ fontSize: 11 }} />
                <YAxis tick={{ fontSize: 11 }} allowDecimals={false} />
                <Tooltip contentStyle={TOOLTIP_STYLE} />
                <Legend wrapperStyle={{ fontSize: 12 }} />
                <Bar dataKey="wins" stackId="a" fill="#22c55e" name="Win" />
                <Bar dataKey="draws" stackId="a" fill="#f59e0b" name="Draw" />
                <Bar dataKey="losses" stackId="a" fill="#ef4444" name="Loss" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Row 2: Pass Accuracy + Possession */}
      <div className="grid gap-4 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Pass Accuracy</CardTitle>
            <CardDescription>% per matchweek — current season</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={220}>
              <LineChart data={PASS_ACC} margin={{ top: 5, right: 16, left: -10, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis dataKey="match" tick={{ fontSize: 11 }} />
                <YAxis domain={[70, 100]} tick={{ fontSize: 11 }} unit="%" />
                <Tooltip contentStyle={TOOLTIP_STYLE} formatter={(v) => [`${v}%`, 'Accuracy']} />
                <Line type="monotone" dataKey="accuracy" stroke="#6366f1" strokeWidth={2} dot={{ r: 3 }} name="Accuracy" />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Possession Split</CardTitle>
            <CardDescription>Our team vs opponent per matchweek</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={220}>
              <BarChart data={POSSESSION} margin={{ top: 5, right: 16, left: -10, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis dataKey="match" tick={{ fontSize: 11 }} />
                <YAxis tick={{ fontSize: 11 }} unit="%" />
                <Tooltip contentStyle={TOOLTIP_STYLE} formatter={(v) => [`${v}%`]} />
                <Legend wrapperStyle={{ fontSize: 12 }} />
                <Bar dataKey="us" fill="#6366f1" name="Our Team" radius={[4, 4, 0, 0]} />
                <Bar dataKey="them" fill="#cbd5e1" name="Opponent" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
