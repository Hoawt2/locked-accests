import { useLanguage } from '@/contexts/LanguageContext';
import { MainLayout } from '@/components/layout/MainLayout';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Clock,
  AlertTriangle,
  Eye,
  RefreshCw
} from 'lucide-react';

// Mock data
const pendingTransactions = [
  {
    id: 1,
    type: 'withdrawal',
    user: '3ff732cb-cf34-41fe-b587-3d2e8cb93c68',
    amount: 5000,
    reason: 'Insufficient liquidity',
    waitingTime: '2 hours',
    status: 'pending',
    createdAt: '2024-01-20 14:30',
  },
  {
    id: 2,
    type: 'maturity_payout',
    user: '8a2b5e1c-d4f7-48b2-a9c1-6e3f0d2c5b9a',
    amount: 25740.50,
    reason: 'Processing queue',
    waitingTime: '45 minutes',
    status: 'pending',
    createdAt: '2024-01-20 15:15',
  },
  {
    id: 3,
    type: 'early_redemption',
    user: '1c9e4b7a-5d8f-4a3c-b2e1-9f6d0c7b4a5e',
    amount: 14850.00,
    reason: 'Manual review required',
    waitingTime: '4 hours',
    status: 'pending',
    createdAt: '2024-01-20 12:00',
  },
  {
    id: 4,
    type: 'interest_payout',
    user: '5f8d2a1b-c3e9-40b7-9a4c-8e2d1f0b6e3d',
    amount: 156.80,
    reason: 'System delay',
    waitingTime: '30 minutes',
    status: 'pending',
    createdAt: '2024-01-20 15:30',
  },
];

export default function AdminPendingPage() {
  const { t } = useLanguage();

  const getTypeBadge = (type: string) => {
    const types: Record<string, { label: string; className: string }> = {
      withdrawal: { label: t('transactions.withdrawal'), className: 'bg-info/10 text-info border-info/20' },
      maturity_payout: { label: t('transactions.maturityPayout'), className: 'bg-success/10 text-success border-success/20' },
      early_redemption: { label: t('transactions.earlyRedemption'), className: 'bg-warning/10 text-warning border-warning/20' },
      interest_payout: { label: t('transactions.dailyInterest'), className: 'bg-accent/10 text-accent border-accent/20' },
    };
    return types[type] || { label: type, className: 'bg-muted text-muted-foreground' };
  };

  const getStatusBadge = (status: string) => {
    return <Badge className="status-pending">{t('common.pending')}</Badge>;
  };

  const totalPending = pendingTransactions.reduce((sum, tx) => sum + tx.amount, 0);

  return (
    <MainLayout>
      <div className="p-6 max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-bold mb-1">{t('admin.pending.title')}</h1>
            <p className="text-muted-foreground">
              {pendingTransactions.length} transactions pending processing
            </p>
          </div>
          <Button variant="outline" className="gap-2">
            <RefreshCw className="w-4 h-4" />
            Refresh
          </Button>
        </div>

        {/* Summary */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
          <div className="data-card">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 bg-warning/10 rounded-lg flex items-center justify-center">
                <Clock className="w-5 h-5 text-warning" />
              </div>
              <span className="text-sm text-muted-foreground">Pending Count</span>
            </div>
            <p className="text-2xl font-bold">{pendingTransactions.length}</p>
          </div>
          <div className="data-card">
            <p className="text-sm text-muted-foreground mb-2">Total Pending Amount</p>
            <p className="text-2xl font-bold">${totalPending.toLocaleString()}</p>
          </div>
        </div>

        {/* Transactions Table */}
        <div className="data-card overflow-hidden p-0">
          <div className="overflow-x-auto">
            <table className="fintech-table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>{t('transactions.type')}</th>
                  <th>User</th>
                  <th>{t('common.amount')}</th>
                  <th>{t('admin.pending.reason')}</th>
                  <th>{t('admin.pending.waitingTime')}</th>
                  <th>{t('common.status')}</th>
                </tr>
              </thead>
              <tbody>
                {pendingTransactions.map((tx) => {
                  const typeBadge = getTypeBadge(tx.type);
                  return (
                    <tr key={tx.id}>
                      <td className="font-mono text-sm">#{tx.id.toString().padStart(6, '0')}</td>
                      <td>
                        <Badge className={typeBadge.className}>{typeBadge.label}</Badge>
                      </td>
                      <td className="text-muted-foreground">{tx.user}</td>
                      <td className="font-medium">${tx.amount.toLocaleString()}</td>
                      <td className="text-sm">{tx.reason}</td>
                      <td>
                        <div className="flex items-center gap-1">
                          <Clock className="w-4 h-4 text-muted-foreground" />
                          <span>{tx.waitingTime}</span>
                        </div>
                      </td>
                      <td>{getStatusBadge(tx.status)}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        {pendingTransactions.length === 0 && (
          <div className="data-card text-center py-12">
            <Clock className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
            <p className="text-muted-foreground">{t('admin.pending.noTransactions')}</p>
          </div>
        )}
      </div>
    </MainLayout>
  );
}
