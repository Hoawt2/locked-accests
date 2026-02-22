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
import { Search, Filter, Calendar } from 'lucide-react';

// Mock data
const transactions = [
  { id: 1, type: 'dailyInterest', packageName: '90-Day Lock', amount: 16.44, date: '2024-01-20', status: 'success' },
  { id: 2, type: 'dailyInterest', packageName: '60-Day Lock', amount: 8.35, date: '2024-01-20', status: 'success' },
  { id: 3, type: 'dailyInterest', packageName: '30-Day Lock', amount: 2.32, date: '2024-01-20', status: 'pending' },
  { id: 4, type: 'subscription', packageName: '30-Day Lock', amount: -10000, date: '2024-01-20', status: 'success' },
  { id: 5, type: 'dailyInterest', packageName: '90-Day Lock', amount: 16.44, date: '2024-01-19', status: 'success' },
  { id: 6, type: 'dailyInterest', packageName: '60-Day Lock', amount: 8.35, date: '2024-01-19', status: 'success' },
  { id: 7, type: 'withdrawal', packageName: '-', amount: 500, date: '2024-01-18', status: 'success' },
  { id: 8, type: 'maturityPayout', packageName: '30-Day Lock (Old)', amount: 5215.50, date: '2024-01-15', status: 'success' },
  { id: 9, type: 'earlyRedemption', packageName: '60-Day Lock (Old)', amount: 14850.00, date: '2024-01-10', status: 'failed' },
];

export default function TransactionsPage() {
  const { t } = useLanguage();
  const [typeFilter, setTypeFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredTransactions = transactions.filter((tx) => {
    if (typeFilter !== 'all' && tx.type !== typeFilter) return false;
    if (statusFilter !== 'all' && tx.status !== statusFilter) return false;
    if (searchQuery && !tx.packageName.toLowerCase().includes(searchQuery.toLowerCase())) return false;
    return true;
  });

  const getTypeLabel = (type: string) => {
    const labels: Record<string, string> = {
      dailyInterest: t('transactions.dailyInterest'),
      earlyRedemption: t('transactions.earlyRedemption'),
      maturityPayout: t('transactions.maturityPayout'),
      withdrawal: t('transactions.withdrawal'),
      subscription: t('transactions.subscription'),
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
                  <SelectItem value="dailyInterest">{t('transactions.dailyInterest')}</SelectItem>
                  <SelectItem value="earlyRedemption">{t('transactions.earlyRedemption')}</SelectItem>
                  <SelectItem value="maturityPayout">{t('transactions.maturityPayout')}</SelectItem>
                  <SelectItem value="withdrawal">{t('transactions.withdrawal')}</SelectItem>
                  <SelectItem value="subscription">{t('transactions.subscription')}</SelectItem>
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
              <Button variant="outline" className="gap-2">
                <Calendar className="w-4 h-4" />
                Date Range
              </Button>
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
                  <th>Package</th>
                  <th>{t('common.amount')}</th>
                  <th>{t('common.status')}</th>
                </tr>
              </thead>
              <tbody>
                {filteredTransactions.map((tx) => (
                  <tr key={tx.id}>
                    <td className="text-muted-foreground">{tx.date}</td>
                    <td>
                      <span className="font-medium">{getTypeLabel(tx.type)}</span>
                    </td>
                    <td>{tx.packageName}</td>
                    <td className={`font-medium ${tx.amount > 0 ? 'text-success' : ''}`}>
                      {tx.amount > 0 ? '+' : ''}${Math.abs(tx.amount).toLocaleString(undefined, { minimumFractionDigits: 2 })}
                    </td>
                    <td>{getStatusBadge(tx.status)}</td>
                  </tr>
                ))}
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
