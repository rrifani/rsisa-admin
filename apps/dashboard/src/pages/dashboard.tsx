import { Card, CardContent } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '../components/ui/table';
import { TrendingUp, TrendingDown } from 'lucide-react';
import { useOutletContext } from 'react-router-dom';
import { cn } from '../lib/utils';
import type { Density } from '../components/layout/dashboard-layout';

const stats = [
  {
    title: 'Total Pasien',
    value: '—',
    change: '—',
    trend: 'up' as const,
  },
  {
    title: 'Dokter Aktif',
    value: '—',
    change: '—',
    trend: 'down' as const,
  },
  {
    title: 'Laporan Bulanan',
    value: '—',
    change: '—',
    trend: 'up' as const,
  },
  {
    title: 'Pertumbuhan',
    value: '—',
    change: '—',
    trend: 'up' as const,
  },
];

export default function DashboardPage() {
  const { density } = useOutletContext<{ density: Density }>();
  const compact = density === 'compact';

  return (
    <div className="flex flex-1 flex-col">
      {/* Stats Cards */}
      <div className={cn('flex flex-col', compact ? 'gap-3 p-3 md:gap-4 md:p-4' : 'gap-4 p-4 md:gap-6 md:p-6')}>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {stats.map((stat) => (
            <Card key={stat.title} className="border-muted/60">
              <CardContent className={cn(compact ? 'p-4' : 'p-6')}>
                <div className="flex items-center justify-between">
                  <p className="text-sm font-medium text-muted-foreground">
                    {stat.title}
                  </p>
                  {stat.trend === 'up' ? (
                    <TrendingUp className="h-4 w-4 text-emerald-500" />
                  ) : (
                    <TrendingDown className="h-4 w-4 text-red-500" />
                  )}
                </div>
                <p className="text-2xl font-bold">{stat.value}</p>
                <p className="text-xs text-muted-foreground">
                  <Badge
                    variant="secondary"
                    className={
                      stat.trend === 'up'
                        ? 'bg-emerald-50 text-emerald-700'
                        : 'bg-red-50 text-red-700'
                    }
                  >
                    {stat.change}
                  </Badge>
                </p>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Chart Placeholder */}
        <div className="rounded-xl border bg-card">
          <div className={cn(compact ? 'p-4' : 'p-6')}>
            <h3 className="text-lg font-semibold">Grafik Kunjungan</h3>
            <p className="text-sm text-muted-foreground">
              Data kunjungan 6 bulan terakhir
            </p>
          </div>
          <div className="flex h-[350px] items-center justify-center border-t bg-muted/30 text-sm text-muted-foreground">
            Chart placeholder — integrasi chart menyusul
          </div>
        </div>

        {/* Table Placeholder */}
        <div className="rounded-xl border bg-card">
          <div className={cn(compact ? 'p-4' : 'p-6')}>
            <h3 className="text-lg font-semibold">Aktivitas Terbaru</h3>
            <p className="text-sm text-muted-foreground">
              Log aktivitas sistem
            </p>
          </div>
          <div className="border-t">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[100px]">ID</TableHead>
                  <TableHead>Deskripsi</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Tanggal</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                <TableRow>
                  <TableCell colSpan={4} className="h-24 text-center text-muted-foreground">
                    Belum ada data — integrasi API menyusul
                  </TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </div>
        </div>
      </div>
    </div>
  );
}

