import { Users, BarChart3, Trophy, ActivitySquare } from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'

const STATS = [
  { label: 'Active Athletes', value: '34', trend: '+2', icon: Users, color: 'text-blue-500' },
  { label: 'Matches Played', value: '18', trend: '+1', icon: Trophy, color: 'text-yellow-500' },
  { label: 'Season Win Rate', value: '72%', trend: '+4%', icon: BarChart3, color: 'text-green-500' },
  { label: 'Injuries', value: '3', trend: '-1', icon: ActivitySquare, color: 'text-red-500' },
]

const RECENT_ACTIVITY = [
  { user: 'Marco Silva', action: 'Logged post-match recovery session', time: '10 min ago', badge: 'Training' },
  { user: 'James Hartley', action: 'Match report submitted — FC Porto 2:1 W', time: '1 hr ago', badge: 'Match' },
  { user: 'Sofia Andrade', action: 'Injury assessment updated — mild hamstring strain', time: '2 hr ago', badge: 'Medical' },
  { user: 'Carlos Mendes', action: 'Scouting report added for A. Ribeiro', time: '4 hr ago', badge: 'Scouting' },
  { user: 'Ana Ferreira', action: 'Tactical session plan uploaded for Thursday', time: '6 hr ago', badge: 'Training' },
]

export default function DashboardPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Dashboard</h1>
        <p className="text-muted-foreground">Season 2025/26 — Week 22. Here's your team overview.</p>
      </div>

      {/* Stats */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {STATS.map((stat) => (
          <Card key={stat.label}>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                {stat.label}
              </CardTitle>
              <stat.icon className={`h-4 w-4 ${stat.color}`} />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
              <p className="text-xs text-muted-foreground mt-1">
                <span className="text-green-500 font-medium">{stat.trend}</span> vs last week
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Recent Activity */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Activity</CardTitle>
          <CardDescription>Latest updates from staff and coaching team</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {RECENT_ACTIVITY.map((item, i) => (
              <div key={i} className="flex items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="h-8 w-8 rounded-full bg-muted flex items-center justify-center text-xs font-medium">
                    {item.user.split(' ').map((n) => n[0]).join('')}
                  </div>
                  <div>
                    <p className="text-sm font-medium leading-none">{item.user}</p>
                    <p className="text-xs text-muted-foreground mt-0.5">{item.action}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <Badge variant="outline" className="text-xs">{item.badge}</Badge>
                  <span className="text-xs text-muted-foreground">{item.time}</span>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
