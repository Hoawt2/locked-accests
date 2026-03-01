import { useLanguage } from '@/contexts/LanguageContext';
import { MainLayout } from '@/components/layout/MainLayout';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ArrowRight, Shield, TrendingUp, Clock, Wallet } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useQuery } from '@tanstack/react-query';
import { fetchLockedProducts, LockedProduct } from '@/pages/ProductsPage';

function ProductCard({ product }: { product: LockedProduct }) {
  const { t } = useLanguage();

  const getStatusKey = () => {
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

  const statusKey = getStatusKey();
  const status = statusConfig[statusKey];
  const isAvailable = statusKey === 'active';
  const aprPercent = Number((product.interestRate * 100).toFixed(2));

  const userRole = localStorage.getItem('userRole');

  return (
    <div className={cn(
      "data-card group hover:shadow-lg transition-all duration-300",
      !isAvailable && "opacity-60"
    )}>
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
          <Link to={userRole ? `/products/${product.id}/subscribe` : "/login"} className="flex-1">
            <Button className="w-full bg-accent hover:bg-accent/90 text-accent-foreground" size="sm">
              {t('common.subscribe')}
            </Button>
          </Link>
        )}
      </div>
    </div>
  );
}

export default function LandingPage() {
  const { t } = useLanguage();

  const { data: products = [], isLoading } = useQuery({
    queryKey: ['lockedProducts'],
    queryFn: fetchLockedProducts,
  });

  return (
    <MainLayout hideSidebar>
      {/* Hero Section */}
      <section className="bg-gradient-primary text-primary-foreground py-20 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="max-w-2xl">
            <h1 className="text-4xl md:text-5xl font-bold mb-4 animate-fade-in">
              {t('landing.title')}
            </h1>
            <p className="text-xl md:text-2xl text-primary-foreground/80 mb-2 animate-fade-in">
              {t('landing.subtitle')}
            </p>
            <p className="text-primary-foreground/70 mb-8 animate-fade-in">
              {t('landing.description')}
            </p>
            <div className="flex gap-4 animate-slide-up">
              <Button
                size="lg"
                className="bg-accent hover:bg-accent/90 text-accent-foreground gap-2 cursor-pointer"
                onClick={() => {
                  const element = document.getElementById('products');
                  if (element) {
                    element.scrollIntoView({ behavior: 'smooth' });
                  }
                }}
              >
                {t('landing.exploreProducts')}
                <ArrowRight className="w-5 h-5" />
              </Button>
              <Link to="/login">
                <Button size="lg" variant="outline" className="bg-transparent border-primary-foreground/30 text-primary-foreground hover:bg-primary-foreground/10">
                  {t('nav.dashboard')}
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-16 px-6 bg-secondary/30">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="data-card text-center">
              <div className="w-12 h-12 bg-accent/10 rounded-xl flex items-center justify-center mx-auto mb-4">
                <Shield className="w-6 h-6 text-accent" />
              </div>
              <h3 className="font-semibold mb-2">Secure & Safe</h3>
              <p className="text-sm text-muted-foreground">Your assets are protected with enterprise-grade security</p>
            </div>
            <div className="data-card text-center">
              <div className="w-12 h-12 bg-accent/10 rounded-xl flex items-center justify-center mx-auto mb-4">
                <TrendingUp className="w-6 h-6 text-accent" />
              </div>
              <h3 className="font-semibold mb-2">Fixed APR</h3>
              <p className="text-sm text-muted-foreground">Guaranteed returns with competitive interest rates</p>
            </div>
            <div className="data-card text-center">
              <div className="w-12 h-12 bg-accent/10 rounded-xl flex items-center justify-center mx-auto mb-4">
                <Clock className="w-6 h-6 text-accent" />
              </div>
              <h3 className="font-semibold mb-2">Flexible Terms</h3>
              <p className="text-sm text-muted-foreground">Choose from 30 to 365-day lock periods</p>
            </div>
            <div className="data-card text-center">
              <div className="w-12 h-12 bg-accent/10 rounded-xl flex items-center justify-center mx-auto mb-4">
                <Wallet className="w-6 h-6 text-accent" />
              </div>
              <h3 className="font-semibold mb-2">Daily Interest</h3>
              <p className="text-sm text-muted-foreground">Interest calculated T+1 and accrued daily</p>
            </div>
          </div>
        </div>
      </section>

      {/* Products Grid */}
      <section id="products" className="py-16 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">{t('nav.products')}</h2>
            <p className="text-muted-foreground max-w-xl mx-auto">
              Choose the lock period that fits your investment strategy
            </p>
          </div>

          {isLoading ? (
            <div className="flex items-center justify-center py-16">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {products.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-primary text-primary-foreground py-8 px-6">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-accent rounded-lg flex items-center justify-center">
              <span className="text-accent-foreground font-bold text-sm">LA</span>
            </div>
            <span className="font-semibold">LockAsset</span>
          </div>
          <p className="text-sm text-primary-foreground/60">
            © 2024 LockAsset. All rights reserved.
          </p>
        </div>
      </footer>
    </MainLayout>
  );
}
