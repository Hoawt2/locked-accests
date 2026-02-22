import { useLanguage } from '@/contexts/LanguageContext';
import { MainLayout } from '@/components/layout/MainLayout';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { useState } from 'react';
import { 
  AlertTriangle,
  CheckCircle2,
  XCircle,
  Clock,
  User,
  FileText
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
const exceptionalCases = [
  {
    id: 1,
    type: 'early_redemption',
    user: 'bob.wilson@email.com',
    amount: 14850.00,
    reason: 'Large amount early redemption - requires manual approval',
    waitingTime: '4 hours',
    originalAmount: 15000,
    penaltyAmount: 150,
    packageName: '60-Day Lock',
    createdAt: '2024-01-20 12:00',
  },
  {
    id: 2,
    type: 'withdrawal',
    user: 'charlie.davis@email.com',
    amount: 50000,
    reason: 'High-value withdrawal exceeds automatic approval threshold',
    waitingTime: '6 hours',
    originalAmount: 50000,
    createdAt: '2024-01-20 10:00',
  },
  {
    id: 3,
    type: 'rollback',
    user: 'diana.evans@email.com',
    amount: 8500,
    reason: 'Transaction failed mid-process - requires rollback decision',
    waitingTime: '2 hours',
    originalAmount: 8500,
    failureReason: 'Network timeout during payout',
    createdAt: '2024-01-20 14:00',
  },
];

function ActionDialog({ 
  caseItem, 
  action 
}: { 
  caseItem: typeof exceptionalCases[0]; 
  action: 'approve' | 'reject';
}) {
  const { t } = useLanguage();
  const [notes, setNotes] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);

  const handleSubmit = () => {
    if (!notes.trim()) return;
    setIsProcessing(true);
    setTimeout(() => {
      setIsProcessing(false);
    }, 1500);
  };

  return (
    <DialogContent className="sm:max-w-md">
      <DialogHeader>
        <DialogTitle className="flex items-center gap-2">
          {action === 'approve' ? (
            <>
              <CheckCircle2 className="w-5 h-5 text-success" />
              {t('admin.manual.forceApprove')}
            </>
          ) : (
            <>
              <XCircle className="w-5 h-5 text-destructive" />
              {t('admin.manual.reject')}
            </>
          )}
        </DialogTitle>
        <DialogDescription>
          {action === 'approve' 
            ? 'This will force approve the transaction and process the payout.'
            : 'This will reject the transaction. The user will be notified.'
          }
        </DialogDescription>
      </DialogHeader>
      
      <div className="space-y-4 py-4">
        <div className="p-4 bg-secondary/30 rounded-lg space-y-2">
          <div className="flex justify-between">
            <span className="text-sm text-muted-foreground">User</span>
            <span className="text-sm">{caseItem.user}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-sm text-muted-foreground">Amount</span>
            <span className="font-medium">${caseItem.amount.toLocaleString()}</span>
          </div>
        </div>

        <div>
          <Label htmlFor="notes" className="text-sm font-medium">
            {t('admin.manual.notes')} <span className="text-destructive">*</span>
          </Label>
          <Textarea
            id="notes"
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="Enter your notes explaining this decision..."
            className="mt-2"
            rows={4}
          />
        </div>
      </div>

      <DialogFooter>
        <Button variant="outline">{t('common.cancel')}</Button>
        <Button 
          onClick={handleSubmit}
          disabled={!notes.trim() || isProcessing}
          className={action === 'approve' 
            ? 'bg-success hover:bg-success/90' 
            : 'bg-destructive hover:bg-destructive/90'
          }
        >
          {isProcessing ? t('common.loading') : t('common.confirm')}
        </Button>
      </DialogFooter>
    </DialogContent>
  );
}

export default function AdminManualPage() {
  const { t } = useLanguage();

  return (
    <MainLayout>
      <div className="p-6 max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-2xl font-bold mb-1">{t('admin.manual.title')}</h1>
          <p className="text-muted-foreground">
            Review and handle exceptional cases requiring manual intervention
          </p>
        </div>

        {/* Warning Banner */}
        <div className="data-card mb-6 border border-warning/20 bg-warning/5">
          <div className="flex items-start gap-4">
            <div className="w-10 h-10 bg-warning/10 rounded-lg flex items-center justify-center flex-shrink-0">
              <AlertTriangle className="w-5 h-5 text-warning" />
            </div>
            <div>
              <p className="font-medium">Manual Action Required</p>
              <p className="text-sm text-muted-foreground mt-1">
                These transactions require manual review and approval. All actions are logged and require mandatory notes.
              </p>
            </div>
          </div>
        </div>

        {/* Cases List */}
        <div className="space-y-4">
          {exceptionalCases.map((caseItem) => (
            <div key={caseItem.id} className="data-card">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-warning/10 rounded-lg flex items-center justify-center">
                    <FileText className="w-5 h-5 text-warning" />
                  </div>
                  <div>
                    <p className="font-semibold">Case #{caseItem.id.toString().padStart(6, '0')}</p>
                    <div className="flex items-center gap-2 mt-1">
                      <Badge className="status-warning capitalize">{caseItem.type.replace('_', ' ')}</Badge>
                      <span className="text-sm text-muted-foreground flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        Waiting: {caseItem.waitingTime}
                      </span>
                    </div>
                  </div>
                </div>
                <p className="text-2xl font-bold">${caseItem.amount.toLocaleString()}</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div className="p-3 bg-secondary/30 rounded-lg">
                  <div className="flex items-center gap-2 mb-1">
                    <User className="w-4 h-4 text-muted-foreground" />
                    <span className="text-sm text-muted-foreground">User</span>
                  </div>
                  <p className="font-medium">{caseItem.user}</p>
                </div>
                <div className="p-3 bg-secondary/30 rounded-lg">
                  <p className="text-sm text-muted-foreground mb-1">Reason for Manual Review</p>
                  <p className="text-sm">{caseItem.reason}</p>
                </div>
              </div>

              {caseItem.packageName && (
                <div className="p-3 bg-secondary/30 rounded-lg mb-4">
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">Package</span>
                    <span className="font-medium">{caseItem.packageName}</span>
                  </div>
                  {caseItem.penaltyAmount && (
                    <div className="flex justify-between mt-2">
                      <span className="text-sm text-muted-foreground">Penalty Amount</span>
                      <span className="font-medium text-destructive">-${caseItem.penaltyAmount}</span>
                    </div>
                  )}
                </div>
              )}

              <div className="flex gap-3 justify-end">
                <Dialog>
                  <DialogTrigger asChild>
                    <Button variant="outline" className="text-destructive border-destructive/30 hover:bg-destructive/10">
                      <XCircle className="w-4 h-4 mr-2" />
                      {t('admin.manual.reject')}
                    </Button>
                  </DialogTrigger>
                  <ActionDialog caseItem={caseItem} action="reject" />
                </Dialog>
                <Dialog>
                  <DialogTrigger asChild>
                    <Button className="bg-success hover:bg-success/90">
                      <CheckCircle2 className="w-4 h-4 mr-2" />
                      {t('admin.manual.forceApprove')}
                    </Button>
                  </DialogTrigger>
                  <ActionDialog caseItem={caseItem} action="approve" />
                </Dialog>
              </div>
            </div>
          ))}
        </div>

        {exceptionalCases.length === 0 && (
          <div className="data-card text-center py-12">
            <CheckCircle2 className="w-12 h-12 text-success mx-auto mb-4" />
            <p className="text-muted-foreground">No exceptional cases requiring manual handling</p>
          </div>
        )}
      </div>
    </MainLayout>
  );
}
