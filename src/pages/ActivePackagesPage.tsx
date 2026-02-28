import { useLanguage } from '@/contexts/LanguageContext';
import { MainLayout } from '@/components/layout/MainLayout';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Eye,
  Clock,
  Info,
  AlertTriangle
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

import { useQuery } from '@tanstack/react-query';

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

function EarlyRedemptionDialog({ pkg }: { pkg: PackageData }) {
  const { t } = useLanguage();
  const [isConfirming, setIsConfirming] = useState(false);

  const penaltyAmount = (pkg.principal * pkg.penaltyRate) / 100;
  const finalAmount = pkg.principal + pkg.accruedInterest - penaltyAmount;

  const handleConfirm = () => {
    setIsConfirming(true);
    setTimeout(() => {
      setIsConfirming(false);
    }, 2000);
  };

  return (
    <Dialog>
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

        <div className="space-y-4 py-4">
          <div className="p-4 bg-secondary/50 rounded-lg space-y-3">
            <div className="flex justify-between">
              <span className="text-sm text-muted-foreground">{t('packages.principal')}</span>
              <span className="font-medium">${pkg.principal.toLocaleString()}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-muted-foreground">{t('packages.accruedInterest')}</span>
              <span className="font-medium text-success">+${pkg.accruedInterest.toLocaleString()}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-muted-foreground">{t('redemption.currentProgress')}</span>
              <span className="font-medium">{Math.round((pkg.holdingDays / pkg.totalDays) * 100)}%</span>
            </div>
            <hr className="border-border" />
            <div className="flex justify-between">
              <span className="text-sm text-muted-foreground">{t('redemption.penaltyRate')}</span>
              <span className="font-medium text-destructive">{pkg.penaltyRate}%</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-muted-foreground">{t('redemption.penaltyAmount')}</span>
              <span className="font-medium text-destructive">-${penaltyAmount.toLocaleString()}</span>
            </div>
            <hr className="border-border" />
            <div className="flex justify-between">
              <span className="font-medium">{t('redemption.finalAmount')}</span>
              <span className="text-lg font-bold text-accent">${finalAmount.toLocaleString()}</span>
            </div>
          </div>

          <p className="text-sm text-muted-foreground text-center">
            {t('redemption.confirmMessage')}
          </p>
        </div>

        <DialogFooter className="gap-2">
          <Button variant="outline">{t('common.cancel')}</Button>
          <Button
            onClick={handleConfirm}
            disabled={isConfirming}
            className="bg-destructive hover:bg-destructive/90"
          >
            {isConfirming ? t('common.loading') : t('common.confirm')}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}



export default function ActivePackagesPage() {
  const { t } = useLanguage();

  const { data: activePackages = [], isLoading, error } = useQuery({
    queryKey: ['activePackages'],
    queryFn: fetchActivePackages,
  });

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
                          <Button variant="ghost" size="sm">
                            <Eye className="w-4 h-4" />
                          </Button>
                          <EarlyRedemptionDialog pkg={pkg} />
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
