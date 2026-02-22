import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

type Language = 'en' | 'vi';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

// Translation dictionaries
const translations: Record<Language, Record<string, string>> = {
  en: {
    // Navigation
    'nav.home': 'Home',
    'nav.dashboard': 'Dashboard',
    'nav.products': 'Products',
    'nav.activePackages': 'Active Packages',
    'nav.investmentHistory': 'Investment History',
    'nav.transactions': 'Transactions',
    'nav.notifications': 'Notifications',
    'nav.admin': 'Admin',
    'nav.liquidity': 'Liquidity Monitor',
    'nav.pending': 'Pending Transactions',
    'nav.manual': 'Manual Handling',
    'nav.logout': 'Logout',
    
    // Common
    'common.viewDetails': 'View Details',
    'common.subscribe': 'Subscribe',
    'common.confirm': 'Confirm',
    'common.cancel': 'Cancel',
    'common.submit': 'Submit',
    'common.back': 'Back',
    'common.loading': 'Loading...',
    'common.success': 'Success',
    'common.failed': 'Failed',
    'common.pending': 'Pending',
    'common.active': 'Active',
    'common.inactive': 'Inactive',
    'common.full': 'Full',
    'common.days': 'days',
    'common.amount': 'Amount',
    'common.date': 'Date',
    'common.status': 'Status',
    'common.action': 'Action',
    'common.search': 'Search',
    'common.filter': 'Filter',
    'common.all': 'All',
    
    // Landing Page
    'landing.title': 'Locked Asset Products',
    'landing.subtitle': 'Grow your wealth with fixed-term investments',
    'landing.description': 'Secure returns with our fixed-term locked asset products. Choose from various terms and enjoy competitive APR rates.',
    'landing.exploreProducts': 'Explore Products',
    'landing.term': 'Term',
    'landing.apr': 'APR',
    'landing.minAmount': 'Min Amount',
    'landing.maxAmount': 'Max Amount',
    'landing.quota': 'Available Quota',
    
    // Dashboard
    'dashboard.title': 'Dashboard',
    'dashboard.welcome': 'Welcome back',
    'dashboard.totalBalance': 'Total Balance',
    'dashboard.availableBalance': 'Available Balance',
    'dashboard.frozenBalance': 'Frozen Balance',
    'dashboard.totalInterest': 'Total Accrued Interest',
    'dashboard.activeSummary': 'Active Packages Summary',
    'dashboard.recentActivity': 'Recent Activity',
    'dashboard.quickActions': 'Quick Actions',
    
    // Active Packages
    'packages.title': 'Active Packages',
    'packages.principal': 'Principal',
    'packages.interestRate': 'Interest Rate',
    'packages.accruedInterest': 'Accrued Interest',
    'packages.holdingDays': 'Holding Days',
    'packages.startDate': 'Start Date',
    'packages.maturityDate': 'Maturity Date',
    'packages.progress': 'Progress',
    'packages.earlyRedemption': 'Early Redemption',
    'packages.withdraw': 'Withdraw Available',
    'packages.noPackages': 'No active packages found',
    
    // Early Redemption
    'redemption.title': 'Early Redemption',
    'redemption.warning': 'Early redemption will incur a penalty',
    'redemption.currentProgress': 'Current Progress',
    'redemption.penaltyRate': 'Penalty Rate',
    'redemption.penaltyAmount': 'Penalty Amount',
    'redemption.finalAmount': 'Final Receivable Amount',
    'redemption.confirmMessage': 'Are you sure you want to proceed with early redemption?',
    
    // Withdraw
    'withdraw.title': 'Withdraw Available Amount',
    'withdraw.availableToWithdraw': 'Available to Withdraw',
    'withdraw.destination': 'Destination Wallet',
    'withdraw.confirmMessage': 'Confirm withdrawal to your wallet?',
    
    // Investment History
    'history.title': 'Investment History',
    'history.matured': 'Matured',
    'history.earlyRedeemed': 'Early Redeemed',
    'history.finalAmount': 'Final Amount',
    'history.completedDate': 'Completed Date',
    
    // Transactions
    'transactions.title': 'Transaction History',
    'transactions.type': 'Transaction Type',
    'transactions.dailyInterest': 'Daily Interest',
    'transactions.earlyRedemption': 'Early Redemption',
    'transactions.maturityPayout': 'Maturity Payout',
    'transactions.withdrawal': 'Withdrawal',
    'transactions.subscription': 'Subscription',
    
    // Notifications
    'notifications.title': 'Notifications',
    'notifications.markAllRead': 'Mark All Read',
    'notifications.noNotifications': 'No notifications',
    'notifications.interestAccrued': 'Interest Accrued',
    'notifications.maturityReached': 'Maturity Reached',
    'notifications.transactionPending': 'Transaction Pending',
    'notifications.systemMessage': 'System Message',
    
    // Admin - Liquidity
    'admin.liquidity.title': 'Liquidity Monitoring Dashboard',
    'admin.liquidity.totalLiquidity': 'Total Liquidity',
    'admin.liquidity.minThreshold': 'Minimum Threshold',
    'admin.liquidity.status': 'Status',
    'admin.liquidity.normal': 'Normal',
    'admin.liquidity.warning': 'Warning',
    'admin.liquidity.critical': 'Critical',
    'admin.liquidity.inject': 'Inject Liquidity',
    'admin.liquidity.reason': 'Reason',
    
    // Admin - Pending
    'admin.pending.title': 'Pending Transactions',
    'admin.pending.waitingTime': 'Waiting Time',
    'admin.pending.reason': 'Reason',
    'admin.pending.noTransactions': 'No pending transactions',
    
    // Admin - Manual
    'admin.manual.title': 'Manual Handling',
    'admin.manual.forceApprove': 'Force Approve',
    'admin.manual.reject': 'Reject',
    'admin.manual.notes': 'Notes (Required)',
    'admin.manual.exceptional': 'Exceptional Cases',
    
    // Product Detail
    'product.details': 'Product Details',
    'product.rules': 'Product Rules',
    'product.interestCalculation': 'Interest is calculated T+1 and accrued daily',
    'product.earlyPenalty': 'Early redemption penalty applies',
    'product.investmentAmount': 'Investment Amount',
    'product.enterAmount': 'Enter investment amount',
    'product.confirmSubscription': 'Confirm Subscription',
    'product.subscriptionSuccess': 'Subscription Successful!',
    'product.subscriptionFailed': 'Subscription Failed',
    
    // Tooltips
    'tooltip.t1Interest': 'Interest calculation starts from T+1 (next day after subscription)',
    'tooltip.frozenBalance': 'Amount locked in active packages',
    'tooltip.availableBalance': 'Amount available for withdrawal',
    'tooltip.penalty': 'Penalty is calculated based on days remaining until maturity',
    'tooltip.progress': 'Percentage of term completed',
  },
  vi: {
    // Navigation
    'nav.home': 'Trang chủ',
    'nav.dashboard': 'Bảng điều khiển',
    'nav.products': 'Sản phẩm',
    'nav.activePackages': 'Gói đang hoạt động',
    'nav.investmentHistory': 'Lịch sử đầu tư',
    'nav.transactions': 'Giao dịch',
    'nav.notifications': 'Thông báo',
    'nav.admin': 'Quản trị',
    'nav.liquidity': 'Giám sát thanh khoản',
    'nav.pending': 'Giao dịch chờ xử lý',
    'nav.manual': 'Xử lý thủ công',
    'nav.logout': 'Đăng xuất',
    
    // Common
    'common.viewDetails': 'Xem chi tiết',
    'common.subscribe': 'Đăng ký',
    'common.confirm': 'Xác nhận',
    'common.cancel': 'Hủy',
    'common.submit': 'Gửi',
    'common.back': 'Quay lại',
    'common.loading': 'Đang tải...',
    'common.success': 'Thành công',
    'common.failed': 'Thất bại',
    'common.pending': 'Đang chờ',
    'common.active': 'Hoạt động',
    'common.inactive': 'Không hoạt động',
    'common.full': 'Đã đầy',
    'common.days': 'ngày',
    'common.amount': 'Số tiền',
    'common.date': 'Ngày',
    'common.status': 'Trạng thái',
    'common.action': 'Hành động',
    'common.search': 'Tìm kiếm',
    'common.filter': 'Lọc',
    'common.all': 'Tất cả',
    
    // Landing Page
    'landing.title': 'Sản phẩm Tài sản Khóa',
    'landing.subtitle': 'Gia tăng tài sản với đầu tư có kỳ hạn',
    'landing.description': 'Lợi nhuận ổn định với các sản phẩm tài sản khóa có kỳ hạn. Lựa chọn từ nhiều kỳ hạn và hưởng lãi suất APR cạnh tranh.',
    'landing.exploreProducts': 'Khám phá sản phẩm',
    'landing.term': 'Kỳ hạn',
    'landing.apr': 'Lãi suất',
    'landing.minAmount': 'Số tiền tối thiểu',
    'landing.maxAmount': 'Số tiền tối đa',
    'landing.quota': 'Hạn mức còn lại',
    
    // Dashboard
    'dashboard.title': 'Bảng điều khiển',
    'dashboard.welcome': 'Chào mừng trở lại',
    'dashboard.totalBalance': 'Tổng số dư',
    'dashboard.availableBalance': 'Số dư khả dụng',
    'dashboard.frozenBalance': 'Số dư đóng băng',
    'dashboard.totalInterest': 'Tổng lãi tích lũy',
    'dashboard.activeSummary': 'Tóm tắt gói hoạt động',
    'dashboard.recentActivity': 'Hoạt động gần đây',
    'dashboard.quickActions': 'Thao tác nhanh',
    
    // Active Packages
    'packages.title': 'Gói đang hoạt động',
    'packages.principal': 'Vốn gốc',
    'packages.interestRate': 'Lãi suất',
    'packages.accruedInterest': 'Lãi tích lũy',
    'packages.holdingDays': 'Số ngày nắm giữ',
    'packages.startDate': 'Ngày bắt đầu',
    'packages.maturityDate': 'Ngày đáo hạn',
    'packages.progress': 'Tiến độ',
    'packages.earlyRedemption': 'Tất toán sớm',
    'packages.withdraw': 'Rút tiền khả dụng',
    'packages.noPackages': 'Không có gói hoạt động',
    
    // Early Redemption
    'redemption.title': 'Tất toán sớm',
    'redemption.warning': 'Tất toán sớm sẽ chịu phí phạt',
    'redemption.currentProgress': 'Tiến độ hiện tại',
    'redemption.penaltyRate': 'Tỷ lệ phạt',
    'redemption.penaltyAmount': 'Số tiền phạt',
    'redemption.finalAmount': 'Số tiền nhận cuối cùng',
    'redemption.confirmMessage': 'Bạn có chắc muốn tiến hành tất toán sớm?',
    
    // Withdraw
    'withdraw.title': 'Rút số tiền khả dụng',
    'withdraw.availableToWithdraw': 'Có thể rút',
    'withdraw.destination': 'Ví đích',
    'withdraw.confirmMessage': 'Xác nhận rút tiền về ví của bạn?',
    
    // Investment History
    'history.title': 'Lịch sử đầu tư',
    'history.matured': 'Đã đáo hạn',
    'history.earlyRedeemed': 'Tất toán sớm',
    'history.finalAmount': 'Số tiền cuối',
    'history.completedDate': 'Ngày hoàn thành',
    
    // Transactions
    'transactions.title': 'Lịch sử giao dịch',
    'transactions.type': 'Loại giao dịch',
    'transactions.dailyInterest': 'Lãi hàng ngày',
    'transactions.earlyRedemption': 'Tất toán sớm',
    'transactions.maturityPayout': 'Chi trả đáo hạn',
    'transactions.withdrawal': 'Rút tiền',
    'transactions.subscription': 'Đăng ký',
    
    // Notifications
    'notifications.title': 'Thông báo',
    'notifications.markAllRead': 'Đánh dấu đã đọc',
    'notifications.noNotifications': 'Không có thông báo',
    'notifications.interestAccrued': 'Lãi đã tích lũy',
    'notifications.maturityReached': 'Đã đáo hạn',
    'notifications.transactionPending': 'Giao dịch đang chờ',
    'notifications.systemMessage': 'Thông báo hệ thống',
    
    // Admin - Liquidity
    'admin.liquidity.title': 'Bảng giám sát thanh khoản',
    'admin.liquidity.totalLiquidity': 'Tổng thanh khoản',
    'admin.liquidity.minThreshold': 'Ngưỡng tối thiểu',
    'admin.liquidity.status': 'Trạng thái',
    'admin.liquidity.normal': 'Bình thường',
    'admin.liquidity.warning': 'Cảnh báo',
    'admin.liquidity.critical': 'Nghiêm trọng',
    'admin.liquidity.inject': 'Bổ sung thanh khoản',
    'admin.liquidity.reason': 'Lý do',
    
    // Admin - Pending
    'admin.pending.title': 'Giao dịch chờ xử lý',
    'admin.pending.waitingTime': 'Thời gian chờ',
    'admin.pending.reason': 'Lý do',
    'admin.pending.noTransactions': 'Không có giao dịch chờ',
    
    // Admin - Manual
    'admin.manual.title': 'Xử lý thủ công',
    'admin.manual.forceApprove': 'Phê duyệt bắt buộc',
    'admin.manual.reject': 'Từ chối',
    'admin.manual.notes': 'Ghi chú (Bắt buộc)',
    'admin.manual.exceptional': 'Trường hợp ngoại lệ',
    
    // Product Detail
    'product.details': 'Chi tiết sản phẩm',
    'product.rules': 'Quy tắc sản phẩm',
    'product.interestCalculation': 'Lãi được tính từ T+1 và tích lũy hàng ngày',
    'product.earlyPenalty': 'Áp dụng phí phạt tất toán sớm',
    'product.investmentAmount': 'Số tiền đầu tư',
    'product.enterAmount': 'Nhập số tiền đầu tư',
    'product.confirmSubscription': 'Xác nhận đăng ký',
    'product.subscriptionSuccess': 'Đăng ký thành công!',
    'product.subscriptionFailed': 'Đăng ký thất bại',
    
    // Tooltips
    'tooltip.t1Interest': 'Tính lãi bắt đầu từ T+1 (ngày tiếp theo sau đăng ký)',
    'tooltip.frozenBalance': 'Số tiền bị khóa trong các gói đang hoạt động',
    'tooltip.availableBalance': 'Số tiền có thể rút',
    'tooltip.penalty': 'Phí phạt được tính dựa trên số ngày còn lại đến đáo hạn',
    'tooltip.progress': 'Phần trăm kỳ hạn đã hoàn thành',
  },
};

interface LanguageProviderProps {
  children: ReactNode;
}

export function LanguageProvider({ children }: LanguageProviderProps) {
  const [language, setLanguageState] = useState<Language>(() => {
    const saved = sessionStorage.getItem('language');
    return (saved as Language) || 'en';
  });

  useEffect(() => {
    sessionStorage.setItem('language', language);
  }, [language]);

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
  };

  const t = (key: string): string => {
    return translations[language][key] || key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
}
