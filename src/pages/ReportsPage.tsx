import { useNavigate } from 'react-router-dom'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { FileText, Download, Plus } from 'lucide-react'
import { ALL_REPORTS } from '@/pages/ReportDetailPage'

export default function ReportsPage() {
  const navigate = useNavigate()

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Reports</h1>
          <p className="text-muted-foreground">Match, training, medical and scouting reports</p>
        </div>
        <Button onClick={() => navigate('/reports/new/match')} className="gap-1.5 shrink-0">
          <Plus className="h-4 w-4" /> New Match Report
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>All Reports</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {ALL_REPORTS.map((r) => (
              <div
                key={r.name}
                className="flex items-center justify-between gap-4 rounded-lg border p-3 hover:bg-muted/40 transition-colors cursor-pointer"
                onClick={() => navigate(`/reports/${r.id}`, { state: { report: r } })}
              >
                <div className="flex items-center gap-3">
                  <FileText className="h-5 w-5 text-muted-foreground shrink-0" />
                  <div>
                    <p className="font-medium text-sm">{r.name}</p>
                    <p className="text-xs text-muted-foreground">{r.date}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2" onClick={(e) => e.stopPropagation()}>
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
