import { useAuth } from '../contexts/auth-context';
import { Button } from '../components/ui/button';
import { Card, CardHeader, CardTitle, CardContent } from '../components/ui/card';

export default function DashboardPage() {
  const { user, logout } = useAuth();

  return (
    <div className="min-h-screen bg-muted/50 p-6">
      <header className="mb-6 flex items-center justify-between rounded-lg bg-white p-4 shadow-sm">
        <div>
          <h1 className="text-xl font-bold">Dashboard RSISA</h1>
          <p className="text-sm text-muted-foreground">Selamat datang, {user?.fullName}</p>
        </div>
        <div className="flex items-center gap-4">
          <span className="text-sm text-muted-foreground">{user?.username}</span>
          <Button variant="outline" size="sm" onClick={logout}>
            Logout
          </Button>
        </div>
      </header>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Informasi User</CardTitle>
          </CardHeader>
          <CardContent>
            <dl className="space-y-2 text-sm">
              <div className="flex justify-between">
                <dt className="text-muted-foreground">ID</dt>
                <dd className="font-mono text-xs">{user?.id}</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-muted-foreground">Username</dt>
                <dd>{user?.username}</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-muted-foreground">Nama</dt>
                <dd>{user?.fullName}</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-muted-foreground">Tipe</dt>
                <dd>{user?.type === 0 ? 'Karyawan' : user?.type === 1 ? 'Dokter' : user?.type === 2 ? 'Administrator' : '-'}</dd>
              </div>
            </dl>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Quick Links</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <Button variant="outline" className="w-full justify-start" size="sm">
              Manajemen Pasien
            </Button>
            <Button variant="outline" className="w-full justify-start" size="sm">
              Data Dokter
            </Button>
            <Button variant="outline" className="w-full justify-start" size="sm">
              Laporan
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
