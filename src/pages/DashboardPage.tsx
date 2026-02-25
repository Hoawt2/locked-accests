import { useLanguage } from '@/contexts/LanguageContext';
import { MainLayout } from '@/components/layout/MainLayout';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import {
  Wallet,
  Lock,
  TrendingUp,
  ArrowUpRight,
  Package,
  ChevronRight,
  Info
} from 'lucide-react';
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip';

// Mock data
const dashboardData = {
  totalBalance: 125750.00,
  availableBalance: 45750.00,
  frozenBalance: 80000.00,
  totalInterest: 2340.50,
  activePackages: [
    { id: 1, name: '90-Day Lock', principal: 50000, apr: 12.0, progress: 45, maturityDate: '2024-03-15' },
    { id: 2, name: '60-Day Lock', principal: 30000, apr: 10.2, progress: 72, maturityDate: '2024-02-28' },
  ],
  recentActivity: [
    { id: 1, type: 'dailyInterest', amount: 16.44, date: '2024-01-15', status: 'success' },
    { id: 2, type: 'earlyRedemption', amount: 30000, date: '2024-01-10', status: 'success' },
    { id: 3, type: 'dailyInterest', amount: 9.86, date: '2024-01-09', status: 'success' },
    { id: 4, type: 'redemption', amount: 5000, date: '2024-01-08', status: 'pending' },
    { id: 5, type: 'dailyInterest', amount: 12.50, date: '2024-01-07', status: 'success' },
  ],
};

const getTypeLabel = (type: string) => {
  const types: Record<string, string> = {
    dailyInterest: 'Daily Interest',
    earlyRedemption: 'Early Redemption',
    redemption: 'Redemption',
  };
  return types[type] || type;
};

function BalanceCard({
  title,
  value,
  icon: Icon,
  tooltip,
  accent = false
}: {
  title: string;
  value: number;
  icon: React.ElementType;
  tooltip?: string;
  accent?: boolean;
}) {
  return (
    <div className="data-card">
      <div className="flex items-start justify-between mb-3">
        <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${accent ? 'bg-accent/10' : 'bg-secondary'
          }`}>
          <Icon className={`w-5 h-5 ${accent ? 'text-accent' : 'text-muted-foreground'}`} />
        </div>
        {tooltip && (
          <Tooltip>
            <TooltipTrigger>
              <Info className="w-4 h-4 text-muted-foreground" />
            </TooltipTrigger>
            <TooltipContent>
              <p className="max-w-xs">{tooltip}</p>
            </TooltipContent>
          </Tooltip>
        )}
      </div>
      <p className="text-sm text-muted-foreground mb-1">{title}</p>
      <p className={`text-2xl font-bold ${accent ? 'text-accent' : 'text-foreground'}`}>
        ${value.toLocaleString(undefined, { minimumFractionDigits: 2 })}
      </p>
    </div>
  );
}

export default function DashboardPage() {
  const { t } = useLanguage();

  return (
    <MainLayout>
      <div className="p-6 max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-2xl font-bold mb-1">{t('dashboard.title')}</h1>
          <p className="text-muted-foreground">{t('dashboard.welcome')}, John Doe</p>
        </div>

        {/* Balance Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <BalanceCard
            title={t('dashboard.totalBalance')}
            value={dashboardData.totalBalance}
            icon={Wallet}
          />
          <BalanceCard
            title={t('dashboard.availableBalance')}
            value={dashboardData.availableBalance}
            icon={ArrowUpRight}
            tooltip={t('tooltip.availableBalance')}
          />
          <BalanceCard
            title={t('dashboard.frozenBalance')}
            value={dashboardData.frozenBalance}
            icon={Lock}
            tooltip={t('tooltip.frozenBalance')}
          />
          <BalanceCard
            title={t('dashboard.totalInterest')}
            value={dashboardData.totalInterest}
            icon={TrendingUp}
            accent
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Active Packages Summary */}
          <div className="lg:col-span-2 data-card">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-semibold">{t('dashboard.activeSummary')}</h2>
              <Link to="/packages">
                <Button variant="ghost" size="sm" className="gap-1">
                  {t('common.viewDetails')}
                  <ChevronRight className="w-4 h-4" />
                </Button>
              </Link>
            </div>

            <div className="space-y-4">
              {dashboardData.activePackages.map((pkg) => (
                <div key={pkg.id} className="p-4 bg-secondary/30 rounded-lg">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-accent/10 rounded-lg flex items-center justify-center">
                        <Package className="w-5 h-5 text-accent" />
                      </div>
                      <div>
                        <p className="font-medium">{pkg.name}</p>
                        <p className="text-sm text-muted-foreground">
                          ${pkg.principal.toLocaleString()} • {pkg.apr}% APR
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-muted-foreground">{t('packages.maturityDate')}</p>
                      <p className="font-medium">{pkg.maturityDate}</p>
                    </div>
                  </div>
                  <div className="progress-track">
                    <div className="progress-fill" style={{ width: `${pkg.progress}%` }} />
                  </div>
                  <p className="text-xs text-muted-foreground mt-2">{pkg.progress}% complete</p>
                </div>
              ))}
            </div>
          </div>

          {/* Recent Activity & Quick Actions */}
          <div className="space-y-6">
            {/* Quick Actions */}
            <div className="data-card">
              <h2 className="text-lg font-semibold mb-4">{t('dashboard.quickActions')}</h2>
              <div className="space-y-2">
                <Link to="/products" className="block">
                  <Button variant="outline" className="w-full justify-start gap-2">
                    <Package className="w-4 h-4" />
                    {t('landing.exploreProducts')}
                  </Button>
                </Link>
                <Link to="/packages" className="block">
                  <Button variant="outline" className="w-full justify-start gap-2">
                    <Lock className="w-4 h-4" />
                    {t('nav.activePackages')}
                  </Button>
                </Link>
                <Link to="/transactions" className="block">
                  <Button variant="outline" className="w-full justify-start gap-2">
                    <TrendingUp className="w-4 h-4" />
                    {t('nav.transactions')}
                  </Button>
                </Link>
              </div>
            </div>

            {/* Recent Activity */}
            <div className="data-card">
              <h2 className="text-lg font-semibold mb-4">{t('dashboard.recentActivity')}</h2>
              <div className="space-y-3">
                {dashboardData.recentActivity.map((activity) => (
                  <div key={activity.id} className="flex items-center justify-between py-2 border-b border-border/50 last:border-0">
                    <div>
                      <p className="text-sm font-medium">{getTypeLabel(activity.type)}</p>
                      <p className="text-xs text-muted-foreground">{activity.date}</p>
                    </div>
                    <div className="text-right">
                      <p className={`font-medium ${activity.amount > 0 ? 'text-success' : ''}`}>
                        {activity.amount > 0 ? '+' : ''}${Math.abs(activity.amount).toLocaleString()}
                      </p>
                      <span className={`text-xs px-2 py-0.5 rounded-full ${activity.status === 'success' ? 'status-success' : 'status-pending'
                        }`}>
                        {activity.status === 'success' ? t('common.success') : t('common.pending')}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
}
