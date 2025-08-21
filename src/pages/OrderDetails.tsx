import { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { orderApi } from "@/lib/orderApi";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { Clock, Loader2, MapPin, Package, Truck, X } from "lucide-react";
import type { Order } from "@/types/order";

const OrderDetails = () => {
  const { orderId } = useParams<{ orderId: string }>();
  const { user } = useAuth();
  const [order, setOrder] = useState<Order | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [isCancelling, setIsCancelling] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchOrder = async () => {
      if (!user || !orderId) return;
      
      try {
        const data = await orderApi.getOrderById(localStorage.getItem('token') || '', orderId);
        setOrder(data);
      } catch (err: any) {
        setError("Impossible de charger les détails de la commande");
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchOrder();
  }, [user, orderId]);

  const handleCancelOrder = async () => {
    if (!user || !orderId) return;
    
    setIsCancelling(true);
    try {
      const updatedOrder = await orderApi.cancelOrder(localStorage.getItem('token') || '', orderId);
      setOrder(updatedOrder);
    } catch (err: any) {
      setError("Impossible d'annuler la commande");
      console.error(err);
    } finally {
      setIsCancelling(false);
    }
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
      <Badge variant={config.variant} className="whitespace-nowrap">
        {config.label}
      </Badge>
    );
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('fr-FR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    }).format(date);
  };

  const formatPrice = (amount: number) => {
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: 'EUR'
    }).format(amount / 100);
  };

  const canCancelOrder = order && ["PENDING_PAYMENT", "PAID", "PROCESSING"].includes(order.status);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
      </div>
    );
  }

  if (error || !order) {
    return (
      <div className="container mx-auto py-10 px-4 md:px-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-red-500">Erreur</CardTitle>
            <CardDescription>{error || "Commande non trouvée"}</CardDescription>
          </CardHeader>
          <CardFooter>
            <Button onClick={() => navigate("/dashboard")}>Retour au tableau de bord</Button>
          </CardFooter>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-10 px-4 md:px-6">
      <div className="mb-6">
        <Button variant="outline" onClick={() => navigate("/dashboard")}>
          &larr; Retour au tableau de bord
        </Button>
      </div>
      
      <div className="grid gap-6 md:grid-cols-3">
        <div className="md:col-span-2">
          <Card>
            <CardHeader>
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div>
                  <CardTitle className="text-xl">Commande #{order.orderReference}</CardTitle>
                  <CardDescription>Passée le {formatDate(order.createdAt.toString())}</CardDescription>
                </div>
                <div>
                  {getStatusBadge(order.status)}
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div>
                  <h3 className="font-semibold text-lg mb-2 flex items-center gap-2">
                    <Package className="h-5 w-5" /> Détails du livre
                  </h3>
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-sm text-gray-500">Format</p>
                        <p className="font-medium">{order.bookFormat}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">ID du livre</p>
                        <p className="font-medium">#{order.bookId}</p>
                      </div>
                    </div>
                  </div>
                </div>

                <Separator />

                <div>
                  <h3 className="font-semibold text-lg mb-2 flex items-center gap-2">
                    <MapPin className="h-5 w-5" /> Adresse de livraison
                  </h3>
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <p className="font-medium">{order.shippingAddress.fullName}</p>
                    <p>{order.shippingAddress.addressLine1}</p>
                    {order.shippingAddress.addressLine2 && <p>{order.shippingAddress.addressLine2}</p>}
                    <p>{order.shippingAddress.postalCode} {order.shippingAddress.city}</p>
                    <p>{order.shippingAddress.country}</p>
                    <p className="mt-2">{order.shippingAddress.phone}</p>
                  </div>
                </div>

                {order.trackingNumber && (
                  <>
                    <Separator />
                    <div>
                      <h3 className="font-semibold text-lg mb-2 flex items-center gap-2">
                        <Truck className="h-5 w-5" /> Suivi de livraison
                      </h3>
                      <div className="bg-gray-50 p-4 rounded-lg">
                        <p className="text-sm text-gray-500">Numéro de suivi</p>
                        <p className="font-medium">{order.trackingNumber}</p>
                        {order.estimatedDeliveryDate && (
                          <div className="mt-2">
                            <p className="text-sm text-gray-500">Livraison estimée</p>
                            <p className="font-medium">
                              {formatDate(order.estimatedDeliveryDate.toString())}
                            </p>
                          </div>
                        )}
                      </div>
                    </div>
                  </>
                )}
              </div>
            </CardContent>
            <CardFooter>
              {canCancelOrder && (
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button variant="destructive" disabled={isCancelling}>
                      {isCancelling ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <X className="h-4 w-4 mr-2" />}
                      Annuler la commande
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Êtes-vous sûr?</AlertDialogTitle>
                      <AlertDialogDescription>
                        Cette action ne peut pas être annulée. Cela annulera définitivement votre commande.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Annuler</AlertDialogCancel>
                      <AlertDialogAction onClick={handleCancelOrder}>Confirmer</AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              )}
            </CardFooter>
          </Card>
        </div>

        <div>
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Récapitulatif</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex justify-between">
                  <span>Livre ({order.bookFormat})</span>
                  <span>{formatPrice(order.totalAmount)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Livraison</span>
                  <span>Incluse</span>
                </div>
                <Separator />
                <div className="flex justify-between font-bold">
                  <span>Total</span>
                  <span>{formatPrice(order.totalAmount)}</span>
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex flex-col gap-4">
              <div className="w-full flex items-center gap-2 text-gray-500">
                <Clock className="h-4 w-4" />
                <span className="text-sm">
                  {order.status === "DELIVERED" 
                    ? "Livré le " + (order.updatedAt ? formatDate(order.updatedAt.toString()) : "N/A")
                    : "Commande " + getStatusBadge(order.status).props.children.toLowerCase()}
                </span>
              </div>
            </CardFooter>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default OrderDetails;
