
import React from "react";
import { Outlet, useNavigate } from "react-router-dom";
import { 
  LayoutDashboard, 
  Package, 
  Users, 
  CreditCard, 
  LogOut,
  Menu,
  ArrowLeft
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/context/AuthContext";
import { useToast } from "@/components/ui/use-toast";
import AdminSidebar from "./AdminSidebar";
import { useState, useEffect } from "react";
import { useLanguage } from "@/context/LanguageContext";

const AdminLayout: React.FC = () => {
  const navigate = useNavigate();
  const { user, profile, logout } = useAuth();
  const { toast } = useToast();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [isMobile, setIsMobile] = useState(false);
  const { language } = useLanguage();

  // Traductions
  const translations = {
    fr: {
      dashboard: "Tableau de bord administrateur",
      logout: "Déconnexion",
      backToSite: "Retour au site",
      userInfo: "Connecté en tant que"
    },
    en: {
      dashboard: "Admin Dashboard",
      logout: "Logout",
      backToSite: "Back to site",
      userInfo: "Logged in as"
    },
    es: {
      dashboard: "Panel de administración",
      logout: "Cerrar sesión",
      backToSite: "Volver al sitio",
      userInfo: "Conectado como"
    },
    ar: {
      dashboard: "لوحة الإدارة",
      logout: "تسجيل الخروج",
      backToSite: "العودة إلى الموقع",
      userInfo: "متصل كـ"
    }
  };

  const t = translations[language] || translations.fr;

  // Détecter si on est sur mobile
  useEffect(() => {
    const checkIfMobile = () => {
      setIsMobile(window.innerWidth < 768);
      if (window.innerWidth < 768) {
        setSidebarOpen(false);
      } else {
        setSidebarOpen(true);
      }
    };
    
    checkIfMobile();
    window.addEventListener("resize", checkIfMobile);
    
    return () => {
      window.removeEventListener("resize", checkIfMobile);
    };
  }, []);
  
  const handleLogout = async () => {
    await logout();
    toast({
      title: t.logout,
      description: "Vous avez été déconnecté avec succès",
    });
    navigate("/login");
  };

  const handleBackToSite = () => {
    navigate("/");
  };

  // Options de navigation pour la version mobile
  const mobileNavItems = [
    { name: "Dashboard", href: "/admin", icon: LayoutDashboard },
    { name: "Commandes", href: "/admin/orders", icon: Package },
    { name: "Utilisateurs", href: "/admin/users", icon: Users },
    { name: "Paiements", href: "/admin/payments", icon: CreditCard },
  ];

  return (
    <div className="flex h-screen overflow-hidden">
      {/* Sidebar */}
      <div 
        className={`${sidebarOpen ? 'w-64' : 'w-0'} md:w-64 h-full transition-all duration-300 hidden md:block`}
      >
        <AdminSidebar onLogout={handleLogout} />
      </div>
      
      {/* Mobile sidebar - slide in from left */}
      {isMobile && sidebarOpen && (
        <div className="fixed inset-0 z-40 flex md:hidden">
          <div className="fixed inset-0 bg-black/50" onClick={() => setSidebarOpen(false)}></div>
          <div className="relative flex flex-col w-full max-w-xs pb-4 bg-gray-900">
            <AdminSidebar onLogout={handleLogout} />
          </div>
        </div>
      )}

      {/* Main content */}
      <div className="flex flex-col flex-1 overflow-hidden">
        {/* Mobile header */}
        <div className="bg-gray-900 text-white p-4 flex items-center justify-between md:hidden">
          <Button variant="ghost" size="icon" onClick={() => setSidebarOpen(!sidebarOpen)}>
            <Menu className="h-6 w-6" />
          </Button>
          
          <h1 className="text-xl font-bold flex items-center gap-2">
            Admin Panel
            <span className="p-1.5 rounded-full bg-red-500 animate-pulse"></span>
          </h1>
          
          <Button variant="ghost" size="sm" onClick={handleLogout}>
            <LogOut className="h-5 w-5" />
          </Button>
        </div>

        {/* Desktop header */}
        <div className="bg-gray-100 border-b">
          <div className="flex items-center justify-between p-4 max-w-screen-2xl mx-auto">
            <div className="flex items-center gap-4">
              <Button 
                variant="outline" 
                size="icon" 
                className="md:hidden" 
                onClick={() => setSidebarOpen(!sidebarOpen)}
              >
                <Menu className="h-6 w-6" />
              </Button>

              {/* Bouton retour vers le site */}
              <Button 
                variant="outline" 
                size="sm"
                onClick={handleBackToSite}
                className="flex items-center gap-2"
              >
                <ArrowLeft className="h-4 w-4" />
                {t.backToSite}
              </Button>
              
              <h1 className="text-xl font-bold">{t.dashboard}</h1>
            </div>
            <div>
              {user && (
                <span className="text-sm text-gray-500">
                  {t.userInfo}: {user?.email}
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Page content */}
        <main className="flex-1 overflow-y-auto bg-gray-50">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
