import { useLanguage } from '@/contexts/LanguageContext';
import { MainLayout } from '@/components/layout/MainLayout';
import { Link } from 'react-router-dom';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useQuery } from '@tanstack/react-query';

export interface LockedProduct {
  id: number;
  termDays: number;
  interestRate: number;
  minAmount: number;
  maxAmount: number;
  totalQuota: number;
  availableQuota: number;
  status: string;
}

export const fetchLockedProducts = async (): Promise<LockedProduct[]> => {
  const response = await fetch('/api/cms/locked-products');
  if (!response.ok) throw new Error('Failed to fetch products');
  const result = await response.json();
  return result.data || [];
};

export default function ProductsPage() {
  const { t } = useLanguage();

  const { data: products = [], isLoading } = useQuery({
    queryKey: ['lockedProducts'],
    queryFn: fetchLockedProducts,
  });

  const getStatusKey = (product: LockedProduct) => {
    const s = product.status?.toUpperCase();
    if (s === 'ACTIVE') return 'active';
    if (s === 'FULL' || product.availableQuota <= 0) return 'full';
    return 'inactive';
  };

  const statusConfig = {
    active: { label: t('common.active'), className: 'status-success' },
    full: { label: t('common.full'), className: 'status-warning' },
    inactive: { label: t('common.inactive'), className: 'status-error' },
  };

  return (
    <MainLayout hideSidebar>
      <div className="p-6 max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-2xl font-bold mb-1">{t('nav.products')}</h1>
          <p className="text-muted-foreground">
            Choose the investment product that suits your goals
          </p>
        </div>

        {isLoading ? (
          <div className="flex items-center justify-center py-16">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
          </div>
        ) : (
          /* Products Grid */
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {products.map((product) => {
              const statusKey = getStatusKey(product);
              const status = statusConfig[statusKey];
              const isAvailable = statusKey === 'active';
              const aprPercent = Number((product.interestRate * 100).toFixed(2));

              return (
                <div
                  key={product.id}
                  className={cn(
                    "data-card group hover:shadow-lg transition-all duration-300",
                    !isAvailable && "opacity-60"
                  )}
                >
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h3 className="font-semibold text-lg text-foreground">{product.termDays}-Day Lock</h3>
                      <p className="text-sm text-muted-foreground">
                        {product.termDays} {t('common.days')}
                      </p>
                    </div>
                    <Badge className={status.className}>
                      {status.label}
                    </Badge>
                  </div>

                  <div className="space-y-3 mb-6">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-muted-foreground">{t('landing.apr')}</span>
                      <span className="text-2xl font-bold text-accent">{aprPercent}%</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-muted-foreground">{t('landing.minAmount')}</span>
                      <span className="font-medium">${product.minAmount.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-muted-foreground">{t('landing.maxAmount')}</span>
                      <span className="font-medium">${product.maxAmount.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-muted-foreground">{t('landing.quota')}</span>
                      <span className="font-medium">${product.availableQuota.toLocaleString()}</span>
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <Link to={`/products/${product.id}`} className="flex-1">
                      <Button variant="outline" className="w-full" size="sm">
                        {t('common.viewDetails')}
                      </Button>
                    </Link>
                    {isAvailable && (
                      <Link to={`/products/${product.id}/subscribe`} className="flex-1">
                        <Button className="w-full bg-accent hover:bg-accent/90 text-accent-foreground" size="sm">
                          {t('common.subscribe')}
                        </Button>
                      </Link>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </MainLayout>
  );
}
