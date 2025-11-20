import { ReactNode, useState } from 'react';
import { Sidebar } from './Sidebar';
import { MenuIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { AddContractModal } from '@/components/contracts/AddContractModal';

interface AppShellProps {
  children: ReactNode;
}

export function AppShell({ children }: AppShellProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="flex h-screen overflow-hidden bg-background">
      {/* Mobile menu button */}
      <div className="fixed top-4 left-4 z-50 lg:hidden">
        <Button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="bg-primary text-primary-foreground"
          size="icon"
          aria-label="Toggle menu"
        >
          <MenuIcon className="w-6 h-6" />
        </Button>
      </div>

      {/* Sidebar */}
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      {/* Main content */}
      <main className="flex-1 overflow-y-auto pt-16 lg:pt-0">
        <div className="min-h-full">
          {children}
        </div>
      </main>

      {/* Add Contract Modal */}
      <AddContractModal />
    </div>
  );
}
