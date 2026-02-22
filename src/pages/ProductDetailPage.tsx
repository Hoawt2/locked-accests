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

// Mock product data
const products = [
  { id: 1, name: '30-Day Lock', term: 30, apr: 8.5, minAmount: 100, maxAmount: 50000, quota: 125000, status: 'active', description: 'Short-term investment with guaranteed returns. Perfect for beginners.' },
  { id: 2, name: '60-Day Lock', term: 60, apr: 10.2, minAmount: 500, maxAmount: 100000, quota: 89000, status: 'active', description: 'Medium-term lock with higher APR. Ideal for steady growth.' },
  { id: 3, name: '90-Day Lock', term: 90, apr: 12.0, minAmount: 1000, maxAmount: 200000, quota: 0, status: 'full', description: 'Popular choice with balanced term and returns.' },
  { id: 4, name: '180-Day Lock', term: 180, apr: 15.5, minAmount: 5000, maxAmount: 500000, quota: 450000, status: 'active', description: 'Long-term investment for serious investors seeking higher yields.' },
  { id: 5, name: '365-Day Lock', term: 365, apr: 18.0, minAmount: 10000, maxAmount: 1000000, quota: 800000, status: 'inactive', description: 'Maximum returns for committed long-term investors.' },
];

export default function ProductDetailPage() {
  const { t } = useLanguage();
  const { id } = useParams();
  
  const product = products.find(p => p.id === Number(id)) || products[0];
  const isAvailable = product.status === 'active';

  const statusConfig = {
    active: { label: t('common.active'), className: 'status-success' },
    full: { label: t('common.full'), className: 'status-warning' },
    inactive: { label: t('common.inactive'), className: 'status-error' },
  };

  const status = statusConfig[product.status as keyof typeof statusConfig];

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
                <h1 className="text-2xl font-bold">{product.name}</h1>
                <Badge className={status.className}>{status.label}</Badge>
              </div>
              <p className="text-muted-foreground">{product.description}</p>
            </div>
            <div className="text-right">
              <p className="text-sm text-muted-foreground mb-1">{t('landing.apr')}</p>
              <p className="text-4xl font-bold text-accent">{product.apr}%</p>
            </div>
          </div>

          {/* Product Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="p-4 bg-secondary/30 rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <Clock className="w-4 h-4 text-muted-foreground" />
                <span className="text-sm text-muted-foreground">{t('landing.term')}</span>
              </div>
              <p className="text-xl font-semibold">{product.term} {t('common.days')}</p>
            </div>
            <div className="p-4 bg-secondary/30 rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <TrendingUp className="w-4 h-4 text-muted-foreground" />
                <span className="text-sm text-muted-foreground">{t('landing.apr')}</span>
              </div>
              <p className="text-xl font-semibold text-accent">{product.apr}%</p>
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
              <p className="text-2xl font-bold">${product.quota.toLocaleString()}</p>
            </div>
            {product.quota > 0 && (
              <div className="w-32">
                <div className="progress-track h-3">
                  <div 
                    className="progress-fill" 
                    style={{ width: `${Math.min((product.quota / product.maxAmount) * 100, 100)}%` }} 
                  />
                </div>
                <p className="text-xs text-muted-foreground mt-1 text-right">
                  {Math.round((product.quota / product.maxAmount) * 100)}% available
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
