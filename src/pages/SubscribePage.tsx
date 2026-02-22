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

// Mock product data
const products = [
  { id: 1, name: '30-Day Lock', term: 30, apr: 8.5, minAmount: 100, maxAmount: 50000, quota: 125000, status: 'active' },
  { id: 2, name: '60-Day Lock', term: 60, apr: 10.2, minAmount: 500, maxAmount: 100000, quota: 89000, status: 'active' },
  { id: 3, name: '90-Day Lock', term: 90, apr: 12.0, minAmount: 1000, maxAmount: 200000, quota: 0, status: 'full' },
  { id: 4, name: '180-Day Lock', term: 180, apr: 15.5, minAmount: 5000, maxAmount: 500000, quota: 450000, status: 'active' },
  { id: 5, name: '365-Day Lock', term: 365, apr: 18.0, minAmount: 10000, maxAmount: 1000000, quota: 800000, status: 'inactive' },
];

export default function SubscribePage() {
  const { t } = useLanguage();
  const { id } = useParams();
  const navigate = useNavigate();
  
  const product = products.find(p => p.id === Number(id)) || products[0];
  
  const [amount, setAmount] = useState('');
  const [showConfirm, setShowConfirm] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [result, setResult] = useState<'success' | 'failed' | null>(null);

  const numAmount = parseFloat(amount) || 0;
  const isValid = numAmount >= product.minAmount && numAmount <= product.maxAmount;
  const estimatedInterest = (numAmount * product.apr / 100 / 365) * product.term;

  const handleSubscribe = () => {
    if (!isValid) return;
    setShowConfirm(true);
  };

  const handleConfirm = () => {
    setIsProcessing(true);
    // Simulate API call
    setTimeout(() => {
      setIsProcessing(false);
      setShowConfirm(false);
      // Random success/fail for demo
      setResult(Math.random() > 0.2 ? 'success' : 'failed');
    }, 2000);
  };

  if (result) {
    return (
      <MainLayout hideSidebar>
        <div className="p-6 max-w-md mx-auto text-center py-20">
          <div className={`w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6 ${
            result === 'success' ? 'bg-success/10' : 'bg-destructive/10'
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
              ? `You have successfully invested $${numAmount.toLocaleString()} in ${product.name}.`
              : 'There was an error processing your subscription. Please try again.'
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

        <h1 className="text-2xl font-bold mb-6">{t('common.subscribe')} - {product.name}</h1>

        {/* Product Summary */}
        <div className="data-card mb-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div>
              <p className="text-sm text-muted-foreground">{t('landing.term')}</p>
              <p className="font-semibold">{product.term} {t('common.days')}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">{t('landing.apr')}</p>
              <p className="font-semibold text-accent">{product.apr}%</p>
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
                      {new Date(Date.now() + product.term * 24 * 60 * 60 * 1000).toLocaleDateString()}
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
                <span className="font-medium">{product.name}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Amount</span>
                <span className="font-medium">${numAmount.toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">APR</span>
                <span className="font-medium text-accent">{product.apr}%</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Term</span>
                <span className="font-medium">{product.term} days</span>
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
