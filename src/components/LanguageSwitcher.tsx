import { useLanguage } from '@/contexts/LanguageContext';
import { Button } from '@/components/ui/button';
import { Globe } from 'lucide-react';

export function LanguageSwitcher() {
  const { language, setLanguage } = useLanguage();

  return (
    <div className="flex items-center gap-1 bg-secondary/50 rounded-lg p-1">
      <Globe className="w-4 h-4 text-muted-foreground ml-2" />
      <Button
        variant={language === 'en' ? 'default' : 'ghost'}
        size="sm"
        onClick={() => setLanguage('en')}
        className="h-7 px-3 text-xs font-medium"
      >
        EN
      </Button>
      <Button
        variant={language === 'vi' ? 'default' : 'ghost'}
        size="sm"
        onClick={() => setLanguage('vi')}
        className="h-7 px-3 text-xs font-medium"
      >
        VI
      </Button>
    </div>
  );
}
