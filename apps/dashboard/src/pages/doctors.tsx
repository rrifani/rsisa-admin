import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '../components/ui/card';
import { Stethoscope } from 'lucide-react';

export default function DoctorsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Data Dokter</h1>
        <p className="text-muted-foreground">
          Kelola data dokter, spesialisasi, dan jadwal praktek.
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Stethoscope className="h-5 w-5" />
            Daftar Dokter
          </CardTitle>
          <CardDescription>
            Fitur ini akan menampilkan tabel data dokter yang terhubung ke API
            backend.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex h-48 items-center justify-center rounded-lg border border-dashed text-sm text-muted-foreground">
            Data dokter akan ditampilkan di sini setelah integrasi API.
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
