
import { useState, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import { orderApi } from "@/lib/orderApi";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Loader2, Package, Users, CreditCard, TrendingUp, Bell } from "lucide-react";
import type { Order } from "@/types/order";
import type { User } from "@/types/user";
import DashboardStats from "@/components/admin/DashboardStats";
import RecentOrdersList from "@/components/admin/RecentOrdersList";

const AdminDashboard = () => {
  const { user } = useAuth();
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  
  const [orders, setOrders] = useState<Order[]>([]);
  const [recentOrders, setRecentOrders] = useState<Order[]>([]);
  const [pendingOrders, setPendingOrders] = useState<Order[]>([]);
  
  const [statistics, setStatistics] = useState({
    totalOrders: 0,
    pendingOrders: 0,
    totalRevenue: 0,
    activeUsers: 0,
    salesByFormat: {
      STANDARD: 0,
      PREMIUM: 0,
      EBOOK: 0
    },
    newUsers: 0,
    totalUsers: 0
  });

  useEffect(() => {
    const fetchData = async () => {
      if (!user) return;
      
      setIsLoading(true);
      try {
        // Charger les commandes
        const ordersData = await orderApi.getAllOrders(localStorage.getItem('token') || '');
        setOrders(ordersData);
        
        // Filtrer les commandes récentes (7 derniers jours)
        const oneWeekAgo = new Date();
        oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
        
        const recent = ordersData
          .filter(order => new Date(order.createdAt) >= oneWeekAgo)
          .slice(0, 5);
        setRecentOrders(recent);
        
        // Filtrer les commandes en attente
        const pending = ordersData
          .filter(order => ["PENDING_PAYMENT", "PAID", "PROCESSING"].includes(order.status))
          .slice(0, 5);
        setPendingOrders(pending);
        
        // Calculer les statistiques
        const totalRev = ordersData
          .filter(order => order.status !== "CANCELLED" && order.status !== "REFUNDED")
          .reduce((sum, order) => sum + order.totalAmount, 0);
        
        // Compter les commandes par format de livre
        const formatCounts = {
          STANDARD: 0,
          PREMIUM: 0,
          EBOOK: 0
        };
        
        ordersData.forEach(order => {
          const format = order.bookFormat || "STANDARD";
          if (format in formatCounts) {
            formatCounts[format as keyof typeof formatCounts]++;
          }
        });
        
        setStatistics({
          totalOrders: ordersData.length,
          pendingOrders: ordersData.filter(order => ["PENDING_PAYMENT", "PAID", "PROCESSING"].includes(order.status)).length,
          totalRevenue: totalRev,
          activeUsers: new Set(ordersData.map(order => order.userId)).size,
          salesByFormat: formatCounts,
          newUsers: 5, // Exemple pour démonstration
          totalUsers: 42 // Exemple pour démonstration
        });
      } catch (err: any) {
        console.error(err);
        setError("Impossible de charger les données");
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchData();
  }, [user]);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto py-10 px-4 md:px-6">
        <div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded-md">
          {error}
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-10 px-4 md:px-6">
      <h1 className="text-3xl font-bold mb-6">Tableau de bord administrateur</h1>

      {/* Statistiques */}
      <DashboardStats 
        totalOrders={statistics.totalOrders}
        pendingOrders={statistics.pendingOrders}
        totalRevenue={statistics.totalRevenue}
        activeUsers={statistics.activeUsers}
        currency="CFA"
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-8">
        {/* Répartition des ventes par type de livre */}
        <Card className="lg:col-span-1">
          <CardHeader>
            <CardTitle>Ventes par format</CardTitle>
            <CardDescription>Répartition des commandes par type de livre</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <div className="w-4 h-4 rounded mr-2 bg-blue-500"></div>
                  <span>Standard</span>
                </div>
                <span className="font-medium">{statistics.salesByFormat.STANDARD}</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <div className="w-4 h-4 rounded mr-2 bg-purple-500"></div>
                  <span>Premium</span>
                </div>
                <span className="font-medium">{statistics.salesByFormat.PREMIUM}</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <div className="w-4 h-4 rounded mr-2 bg-green-500"></div>
                  <span>Ebook</span>
                </div>
                <span className="font-medium">{statistics.salesByFormat.EBOOK}</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Nouveaux utilisateurs */}
        <Card>
          <CardHeader>
            <CardTitle>Utilisateurs</CardTitle>
            <CardDescription>Nouveaux utilisateurs inscrits</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center">
                  <Users className="h-5 w-5 mr-2 text-blue-500" />
                  <span>Total des utilisateurs</span>
                </div>
                <span className="font-bold">{statistics.totalUsers}</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <TrendingUp className="h-5 w-5 mr-2 text-green-500" />
                  <span>Nouveaux cette semaine</span>
                </div>
                <span className="font-bold">{statistics.newUsers}</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Notifications */}
        <Card>
          <CardHeader>
            <CardTitle>Notifications importantes</CardTitle>
            <CardDescription>Alertes récentes</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-start gap-3 pb-3 border-b">
                <div className="bg-amber-100 p-2 rounded-full">
                  <Bell className="h-4 w-4 text-amber-600" />
                </div>
                <div>
                  <p className="font-medium">Commandes en attente</p>
                  <p className="text-sm text-gray-500">
                    {statistics.pendingOrders} commandes nécessitent votre attention
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="bg-blue-100 p-2 rounded-full">
                  <CreditCard className="h-4 w-4 text-blue-600" />
                </div>
                <div>
                  <p className="font-medium">Paiements à vérifier</p>
                  <p className="text-sm text-gray-500">
                    Consultez les transactions récentes
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Onglets pour les commandes récentes et en attente */}
      <Tabs defaultValue="recent" className="mt-8">
        <TabsList>
          <TabsTrigger value="recent">Commandes récentes</TabsTrigger>
          <TabsTrigger value="pending">En attente</TabsTrigger>
        </TabsList>
        <TabsContent value="recent">
          <Card>
            <CardHeader>
              <CardTitle>Dernières commandes</CardTitle>
              <CardDescription>Les 5 commandes les plus récentes</CardDescription>
            </CardHeader>
            <CardContent>
              <RecentOrdersList orders={recentOrders} currency="CFA" />
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="pending">
          <Card>
            <CardHeader>
              <CardTitle>Commandes à traiter</CardTitle>
              <CardDescription>Commandes en attente de traitement</CardDescription>
            </CardHeader>
            <CardContent>
              <RecentOrdersList 
                orders={pendingOrders} 
                emptyMessage="Aucune commande en attente" 
                currency="CFA"
              />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Liens rapides vers les pages d'administration */}
      <div className="grid gap-4 md:grid-cols-3 mt-8">
        <Link to="/admin/orders">
          <Card className="hover:bg-gray-50 transition-colors">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Package className="h-5 w-5" />
                Gérer les commandes
              </CardTitle>
              <CardDescription>Voir et gérer toutes les commandes</CardDescription>
            </CardHeader>
          </Card>
        </Link>
        <Link to="/admin/users">
          <Card className="hover:bg-gray-50 transition-colors">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5" />
                Gérer les utilisateurs
              </CardTitle>
              <CardDescription>Voir et gérer les comptes utilisateurs</CardDescription>
            </CardHeader>
          </Card>
        </Link>
        <Link to="/admin/books">
          <Card className="hover:bg-gray-50 transition-colors">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CreditCard className="h-5 w-5" />
                Gestion des livres
              </CardTitle>
              <CardDescription>Créer et gérer les livres</CardDescription>
            </CardHeader>
          </Card>
        </Link>
      </div>
    </div>
  );
};

export default AdminDashboard;
