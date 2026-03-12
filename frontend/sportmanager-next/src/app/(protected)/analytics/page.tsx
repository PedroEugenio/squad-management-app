'use client'

import { TrendingUp, Trophy, Target, Activity } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import {
  LineChart, Line, BarChart, Bar, XAxis, YAxis,
  CartesianGrid, Cell, Legend, Tooltip,
} from 'recharts'
import {
  ChartContainer,
  type ChartConfig,
} from '@/components/ui/chart'

// ─── Data ─────────────────────────────────────────────────────────────────────

const GOALS_DATA = [
  { gw: 'GW1',  scored: 3, conceded: 1 },
  { gw: 'GW2',  scored: 1, conceded: 1 },
  { gw: 'GW3',  scored: 2, conceded: 0 },
  { gw: 'GW4',  scored: 0, conceded: 2 },
  { gw: 'GW5',  scored: 4, conceded: 2 },
  { gw: 'GW6',  scored: 2, conceded: 2 },
  { gw: 'GW7',  scored: 3, conceded: 1 },
  { gw: 'GW8',  scored: 1, conceded: 1 },
  { gw: 'GW9',  scored: 1, conceded: 1 },
  { gw: 'GW10', scored: 3, conceded: 2 },
]

type Result = 'win' | 'draw' | 'loss'
const RESULTS_DATA: { gw: string; result: Result; value: 1 }[] = [
  { gw: 'GW1',  result: 'win',  value: 1 },
  { gw: 'GW2',  result: 'draw', value: 1 },
  { gw: 'GW3',  result: 'win',  value: 1 },
  { gw: 'GW4',  result: 'loss', value: 1 },
  { gw: 'GW5',  result: 'win',  value: 1 },
  { gw: 'GW6',  result: 'draw', value: 1 },
  { gw: 'GW7',  result: 'win',  value: 1 },
  { gw: 'GW8',  result: 'draw', value: 1 },
  { gw: 'GW9',  result: 'win',  value: 1 },
  { gw: 'GW10', result: 'win',  value: 1 },
]
const RESULT_COLOR: Record<Result, string> = {
  win:  '#22c55e',
  draw: '#f97316',
  loss: '#ef4444',
}

const PASS_DATA = [
  { gw: 'GW1',  accuracy: 82 },
  { gw: 'GW2',  accuracy: 84 },
  { gw: 'GW3',  accuracy: 87 },
  { gw: 'GW4',  accuracy: 82 },
  { gw: 'GW5',  accuracy: 86 },
  { gw: 'GW6',  accuracy: 84 },
  { gw: 'GW7',  accuracy: 83 },
  { gw: 'GW8',  accuracy: 80 },
  { gw: 'GW9',  accuracy: 84 },
  { gw: 'GW10', accuracy: 87 },
]

const POSSESSION_DATA = [
  { gw: 'GW1',  ourTeam: 54, opponent: 46 },
  { gw: 'GW2',  ourTeam: 47, opponent: 47 },
  { gw: 'GW3',  ourTeam: 61, opponent: 39 },
  { gw: 'GW4',  ourTeam: 43, opponent: 57 },
  { gw: 'GW5',  ourTeam: 58, opponent: 41 },
  { gw: 'GW6',  ourTeam: 49, opponent: 49 },
  { gw: 'GW7',  ourTeam: 62, opponent: 38 },
  { gw: 'GW8',  ourTeam: 54, opponent: 43 },
  { gw: 'GW9',  ourTeam: 56, opponent: 43 },
  { gw: 'GW10', ourTeam: 59, opponent: 40 },
]

// ─── Chart configs ─────────────────────────────────────────────────────────────

const goalsConfig: ChartConfig = {
  scored:   { label: 'Scored',   color: '#22c55e' },
  conceded: { label: 'Conceded', color: '#ef4444' },
}

const passConfig: ChartConfig = {
  accuracy: { label: 'Pass Accuracy %', color: '#6366f1' },
}

const possessionConfig: ChartConfig = {
  ourTeam:  { label: 'Our Team', color: '#6366f1' },
  opponent: { label: 'Opponent', color: '#cbd5e1' },
}

// ─── KPIs ──────────────────────────────────────────────────────────────────────

const KPI_CARDS = [
  { title: 'Wins', value: '18', sub: 'This season', icon: Trophy, color: 'text-green-600' },
  { title: 'Goals Scored', value: '47', sub: '2.6 per match avg', icon: Target, color: 'text-blue-600' },
  { title: 'Pass Accuracy', value: '83%', sub: 'Season average', icon: Activity, color: 'text-purple-600' },
  { title: 'Possession', value: '56%', sub: 'Season average', icon: TrendingUp, color: 'text-orange-600' },
]

const tickStyle = { fontSize: 12, fill: 'hsl(var(--muted-foreground))' }

export default function AnalyticsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Analytics</h1>
        <p className="text-muted-foreground">Season performance overview</p>
      </div>

      {/* KPI cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {KPI_CARDS.map(({ title, value, sub, icon: Icon, color }) => (
          <Card key={title}>
            <CardContent className="pt-5">
              <div className="flex items-center justify-between mb-3">
                <p className="text-sm font-medium text-muted-foreground">{title}</p>
                <Icon className={`h-4 w-4 ${color}`} />
              </div>
              <p className="text-2xl font-bold">{value}</p>
              <p className="text-xs text-muted-foreground mt-0.5">{sub}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Charts grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

        {/* Goals per matchweek */}
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Per matchweek — current season</CardDescription>
          </CardHeader>
          <CardContent>
            <ChartContainer config={goalsConfig} className="h-55 w-full">
              <LineChart data={GOALS_DATA} margin={{ top: 8, right: 8, bottom: 0, left: -20 }}>
                <CartesianGrid vertical={false} strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis dataKey="gw" tickLine={false} axisLine={false} tick={tickStyle} />
                <YAxis allowDecimals={false} tickLine={false} axisLine={false} tick={tickStyle} domain={[0, 4]} />
                <Tooltip
                  contentStyle={{ borderRadius: 8, fontSize: 12, border: '1px solid hsl(var(--border))' }}
                  itemStyle={{ padding: 0 }}
                />
                <Legend
                  iconType="circle"
                  iconSize={8}
                  wrapperStyle={{ fontSize: 12, paddingTop: 8 }}
                />
                <Line
                  type="monotone" dataKey="scored" name="Scored"
                  stroke="#22c55e" strokeWidth={2}
                  dot={{ r: 3, fill: '#22c55e', stroke: '#22c55e' }}
                  activeDot={{ r: 5 }}
                />
                <Line
                  type="monotone" dataKey="conceded" name="Conceded"
                  stroke="#ef4444" strokeWidth={2}
                  dot={{ r: 3, fill: '#ef4444', stroke: '#ef4444' }}
                  activeDot={{ r: 5 }}
                />
              </LineChart>
            </ChartContainer>
          </CardContent>
        </Card>

        {/* Results per matchweek */}
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Wins, draws and losses per matchweek</CardDescription>
          </CardHeader>
          <CardContent>
            <ChartContainer config={{}} className="h-55 w-full">
              <BarChart data={RESULTS_DATA} margin={{ top: 8, right: 8, bottom: 0, left: -20 }}>
                <CartesianGrid vertical={false} strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis dataKey="gw" tickLine={false} axisLine={false} tick={tickStyle} />
                <YAxis allowDecimals={false} tickLine={false} axisLine={false} tick={tickStyle} domain={[0, 1]} hide />
                <Tooltip
                  contentStyle={{ borderRadius: 8, fontSize: 12, border: '1px solid hsl(var(--border))' }}
                  formatter={(_, __, props) => [props.payload.result.charAt(0).toUpperCase() + props.payload.result.slice(1), 'Result']}
                />
                <Bar dataKey="value" radius={[4, 4, 0, 0]} maxBarSize={40}>
                  {RESULTS_DATA.map((entry, i) => (
                    <Cell key={i} fill={RESULT_COLOR[entry.result]} />
                  ))}
                </Bar>
              </BarChart>
            </ChartContainer>
            {/* Manual legend */}
            <div className="flex items-center justify-center gap-4 mt-2 text-xs text-muted-foreground">
              {(['win', 'draw', 'loss'] as Result[]).map((r) => (
                <span key={r} className="flex items-center gap-1.5">
                  <span className="h-2 w-2 rounded-full" style={{ background: RESULT_COLOR[r] }} />
                  {r.charAt(0).toUpperCase() + r.slice(1)}
                </span>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Pass Accuracy */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base font-semibold">Pass Accuracy</CardTitle>
            <CardDescription>% per matchweek — current season</CardDescription>
          </CardHeader>
          <CardContent>
            <ChartContainer config={passConfig} className="h-55 w-full">
              <LineChart data={PASS_DATA} margin={{ top: 8, right: 8, bottom: 0, left: -8 }}>
                <CartesianGrid vertical={false} strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis dataKey="gw" tickLine={false} axisLine={false} tick={tickStyle} />
                <YAxis
                  domain={[70, 100]}
                  tickLine={false} axisLine={false} tick={tickStyle}
                  tickFormatter={(v) => `${v}%`}
                />
                <Tooltip
                  contentStyle={{ borderRadius: 8, fontSize: 12, border: '1px solid hsl(var(--border))' }}
                  formatter={(v) => [`${v}%`, 'Pass Accuracy']}
                />
                <Line
                  type="monotone" dataKey="accuracy"
                  stroke="#6366f1" strokeWidth={2}
                  dot={{ r: 3, fill: '#6366f1', stroke: '#6366f1' }}
                  activeDot={{ r: 5 }}
                />
              </LineChart>
            </ChartContainer>
          </CardContent>
        </Card>

        {/* Possession Split */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base font-semibold">Possession Split</CardTitle>
            <CardDescription>Our team vs opponent per matchweek</CardDescription>
          </CardHeader>
          <CardContent>
            <ChartContainer config={possessionConfig} className="h-55 w-full">
              <BarChart data={POSSESSION_DATA} margin={{ top: 8, right: 8, bottom: 0, left: -8 }} barCategoryGap="30%" barGap={2}>
                <CartesianGrid vertical={false} strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis dataKey="gw" tickLine={false} axisLine={false} tick={tickStyle} />
                <YAxis
                  domain={[0, 80]}
                  tickLine={false} axisLine={false} tick={tickStyle}
                  tickFormatter={(v) => `${v}%`}
                />
                <Tooltip
                  contentStyle={{ borderRadius: 8, fontSize: 12, border: '1px solid hsl(var(--border))' }}
                  formatter={(v, name) => [`${v}%`, name]}
                />
                <Legend
                  iconType="square"
                  iconSize={10}
                  wrapperStyle={{ fontSize: 12, paddingTop: 8 }}
                />
                <Bar dataKey="ourTeam"  name="Our Team" fill="#6366f1" radius={[3, 3, 0, 0]} />
                <Bar dataKey="opponent" name="Opponent"  fill="#cbd5e1" radius={[3, 3, 0, 0]} />
              </BarChart>
            </ChartContainer>
          </CardContent>
        </Card>

      </div>
    </div>
  )
}
