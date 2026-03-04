import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { FileText, Download } from 'lucide-react'

const REPORTS = [
  { name: 'Match Report — FC Porto 2:1', date: 'Mar 2, 2026', status: 'Ready', type: 'Match' },
  { name: 'Weekly Training Load Summary', date: 'Mar 1, 2026', status: 'Ready', type: 'Training' },
  { name: 'Injury Assessment — A. Costa', date: 'Feb 27, 2026', status: 'Processing', type: 'Medical' },
  { name: 'Scouting — R. Oliveira (Braga)', date: 'Feb 24, 2026', status: 'Ready', type: 'Scouting' },
  { name: 'March Fixture & Travel Plan', date: 'Feb 20, 2026', status: 'Ready', type: 'Planning' },
  { name: 'Mid-Season Performance Review', date: 'Jan 31, 2026', status: 'Processing', type: 'Performance' },
]

export default function ReportsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Reports</h1>
        <p className="text-muted-foreground">Match, training, medical and scouting reports</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>All Reports</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {REPORTS.map((r) => (
              <div key={r.name} className="flex items-center justify-between gap-4 rounded-lg border p-3">
                <div className="flex items-center gap-3">
                  <FileText className="h-5 w-5 text-muted-foreground shrink-0" />
                  <div>
                    <p className="font-medium text-sm">{r.name}</p>
                    <p className="text-xs text-muted-foreground">{r.date}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant="outline">{r.type}</Badge>
                  <Badge variant={r.status === 'Ready' ? 'default' : 'secondary'}>
                    {r.status}
                  </Badge>
                  {r.status === 'Ready' && (
                    <Button size="icon" variant="ghost" aria-label="Download">
                      <Download className="h-4 w-4" />
                    </Button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
