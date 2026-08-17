import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '../components/ui/card';
import { Users } from 'lucide-react';

export default function PatientsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Manajemen Pasien</h1>
        <p className="text-muted-foreground">
          Kelola data pasien, rekam medis, dan jadwal kunjungan.
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="h-5 w-5" />
            Daftar Pasien
          </CardTitle>
          <CardDescription>
            Fitur ini akan menampilkan tabel data pasien yang terhubung ke API
            backend.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex h-48 items-center justify-center rounded-lg border border-dashed text-sm text-muted-foreground">
            Data pasien akan ditampilkan di sini setelah integrasi API.
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
