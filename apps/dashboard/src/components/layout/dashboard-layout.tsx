import { Outlet } from 'react-router-dom';
import Sidebar from './sidebar';
import Header from './header';
import { useState, useCallback } from 'react';

export type Density = 'compact' | 'comfortable';

function getStoredDensity(): Density {
  try {
    const stored = localStorage.getItem('dashboard-density');
    if (stored === 'compact' || stored === 'comfortable') return stored;
  } catch {}
  return 'compact';
}

export default function DashboardLayout() {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [density, setDensity] = useState<Density>(getStoredDensity);

  const toggleDensity = useCallback(() => {
    setDensity((prev) => {
      const next: Density = prev === 'compact' ? 'comfortable' : 'compact';
      try { localStorage.setItem('dashboard-density', next); } catch {}
      return next;
    });
  }, []);

  return (
    <div className="flex h-screen overflow-hidden">
      <div className="hidden md:block">
        <Sidebar collapsed={sidebarCollapsed} density={density} />
      </div>
      <div className="flex flex-1 flex-col overflow-hidden">
        <Header
          density={density}
          onToggleSidebar={() => setSidebarCollapsed((prev) => !prev)}
          onToggleDensity={toggleDensity}
        />
        <main className="flex-1 overflow-auto bg-muted/30">
          <Outlet context={{ density }} />
        </main>
      </div>
    </div>
  );
}

