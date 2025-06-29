
import React from 'react';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '@/context/LanguageContext';

interface NavigationBackButtonProps {
  to?: string;
  label?: string;
  className?: string;
  variant?: "default" | "destructive" | "outline" | "secondary" | "ghost" | "link";
  onClick?: () => void; // Added onClick prop
}

const NavigationBackButton: React.FC<NavigationBackButtonProps> = ({
  to,
  label,
  className = "",
  variant = "outline",
  onClick
}) => {
  const navigate = useNavigate();
  const { language } = useLanguage();

  // Translations for the back button
  const translations = {
    fr: "Retour",
    en: "Back",
    es: "Volver",
    ar: "رجوع"
  };
  
  const backLabel = label || translations[language as keyof typeof translations] || translations.fr;
  
  const handleBack = () => {
    if (onClick) {
      onClick();
    } else if (to) {
      navigate(to);
    } else {
      navigate(-1);
    }
  };
  
  return (
    <Button 
      variant={variant} 
      onClick={handleBack}
      className={`flex items-center gap-2 ${className}`}
    >
      <ArrowLeft className="h-4 w-4" />
      {backLabel}
    </Button>
  );
};

export default NavigationBackButton;
