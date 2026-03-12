'use client'

import { useRouter } from 'next/navigation'
import { FileText, Plus, Download, MoreVertical, Eye } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { useReports } from '@/lib/queries'
import type { ReportType, ReportStatus } from '@/lib/types'
import type { BadgeProps } from '@/components/ui/badge'
import { Skeleton } from '@/components/ui/skeleton'

const STATUS_VARIANT: Record<ReportStatus, BadgeProps['variant']> = {
  Ready: 'default', Processing: 'secondary',
}

const TYPE_VARIANT: Record<ReportType, BadgeProps['variant']> = {
  Match: 'default', Training: 'secondary', Medical: 'destructive',
  Scouting: 'outline', Planning: 'outline', Performance: 'secondary',
}

export default function ReportsPage() {
  const router = useRouter()
  const { data: reports = [], isLoading } = useReports()

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Reports</h1>
          <p className="text-muted-foreground">Match and training analysis documents</p>
        </div>
        <Button size="icon" className="rounded-full sm:hidden" onClick={() => router.push('/reports/new/match')}>
          <Plus className="h-5 w-5" />
        </Button>
        <Button className="hidden sm:flex" onClick={() => router.push('/reports/new/match')}>
          <Plus className="mr-2 h-4 w-4" /> New Match Report
        </Button>
      </div>

      {isLoading ? (
        <Card>
          <CardContent className="pt-6">
            <div className="space-y-2">
              {Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="flex items-center gap-4 rounded-lg border p-4">
                  <Skeleton className="h-5 w-5 shrink-0" />
                  <div className="flex-1 space-y-1.5">
                    <Skeleton className="h-4 w-52" />
                    <Skeleton className="h-3 w-28" />
                  </div>
                  <Skeleton className="h-5 w-16 rounded-full" />
                  <Skeleton className="h-5 w-14 rounded-full" />
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      ) : (
        <Card>
          <CardContent className="pt-6">
            <div className="space-y-2">
              {reports.map((r) => (
                <div
                  key={r.id}
                  className="flex items-center gap-4 rounded-lg border p-4 hover:bg-muted/40 transition-colors cursor-pointer"
                  onClick={() => router.push(`/reports/${r.id}`)}
                >
                  <FileText className="h-5 w-5 text-muted-foreground shrink-0" />
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-sm truncate">{r.name}</p>
                    <p className="text-xs text-muted-foreground">{r.date}</p>
                  </div>
                  <div className="flex items-center gap-2 shrink-0" onClick={(e) => e.stopPropagation()}>
                    <Badge variant={TYPE_VARIANT[r.type]} className="hidden sm:inline-flex">{r.type}</Badge>
                    <Badge variant={STATUS_VARIANT[r.status]}>{r.status}</Badge>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon">
                          <MoreVertical className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => router.push(`/reports/${r.id}`)}>
                          <Eye className="h-4 w-4 mr-2" /> View
                        </DropdownMenuItem>
                        {r.status === 'Ready' && (
                          <DropdownMenuItem>
                            <Download className="h-4 w-4 mr-2" /> Download
                          </DropdownMenuItem>
                        )}
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
