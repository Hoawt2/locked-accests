import { useLanguage } from '@/contexts/LanguageContext';
import { MainLayout } from '@/components/layout/MainLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import {
  ArrowLeft,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  Info
} from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { useQuery } from '@tanstack/react-query';
import { fetchLockedProducts } from '@/pages/ProductsPage';

export default function SubscribePage() {
  const { t } = useLanguage();
  const { id } = useParams();
  const navigate = useNavigate();

  const { data: products = [], isLoading } = useQuery({
    queryKey: ['lockedProducts'],
    queryFn: fetchLockedProducts,
  });

  const product = products.find(p => p.id === Number(id));

  const [amount, setAmount] = useState('');
  const [showConfirm, setShowConfirm] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [result, setResult] = useState<'success' | 'failed' | null>(null);
  const [errorMessage, setErrorMessage] = useState('');

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
        <div className="p-6 max-w-2xl mx-auto text-center py-16">
          <p className="text-muted-foreground">Product not found</p>
          <Link to="/products">
            <Button variant="outline" className="mt-4">{t('common.back')}</Button>
          </Link>
        </div>
      </MainLayout>
    );
  }

  const aprPercent = Number((product.interestRate * 100).toFixed(2));
  const numAmount = parseFloat(amount) || 0;
  const isValid = numAmount >= product.minAmount && numAmount <= product.maxAmount;
  const estimatedInterest = numAmount * product.interestRate * (product.termDays / 360);

  const handleSubscribe = () => {
    if (!isValid) return;
    setShowConfirm(true);
  };

  const handleConfirm = async () => {
    setIsProcessing(true);
    setErrorMessage('');

    try {
      const walletId = localStorage.getItem('X-WALLET-ID') || '';
      const response = await fetch('/api/user/subscriptions', {
        method: 'POST',
        headers: {
          'X-WALLET-ID': walletId,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          productId: product.id,
          principal: numAmount,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Subscription failed');
      }

      setShowConfirm(false);
      setResult('success');
    } catch (err) {
      console.error('Subscription error:', err);
      setShowConfirm(false);
      setErrorMessage(err instanceof Error ? err.message : 'Something went wrong');
      setResult('failed');
    } finally {
      setIsProcessing(false);
    }
  };

  const productName = `${product.termDays}-Day Lock`;

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
            {result === 'success' ? t('product.subscriptionSuccess') : t('product.subscriptionFailed')}
          </h1>
          <p className="text-muted-foreground mb-8">
            {result === 'success'
              ? `You have successfully invested $${numAmount.toLocaleString()} in ${productName}.`
              : errorMessage || 'There was an error processing your subscription. Please try again.'
            }
          </p>
          <div className="flex gap-4 justify-center">
            {result === 'success' ? (
              <>
                <Link to="/packages">
                  <Button className="bg-accent hover:bg-accent/90">
                    {t('nav.activePackages')}
                  </Button>
                </Link>
                <Link to="/dashboard">
                  <Button variant="outline">
                    {t('nav.dashboard')}
                  </Button>
                </Link>
              </>
            ) : (
              <>
                <Button onClick={() => setResult(null)}>
                  Try Again
                </Button>
                <Link to="/products">
                  <Button variant="outline">
                    {t('nav.products')}
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
    <MainLayout hideSidebar>
      <div className="p-6 max-w-2xl mx-auto">
        {/* Back Button */}
        <Link to={`/products/${product.id}`} className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground mb-6">
          <ArrowLeft className="w-4 h-4" />
          {t('common.back')}
        </Link>

        <h1 className="text-2xl font-bold mb-6">{t('common.subscribe')} - {productName}</h1>

        {/* Product Summary */}
        <div className="data-card mb-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div>
              <p className="text-sm text-muted-foreground">{t('landing.term')}</p>
              <p className="font-semibold">{product.termDays} {t('common.days')}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">{t('landing.apr')}</p>
              <p className="font-semibold text-accent">{aprPercent}%</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">{t('landing.minAmount')}</p>
              <p className="font-semibold">${product.minAmount.toLocaleString()}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">{t('landing.maxAmount')}</p>
              <p className="font-semibold">${product.maxAmount.toLocaleString()}</p>
            </div>
          </div>
        </div>

        {/* Investment Form */}
        <div className="data-card mb-6">
          <div className="space-y-4">
            <div>
              <Label htmlFor="amount" className="text-base font-medium">
                {t('product.investmentAmount')}
              </Label>
              <div className="mt-2 relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">$</span>
                <Input
                  id="amount"
                  type="number"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  placeholder={t('product.enterAmount')}
                  className="pl-8 text-lg h-12"
                  min={product.minAmount}
                  max={product.maxAmount}
                />
              </div>
              {amount && !isValid && (
                <p className="text-sm text-destructive mt-2 flex items-center gap-1">
                  <AlertTriangle className="w-4 h-4" />
                  Amount must be between ${product.minAmount.toLocaleString()} and ${product.maxAmount.toLocaleString()}
                </p>
              )}
            </div>

            {numAmount > 0 && isValid && (
              <div className="p-4 bg-accent/5 rounded-lg border border-accent/20">
                <div className="flex items-center gap-2 mb-3">
                  <Info className="w-4 h-4 text-accent" />
                  <span className="text-sm font-medium">Estimated Returns</span>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-muted-foreground">Principal</p>
                    <p className="font-semibold">${numAmount.toLocaleString()}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Est. Interest</p>
                    <p className="font-semibold text-success">+${estimatedInterest.toFixed(2)}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Maturity Date</p>
                    <p className="font-semibold">
                      {new Date(Date.now() + product.termDays * 24 * 60 * 60 * 1000).toLocaleDateString()}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Est. Total</p>
                    <p className="font-semibold text-accent">${(numAmount + estimatedInterest).toFixed(2)}</p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-4">
          <Link to={`/products/${product.id}`} className="flex-1">
            <Button variant="outline" className="w-full">
              {t('common.cancel')}
            </Button>
          </Link>
          <Button
            onClick={handleSubscribe}
            disabled={!isValid}
            className="flex-1 bg-accent hover:bg-accent/90 text-accent-foreground"
          >
            {t('product.confirmSubscription')}
          </Button>
        </div>

        {/* Confirmation Dialog */}
        <Dialog open={showConfirm} onOpenChange={setShowConfirm}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{t('product.confirmSubscription')}</DialogTitle>
              <DialogDescription>
                Please review your investment details before confirming.
              </DialogDescription>
            </DialogHeader>

            <div className="py-4 space-y-3">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Product</span>
                <span className="font-medium">{productName}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Amount</span>
                <span className="font-medium">${numAmount.toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">APR</span>
                <span className="font-medium text-accent">{aprPercent}%</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Term</span>
                <span className="font-medium">{product.termDays} days</span>
              </div>
              <hr className="border-border" />
              <div className="flex justify-between">
                <span className="font-medium">Est. Return</span>
                <span className="font-bold text-accent">${(numAmount + estimatedInterest).toFixed(2)}</span>
              </div>
            </div>

            <DialogFooter>
              <Button variant="outline" onClick={() => setShowConfirm(false)}>
                {t('common.cancel')}
              </Button>
              <Button
                onClick={handleConfirm}
                disabled={isProcessing}
                className="bg-accent hover:bg-accent/90"
              >
                {isProcessing ? t('common.loading') : t('common.confirm')}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </MainLayout>
  );
}
