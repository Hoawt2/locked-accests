import { useLanguage } from '@/contexts/LanguageContext';
import { MainLayout } from '@/components/layout/MainLayout';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Search, Filter, Calendar } from 'lucide-react';
import { fetchActivePackages } from '@/pages/ActivePackagesPage';

// Fetch earning transactions
const fetchTransactions = async () => {
  const walletId = localStorage.getItem('X-WALLET-ID');
  if (!walletId) return [];

  const response = await fetch('/api/user/transaction/earning', {
    headers: { 'X-WALLET-ID': walletId },
  });

  if (!response.ok) {
    if (response.status === 404) return [];
    throw new Error('Failed to fetch transactions');
  }

  const result = await response.json();
  return result.data || [];
};



export default function TransactionsPage() {
  const { t } = useLanguage();
  const [typeFilter, setTypeFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  const { data: rawTransactions = [], isLoading } = useQuery({
    queryKey: ['earningTransactions'],
    queryFn: fetchTransactions,
  });

  const { data: activePackages = [] } = useQuery({
    queryKey: ['activePackages'],
    queryFn: fetchActivePackages,
  });

  // Map transactions to include subscriptionId if available
  const transactions = rawTransactions.map((tx: any) => {
    const matchedPackage = activePackages.find((pkg: any) => pkg.earningId === tx.earningId);
    return {
      id: tx.txId,
      originalType: tx.type,
      type: tx.type === 'DAILY_INTEREST' ? 'dailyInterest' : tx.type === 'EARLY_REDEEMED' ? 'earlyRedemption' : 'redemption',
      earningId: tx.earningId,
      subscriptionId: matchedPackage ? matchedPackage.id : `EARN-${tx.earningId}`,
      amount: tx.amount,
      date: tx.createdAt ? new Date(tx.createdAt).toLocaleDateString() : 'N/A',
      status: tx.status === 'SUCCESS' ? 'success' : tx.status === 'PENDING' ? 'pending' : 'failed',
    };
  });

  const filteredTransactions = transactions.filter((tx: any) => {
    if (typeFilter !== 'all' && tx.type !== typeFilter) return false;
    if (statusFilter !== 'all' && tx.status !== statusFilter) return false;
    if (searchQuery && !String(tx.subscriptionId).toLowerCase().includes(searchQuery.toLowerCase()) && !String(tx.earningId).includes(searchQuery)) return false;
    return true;
  });

  const getTypeLabel = (type: string) => {
    const labels: Record<string, string> = {
      dailyInterest: 'Daily Interest',
      earlyRedemption: 'Early Redemption',
      redemption: 'Redemption',
    };
    return labels[type] || type;
  };

  const getStatusBadge = (status: string) => {
    const styles: Record<string, string> = {
      success: 'status-success',
      pending: 'status-pending',
      failed: 'status-error',
    };
    const labels: Record<string, string> = {
      success: t('common.success'),
      pending: t('common.pending'),
      failed: t('common.failed'),
    };
    return <Badge className={styles[status]}>{labels[status]}</Badge>;
  };

  return (
    <MainLayout>
      <div className="p-6 max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-2xl font-bold mb-1">{t('transactions.title')}</h1>
          <p className="text-muted-foreground">
            View all your transaction history
          </p>
        </div>

        {/* Filters */}
        <div className="data-card mb-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder={t('common.search')}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            <div className="flex gap-3">
              <Select value={typeFilter} onValueChange={setTypeFilter}>
                <SelectTrigger className="w-[180px]">
                  <Filter className="w-4 h-4 mr-2" />
                  <SelectValue placeholder={t('transactions.type')} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">{t('common.all')}</SelectItem>
                  <SelectItem value="dailyInterest">Daily Interest</SelectItem>
                  <SelectItem value="earlyRedemption">Early Redemption</SelectItem>
                  <SelectItem value="redemption">Redemption</SelectItem>
                </SelectContent>
              </Select>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-[140px]">
                  <SelectValue placeholder={t('common.status')} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">{t('common.all')}</SelectItem>
                  <SelectItem value="success">{t('common.success')}</SelectItem>
                  <SelectItem value="pending">{t('common.pending')}</SelectItem>
                  <SelectItem value="failed">{t('common.failed')}</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>

        {/* Transactions Table */}
        <div className="data-card overflow-hidden p-0">
          <div className="overflow-x-auto">
            <table className="fintech-table">
              <thead>
                <tr>
                  <th>{t('common.date')}</th>
                  <th>{t('transactions.type')}</th>
                  <th>Subscription</th>
                  <th>{t('common.amount')}</th>
                  <th>{t('common.status')}</th>
                </tr>
              </thead>
              <tbody>
                {isLoading ? (
                  <tr>
                    <td colSpan={6} className="text-center py-8 text-muted-foreground">
                      Loading transactions...
                    </td>
                  </tr>
                ) : (
                  filteredTransactions.map((tx: any) => (
                    <tr key={tx.id}>
                      <td className="text-muted-foreground">{tx.date}</td>
                      <td>
                        <span className="font-medium">{getTypeLabel(tx.type)}</span>
                      </td>
                      <td className="text-muted-foreground font-mono text-sm">{tx.subscriptionId}</td>
                      <td className={`font-medium ${tx.amount > 0 ? 'text-success' : ''}`}>
                        {tx.amount > 0 ? '+' : ''}${Math.abs(tx.amount).toLocaleString(undefined, { minimumFractionDigits: 2 })}
                      </td>
                      <td>{getStatusBadge(tx.status)}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {filteredTransactions.length === 0 && (
          <div className="data-card text-center py-12">
            <p className="text-muted-foreground">No transactions found</p>
          </div>
        )}
      </div>
    </MainLayout>
  );
}
