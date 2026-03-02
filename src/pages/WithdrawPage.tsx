import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useLanguage } from '@/contexts/LanguageContext';
import { MainLayout } from '@/components/layout/MainLayout';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { ArrowDownToLine, Info, ArrowRight, CheckCircle2, XCircle } from 'lucide-react';
import {
    Tooltip,
    TooltipContent,
    TooltipTrigger,
} from '@/components/ui/tooltip';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from '@/components/ui/dialog';
import { useQuery, useQueryClient } from '@tanstack/react-query';

interface EarningData {
    earningId: number;
    termDays: number;
    principal: number;
    availableToWithdraw: number;
    accruedInterest: number;
    holdingDays: number;
    progress: number;
}

const fetchEarnings = async (): Promise<EarningData[]> => {
    const walletId = localStorage.getItem('X-WALLET-ID');
    if (!walletId) return [];

    const response = await fetch('/api/user/earnings', {
        headers: { 'X-WALLET-ID': walletId },
    });

    if (!response.ok) {
        if (response.status === 404) return [];
        throw new Error('Failed to fetch earnings');
    }

    const result = await response.json();
    return result.data || [];
};

function WithdrawActionDialog({
    earning,
    onSuccess,
    onError
}: {
    earning: EarningData;
    onSuccess: (amount: number) => void;
    onError: (error: string) => void;
}) {
    const { t } = useLanguage();
    const [isOpen, setIsOpen] = useState(false);
    const [amount, setAmount] = useState<string>('');
    const [isConfirming, setIsConfirming] = useState(false);
    const [error, setError] = useState<string>('');

    const walletId = localStorage.getItem('X-WALLET-ID') || '';
    const parsedAmount = parseFloat(amount || '0');

    const handleConfirm = async () => {
        if (parsedAmount <= 0) {
            setError(t('withdraw.errorMin') || 'Please enter a valid amount greater than 0.');
            return;
        }
        if (parsedAmount > earning.availableToWithdraw) {
            setError(t('withdraw.errorMax') || 'Withdrawal amount exceeds available balance.');
            return;
        }

        setError('');
        setIsConfirming(true);

        try {
            const response = await fetch('/api/user/earnings/withdraw', {
                method: 'POST',
                headers: {
                    'X-WALLET-ID': walletId,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    earningId: earning.earningId,
                    amount: parsedAmount,
                }),
            });

            const result = await response.json();

            if (!response.ok) {
                throw new Error(result.message || 'Withdrawal failed');
            }

            setIsOpen(false);
            setAmount('');
            onSuccess(parsedAmount);
            // Refresh earnings data happens in parent
        } catch (err) {
            const errorMsg = err instanceof Error ? err.message : 'Something went wrong';
            setError(errorMsg);
            setIsOpen(false);
            onError(errorMsg);
        } finally {
            setIsConfirming(false);
        }
    };

    const handleMaxClick = () => {
        setAmount(earning.availableToWithdraw.toString());
        setError('');
    };

    const handleOpenChange = (open: boolean) => {
        setIsOpen(open);
        if (!open) {
            setAmount('');
            setError('');
        }
    };

    if (earning.availableToWithdraw <= 0) {
        return (
            <Button variant="outline" size="sm" disabled>
                <ArrowDownToLine className="w-4 h-4 mr-1" />
                {t('packages.withdraw') || 'Withdraw'}
            </Button>
        );
    }

    return (
        <Dialog open={isOpen} onOpenChange={handleOpenChange}>
            <DialogTrigger asChild>
                <Button variant="outline" size="sm" className="text-accent hover:text-accent hover:bg-accent/10 border-accent/20">
                    <ArrowDownToLine className="w-4 h-4 mr-1" />
                    {t('packages.withdraw') || 'Withdraw'}
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-md">
                <DialogHeader>
                    <DialogTitle>{t('withdraw.title') || 'Withdraw Available Amount'}</DialogTitle>
                    <DialogDescription>
                        {t('withdraw.enterAmount') || 'Enter the amount you wish to withdraw to your wallet.'}
                    </DialogDescription>
                </DialogHeader>

                <div className="space-y-4 py-4">
                    <div className="p-4 bg-secondary/50 rounded-lg flex justify-between items-center mb-4">
                        <span className="text-muted-foreground">{t('withdraw.availableToWithdraw') || 'Available to Withdraw'}</span>
                        <span className="text-xl font-bold text-accent">${earning.availableToWithdraw.toLocaleString()}</span>
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                            {t('common.amount') || 'Amount'}
                        </label>
                        <div className="relative relative-input flex items-center">
                            <span className="absolute left-3 text-muted-foreground">$</span>
                            <Input
                                type="number"
                                placeholder="0.00"
                                value={amount}
                                onChange={(e) => {
                                    setAmount(e.target.value);
                                    setError('');
                                }}
                                className={`pl-7 pr-16 ${error ? 'border-destructive focus-visible:ring-destructive' : ''}`}
                                min="0"
                                step="0.01"
                            />
                            <Button
                                type="button"
                                variant="ghost"
                                size="sm"
                                className="absolute right-1 h-7 text-xs text-accent hover:text-accent font-semibold"
                                onClick={handleMaxClick}
                            >
                                MAX
                            </Button>
                        </div>
                        {error && <p className="text-xs text-destructive">{error}</p>}
                    </div>
                </div>

                <DialogFooter className="gap-2">
                    <Button variant="outline" onClick={() => handleOpenChange(false)}>{t('common.cancel')}</Button>
                    <Button
                        onClick={handleConfirm}
                        disabled={isConfirming || !amount || parsedAmount <= 0}
                        className="bg-accent hover:bg-accent/90"
                    >
                        {isConfirming ? t('common.loading') : t('common.confirm')}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}

export default function WithdrawPage() {
    const { t } = useLanguage();
    const navigate = useNavigate();
    const queryClient = useQueryClient();

    const { data: earningsData = [], isLoading } = useQuery({
        queryKey: ['earnings'],
        queryFn: fetchEarnings,
    });

    const [result, setResult] = useState<'success' | 'failed' | null>(null);
    const [withdrawAmount, setWithdrawAmount] = useState<number>(0);
    const [errorMessage, setErrorMessage] = useState('');

    const handleSuccess = (amount: number) => {
        setWithdrawAmount(amount);
        setResult('success');
        queryClient.invalidateQueries({ queryKey: ['earnings'] });
    };

    const handleError = (error: string) => {
        setErrorMessage(error);
        setResult('failed');
    };

    if (result) {
        return (
            <MainLayout hideSidebar>
                <div className="p-6 max-w-md mx-auto text-center py-20">
                    <div className={`w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6 ${result === 'success' ? 'bg-success/10' : 'bg-destructive/10'
                        }`}>
                        {result === 'success' ? (
                            <CheckCircle2 className="w-10 h-10 text-success" />
                        ) : (
                            <XCircle className="w-10 h-10 text-destructive" />
                        )}
                    </div>
                    <h1 className="text-2xl font-bold mb-2">
                        {result === 'success' ? 'Withdrawal Successful' : 'Withdrawal Failed'}
                    </h1>
                    <p className="text-muted-foreground mb-8">
                        {result === 'success'
                            ? `You have successfully withdrawn $${withdrawAmount.toLocaleString()}. The funds should be available in your wallet.`
                            : errorMessage || 'There was an error processing your withdrawal. Please try again.'
                        }
                    </p>
                    <div className="flex gap-4 justify-center">
                        {result === 'success' ? (
                            <>
                                <Link to="/withdraw/transactions">
                                    <Button className="bg-accent hover:bg-accent/90">
                                        View Transactions
                                    </Button>
                                </Link>
                                <Button variant="outline" onClick={() => setResult(null)}>
                                    Back to Withdraw
                                </Button>
                            </>
                        ) : (
                            <>
                                <Button onClick={() => setResult(null)}>
                                    Try Again
                                </Button>
                                <Link to="/dashboard">
                                    <Button variant="outline">
                                        {t('nav.dashboard')}
                                    </Button>
                                </Link>
                            </>
                        )}
                    </div>
                </div>
            </MainLayout>
        );
    }

    return (
        <MainLayout>
            <div className="p-6 max-w-7xl mx-auto">
                {/* Header */}
                <div className="mb-8 flex items-start justify-between">
                    <div>
                        <h1 className="text-2xl font-bold mb-1">{t('nav.withdraw') || 'Withdraw Available'}</h1>
                        <p className="text-muted-foreground">
                            {t('withdraw.subtitle') || 'Withdraw your accumulated interest and available funds.'}
                        </p>
                    </div>
                    <Button
                        variant="outline"
                        onClick={() => navigate('/withdraw/transactions')}
                        className="flex items-center gap-2"
                    >
                        Withdraw Transactions
                        <ArrowRight className="w-4 h-4" />
                    </Button>
                </div>

                {/* WithdrawTable */}
                <div className="data-card overflow-hidden p-0">
                    <div className="overflow-x-auto">
                        <table className="fintech-table">
                            <thead>
                                <tr>
                                    <th>Product</th>
                                    <th>{t('packages.principal') || 'Principal'}</th>
                                    <th>
                                        <div className="flex items-center gap-1">
                                            {t('withdraw.availableToWithdraw') || 'Available'}
                                            <Tooltip>
                                                <TooltipTrigger>
                                                    <Info className="w-3.5 h-3.5 text-muted-foreground" />
                                                </TooltipTrigger>
                                                <TooltipContent>
                                                    <p>Total funds currently available for immediate withdrawal</p>
                                                </TooltipContent>
                                            </Tooltip>
                                        </div>
                                    </th>
                                    <th>{t('packages.accruedInterest') || 'Total Interest'}</th>
                                    <th>{t('packages.holdingDays') || 'Holding Days'}</th>
                                    <th>
                                        <div className="flex items-center gap-1">
                                            {t('packages.progress') || 'Progress'}
                                            <Tooltip>
                                                <TooltipTrigger>
                                                    <Info className="w-3.5 h-3.5 text-muted-foreground" />
                                                </TooltipTrigger>
                                                <TooltipContent>
                                                    <p>{t('tooltip.progress') || 'Time elapsed within the lock term'}</p>
                                                </TooltipContent>
                                            </Tooltip>
                                        </div>
                                    </th>
                                    <th>{t('common.action') || 'Action'}</th>
                                </tr>
                            </thead>
                            <tbody>
                                {isLoading ? (
                                    <tr>
                                        <td colSpan={7} className="text-center py-8 text-muted-foreground">
                                            Loading earnings...
                                        </td>
                                    </tr>
                                ) : earningsData.map((earning) => {
                                    const progress = Math.round(earning.progress * 100);
                                    return (
                                        <tr key={earning.earningId}>
                                            <td>
                                                <div className="font-medium">{earning.termDays}-Day Lock</div>
                                            </td>
                                            <td className="text-muted-foreground">${earning.principal.toLocaleString()}</td>
                                            <td className="font-bold text-accent">
                                                ${earning.availableToWithdraw.toLocaleString()}
                                            </td>
                                            <td className="text-success font-medium">
                                                +${earning.accruedInterest.toLocaleString()}
                                            </td>
                                            <td>
                                                {earning.holdingDays} / {earning.termDays} {t('common.days')}
                                            </td>
                                            <td>
                                                <div className="flex items-center gap-2">
                                                    <div className="progress-track w-20">
                                                        <div className="progress-fill" style={{ width: `${progress}%` }} />
                                                    </div>
                                                    <span className="text-sm text-muted-foreground">{progress}%</span>
                                                </div>
                                            </td>
                                            <td>
                                                <WithdrawActionDialog
                                                    earning={earning}
                                                    onSuccess={handleSuccess}
                                                    onError={handleError}
                                                />
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>
                </div>

                {!isLoading && earningsData.length === 0 && (
                    <div className="data-card text-center py-12">
                        <p className="text-muted-foreground">{t('packages.noPackages') || 'No earnings data found.'}</p>
                    </div>
                )}
            </div>
        </MainLayout>
    );
}
