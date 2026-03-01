import { useLanguage } from '@/contexts/LanguageContext';
import { MainLayout } from '@/components/layout/MainLayout';
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
import { Search } from 'lucide-react';

interface WithdrawTransaction {
    txId: string;
    earningId: number;
    subscriptionId: string;
    date: string;
    availableBefore: number;
    amount: number;
    availableAfter: number;
    createdAt: string;
}

const fetchWithdrawTransactions = async (): Promise<WithdrawTransaction[]> => {
    const walletId = localStorage.getItem('X-WALLET-ID');
    if (!walletId) return [];

    const response = await fetch('/api/user/transaction/withdraw', {
        headers: { 'X-WALLET-ID': walletId },
    });

    if (!response.ok) {
        if (response.status === 404) return [];
        throw new Error('Failed to fetch withdraw transactions');
    }

    const result = await response.json();
    return result.data || [];
};

export default function WithdrawTransactionsPage() {
    const { t } = useLanguage();
    const [statusFilter, setStatusFilter] = useState('all');
    const [searchQuery, setSearchQuery] = useState('');

    const { data: rawTransactions = [], isLoading } = useQuery({
        queryKey: ['withdrawTransactions'],
        queryFn: fetchWithdrawTransactions,
    });

    const transactions = rawTransactions.map((tx) => ({
        id: tx.txId,
        type: 'Withdraw',
        earningId: tx.earningId,
        subscriptionId: tx.subscriptionId || `EARN-${tx.earningId}`,
        amount: tx.amount,
        availableBefore: tx.availableBefore,
        availableAfter: tx.availableAfter,
        date: tx.createdAt ? new Date(tx.createdAt).toLocaleDateString() : tx.date || 'N/A',
    }));

    const filteredTransactions = transactions.filter((tx) => {
        if (
            searchQuery &&
            !String(tx.subscriptionId).toLowerCase().includes(searchQuery.toLowerCase()) &&
            !String(tx.earningId).includes(searchQuery)
        )
            return false;
        return true;
    });

    return (
        <MainLayout>
            <div className="p-6 max-w-7xl mx-auto">
                {/* Header */}
                <div className="mb-8">
                    <h1 className="text-2xl font-bold mb-1">Withdraw Transactions</h1>
                    <p className="text-muted-foreground">
                        View all your withdrawal transaction history
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
                                    <th>Available Before</th>
                                    <th>{t('common.amount')}</th>
                                    <th>Available After</th>
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
                                    filteredTransactions.map((tx) => (
                                        <tr key={tx.id}>
                                            <td className="text-muted-foreground">{tx.date}</td>
                                            <td>
                                                <Badge className="status-pending">Withdraw</Badge>
                                            </td>
                                            <td className="text-muted-foreground font-mono text-sm">
                                                <span title={tx.subscriptionId}>
                                                    {tx.subscriptionId.length > 8
                                                        ? `${tx.subscriptionId.substring(0, 8)}...`
                                                        : tx.subscriptionId}
                                                </span>
                                            </td>
                                            <td className="text-muted-foreground">
                                                ${tx.availableBefore.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                                            </td>
                                            <td className="font-medium text-success">
                                                -${Math.abs(tx.amount).toLocaleString(undefined, { minimumFractionDigits: 2 })}
                                            </td>
                                            <td className="text-muted-foreground">
                                                ${tx.availableAfter.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>

                {!isLoading && filteredTransactions.length === 0 && (
                    <div className="data-card text-center py-12">
                        <p className="text-muted-foreground">No withdraw transactions found</p>
                    </div>
                )}
            </div>
        </MainLayout>
    );
}
