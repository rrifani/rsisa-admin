import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '../components/ui/card';
import { FileText } from 'lucide-react';

export default function ReportsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Laporan</h1>
        <p className="text-muted-foreground">
          Lihat dan unduh laporan periodik rumah sakit.
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            Laporan
          </CardTitle>
          <CardDescription>
            Fitur ini akan menampilkan laporan-laporan yang terhubung ke API
            backend.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex h-48 items-center justify-center rounded-lg border border-dashed text-sm text-muted-foreground">
            Laporan akan ditampilkan di sini setelah integrasi API.
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
