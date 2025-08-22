import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface OrderRequest {
  items: Array<{
    product_id: string;
    quantity: number;
    unit_price: number;
  }>;
  shipping_address: {
    name: string;
    email: string;
    phone: string;
    address: string;
    city: string;
    country: string;
    postal_code?: string;
  };
  book_data?: any;
  book_title?: string;
  book_format: string;
}

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Authentifier l'utilisateur
    const authHeader = req.headers.get("Authorization");
    if (!authHeader) {
      throw new Error("Authorization header required");
    }

    const supabaseClient = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_ANON_KEY") ?? ""
    );

    const token = authHeader.replace("Bearer ", "");
    const { data: { user }, error: authError } = await supabaseClient.auth.getUser(token);
    
    if (authError || !user) {
      throw new Error("Invalid authentication");
    }

    const orderRequest: OrderRequest = await req.json();

    // Calculer le montant total
    const totalAmount = orderRequest.items.reduce((sum, item) => 
      sum + (item.unit_price * item.quantity), 0
    );

    // Utiliser le service role key pour créer la commande
    const supabaseService = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "",
      { auth: { persistSession: false } }
    );

    // Créer la commande
    const { data: order, error: orderError } = await supabaseService
      .from('orders')
      .insert({
        user_id: user.id,
        book_format: orderRequest.book_format,
        book_title: orderRequest.book_title,
        total_amount: totalAmount,
        shipping_address: orderRequest.shipping_address,
        book_data: orderRequest.book_data,
        status: 'PENDING_PAYMENT'
      })
      .select()
      .single();

    if (orderError) {
      console.error("Order creation error:", orderError);
      throw new Error(`Failed to create order: ${orderError.message}`);
    }

    // Créer les éléments de commande
    const orderItemsData = orderRequest.items.map(item => ({
      order_id: order.id,
      product_id: item.product_id,
      quantity: item.quantity,
      unit_price: item.unit_price,
      total_price: item.unit_price * item.quantity
    }));

    const { error: itemsError } = await supabaseService
      .from('order_items')
      .insert(orderItemsData);

    if (itemsError) {
      console.error("Order items creation error:", itemsError);
      throw new Error(`Failed to create order items: ${itemsError.message}`);
    }

    // Créer une notification
    await supabaseService
      .from('notifications')
      .insert({
        user_id: user.id,
        type: 'order_created',
        title: 'Commande créée',
        message: `Votre commande ${order.order_reference} a été créée avec succès.`,
        order_id: order.id
      });

    console.log("Order created successfully:", order.order_reference);

    return new Response(JSON.stringify({ 
      success: true, 
      order: order 
    }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 200,
    });

  } catch (error) {
    console.error("Error in create-order function:", error);
    return new Response(JSON.stringify({ 
      error: error.message 
    }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 500,
    });
  }
});