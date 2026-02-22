import { NavLink, useLocation } from 'react-router-dom';
import { useLanguage } from '@/contexts/LanguageContext';
import { cn } from '@/lib/utils';
import {
  LayoutDashboard,
  Package,
  History,
  Receipt,
  Bell,
  Droplets,
  Clock,
  Wrench,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';
import { useState } from 'react';
import { Button } from '@/components/ui/button';

interface SidebarProps {
  isAdmin?: boolean;
}

export function Sidebar({ isAdmin = false }: SidebarProps) {
  const { t } = useLanguage();
  const location = useLocation();
  const [collapsed, setCollapsed] = useState(false);

  const userLinks = [
    { to: '/dashboard', icon: LayoutDashboard, label: t('nav.dashboard') },
    { to: '/packages', icon: Package, label: t('nav.activePackages') },
    { to: '/history', icon: History, label: t('nav.investmentHistory') },
    { to: '/transactions', icon: Receipt, label: t('nav.transactions') },
    { to: '/notifications', icon: Bell, label: t('nav.notifications') },
  ];

  const adminLinks = [
    { to: '/admin/liquidity', icon: Droplets, label: t('nav.liquidity') },
    { to: '/admin/pending', icon: Clock, label: t('nav.pending') },
    { to: '/admin/manual', icon: Wrench, label: t('nav.manual') },
  ];

  const links = isAdmin ? adminLinks : userLinks;

  return (
    <aside 
      className={cn(
        "bg-sidebar border-r border-sidebar-border transition-all duration-300 flex flex-col",
        collapsed ? "w-16" : "w-60"
      )}
    >
      <div className="flex-1 py-4">
        <nav className="space-y-1 px-2">
          {links.map((link) => {
            const isActive = location.pathname === link.to;
            return (
              <NavLink
                key={link.to}
                to={link.to}
                className={cn(
                  "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors",
                  isActive
                    ? "bg-sidebar-accent text-sidebar-primary"
                    : "text-sidebar-foreground hover:bg-sidebar-accent/50 hover:text-sidebar-accent-foreground"
                )}
              >
                <link.icon className="w-5 h-5 flex-shrink-0" />
                {!collapsed && <span>{link.label}</span>}
              </NavLink>
            );
          })}
        </nav>

        {!isAdmin && (
          <div className="mt-6 pt-6 border-t border-sidebar-border mx-2">
            <div className="px-2 mb-2">
              {!collapsed && (
                <span className="text-xs font-medium text-sidebar-foreground/60 uppercase tracking-wider">
                  {t('nav.admin')}
                </span>
              )}
            </div>
            <nav className="space-y-1 px-2">
              {adminLinks.map((link) => {
                const isActive = location.pathname === link.to;
                return (
                  <NavLink
                    key={link.to}
                    to={link.to}
                    className={cn(
                      "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors",
                      isActive
                        ? "bg-sidebar-accent text-sidebar-primary"
                        : "text-sidebar-foreground hover:bg-sidebar-accent/50 hover:text-sidebar-accent-foreground"
                    )}
                  >
                    <link.icon className="w-5 h-5 flex-shrink-0" />
                    {!collapsed && <span>{link.label}</span>}
                  </NavLink>
                );
              })}
            </nav>
          </div>
        )}
      </div>

      <div className="p-2 border-t border-sidebar-border">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setCollapsed(!collapsed)}
          className="w-full justify-center text-sidebar-foreground hover:bg-sidebar-accent/50"
        >
          {collapsed ? (
            <ChevronRight className="w-4 h-4" />
          ) : (
            <>
              <ChevronLeft className="w-4 h-4 mr-2" />
              <span>Collapse</span>
            </>
          )}
        </Button>
      </div>
    </aside>
  );
}
