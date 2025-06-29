
import React from "react";
import { Link, useLocation } from "react-router-dom";
import { 
  LayoutDashboard, 
  Package, 
  Users, 
  CreditCard, 
  Settings, 
  LogOut,
  Book,
  FileText,
  MessageSquare,
  Coins,
  UserPlus,
  FileUp,
  FileSearch,
  Calendar,
  Edit,
  Image,
  Award,
  Mail,
  Receipt,
  Truck,
  Info,
  Lock,
  UserCog,
  History,
  TrendingUp,
  Bell,
  AlertCircle
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { useAuth } from "@/context/AuthContext";

interface AdminSidebarProps {
  onLogout: () => Promise<void>;
}

const AdminSidebar: React.FC<AdminSidebarProps> = ({ onLogout }) => {
  const location = useLocation();
  const { user } = useAuth();
  
  // Groupes de navigation
  const navigationGroups = [
    {
      title: "Principal",
      items: [
        { name: "Tableau de bord", href: "/admin", icon: LayoutDashboard },
        { name: "Commandes", href: "/admin/orders", icon: Package },
        { name: "Utilisateurs", href: "/admin/users", icon: Users },
        { name: "Paiements", href: "/admin/payments", icon: CreditCard },
      ]
    },
    {
      title: "Gestion du contenu",
      items: [
        { name: "Livres & Création", href: "/admin/books", icon: Book },
        { name: "Contenu du site", href: "/admin/content", icon: FileText },
        { name: "Témoignages", href: "/admin/testimonials", icon: Award },
      ]
    },
    {
      title: "Communication",
      items: [
        { name: "Messagerie", href: "/admin/messages", icon: MessageSquare },
        { name: "Notifications", href: "/admin/notifications", icon: Bell },
      ]
    },
    {
      title: "Avancé",
      items: [
        { name: "Partenaires", href: "/admin/partners", icon: Truck },
        { name: "Comptes admin", href: "/admin/admin-accounts", icon: UserPlus },
        { name: "Historique", href: "/admin/history", icon: History },
        { name: "Paramètres", href: "/admin/settings", icon: Settings },
      ]
    }
  ];

  // Vérifier si un lien est actif
  const isActive = (path: string) => {
    return location.pathname === path;
  };

  return (
    <div className="h-full flex flex-col bg-gray-900 text-white">
      <div className="px-4 py-6 flex items-center justify-between bg-gray-800">
        <h1 className="text-xl font-bold">Admin Panel</h1>
        <div className="p-1 rounded-full bg-red-500 animate-pulse" title="Mode administrateur actif"></div>
      </div>
      
      {user && (
        <div className="px-4 py-3 bg-gray-800/50 border-y border-gray-700">
          <p className="text-sm font-medium">Connecté en tant que :</p>
          <p className="text-sm font-bold">{user.firstName} {user.lastName}</p>
          <p className="text-xs text-gray-400">{user.email}</p>
          <p className="text-xs mt-1 bg-red-500/20 text-red-300 px-2 py-0.5 rounded inline-flex items-center">
            <AlertCircle className="h-3 w-3 mr-1" />
            Mode administrateur
          </p>
        </div>
      )}
      
      <ScrollArea className="flex-1">
        <div className="px-2 py-2">
          {navigationGroups.map((group, index) => (
            <Collapsible key={index} defaultOpen={true} className="mb-2">
              <CollapsibleTrigger className="w-full flex items-center justify-between px-2 py-2 text-sm font-semibold text-gray-400 hover:text-white">
                {group.title}
                <span className="text-xs">▼</span>
              </CollapsibleTrigger>
              <CollapsibleContent>
                <div className="mt-1 space-y-1">
                  {group.items.map((item) => (
                    <Link
                      key={item.name}
                      to={item.href}
                      className={`
                        flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors
                        ${isActive(item.href) 
                          ? "bg-gray-800 text-white" 
                          : "text-gray-300 hover:bg-gray-700"}
                      `}
                    >
                      <item.icon className="mr-3 h-5 w-5" />
                      {item.name}
                    </Link>
                  ))}
                </div>
              </CollapsibleContent>
            </Collapsible>
          ))}
        </div>
      </ScrollArea>
      
      <div className="p-4 border-t border-gray-700">
        <Button
          variant="ghost"
          className="w-full justify-start text-gray-300 hover:bg-gray-700 px-4 py-3"
          onClick={onLogout}
        >
          <LogOut className="mr-3 h-5 w-5" />
          Déconnexion
        </Button>
      </div>
    </div>
  );
};

export default AdminSidebar;
