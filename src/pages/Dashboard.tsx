
import { useEffect, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { BookOpen, ShoppingBag, User } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";

const Dashboard = () => {
  const { user, userProfile, isAdmin } = useAuth();
  const navigate = useNavigate();
  const { t } = useLanguage();
  
  // Rediriger les administrateurs vers le tableau de bord d'administration
  useEffect(() => {
    if (isAdmin) {
      navigate('/admin');
    }
  }, [isAdmin, navigate]);
  
  const handleCreateBook = () => {
    navigate('/designer');
  };
  
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8 text-ts-forest">
        {t('dashboard.welcome')}, {userProfile?.first_name || user?.email || 'utilisateur'} !
      </h1>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
        <Card className="border-ts-gold/20 hover:shadow-md transition-all">
          <CardHeader className="bg-ts-forest/5 rounded-t-lg">
            <CardTitle className="flex items-center gap-2">
              <BookOpen className="h-5 w-5 text-ts-gold" />
              {t('dashboard.createBook')}
            </CardTitle>
            <CardDescription>{t('dashboard.createBookDesc')}</CardDescription>
          </CardHeader>
          <CardContent className="pt-6">
            <p className="text-sm text-gray-600 mb-4">
              Créez un livre personnalisé à partir de vos conversations
            </p>
          </CardContent>
          <CardFooter>
            <Button 
              onClick={handleCreateBook}
              className="w-full bg-ts-forest hover:bg-ts-forest/90 text-white"
            >
              Créer un livre
            </Button>
          </CardFooter>
        </Card>
        
        <Card className="border-ts-gold/20 hover:shadow-md transition-all">
          <CardHeader className="bg-ts-forest/5 rounded-t-lg">
            <CardTitle className="flex items-center gap-2">
              <ShoppingBag className="h-5 w-5 text-ts-terracotta" />
              {t('dashboard.orders')}
            </CardTitle>
            <CardDescription>{t('dashboard.ordersDesc')}</CardDescription>
          </CardHeader>
          <CardContent className="pt-6">
            <p className="text-sm text-gray-600">
              {t('orders.description')}
            </p>
          </CardContent>
          <CardFooter>
            <Button onClick={() => navigate('/user-orders')} variant="outline" className="w-full border-ts-terracotta text-ts-terracotta hover:bg-ts-terracotta/10">
              {t('dashboard.viewOrders')}
            </Button>
          </CardFooter>
        </Card>
        
        <Card className="border-ts-gold/20 hover:shadow-md transition-all">
          <CardHeader className="bg-ts-forest/5 rounded-t-lg">
            <CardTitle className="flex items-center gap-2">
              <User className="h-5 w-5 text-ts-indigo" />
              {t('dashboard.profile')}
            </CardTitle>
            <CardDescription>{t('dashboard.profileDesc')}</CardDescription>
          </CardHeader>
          <CardContent className="pt-6">
            <p className="text-sm text-gray-600">
              {t('profile.description')}
            </p>
          </CardContent>
          <CardFooter>
            <Button onClick={() => navigate('/profile')} variant="outline" className="w-full border-ts-indigo text-ts-indigo hover:bg-ts-indigo/10">
              {t('dashboard.editProfile')}
            </Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;