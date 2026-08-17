import { useLocation } from 'react-router-dom';
import { Separator } from '../ui/separator';
import {
  Breadcrumb,
  BreadcrumbList,
  BreadcrumbItem,
  BreadcrumbPage,
} from '../ui/breadcrumb';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '../ui/dropdown-menu';
import { Avatar, AvatarFallback } from '../ui/avatar';
import { SidebarTrigger } from '../ui/sidebar-trigger';
import { Button } from '../ui/button';
import { useAuth } from '../../contexts/auth-context';
import { LogOut, User, Rows3, Rows2 } from 'lucide-react';
import { useState, useRef, useEffect } from 'react';
import { cn } from '../../lib/utils';
import type { Density } from './dashboard-layout';

interface HeaderProps {
  density: Density;
  onToggleSidebar: () => void;
  onToggleDensity: () => void;
}

export default function Header({ density, onToggleSidebar, onToggleDensity }: HeaderProps) {
  const { user, logout } = useAuth();
  const location = useLocation();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setDropdownOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const getInitials = (name: string) =>
    name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);

  const pathSegments = location.pathname.split('/').filter(Boolean);
  const compact = density === 'compact';
  const breadcrumbLabel =
    pathSegments.length > 0
      ? pathSegments[pathSegments.length - 1].charAt(0).toUpperCase() +
        pathSegments[pathSegments.length - 1].slice(1)
      : 'Dashboard';

  return (
    <header
      className={cn(
        'flex shrink-0 items-center gap-2 border-b bg-background px-4 transition-all ease-linear',
        compact ? 'h-10' : 'h-14'
      )}
    >
      <SidebarTrigger className="-ml-2" onClick={onToggleSidebar} />
      <Separator orientation="vertical" className="mr-2 h-4" />
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbPage className={compact ? 'text-xs' : ''}>{breadcrumbLabel}</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>
      <div className="ml-auto" />
      {/* Density Toggle */}
      <Button
        variant="ghost"
        size="icon"
        className={cn(compact ? 'h-7 w-7' : 'h-8 w-8')}
        onClick={onToggleDensity}
        title={compact ? 'Switch to comfortable' : 'Switch to compact'}
      >
        {compact ? <Rows2 className="h-3.5 w-3.5" /> : <Rows3 className="h-3.5 w-3.5" />}
      </Button>
      {/* User */}
      <DropdownMenu ref={dropdownRef}>
        <DropdownMenuTrigger
          className="flex items-center gap-2 rounded-full p-1 hover:bg-accent transition-colors"
          onClick={() => setDropdownOpen(!dropdownOpen)}
        >
          <Avatar className={cn('rounded-md', compact ? 'h-6 w-6' : 'h-8 w-8')}>
            <AvatarFallback className={cn('rounded-md bg-emerald-600 text-white', compact ? 'text-[10px]' : 'text-xs')}>
              {user ? getInitials(user.fullName) : 'U'}
            </AvatarFallback>
          </Avatar>
          <div className="hidden text-left md:block">
            <p className={cn('font-medium leading-none', compact ? 'text-xs' : 'text-sm')}>{user?.fullName}</p>
            <p className={cn('text-muted-foreground', compact ? 'text-[10px]' : 'text-xs')}>{user?.username}</p>
          </div>
        </DropdownMenuTrigger>
        {dropdownOpen && (
          <DropdownMenuContent align="end" className="w-56">
            <DropdownMenuLabel>Akun Saya</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem>
              <User className="mr-2 h-4 w-4" />Profile
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={logout} className="text-destructive focus:bg-destructive/10">
              <LogOut className="mr-2 h-4 w-4" />Logout
            </DropdownMenuItem>
          </DropdownMenuContent>
        )}
      </DropdownMenu>
    </header>
  );
}
