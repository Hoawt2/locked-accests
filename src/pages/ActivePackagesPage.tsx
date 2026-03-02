import { useLanguage } from '@/contexts/LanguageContext';
import { MainLayout } from '@/components/layout/MainLayout';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Clock,
  Info,
  AlertTriangle,
  CheckCircle2,
  XCircle
} from 'lucide-react';
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
import { useState } from 'react';
import { Link } from 'react-router-dom';

import { useQuery, useQueryClient } from '@tanstack/react-query';

interface ActionPackageResponse {
  subscriptionId: string;
  earningId: number;
  productId: number;
  startDate: string;
  maturityDate: string;
  principal: number;
  interestRate: number;
  accruedInterest: number;
  holdingDays: number;
  progress: number;
  available: number;
}

export interface PackageData {
  id: string; // This is the subscriptionId
  earningId: number;
  productName: string;
  principal: number;
  interestRate: number;
  accruedInterest: number;
  holdingDays: number;
  totalDays: number;
  startDate: string;
  maturityDate: string;
  availableAmount: number;
  earlyRedemptionEligible: boolean;
  penaltyRate: number;
}

export const fetchActivePackages = async (): Promise<PackageData[]> => {
  const walletId = localStorage.getItem('X-WALLET-ID');
  // For safety, providing an empty array if no wallet ID exists yet
  if (!walletId) return [];

  const response = await fetch('/api/user/subscriptions/active', {
    headers: {
      'X-WALLET-ID': walletId,
    },
  });

  if (!response.ok) {
    throw new Error('Failed to fetch active packages');
  }

  const result = await response.json();
  const data: ActionPackageResponse[] = result.data || [];

  return data.map((pkg) => {
    const start = new Date(pkg.startDate);
    const maturity = new Date(pkg.maturityDate);
    const termDays = (Math.round((maturity.getTime() - start.getTime()) / (1000 * 60 * 60 * 24))) + 1;

    return {
      id: pkg.subscriptionId,
      earningId: pkg.earningId,
      productName: `${termDays}-Lock Day`,
      principal: pkg.principal,
      interestRate: Number((pkg.interestRate * 100).toFixed(2)),
      accruedInterest: pkg.accruedInterest || 0,
      holdingDays: pkg.holdingDays || 0,
      totalDays: termDays || 1,
      startDate: pkg.startDate,
      maturityDate: pkg.maturityDate,
      availableAmount: pkg.available || 0,
      earlyRedemptionEligible: true,
      penaltyRate: 3.5,
    };
  });
};

interface EarlyRedeemPreview {
  earningId: number;
  principal: number;
  accruedInterest: number;
  currentProgress: number;
  penaltyRate: number;
  penaltyAmount: number;
  finalReceivableAmount: number;
}

function EarlyRedemptionDialog({
  pkg,
  onSuccess,
  onError
}: {
  pkg: PackageData;
  onSuccess: (amount: number) => void;
  onError: (error: string) => void;
}) {
  const { t } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);
  const [isConfirming, setIsConfirming] = useState(false);
  const [preview, setPreview] = useState<EarlyRedeemPreview | null>(null);
  const [isLoadingPreview, setIsLoadingPreview] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const walletId = localStorage.getItem('X-WALLET-ID') || '';

  const fetchPreview = async () => {
    setIsLoadingPreview(true);
    setError(null);
    try {
      const response = await fetch(`/api/user/earnings/${pkg.earningId}/early-redeem/preview`, {
        headers: { 'X-WALLET-ID': walletId },
      });
      const result = await response.json();
      if (!response.ok) {
        throw new Error(result.message || 'Failed to fetch preview');
      }
      setPreview(result.data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong');
    } finally {
      setIsLoadingPreview(false);
    }
  };

  const handleOpenChange = (open: boolean) => {
    setIsOpen(open);
    if (open) {
      fetchPreview();
    } else {
      setPreview(null);
      setError(null);
    }
  };

  const handleConfirm = async () => {
    setIsConfirming(true);
    setError(null);
    try {
      const response = await fetch(`/api/user/earnings/${pkg.earningId}/early-redeem`, {
        method: 'POST',
        headers: {
          'X-WALLET-ID': walletId,
          'Content-Type': 'application/json',
        },
      });
      if (!response.ok) throw new Error('Early redemption failed');
      setIsOpen(false);
      if (preview) {
        onSuccess(preview.finalReceivableAmount);
      } else {
        onSuccess(0);
      }
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : 'Something went wrong';
      setError(errorMsg);
      setIsOpen(false);
      onError(errorMsg);
    } finally {
      setIsConfirming(false);
    }
  };



  return (
    <Dialog open={isOpen} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        <Button
          variant="outline"
          size="sm"
          className="text-destructive border-destructive/30 hover:bg-destructive/10"
          disabled={!pkg.earlyRedemptionEligible}
        >
          <Clock className="w-4 h-4 mr-1" />
          {t('packages.earlyRedemption')}
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <AlertTriangle className="w-5 h-5 text-warning" />
            {t('redemption.title')}
          </DialogTitle>
          <DialogDescription>
            {t('redemption.warning')}
          </DialogDescription>
        </DialogHeader>

        {isLoadingPreview ? (
          <div className="flex items-center justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
          </div>
        ) : error ? (
          <div className="py-6 text-center text-destructive text-sm">{error}</div>
        ) : preview ? (
          <>
            <div className="space-y-4 py-4">
              <div className="p-4 bg-secondary/50 rounded-lg space-y-3">
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">{t('packages.principal')}</span>
                  <span className="font-medium">${preview.principal.toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">{t('packages.accruedInterest')}</span>
                  <span className="font-medium text-success">+${preview.accruedInterest.toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">{t('redemption.currentProgress')}</span>
                  <span className="font-medium">{preview.currentProgress}%</span>
                </div>
                <hr className="border-border" />
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">{t('redemption.penaltyRate')}</span>
                  <span className="font-medium text-destructive">{preview.penaltyRate}%</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">{t('redemption.penaltyAmount')}</span>
                  <span className="font-medium text-destructive">-${preview.penaltyAmount.toLocaleString()}</span>
                </div>
                <hr className="border-border" />
                <div className="flex justify-between">
                  <span className="font-medium">{t('redemption.finalAmount')}</span>
                  <span className="text-lg font-bold text-accent">${preview.finalReceivableAmount.toLocaleString()}</span>
                </div>
              </div>

              <p className="text-sm text-muted-foreground text-center">
                {t('redemption.confirmMessage')}
              </p>
            </div>

            <DialogFooter className="gap-2">
              <Button variant="outline" onClick={() => setIsOpen(false)}>
                {t('common.cancel')}
              </Button>
              <Button
                onClick={handleConfirm}
                disabled={isConfirming}
                className="bg-destructive hover:bg-destructive/90"
              >
                {isConfirming ? t('common.loading') : t('common.confirm')}
              </Button>
            </DialogFooter>
          </>
        ) : null}
      </DialogContent>
    </Dialog>
  );
}



export default function ActivePackagesPage() {
  const { t } = useLanguage();
  const queryClient = useQueryClient();

  const { data: activePackages = [], isLoading, error } = useQuery({
    queryKey: ['activePackages'],
    queryFn: fetchActivePackages,
  });

  const [result, setResult] = useState<'success' | 'failed' | null>(null);
  const [redeemAmount, setRedeemAmount] = useState<number>(0);
  const [errorMessage, setErrorMessage] = useState('');

  const handleSuccess = (amount: number) => {
    setRedeemAmount(amount);
    setResult('success');
    queryClient.invalidateQueries({ queryKey: ['activePackages'] });
  };

  const handleError = (err: string) => {
    setErrorMessage(err);
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
            {result === 'success' ? 'Early Redemption Successful' : 'Early Redemption Failed'}
          </h1>
          <p className="text-muted-foreground mb-8">
            {result === 'success'
              ? `You have successfully redeemed $${redeemAmount.toLocaleString()}. The funds should be available in your wallet.`
              : errorMessage || 'There was an error processing your early redemption. Please try again.'
            }
          </p>
          <div className="flex gap-4 justify-center">
            {result === 'success' ? (
              <>
                <Link to="/history">
                  <Button className="bg-accent hover:bg-accent/90">
                    {t('nav.history')}
                  </Button>
                </Link>
                <Button variant="outline" onClick={() => setResult(null)}>
                  Back to Packages
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
        <div className="mb-8">
          <h1 className="text-2xl font-bold mb-1">{t('packages.title')}</h1>
          <p className="text-muted-foreground">
            {activePackages.length} {t('common.active').toLowerCase()} packages
          </p>
        </div>

        {/* Packages Table */}
        <div className="data-card overflow-hidden p-0">
          <div className="overflow-x-auto">
            <table className="fintech-table">
              <thead>
                <tr>
                  <th>Product</th>
                  <th>Subscription</th>
                  <th>{t('packages.principal')}</th>
                  <th>
                    <div className="flex items-center gap-1">
                      {t('packages.interestRate')}
                      <Tooltip>
                        <TooltipTrigger>
                          <Info className="w-3.5 h-3.5 text-muted-foreground" />
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>{t('tooltip.t1Interest')}</p>
                        </TooltipContent>
                      </Tooltip>
                    </div>
                  </th>
                  <th>{t('packages.accruedInterest')}</th>
                  <th>{t('packages.holdingDays')}</th>
                  <th>{t('packages.startDate')}</th>
                  <th>{t('packages.maturityDate')}</th>
                  <th>
                    <div className="flex items-center gap-1">
                      {t('packages.progress')}
                      <Tooltip>
                        <TooltipTrigger>
                          <Info className="w-3.5 h-3.5 text-muted-foreground" />
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>{t('tooltip.progress')}</p>
                        </TooltipContent>
                      </Tooltip>
                    </div>
                  </th>
                  <th>{t('common.action')}</th>
                </tr>
              </thead>
              <tbody>
                {activePackages.map((pkg) => {
                  const progress = Math.round((pkg.holdingDays / pkg.totalDays) * 100);
                  return (
                    <tr key={pkg.id}>
                      <td>
                        <div className="font-medium">{pkg.productName}</div>
                      </td>
                      <td className="text-sm font-mono text-muted-foreground">
                        <span title={pkg.id}>
                          {pkg.id.length > 8 ? `${pkg.id.substring(0, 8)}...` : pkg.id}
                        </span>
                      </td>
                      <td className="font-medium">${pkg.principal.toLocaleString()}</td>
                      <td>
                        <Badge className="status-success">{pkg.interestRate}%</Badge>
                      </td>
                      <td className="text-success font-medium">
                        +${pkg.accruedInterest.toLocaleString()}
                      </td>
                      <td>
                        {pkg.holdingDays} / {pkg.totalDays} {t('common.days')}
                      </td>
                      <td>{pkg.startDate}</td>
                      <td>{pkg.maturityDate}</td>
                      <td>
                        <div className="flex items-center gap-2">
                          <div className="progress-track w-20">
                            <div className="progress-fill" style={{ width: `${progress}%` }} />
                          </div>
                          <span className="text-sm text-muted-foreground">{progress}%</span>
                        </div>
                      </td>
                      <td>
                        <div className="flex items-center gap-2">
                          <EarlyRedemptionDialog
                            pkg={pkg}
                            onSuccess={handleSuccess}
                            onError={handleError}
                          />
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        {activePackages.length === 0 && (
          <div className="data-card text-center py-12">
            <p className="text-muted-foreground">{t('packages.noPackages')}</p>
          </div>
        )}
      </div>
    </MainLayout>
  );
}
