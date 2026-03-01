import { useLanguage } from '@/contexts/LanguageContext';
import { MainLayout } from '@/components/layout/MainLayout';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Link, useParams } from 'react-router-dom';
import {
  ArrowLeft,
  Clock,
  TrendingUp,
  Info,
  AlertTriangle,
  CheckCircle2
} from 'lucide-react';
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { useQuery } from '@tanstack/react-query';
import { fetchLockedProducts, LockedProduct } from '@/pages/ProductsPage';

export default function ProductDetailPage() {
  const { t } = useLanguage();
  const { id } = useParams();

  const { data: products = [], isLoading } = useQuery({
    queryKey: ['lockedProducts'],
    queryFn: fetchLockedProducts,
  });

  const product = products.find(p => p.id === Number(id));

  const getStatusKey = (p: LockedProduct) => {
    const s = p.status?.toUpperCase();
    if (s === 'ACTIVE') return 'active';
    if (s === 'FULL' || p.availableQuota <= 0) return 'full';
    return 'inactive';
  };

  const statusConfig = {
    active: { label: t('common.active'), className: 'status-success' },
    full: { label: t('common.full'), className: 'status-warning' },
    inactive: { label: t('common.inactive'), className: 'status-error' },
  };

  if (isLoading) {
    return (
      <MainLayout hideSidebar>
        <div className="flex items-center justify-center py-32">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
        </div>
      </MainLayout>
    );
  }

  if (!product) {
    return (
      <MainLayout hideSidebar>
        <div className="p-6 max-w-4xl mx-auto text-center py-16">
          <p className="text-muted-foreground">Product not found</p>
          <Link to="/products">
            <Button variant="outline" className="mt-4">{t('common.back')}</Button>
          </Link>
        </div>
      </MainLayout>
    );
  }

  const statusKey = getStatusKey(product);
  const status = statusConfig[statusKey];
  const isAvailable = statusKey === 'active';
  const aprPercent = Number((product.interestRate * 100).toFixed(2));
  const quotaProgress = product.totalQuota > 0
    ? Math.round((product.availableQuota / product.totalQuota) * 100)
    : 0;

  return (
    <MainLayout hideSidebar>
      <div className="p-6 max-w-4xl mx-auto">
        {/* Back Button */}
        <Link to="/products" className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground mb-6">
          <ArrowLeft className="w-4 h-4" />
          {t('common.back')}
        </Link>

        {/* Product Header */}
        <div className="data-card mb-6">
          <div className="flex items-start justify-between mb-6">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <h1 className="text-2xl font-bold">{product.termDays}-Day Lock</h1>
                <Badge className={status.className}>{status.label}</Badge>
              </div>
              <p className="text-muted-foreground">{product.termDays}-day locked-term saving product</p>
            </div>
            <div className="text-right">
              <p className="text-sm text-muted-foreground mb-1">{t('landing.apr')}</p>
              <p className="text-4xl font-bold text-accent">{aprPercent}%</p>
            </div>
          </div>

          {/* Product Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="p-4 bg-secondary/30 rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <Clock className="w-4 h-4 text-muted-foreground" />
                <span className="text-sm text-muted-foreground">{t('landing.term')}</span>
              </div>
              <p className="text-xl font-semibold">{product.termDays} {t('common.days')}</p>
            </div>
            <div className="p-4 bg-secondary/30 rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <TrendingUp className="w-4 h-4 text-muted-foreground" />
                <span className="text-sm text-muted-foreground">{t('landing.apr')}</span>
              </div>
              <p className="text-xl font-semibold text-accent">{aprPercent}%</p>
            </div>
            <div className="p-4 bg-secondary/30 rounded-lg">
              <span className="text-sm text-muted-foreground">{t('landing.minAmount')}</span>
              <p className="text-xl font-semibold">${product.minAmount.toLocaleString()}</p>
            </div>
            <div className="p-4 bg-secondary/30 rounded-lg">
              <span className="text-sm text-muted-foreground">{t('landing.maxAmount')}</span>
              <p className="text-xl font-semibold">${product.maxAmount.toLocaleString()}</p>
            </div>
          </div>
        </div>

        {/* Product Rules */}
        <div className="data-card mb-6">
          <h2 className="text-lg font-semibold mb-4">{t('product.rules')}</h2>
          <div className="space-y-3">
            <div className="flex items-start gap-3 p-3 bg-info/5 rounded-lg border border-info/20">
              <Info className="w-5 h-5 text-info flex-shrink-0 mt-0.5" />
              <div>
                <p className="font-medium text-sm">{t('product.interestCalculation')}</p>
                <p className="text-sm text-muted-foreground mt-1">
                  {t('tooltip.t1Interest')}
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3 p-3 bg-warning/5 rounded-lg border border-warning/20">
              <AlertTriangle className="w-5 h-5 text-warning flex-shrink-0 mt-0.5" />
              <div>
                <p className="font-medium text-sm">{t('product.earlyPenalty')}</p>
                <p className="text-sm text-muted-foreground mt-1">
                  {t('tooltip.penalty')}
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3 p-3 bg-success/5 rounded-lg border border-success/20">
              <CheckCircle2 className="w-5 h-5 text-success flex-shrink-0 mt-0.5" />
              <div>
                <p className="font-medium text-sm">Guaranteed Returns</p>
                <p className="text-sm text-muted-foreground mt-1">
                  Your principal and interest are guaranteed upon maturity.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Quota Info */}
        <div className="data-card mb-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground mb-1">{t('landing.quota')}</p>
              <p className="text-2xl font-bold">${product.availableQuota.toLocaleString()}</p>
              <p className="text-xs text-muted-foreground mt-1">
                of ${product.totalQuota.toLocaleString()} total
              </p>
            </div>
            {product.totalQuota > 0 && (
              <div className="w-32">
                <div className="progress-track h-3">
                  <div
                    className="progress-fill"
                    style={{ width: `${quotaProgress}%` }}
                  />
                </div>
                <p className="text-xs text-muted-foreground mt-1 text-right">
                  {quotaProgress}% available
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Action Button */}
        <div className="flex gap-4">
          <Link to="/products" className="flex-1">
            <Button variant="outline" className="w-full">
              {t('common.back')}
            </Button>
          </Link>
          {isAvailable && (
            <Link to={`/products/${product.id}/subscribe`} className="flex-1">
              <Button className="w-full bg-accent hover:bg-accent/90 text-accent-foreground">
                {t('common.subscribe')}
              </Button>
            </Link>
          )}
        </div>
      </div>
    </MainLayout>
  );
}
