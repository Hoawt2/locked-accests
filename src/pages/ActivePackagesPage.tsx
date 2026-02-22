import { useLanguage } from '@/contexts/LanguageContext';
import { MainLayout } from '@/components/layout/MainLayout';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Eye, 
  Clock, 
  ArrowDownToLine,
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

// Mock data
const activePackages = [
  {
    id: 1,
    productName: '90-Day Lock',
    principal: 50000,
    interestRate: 12.0,
    accruedInterest: 986.30,
    holdingDays: 41,
    totalDays: 90,
    startDate: '2024-01-05',
    maturityDate: '2024-04-05',
    availableAmount: 500,
    earlyRedemptionEligible: true,
    penaltyRate: 3.5,
  },
  {
    id: 2,
    productName: '60-Day Lock',
    principal: 30000,
    interestRate: 10.2,
    accruedInterest: 420.80,
    holdingDays: 25,
    totalDays: 60,
    startDate: '2024-01-10',
    maturityDate: '2024-03-10',
    availableAmount: 200,
    earlyRedemptionEligible: true,
    penaltyRate: 2.5,
  },
  {
    id: 3,
    productName: '30-Day Lock',
    principal: 10000,
    interestRate: 8.5,
    accruedInterest: 58.20,
    holdingDays: 8,
    totalDays: 30,
    startDate: '2024-01-20',
    maturityDate: '2024-02-19',
    availableAmount: 0,
    earlyRedemptionEligible: false,
    penaltyRate: 5.0,
  },
];

function EarlyRedemptionDialog({ pkg }: { pkg: typeof activePackages[0] }) {
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

function WithdrawDialog({ pkg }: { pkg: typeof activePackages[0] }) {
  const { t } = useLanguage();
  const [isConfirming, setIsConfirming] = useState(false);

  const handleConfirm = () => {
    setIsConfirming(true);
    setTimeout(() => {
      setIsConfirming(false);
    }, 2000);
  };

  if (pkg.availableAmount === 0) return null;

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm">
          <ArrowDownToLine className="w-4 h-4 mr-1" />
          {t('packages.withdraw')}
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{t('withdraw.title')}</DialogTitle>
          <DialogDescription>
            {t('withdraw.confirmMessage')}
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-4 py-4">
          <div className="p-4 bg-secondary/50 rounded-lg">
            <div className="flex justify-between items-center">
              <span className="text-muted-foreground">{t('withdraw.availableToWithdraw')}</span>
              <span className="text-2xl font-bold text-accent">${pkg.availableAmount.toLocaleString()}</span>
            </div>
          </div>
        </div>

        <DialogFooter className="gap-2">
          <Button variant="outline">{t('common.cancel')}</Button>
          <Button 
            onClick={handleConfirm}
            disabled={isConfirming}
            className="bg-accent hover:bg-accent/90"
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
                          <WithdrawDialog pkg={pkg} />
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
