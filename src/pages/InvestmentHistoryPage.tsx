import { useLanguage } from '@/contexts/LanguageContext';
import { MainLayout } from '@/components/layout/MainLayout';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  TrendingUp, 
  DollarSign,
  CheckCircle2,
  Clock
} from 'lucide-react';

// Mock data
const investments = [
  {
    id: 1,
    productName: '90-Day Lock',
    principal: 25000,
    interestEarned: 740.50,
    finalAmount: 25740.50,
    startDate: '2023-10-01',
    completedDate: '2023-12-30',
    status: 'matured',
    apr: 12.0,
  },
  {
    id: 2,
    productName: '60-Day Lock',
    principal: 15000,
    interestEarned: 180.00,
    penaltyAmount: 375.00,
    finalAmount: 14805.00,
    startDate: '2023-11-15',
    completedDate: '2023-12-20',
    status: 'early_redeemed',
    apr: 10.2,
  },
  {
    id: 3,
    productName: '30-Day Lock',
    principal: 5000,
    interestEarned: 35.20,
    finalAmount: 5035.20,
    startDate: '2023-12-01',
    completedDate: '2023-12-31',
    status: 'matured',
    apr: 8.5,
  },
  {
    id: 4,
    productName: '180-Day Lock',
    principal: 50000,
    interestEarned: 3875.00,
    finalAmount: 53875.00,
    startDate: '2023-06-15',
    completedDate: '2023-12-12',
    status: 'matured',
    apr: 15.5,
  },
];

export default function InvestmentHistoryPage() {
  const { t } = useLanguage();

  const totalInvested = investments.reduce((sum, inv) => sum + inv.principal, 0);
  const totalEarned = investments.reduce((sum, inv) => sum + inv.interestEarned, 0);
  const maturedCount = investments.filter(inv => inv.status === 'matured').length;

  const getStatusBadge = (status: string) => {
    if (status === 'matured') {
      return <Badge className="status-success">{t('history.matured')}</Badge>;
    }
    return <Badge className="status-warning">{t('history.earlyRedeemed')}</Badge>;
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
                  <th>{t('packages.principal')}</th>
                  <th>{t('packages.interestRate')}</th>
                  <th>Interest Earned</th>
                  <th>{t('history.finalAmount')}</th>
                  <th>{t('packages.startDate')}</th>
                  <th>{t('history.completedDate')}</th>
                  <th>{t('common.status')}</th>
                </tr>
              </thead>
              <tbody>
                {investments.map((inv) => (
                  <tr key={inv.id}>
                    <td className="font-medium">{inv.productName}</td>
                    <td>${inv.principal.toLocaleString()}</td>
                    <td>
                      <Badge className="status-success">{inv.apr}%</Badge>
                    </td>
                    <td className="text-success font-medium">
                      +${inv.interestEarned.toLocaleString()}
                    </td>
                    <td className="font-semibold">${inv.finalAmount.toLocaleString()}</td>
                    <td className="text-muted-foreground">{inv.startDate}</td>
                    <td className="text-muted-foreground">{inv.completedDate}</td>
                    <td>{getStatusBadge(inv.status)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </MainLayout>
  );
}
