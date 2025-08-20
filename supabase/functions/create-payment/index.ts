import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import Stripe from "https://esm.sh/stripe@14.21.0";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const logStep = (step: string, details?: any) => {
  const detailsStr = details ? ` - ${JSON.stringify(details)}` : '';
  console.log(`[CREATE-PAYMENT] ${step}${detailsStr}`);
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    logStep("Function started");

    const stripeKey = Deno.env.get("STRIPE_SECRET_KEY");
    if (!stripeKey) throw new Error("STRIPE_SECRET_KEY is not set");
    logStep("Stripe key verified");

    // Parse request body
    const { amount, currency = 'eur', description, bookId, shippingAddress } = await req.json();
    logStep("Request parsed", { amount, currency, description, bookId });

    // Create Supabase client using service role key for writes
    const supabaseService = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "",
      { auth: { persistSession: false } }
    );

    // Create Supabase client for user authentication
    const supabaseClient = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_ANON_KEY") ?? ""
    );

    let user = null;
    let userEmail = "guest@tchatsouvenir.com"; // Default for guest checkout
    
    // Try to authenticate user (optional for guest checkout)
    const authHeader = req.headers.get("Authorization");
    if (authHeader) {
      const token = authHeader.replace("Bearer ", "");
      const { data: userData, error: userError } = await supabaseClient.auth.getUser(token);
      if (!userError && userData.user) {
        user = userData.user;
        userEmail = user.email;
        logStep("User authenticated", { userId: user.id, email: userEmail });
      }
    }

    if (!user) {
      logStep("Guest checkout - no authentication required");
    }

    const stripe = new Stripe(stripeKey, { apiVersion: "2023-10-16" });
    
    // Check if customer exists
    const customers = await stripe.customers.list({ email: userEmail, limit: 1 });
    let customerId;
    if (customers.data.length > 0) {
      customerId = customers.data[0].id;
      logStep("Existing customer found", { customerId });
    }

    // Create payment session
    const session = await stripe.checkout.sessions.create({
      customer: customerId,
      customer_email: customerId ? undefined : userEmail,
      line_items: [
        {
          price_data: {
            currency: currency,
            product_data: { 
              name: description || "Livre Tchat Souvenir",
              description: "Création de livre personnalisé à partir de conversations"
            },
            unit_amount: Math.round(amount * 100), // Convert to cents
          },
          quantity: 1,
        },
      ],
      mode: "payment",
      success_url: `${req.headers.get("origin")}/checkout?session_id={CHECKOUT_SESSION_ID}&success=true`,
      cancel_url: `${req.headers.get("origin")}/checkout?canceled=true`,
      metadata: {
        bookId: bookId || "",
        userId: user?.id || "guest",
      }
    });

    logStep("Stripe session created", { sessionId: session.id });

    // Create order record in database
    const orderData = {
      user_id: user?.id || null,
      book_id: bookId || null,
      total_amount: amount,
      currency: currency,
      status: 'PENDING',
      payment_reference: session.id,
      payment_method: 'STRIPE',
      shipping_address: shippingAddress || null,
    };

    const { data: order, error: orderError } = await supabaseService
      .from('orders')
      .insert(orderData)
      .select()
      .single();

    if (orderError) {
      logStep("Error creating order", { error: orderError });
      throw new Error(`Failed to create order: ${orderError.message}`);
    }

    logStep("Order created", { orderId: order.id });

    return new Response(JSON.stringify({ 
      url: session.url, 
      sessionId: session.id,
      orderId: order.id 
    }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 200,
    });

  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    logStep("ERROR in create-payment", { message: errorMessage });
    return new Response(JSON.stringify({ error: errorMessage }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 500,
    });
  }
});