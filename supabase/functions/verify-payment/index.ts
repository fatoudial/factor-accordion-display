import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import Stripe from "https://esm.sh/stripe@14.21.0";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const logStep = (step: string, details?: any) => {
  const detailsStr = details ? ` - ${JSON.stringify(details)}` : '';
  console.log(`[VERIFY-PAYMENT] ${step}${detailsStr}`);
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    logStep("Function started");

    const stripeKey = Deno.env.get("STRIPE_SECRET_KEY");
    if (!stripeKey) throw new Error("STRIPE_SECRET_KEY is not set");

    const { sessionId } = await req.json();
    if (!sessionId) throw new Error("Session ID is required");

    logStep("Verifying session", { sessionId });

    const stripe = new Stripe(stripeKey, { apiVersion: "2023-10-16" });
    
    // Retrieve checkout session
    const session = await stripe.checkout.sessions.retrieve(sessionId, {
      expand: ['payment_intent']
    });

    logStep("Session retrieved", { 
      sessionId, 
      paymentStatus: session.payment_status,
      paymentIntent: session.payment_intent?.id 
    });

    // Create Supabase client using service role key
    const supabase = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "",
      { auth: { persistSession: false } }
    );

    // Update order status based on payment status
    let orderStatus = 'PENDING';
    if (session.payment_status === 'paid') {
      orderStatus = 'PAID';
    } else if (session.payment_status === 'unpaid') {
      orderStatus = 'FAILED';
    }

    // Update order in database
    const { data: order, error: updateError } = await supabase
      .from('orders')
      .update({
        status: orderStatus,
        updated_at: new Date().toISOString(),
      })
      .eq('payment_reference', sessionId)
      .select()
      .single();

    if (updateError) {
      logStep("Error updating order", { error: updateError });
      throw new Error(`Failed to update order: ${updateError.message}`);
    }

    logStep("Order updated", { orderId: order.id, status: orderStatus });

    // If payment successful and there's a book, update book status
    if (orderStatus === 'PAID' && order.book_id) {
      const { error: bookError } = await supabase
        .from('books')
        .update({ 
          status: 'ORDERED',
          updated_at: new Date().toISOString()
        })
        .eq('id', order.book_id);

      if (bookError) {
        logStep("Error updating book status", { error: bookError });
      } else {
        logStep("Book status updated to ORDERED", { bookId: order.book_id });
      }
    }

    return new Response(JSON.stringify({
      success: orderStatus === 'PAID',
      status: orderStatus,
      orderId: order.id,
      sessionDetails: {
        paymentStatus: session.payment_status,
        amountTotal: session.amount_total,
        currency: session.currency,
        customerEmail: session.customer_details?.email
      }
    }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 200,
    });

  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    logStep("ERROR in verify-payment", { message: errorMessage });
    return new Response(JSON.stringify({ error: errorMessage }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 500,
    });
  }
});