
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { MapPin } from "lucide-react";
import type { ShippingAddress } from "@/types/order";

interface OrderItem {
  id: string;
  name: string;
  description: string;
  price: number;
  quantity: number;
  image?: string;
}

interface OrderSummaryProps {
  title?: string;
  format?: string;
  price?: number;
  shippingAddress?: ShippingAddress;
  items?: OrderItem[];
  shippingCost?: number;
}

const OrderSummary = ({ 
  title, 
  format, 
  price, 
  shippingAddress, 
  items, 
  shippingCost = 0
}: OrderSummaryProps) => {
  
  // Calculate totals if using items
  const subtotal = items 
    ? items.reduce((sum, item) => sum + (item.price * item.quantity), 0) 
    : price || 0;
  
  const total = subtotal + (shippingCost || 0);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Récapitulatif</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {/* Show either single item or multiple items */}
          {items ? (
            <div className="space-y-3">
              {items.map(item => (
                <div key={item.id} className="flex items-center gap-3">
                  {item.image && (
                    <div className="h-16 w-16 rounded border overflow-hidden">
                      <img 
                        src={item.image} 
                        alt={item.name} 
                        className="h-full w-full object-cover" 
                      />
                    </div>
                  )}
                  <div className="flex-1">
                    <h3 className="font-medium">{item.name}</h3>
                    <p className="text-sm text-muted-foreground">{item.description}</p>
                    <div className="flex justify-between items-center mt-1">
                      <span className="text-sm">Qté: {item.quantity}</span>
                      <span>{item.price.toLocaleString()} FCFA</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            title && format && (
              <div>
                <h3 className="font-medium">{title}</h3>
                <p className="text-sm text-muted-foreground">{format}</p>
              </div>
            )
          )}

          <Separator />

          <div className="space-y-2">
            <div className="flex justify-between">
              <span>Sous-total</span>
              <span>{subtotal.toLocaleString()} FCFA</span>
            </div>
            <div className="flex justify-between">
              <span>Livraison</span>
              <span>{shippingCost ? `${shippingCost.toLocaleString()} FCFA` : 'Incluse'}</span>
            </div>
          </div>

          <Separator />

          <div className="flex justify-between font-semibold">
            <span>Total</span>
            <span>{total.toLocaleString()} FCFA</span>
          </div>

          {shippingAddress && (
            <>
              <Separator />
              <div className="space-y-1">
                <div className="flex items-center gap-1 text-sm font-medium">
                  <MapPin className="h-4 w-4" />
                  <span>Adresse de livraison</span>
                </div>
                <div className="text-sm text-muted-foreground">
                  <p>{shippingAddress.fullName || `${shippingAddress.firstName} ${shippingAddress.lastName}`.trim()}</p>
                  <p>{shippingAddress.addressLine1 || shippingAddress.address}</p>
                  {(shippingAddress.addressLine2) && <p>{shippingAddress.addressLine2}</p>}
                  <p>{shippingAddress.postalCode} {shippingAddress.city}</p>
                  <p>{shippingAddress.state || ''}, {shippingAddress.country}</p>
                  <p>{shippingAddress.phone}</p>
                  {shippingAddress.email && <p>{shippingAddress.email}</p>}
                </div>
              </div>
            </>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default OrderSummary;
