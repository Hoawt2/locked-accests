import { useLanguage } from '@/contexts/LanguageContext';
import { MainLayout } from '@/components/layout/MainLayout';
import { Link } from 'react-router-dom';
import { fetchActivePackages } from '@/pages/ActivePackagesPage';
import { Button } from '@/components/ui/button';
import {
  Wallet,
  Lock,
  TrendingUp,
  ArrowUpRight,
  Package,
  ChevronRight,
  Info,
  DollarSign
} from 'lucide-react';
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { useQuery } from '@tanstack/react-query';

// Fetch wallet data from API
const fetchWalletData = async () => {
  const walletId = localStorage.getItem('X-WALLET-ID');
  if (!walletId) return null;

  const response = await fetch('/api/user/wallet', {
    headers: { 'X-WALLET-ID': walletId },
  });

  if (!response.ok) throw new Error('Failed to fetch wallet');
  const result = await response.json();
  return result.data;
};

// Fetch earnings summary from API
const fetchEarningsSummary = async () => {
  const walletId = localStorage.getItem('X-WALLET-ID');
  if (!walletId) return null;

  const response = await fetch('/api/user/earnings/summary', {
    headers: { 'X-WALLET-ID': walletId },
  });

  if (!response.ok) throw new Error('Failed to fetch earnings summary');
  const result = await response.json();
  return result.data;
};
// Mock data for recent activity (since it's not connected to API yet)
const recentActivity = [
  { id: 1, type: 'dailyInterest', amount: 16.44, date: '2024-01-15', status: 'success' },
  { id: 2, type: 'earlyRedemption', amount: 30000, date: '2024-01-10', status: 'success' },
  { id: 3, type: 'dailyInterest', amount: 9.86, date: '2024-01-09', status: 'success' },
  { id: 4, type: 'redemption', amount: 5000, date: '2024-01-08', status: 'pending' },
  { id: 5, type: 'dailyInterest', amount: 12.50, date: '2024-01-07', status: 'success' },
];

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
  const currentWalletId = localStorage.getItem('X-WALLET-ID') || '';

  const { data: walletData } = useQuery({
    queryKey: ['walletData'],
    queryFn: fetchWalletData,
  });

  const { data: earningsSummary } = useQuery({
    queryKey: ['earningsSummary'],
    queryFn: fetchEarningsSummary,
  });

  const { data: activePackages = [] } = useQuery({
    queryKey: ['activePackages'],
    queryFn: fetchActivePackages,
  });

  const totalBalance = walletData?.totalBalance ?? 0;
  const availableBalance = walletData?.balanceAvailable ?? 0;
  const frozenBalance = walletData?.balanceFrozen ?? 0;

  const displayedPackages = activePackages.slice(0, 5);

  return (
    <MainLayout>
      <div className="p-6 max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-2xl font-bold mb-1">{t('dashboard.title')}</h1>
          <p className="text-muted-foreground">{t('dashboard.welcome')}, {currentWalletId}</p>
        </div>

        {/* Balance Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 mb-8">
          <BalanceCard
            title={t('dashboard.totalBalance')}
            value={totalBalance}
            icon={Wallet}
          />
          <BalanceCard
            title={t('dashboard.availableBalance')}
            value={availableBalance}
            icon={ArrowUpRight}
            tooltip={t('tooltip.availableBalance')}
          />
          <BalanceCard
            title={t('dashboard.frozenBalance')}
            value={frozenBalance}
            icon={Lock}
            tooltip={t('tooltip.frozenBalance')}
          />
          <BalanceCard
            title={t('dashboard.totalInterest')}
            value={earningsSummary?.totalInterest ?? 0}
            icon={TrendingUp}
            accent
          />
          <BalanceCard
            title="Withdraw Available"
            value={earningsSummary?.totalAvailable ?? 0}
            icon={DollarSign}
            tooltip="Total available amount ready for withdrawal"
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
              {displayedPackages.length === 0 && (
                <p className="text-sm text-muted-foreground text-center py-4">No active packages</p>
              )}
              {displayedPackages.map((pkg) => {
                const progress = Math.round((pkg.holdingDays / pkg.totalDays) * 100);
                return (
                  <div key={pkg.id} className="p-4 bg-secondary/30 rounded-lg">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-accent/10 rounded-lg flex items-center justify-center">
                          <Package className="w-5 h-5 text-accent" />
                        </div>
                        <div>
                          <p className="font-medium">{pkg.productName}</p>
                          <p className="text-sm text-muted-foreground">
                            ${pkg.principal.toLocaleString()} • {pkg.interestRate}% APR
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-sm text-muted-foreground">{t('packages.maturityDate')}</p>
                        <p className="font-medium">{pkg.maturityDate}</p>
                      </div>
                    </div>
                    <div className="progress-track">
                      <div className="progress-fill" style={{ width: `${progress}%` }} />
                    </div>
                    <p className="text-xs text-muted-foreground mt-2">{progress}% complete</p>
                  </div>
                );
              })}
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
                {recentActivity.map((activity) => (
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
