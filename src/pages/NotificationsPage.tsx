import { useLanguage } from '@/contexts/LanguageContext';
import { MainLayout } from '@/components/layout/MainLayout';
import { Button } from '@/components/ui/button';
import { 
  Bell, 
  TrendingUp, 
  CheckCircle2, 
  Clock,
  AlertTriangle,
  Info,
  Check
} from 'lucide-react';
import { useState } from 'react';
import { cn } from '@/lib/utils';

// Mock data
const notifications = [
  {
    id: 1,
    type: 'interest',
    title: 'Daily Interest Credited',
    message: 'You have earned $16.44 interest from your 90-Day Lock package.',
    timestamp: '2024-01-20 09:00',
    read: false,
  },
  {
    id: 2,
    type: 'interest',
    title: 'Daily Interest Credited',
    message: 'You have earned $8.35 interest from your 60-Day Lock package.',
    timestamp: '2024-01-20 09:00',
    read: false,
  },
  {
    id: 3,
    type: 'pending',
    title: 'Transaction Pending',
    message: 'Your withdrawal request of $500 is being processed. This may take up to 24 hours.',
    timestamp: '2024-01-19 14:30',
    read: true,
  },
  {
    id: 4,
    type: 'maturity',
    title: 'Package Maturity Reminder',
    message: 'Your 60-Day Lock package will mature in 5 days. Prepare for payout.',
    timestamp: '2024-01-18 10:00',
    read: true,
  },
  {
    id: 5,
    type: 'system',
    title: 'New Product Available',
    message: 'Check out our new 365-Day Lock with 18% APR. Limited quota available!',
    timestamp: '2024-01-17 08:00',
    read: true,
  },
  {
    id: 6,
    type: 'interest',
    title: 'Daily Interest Credited',
    message: 'You have earned $16.44 interest from your 90-Day Lock package.',
    timestamp: '2024-01-19 09:00',
    read: true,
  },
];

export default function NotificationsPage() {
  const { t } = useLanguage();
  const [items, setItems] = useState(notifications);

  const unreadCount = items.filter(n => !n.read).length;

  const getIcon = (type: string) => {
    const icons: Record<string, React.ElementType> = {
      interest: TrendingUp,
      maturity: CheckCircle2,
      pending: Clock,
      warning: AlertTriangle,
      system: Info,
    };
    return icons[type] || Bell;
  };

  const getIconStyle = (type: string) => {
    const styles: Record<string, string> = {
      interest: 'bg-success/10 text-success',
      maturity: 'bg-accent/10 text-accent',
      pending: 'bg-warning/10 text-warning',
      warning: 'bg-destructive/10 text-destructive',
      system: 'bg-info/10 text-info',
    };
    return styles[type] || 'bg-muted text-muted-foreground';
  };

  const markAllRead = () => {
    setItems(items.map(item => ({ ...item, read: true })));
  };

  const markAsRead = (id: number) => {
    setItems(items.map(item => 
      item.id === id ? { ...item, read: true } : item
    ));
  };

  return (
    <MainLayout>
      <div className="p-6 max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-bold mb-1">{t('notifications.title')}</h1>
            <p className="text-muted-foreground">
              {unreadCount > 0 ? `${unreadCount} unread` : 'All caught up!'}
            </p>
          </div>
          {unreadCount > 0 && (
            <Button variant="outline" onClick={markAllRead} className="gap-2">
              <Check className="w-4 h-4" />
              {t('notifications.markAllRead')}
            </Button>
          )}
        </div>

        {/* Notifications List */}
        <div className="space-y-3">
          {items.map((notification) => {
            const Icon = getIcon(notification.type);
            return (
              <div 
                key={notification.id}
                onClick={() => markAsRead(notification.id)}
                className={cn(
                  "data-card flex items-start gap-4 cursor-pointer transition-all hover:shadow-md",
                  !notification.read && "border-l-4 border-l-accent bg-accent/5"
                )}
              >
                <div className={cn(
                  "w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0",
                  getIconStyle(notification.type)
                )}>
                  <Icon className="w-5 h-5" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <p className={cn(
                        "font-medium",
                        !notification.read && "text-foreground",
                        notification.read && "text-muted-foreground"
                      )}>
                        {notification.title}
                      </p>
                      <p className="text-sm text-muted-foreground mt-1">
                        {notification.message}
                      </p>
                    </div>
                    <span className="text-xs text-muted-foreground whitespace-nowrap">
                      {notification.timestamp}
                    </span>
                  </div>
                </div>
                {!notification.read && (
                  <div className="w-2 h-2 bg-accent rounded-full flex-shrink-0 mt-2" />
                )}
              </div>
            );
          })}
        </div>

        {items.length === 0 && (
          <div className="data-card text-center py-12">
            <Bell className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
            <p className="text-muted-foreground">{t('notifications.noNotifications')}</p>
          </div>
        )}
      </div>
    </MainLayout>
  );
}
