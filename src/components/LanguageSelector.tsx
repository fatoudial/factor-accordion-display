
import { useLanguage } from '@/context/LanguageContext';
import { Button } from '@/components/ui/button';
import { Globe } from 'lucide-react';
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

type SupportedLanguage = 'fr' | 'en' | 'es' | 'ar';

const LanguageSelector = () => {
  const { language, setLanguage } = useLanguage();

  const languages = [
    { code: 'fr' as SupportedLanguage, name: 'Français' },
    { code: 'en' as SupportedLanguage, name: 'English' },
    { code: 'es' as SupportedLanguage, name: 'Español' },
    { code: 'ar' as SupportedLanguage, name: 'العربية' },
  ];
  
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button 
          variant="ghost" 
          size="sm"
          aria-label="Changer de langue"
          className="flex items-center gap-2"
        >
          <Globe className="h-4 w-4" />
          <span className="font-medium">{language.toUpperCase()}</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        {languages.map((lang) => (
          <DropdownMenuItem
            key={lang.code}
            onClick={() => {
              setLanguage(lang.code);
              // Store preference in localStorage
              localStorage.setItem('preferredLanguage', lang.code);
            }}
            className={language === lang.code ? 'bg-muted' : ''}
          >
            {lang.name}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default LanguageSelector;
