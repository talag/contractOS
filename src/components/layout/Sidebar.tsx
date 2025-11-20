import { Link, useLocation } from 'react-router-dom';
import { LayoutDashboardIcon, FileTextIcon, BarChart3Icon, SettingsIcon, LogOutIcon, XIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { cn } from '@/lib/utils';
import { useAuth } from '@/contexts/AuthContext';

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

const navItems = [
  { path: '/dashboard', label: 'Dashboard', icon: LayoutDashboardIcon },
  { path: '/contracts', label: 'Contracts', icon: FileTextIcon },
  { path: '/analytics', label: 'Analytics', icon: BarChart3Icon },
  { path: '/settings', label: 'Settings', icon: SettingsIcon },
];

export function Sidebar({ isOpen, onClose }: SidebarProps) {
  const location = useLocation();
  const { logout } = useAuth();

  return (
    <>
      {/* Overlay for mobile */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-gray-900/50 z-40 lg:hidden"
          onClick={onClose}
          aria-hidden="true"
        />
      )}

      {/* Sidebar */}
      <aside
        className={cn(
          'fixed lg:static inset-y-0 left-0 z-40 w-64 bg-primary text-primary-foreground transform transition-transform duration-300 ease-in-out flex flex-col',
          isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        )}
      >
        {/* Close button for mobile */}
        <div className="flex items-center justify-between p-6 lg:hidden">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-primary-foreground/20 rounded-lg" />
            <span className="text-xl font-semibold text-primary-foreground">ContractMind</span>
          </div>
          <Button
            onClick={onClose}
            variant="ghost"
            size="icon"
            className="text-primary-foreground hover:bg-primary-foreground/10"
            aria-label="Close menu"
          >
            <XIcon className="w-6 h-6" />
          </Button>
        </div>

        {/* Logo - Desktop */}
        <div className="hidden lg:flex items-center gap-3 p-6">
          <div className="w-8 h-8 bg-primary-foreground/20 rounded-lg" />
          <span className="text-xl font-semibold text-primary-foreground">ContractMind</span>
        </div>

        <Separator className="bg-primary-foreground/20" />

        {/* Navigation */}
        <nav className="flex-1 p-4 space-y-2">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;
            return (
              <Link
                key={item.path}
                to={item.path}
                onClick={onClose}
                className={cn(
                  'flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ease-in-out font-normal text-primary-foreground',
                  isActive
                    ? 'bg-primary-foreground/20'
                    : 'hover:bg-primary-foreground/10'
                )}
              >
                <Icon className="w-5 h-5" strokeWidth={1.5} />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>

        <Separator className="bg-primary-foreground/20" />

        {/* Bottom actions */}
        <div className="p-4 space-y-2">
          <button
            onClick={logout}
            className="flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ease-in-out w-full text-left font-normal text-primary-foreground hover:bg-primary-foreground/10"
          >
            <LogOutIcon className="w-5 h-5" strokeWidth={1.5} />
            <span>Logout</span>
          </button>
        </div>
      </aside>
    </>
  );
}
