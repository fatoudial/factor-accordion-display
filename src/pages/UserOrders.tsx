
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { orderApi } from "@/lib/orderApi";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/components/ui/use-toast";
import { Loader2, Search, Calendar, Package } from "lucide-react";
import { Input } from "@/components/ui/input";
import type { Order } from "@/types/order";

const UserOrders = () => {
  const { token } = useAuth();
  const { toast } = useToast();
  const [orders, setOrders] = useState<Order[]>([]);
  const [filteredOrders, setFilteredOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    const fetchOrders = async () => {
      if (!token) return;
      
      try {
        const data = await orderApi.getUserOrders(token);
        setOrders(data);
        setFilteredOrders(data);
      } catch (error) {
        toast({
          title: "Erreur",
          description: "Impossible de charger vos commandes",
          variant: "destructive",
        });
        console.error("Error fetching orders:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchOrders();
  }, [token, toast]);

  useEffect(() => {
    if (searchQuery) {
      const filtered = orders.filter(order => 
        order.orderReference.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setFilteredOrders(filtered);
    } else {
      setFilteredOrders(orders);
    }
  }, [searchQuery, orders]);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('fr-FR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    }).format(date);
  };

  const getStatusBadge = (status: string) => {
    const statusConfigs: Record<string, { label: string; variant: "default" | "outline" | "secondary" | "destructive" }> = {
      PENDING_PAYMENT: { label: "En attente de paiement", variant: "outline" },
      PAID: { label: "Payé", variant: "default" },
      PROCESSING: { label: "En préparation", variant: "secondary" },
      SHIPPED: { label: "Expédié", variant: "default" },
      DELIVERED: { label: "Livré", variant: "default" },
      CANCELLED: { label: "Annulé", variant: "destructive" },
      REFUNDED: { label: "Remboursé", variant: "destructive" },
    };

    const config = statusConfigs[status] || { label: status, variant: "default" };
    
    return (
      <Badge variant={config.variant}>
        {config.label}
      </Badge>
    );
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
      </div>
    );
  }

  return (
    <div className="container mx-auto py-10 px-4 md:px-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
        <div>
          <h1 className="text-3xl font-bold">Mes commandes</h1>
          <p className="text-muted-foreground mt-1">
            Gérez et suivez toutes vos commandes ici
          </p>
        </div>
        
        <div className="w-full md:w-auto">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Rechercher par référence..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 w-full md:w-[250px]"
            />
          </div>
        </div>
      </div>

      {filteredOrders.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center pt-10 pb-10">
            <Package className="h-16 w-16 text-muted-foreground/30 mb-4" />
            <h3 className="text-xl font-semibold mb-2">Aucune commande trouvée</h3>
            <p className="text-muted-foreground text-center max-w-sm mb-6">
              {searchQuery 
                ? "Aucune commande ne correspond à votre recherche. Essayez avec une autre référence."
                : "Vous n'avez pas encore passé de commande. Commencez par créer votre premier livre souvenir !"}
            </p>
            <Button asChild>
              <Link to="/designer">Créer un livre</Link>
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-6">
          {filteredOrders.map((order) => (
            <Card key={order.id} className="overflow-hidden">
              <CardHeader className="bg-muted/40 py-4">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2">
                  <div>
                    <CardTitle className="text-lg flex items-center gap-2">
                      Commande #{order.orderReference}
                      {getStatusBadge(order.status)}
                    </CardTitle>
                    <div className="flex items-center gap-1 text-sm text-muted-foreground mt-1">
                      <Calendar className="h-3 w-3" />
                      {formatDate(order.createdAt.toString())}
                    </div>
                  </div>
                  <Button asChild variant="outline" size="sm">
                    <Link to={`/orders/${order.id}`}>Voir les détails</Link>
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="py-4">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <div>
                    <p className="text-sm font-medium">Format</p>
                    <p className="text-muted-foreground">{order.bookFormat}</p>
                  </div>
                  
                  <div>
                    <p className="text-sm font-medium">Montant</p>
                    <p className="text-muted-foreground">
                      {new Intl.NumberFormat('fr-FR', {
                        style: 'currency',
                        currency: 'XOF',
                        minimumFractionDigits: 0,
                        maximumFractionDigits: 0
                      }).format(order.totalAmount)}
                    </p>
                  </div>
                  
                  <div>
                    <p className="text-sm font-medium">Paiement</p>
                    <p className="text-muted-foreground capitalize">{order.paymentMethod}</p>
                  </div>
                  
                  <div>
                    <p className="text-sm font-medium">Destination</p>
                    <p className="text-muted-foreground">{order.shippingAddress.city}, {order.shippingAddress.country}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default UserOrders;
