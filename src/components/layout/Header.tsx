import { Link, useLocation } from 'react-router-dom';
import { useLanguage } from '@/contexts/LanguageContext';
import { LanguageSwitcher } from '@/components/LanguageSwitcher';
import { Bell, User, ChevronDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';

export function Header() {
  const { t } = useLanguage();
  const location = useLocation();
  const isAdmin = location.pathname.startsWith('/admin');
  const userRole = localStorage.getItem('userRole');

  return (
    <header className="h-16 border-b border-border bg-card px-6 flex items-center justify-between sticky top-0 z-50">
      <div className="flex items-center gap-8">
        <Link to="/" className="flex items-center gap-2">
          <div className="w-8 h-8 bg-gradient-primary rounded-lg flex items-center justify-center">
            <span className="text-primary-foreground font-bold text-sm">LA</span>
          </div>
          <span className="font-semibold text-lg text-foreground">LockedAsset</span>
        </Link>

        {userRole && (
          <nav className="hidden md:flex items-center gap-1">
            <Link to="/">
              <Button variant={location.pathname === '/' ? 'secondary' : 'ghost'} size="sm" className="text-sm">
                {t('nav.home')}
              </Button>
            </Link>
            {userRole !== 'admin' && (
              <>
                <Link to="/dashboard">
                  <Button variant={location.pathname === '/dashboard' ? 'secondary' : 'ghost'} size="sm" className="text-sm">
                    {t('nav.dashboard')}
                  </Button>
                </Link>
                <Link to="/products">
                  <Button variant={location.pathname.startsWith('/products') ? 'secondary' : 'ghost'} size="sm" className="text-sm">
                    {t('nav.products')}
                  </Button>
                </Link>

                {isAdmin && (
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="sm" className="text-sm gap-1">
                        {t('nav.admin')}
                        <ChevronDown className="w-4 h-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="start">
                      <DropdownMenuItem asChild>
                        <Link to="/admin/liquidity">{t('nav.liquidity')}</Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem asChild>
                        <Link to="/admin/pending">{t('nav.pending')}</Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem asChild>
                        <Link to="/admin/manual">{t('nav.manual')}</Link>
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                )}
              </>
            )}
          </nav>
        )}
      </div>

      <div className="flex items-center gap-4">
        <LanguageSwitcher />

        {userRole ? (
          <>
            <Link to="/notifications">
              <Button variant="ghost" size="icon" className="relative">
                <Bell className="w-5 h-5" />
                <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-destructive rounded-full" />
              </Button>
            </Link>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm" className="gap-2">
                  <div className="w-8 h-8 bg-accent rounded-full flex items-center justify-center">
                    <User className="w-4 h-4 text-accent-foreground" />
                  </div>
                  <span className="hidden sm:inline text-sm">John Doe</span>
                  <ChevronDown className="w-4 h-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48">
                {userRole !== 'admin' && (
                  <>
                    <DropdownMenuItem asChild>
                      <Link to="/dashboard">{t('nav.dashboard')}</Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link to="/packages">{t('nav.activePackages')}</Link>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                  </>
                )}
                <DropdownMenuItem className="text-destructive" onClick={() => {
                  localStorage.removeItem('userRole');
                  window.location.href = '/login';
                }}>
                  {t('nav.logout')}
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </>
        ) : (
          <Link to="/login">
            <Button variant="default" size="sm">
              Log In
            </Button>
          </Link>
        )}
      </div>
    </header>
  );
}