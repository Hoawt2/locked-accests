import { useLanguage } from '@/contexts/LanguageContext';
import { MainLayout } from '@/components/layout/MainLayout';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  TrendingUp,
  DollarSign,
  CheckCircle2,
  Clock,
  Info
} from 'lucide-react';
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { useQuery } from '@tanstack/react-query';

interface CompletedSubscription {
  subscriptionId: string;
  termDays: number;
  principal: number;
  interestRate: number;
  interestEarned: number;
  finalAmount: number;
  startDate: string;
  completedDate: string;
  status: string;
  penaltyRate: number;
  earlyRedeemRate: number;
}

const fetchCompletedSubscriptions = async (): Promise<CompletedSubscription[]> => {
  const walletId = localStorage.getItem('X-WALLET-ID');
  if (!walletId) return [];

  const response = await fetch('/api/user/subscriptions/completed', {
    headers: { 'X-WALLET-ID': walletId },
  });

  if (!response.ok) {
    if (response.status === 404) return [];
    throw new Error('Failed to fetch completed subscriptions');
  }

  const result = await response.json();
  return result.data || [];
};

export default function InvestmentHistoryPage() {
  const { t } = useLanguage();

  const { data: investments = [], isLoading } = useQuery({
    queryKey: ['completedSubscriptions'],
    queryFn: fetchCompletedSubscriptions,
  });

  const totalInvested = investments.reduce((sum, inv) => sum + inv.principal, 0);
  const totalEarned = investments.reduce((sum, inv) => sum + (inv.interestEarned || 0), 0);
  const maturedCount = investments.filter(inv => inv.status?.toUpperCase() === 'MATURED').length;

  const getStatusBadge = (status: string) => {
    const upper = status?.toUpperCase();
    if (upper === 'MATURED') {
      return <Badge className="status-success">{t('history.matured')}</Badge>;
    }
    if (upper === 'EARLY_REDEEMED') {
      return <Badge className="status-warning">{t('history.earlyRedeemed')}</Badge>;
    }
    return <Badge className="status-pending">{status}</Badge>;
  };

  return (
    <MainLayout>
      <div className="p-6 max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-2xl font-bold mb-1">{t('history.title')}</h1>
          <p className="text-muted-foreground">
            View your completed investments
          </p>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <div className="data-card">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 bg-secondary rounded-lg flex items-center justify-center">
                <DollarSign className="w-5 h-5 text-muted-foreground" />
              </div>
              <span className="text-sm text-muted-foreground">Total Invested</span>
            </div>
            <p className="text-2xl font-bold">${totalInvested.toLocaleString()}</p>
          </div>
          <div className="data-card">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 bg-accent/10 rounded-lg flex items-center justify-center">
                <TrendingUp className="w-5 h-5 text-accent" />
              </div>
              <span className="text-sm text-muted-foreground">Total Interest Earned</span>
            </div>
            <p className="text-2xl font-bold text-accent">+${totalEarned.toLocaleString()}</p>
          </div>
          <div className="data-card">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 bg-success/10 rounded-lg flex items-center justify-center">
                <CheckCircle2 className="w-5 h-5 text-success" />
              </div>
              <span className="text-sm text-muted-foreground">Matured Investments</span>
            </div>
            <p className="text-2xl font-bold">{maturedCount} / {investments.length}</p>
          </div>
        </div>

        {/* History Table */}
        <div className="data-card overflow-hidden p-0">
          <div className="overflow-x-auto">
            <table className="fintech-table">
              <thead>
                <tr>
                  <th>Product</th>
                  <th>Subscription</th>
                  <th>{t('packages.principal')}</th>
                  <th>{t('packages.interestRate')}</th>
                  <th>
                    <div className="flex items-center gap-1">
                      Early Redeem Rate
                      <Tooltip>
                        <TooltipTrigger>
                          <Info className="w-3.5 h-3.5 text-muted-foreground" />
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>The effective interest rate applied if you redeem before maturity</p>
                        </TooltipContent>
                      </Tooltip>
                    </div>
                  </th>
                  <th>Interest Earned</th>
                  <th>{t('history.finalAmount')}</th>
                  <th>{t('packages.startDate')}</th>
                  <th>{t('history.completedDate')}</th>
                  <th>{t('common.status')}</th>
                </tr>
              </thead>
              <tbody>
                {isLoading ? (
                  <tr>
                    <td colSpan={10} className="text-center py-8 text-muted-foreground">
                      Loading history...
                    </td>
                  </tr>
                ) : investments.map((inv) => {
                  const aprPercent = Number((inv.interestRate * 100).toFixed(2));
                  const earlyRedeemPercent = Number(((inv.earlyRedeemRate || 0) * 100).toFixed(2));
                  return (
                    <tr key={inv.subscriptionId}>
                      <td className="font-medium">{inv.termDays}-Day Lock</td>
                      <td className="text-sm font-mono text-muted-foreground">
                        <span title={inv.subscriptionId}>
                          {inv.subscriptionId.length > 8
                            ? `${inv.subscriptionId.substring(0, 8)}...`
                            : inv.subscriptionId}
                        </span>
                      </td>
                      <td>${inv.principal.toLocaleString()}</td>
                      <td>
                        <Badge className="status-success">{aprPercent}%</Badge>
                      </td>
                      <td>
                        <Badge variant="default" className="bg-orange-500 hover:bg-orange-600 text-white border-transparent shadow-sm">
                          {earlyRedeemPercent}%
                        </Badge>
                      </td>
                      <td className="text-success font-medium">
                        +${(inv.interestEarned || 0).toLocaleString()}
                      </td>
                      <td className="font-semibold">${(inv.finalAmount || 0).toLocaleString()}</td>
                      <td className="text-muted-foreground">{inv.startDate}</td>
                      <td className="text-muted-foreground">{inv.completedDate}</td>
                      <td>{getStatusBadge(inv.status)}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        {!isLoading && investments.length === 0 && (
          <div className="data-card text-center py-12">
            <p className="text-muted-foreground">No investment history found</p>
          </div>
        )}
      </div>
    </MainLayout>
  );
}
