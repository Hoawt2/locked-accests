import { useLanguage } from '@/contexts/LanguageContext';
import { MainLayout } from '@/components/layout/MainLayout';
import { Link } from 'react-router-dom';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';
import { cn } from '@/lib/utils';

// Mock product data
const products = [
  { id: 1, name: '30-Day Lock', term: 30, apr: 8.5, minAmount: 100, maxAmount: 50000, quota: 125000, status: 'active' },
  { id: 2, name: '60-Day Lock', term: 60, apr: 10.2, minAmount: 500, maxAmount: 100000, quota: 89000, status: 'active' },
  { id: 3, name: '90-Day Lock', term: 90, apr: 12.0, minAmount: 1000, maxAmount: 200000, quota: 0, status: 'full' },
  { id: 4, name: '180-Day Lock', term: 180, apr: 15.5, minAmount: 5000, maxAmount: 500000, quota: 450000, status: 'active' },
  { id: 5, name: '365-Day Lock', term: 365, apr: 18.0, minAmount: 10000, maxAmount: 1000000, quota: 800000, status: 'inactive' },
];

export default function ProductsPage() {
  const { t } = useLanguage();

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

        {/* Products Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {products.map((product) => {
            const status = statusConfig[product.status as keyof typeof statusConfig];
            const isAvailable = product.status === 'active';

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
                    <h3 className="font-semibold text-lg text-foreground">{product.name}</h3>
                    <p className="text-sm text-muted-foreground">
                      {product.term} {t('common.days')}
                    </p>
                  </div>
                  <Badge className={status.className}>
                    {status.label}
                  </Badge>
                </div>

                <div className="space-y-3 mb-6">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">{t('landing.apr')}</span>
                    <span className="text-2xl font-bold text-accent">{product.apr}%</span>
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
                    <span className="font-medium">${product.quota.toLocaleString()}</span>
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
      </div>
    </MainLayout>
  );
}
