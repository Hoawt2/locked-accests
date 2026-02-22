import { useLanguage } from '@/contexts/LanguageContext';
import { MainLayout } from '@/components/layout/MainLayout';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useState } from 'react';
import { 
  Droplets, 
  AlertTriangle, 
  CheckCircle2,
  TrendingUp,
  TrendingDown,
  Plus
} from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';

// Mock data
const liquidityData = {
  totalLiquidity: 2500000,
  minThreshold: 500000,
  utilizationRate: 68,
  status: 'normal' as 'normal' | 'warning' | 'critical',
  pendingPayouts: 125000,
  dailyInterest: 8500,
  history: [
    { date: '2024-01-20', amount: 2500000, change: 50000 },
    { date: '2024-01-19', amount: 2450000, change: -25000 },
    { date: '2024-01-18', amount: 2475000, change: 100000 },
    { date: '2024-01-17', amount: 2375000, change: -15000 },
  ],
};

function InjectLiquidityDialog() {
  const { t } = useLanguage();
  const [amount, setAmount] = useState('');
  const [reason, setReason] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  const handleSubmit = () => {
    setIsProcessing(true);
    setTimeout(() => {
      setIsProcessing(false);
      setShowSuccess(true);
    }, 1500);
  };

  if (showSuccess) {
    return (
      <DialogContent>
        <div className="text-center py-6">
          <div className="w-16 h-16 bg-success/10 rounded-full flex items-center justify-center mx-auto mb-4">
            <CheckCircle2 className="w-8 h-8 text-success" />
          </div>
          <h3 className="text-lg font-semibold mb-2">{t('common.success')}</h3>
          <p className="text-muted-foreground">
            Liquidity injection of ${parseFloat(amount).toLocaleString()} has been processed.
          </p>
        </div>
      </DialogContent>
    );
  }

  return (
    <DialogContent className="sm:max-w-md">
      <DialogHeader>
        <DialogTitle>{t('admin.liquidity.inject')}</DialogTitle>
        <DialogDescription>
          Add funds to the liquidity pool to maintain system stability.
        </DialogDescription>
      </DialogHeader>
      
      <div className="space-y-4 py-4">
        <div>
          <Label htmlFor="inject-amount">{t('common.amount')}</Label>
          <div className="mt-1 relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">$</span>
            <Input
              id="inject-amount"
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="Enter amount"
              className="pl-8"
            />
          </div>
        </div>
        <div>
          <Label htmlFor="inject-reason">{t('admin.liquidity.reason')}</Label>
          <Textarea
            id="inject-reason"
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            placeholder="Enter reason for injection"
            className="mt-1"
          />
        </div>
      </div>

      <DialogFooter>
        <Button variant="outline">{t('common.cancel')}</Button>
        <Button 
          onClick={handleSubmit}
          disabled={!amount || !reason || isProcessing}
          className="bg-accent hover:bg-accent/90"
        >
          {isProcessing ? t('common.loading') : t('common.confirm')}
        </Button>
      </DialogFooter>
    </DialogContent>
  );
}

export default function AdminLiquidityPage() {
  const { t } = useLanguage();

  const statusConfig = {
    normal: { 
      label: t('admin.liquidity.normal'), 
      className: 'status-success',
      bgClass: 'bg-success/10 border-success/20',
      icon: CheckCircle2,
      iconClass: 'text-success'
    },
    warning: { 
      label: t('admin.liquidity.warning'), 
      className: 'status-warning',
      bgClass: 'bg-warning/10 border-warning/20',
      icon: AlertTriangle,
      iconClass: 'text-warning'
    },
    critical: { 
      label: t('admin.liquidity.critical'), 
      className: 'status-error',
      bgClass: 'bg-destructive/10 border-destructive/20',
      icon: AlertTriangle,
      iconClass: 'text-destructive'
    },
  };

  const status = statusConfig[liquidityData.status];
  const StatusIcon = status.icon;

  return (
    <MainLayout>
      <div className="p-6 max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-bold mb-1">{t('admin.liquidity.title')}</h1>
            <p className="text-muted-foreground">
              Monitor and manage system liquidity
            </p>
          </div>
          <Dialog>
            <DialogTrigger asChild>
              <Button className="bg-accent hover:bg-accent/90 gap-2">
                <Plus className="w-4 h-4" />
                {t('admin.liquidity.inject')}
              </Button>
            </DialogTrigger>
            <InjectLiquidityDialog />
          </Dialog>
        </div>

        {/* Status Banner */}
        <div className={`data-card mb-6 border ${status.bgClass}`}>
          <div className="flex items-center gap-4">
            <div className={`w-12 h-12 rounded-full flex items-center justify-center ${status.bgClass}`}>
              <StatusIcon className={`w-6 h-6 ${status.iconClass}`} />
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-2">
                <span className="text-lg font-semibold">{t('admin.liquidity.status')}:</span>
                <Badge className={status.className}>{status.label}</Badge>
              </div>
              <p className="text-sm text-muted-foreground mt-1">
                Current liquidity is above the minimum threshold. System is operating normally.
              </p>
            </div>
          </div>
        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <div className="data-card">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 bg-accent/10 rounded-lg flex items-center justify-center">
                <Droplets className="w-5 h-5 text-accent" />
              </div>
              <span className="text-sm text-muted-foreground">{t('admin.liquidity.totalLiquidity')}</span>
            </div>
            <p className="text-2xl font-bold">${liquidityData.totalLiquidity.toLocaleString()}</p>
          </div>
          <div className="data-card">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 bg-warning/10 rounded-lg flex items-center justify-center">
                <AlertTriangle className="w-5 h-5 text-warning" />
              </div>
              <span className="text-sm text-muted-foreground">{t('admin.liquidity.minThreshold')}</span>
            </div>
            <p className="text-2xl font-bold">${liquidityData.minThreshold.toLocaleString()}</p>
          </div>
          <div className="data-card">
            <p className="text-sm text-muted-foreground mb-2">Pending Payouts</p>
            <p className="text-2xl font-bold">${liquidityData.pendingPayouts.toLocaleString()}</p>
            <p className="text-xs text-muted-foreground mt-1">Next 24 hours</p>
          </div>
          <div className="data-card">
            <p className="text-sm text-muted-foreground mb-2">Daily Interest Obligation</p>
            <p className="text-2xl font-bold">${liquidityData.dailyInterest.toLocaleString()}</p>
            <p className="text-xs text-muted-foreground mt-1">Est. daily payout</p>
          </div>
        </div>

        {/* Utilization & History */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Utilization */}
          <div className="data-card">
            <h2 className="text-lg font-semibold mb-4">Utilization Rate</h2>
            <div className="relative pt-2">
              <div className="progress-track h-4">
                <div 
                  className="progress-fill" 
                  style={{ width: `${liquidityData.utilizationRate}%` }} 
                />
              </div>
              <div className="flex justify-between mt-2 text-sm">
                <span className="text-muted-foreground">0%</span>
                <span className="font-medium">{liquidityData.utilizationRate}% utilized</span>
                <span className="text-muted-foreground">100%</span>
              </div>
            </div>
            <div className="mt-6 p-4 bg-secondary/30 rounded-lg">
              <p className="text-sm text-muted-foreground mb-2">Available for Payouts</p>
              <p className="text-xl font-bold">
                ${(liquidityData.totalLiquidity - liquidityData.minThreshold).toLocaleString()}
              </p>
            </div>
          </div>

          {/* History */}
          <div className="data-card">
            <h2 className="text-lg font-semibold mb-4">Recent Changes</h2>
            <div className="space-y-3">
              {liquidityData.history.map((entry, index) => (
                <div key={index} className="flex items-center justify-between py-2 border-b border-border/50 last:border-0">
                  <div>
                    <p className="font-medium">${entry.amount.toLocaleString()}</p>
                    <p className="text-sm text-muted-foreground">{entry.date}</p>
                  </div>
                  <div className={`flex items-center gap-1 ${entry.change > 0 ? 'text-success' : 'text-destructive'}`}>
                    {entry.change > 0 ? (
                      <TrendingUp className="w-4 h-4" />
                    ) : (
                      <TrendingDown className="w-4 h-4" />
                    )}
                    <span className="font-medium">
                      {entry.change > 0 ? '+' : ''}${entry.change.toLocaleString()}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
}
