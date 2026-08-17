import { Link, useLocation } from 'react-router-dom';
import { cn } from '../../lib/utils';
import { ScrollArea } from '../ui/scroll-area';
import { Avatar, AvatarFallback } from '../ui/avatar';
import {
  LayoutDashboard,
  Users,
  Stethoscope,
  FileText,
} from 'lucide-react';
import { useAuth } from '../../contexts/auth-context';
import type { Density } from './dashboard-layout';

const navMain = [
  { title: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
  { title: 'Manajemen Pasien', href: '/patients', icon: Users },
  { title: 'Data Dokter', href: '/doctors', icon: Stethoscope },
  { title: 'Laporan', href: '/reports', icon: FileText },
];

interface SidebarProps {
  collapsed: boolean;
  density: Density;
}

export default function Sidebar({ collapsed, density }: SidebarProps) {
  const location = useLocation();
  const { user } = useAuth();

  const getInitials = (name: string) =>
    name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);

  const compact = density === 'compact';

  return (
    <aside
      className={cn(
        'flex h-screen flex-col border-r bg-sidebar text-sidebar-foreground transition-all duration-300',
        collapsed
          ? compact ? 'w-[44px]' : 'w-[56px]'
          : compact ? 'w-48' : 'w-64'
      )}
    >
      {/* Brand */}
      <div
        className={cn(
          'flex items-center gap-2 border-b border-sidebar-border px-3',
          compact ? 'h-10' : 'h-14'
        )}
      >
        <div
          className={cn(
            'flex shrink-0 items-center justify-center rounded-md bg-emerald-600',
            compact ? 'h-6 w-6' : 'h-7 w-7'
          )}
        >
          <img
            src="/logo.png"
            alt="Logo"
            className={cn('object-contain invert', compact ? 'h-3 w-3' : 'h-4 w-4')}
            onError={(e) => {(e.target as HTMLImageElement).style.display = 'none';}}
          />
        </div>
        {!collapsed && (
          <span className={cn('truncate font-semibold', compact ? 'text-xs' : 'text-sm')}>
            Dashboard
          </span>
        )}
      </div>

      {/* Nav Main */}
      <ScrollArea className={cn('flex-1', compact ? 'py-1' : 'py-2')}>
        <nav className={cn('grid gap-0.5', compact ? 'px-1.5' : 'px-2')}>
          {navMain.map((item) => {
            const isActive =
              item.href === '/dashboard'
                ? location.pathname === '/dashboard'
                : location.pathname.startsWith(item.href);

            return (
              <Link
                key={item.href}
                to={item.href}
                className={cn(
                  'flex items-center gap-3 rounded-md font-medium transition-colors hover:bg-sidebar-accent hover:text-sidebar-accent-foreground',
                  compact ? 'px-2 py-1 text-xs' : 'px-3 py-2 text-sm',
                  isActive
                    ? 'bg-sidebar-accent text-sidebar-accent-foreground'
                    : 'text-sidebar-foreground/70',
                  collapsed && (compact ? 'justify-center px-1.5' : 'justify-center px-2')
                )}
                title={collapsed ? item.title : undefined}
              >
                <item.icon className={cn('shrink-0', compact ? 'h-3.5 w-3.5' : 'h-4 w-4')} />
                {!collapsed && <span>{item.title}</span>}
              </Link>
            );
          })}
        </nav>
      </ScrollArea>

      {/* Nav User */}
      <div className={cn('border-t border-sidebar-border', compact ? 'p-2' : 'p-3')}>
        <div
          className={cn(
            'flex items-center gap-3 rounded-md hover:bg-sidebar-accent',
            compact ? 'p-1.5' : 'p-2',
            collapsed && 'justify-center'
          )}
        >
          <Avatar className={cn('rounded-md', compact ? 'h-6 w-6' : 'h-8 w-8')}>
            <AvatarFallback
              className={cn('rounded-md bg-emerald-600 text-white', compact ? 'text-[10px]' : 'text-xs')}
            >
              {user ? getInitials(user.fullName) : 'U'}
            </AvatarFallback>
          </Avatar>
          {!collapsed && (
            <div className="grid flex-1 text-left leading-tight">
              <span className={cn('truncate font-semibold', compact ? 'text-xs' : 'text-sm')}>
                {user?.fullName}
              </span>
              <span
                className={cn(
                  'truncate text-sidebar-foreground/60',
                  compact ? 'text-[10px]' : 'text-xs'
                )}
              >
                {user?.username}
              </span>
            </div>
          )}
        </div>
      </div>
    </aside>
  );
}

