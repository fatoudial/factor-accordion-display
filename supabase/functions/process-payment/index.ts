import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface PaymentRequest {
  order_id: string;
  payment_method: 'orange_money' | 'wave' | 'credit_card';
  phone_number?: string;
  card_details?: {
    number: string;
    expiry: string;
    cvc: string;
    name: string;
  };
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

    const paymentRequest: PaymentRequest = await req.json();

    // Utiliser le service role key
    const supabaseService = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "",
      { auth: { persistSession: false } }
    );

    // Vérifier que la commande existe et appartient à l'utilisateur
    const { data: order, error: orderError } = await supabaseService
      .from('orders')
      .select('*')
      .eq('id', paymentRequest.order_id)
      .eq('user_id', user.id)
      .single();

    if (orderError || !order) {
      throw new Error("Order not found or unauthorized");
    }

    if (order.status !== 'PENDING_PAYMENT') {
      throw new Error("Order is not pending payment");
    }

    // Créer l'enregistrement de paiement
    const { data: payment, error: paymentError } = await supabaseService
      .from('payments')
      .insert({
        order_id: paymentRequest.order_id,
        payment_method: paymentRequest.payment_method,
        amount: order.total_amount,
        phone_number: paymentRequest.phone_number,
        status: 'PENDING'
      })
      .select()
      .single();

    if (paymentError) {
      console.error("Payment creation error:", paymentError);
      throw new Error(`Failed to create payment: ${paymentError.message}`);
    }

    // Simuler le traitement du paiement selon la méthode
    let paymentResult;
    
    if (paymentRequest.payment_method === 'orange_money') {
      paymentResult = await processOrangeMoneyPayment(paymentRequest, order);
    } else if (paymentRequest.payment_method === 'wave') {
      paymentResult = await processWavePayment(paymentRequest, order);
    } else if (paymentRequest.payment_method === 'credit_card') {
      paymentResult = await processCreditCardPayment(paymentRequest, order);
    } else {
      throw new Error("Unsupported payment method");
    }

    // Mettre à jour le paiement avec le résultat
    const { error: updatePaymentError } = await supabaseService
      .from('payments')
      .update({
        status: paymentResult.success ? 'SUCCESS' : 'FAILED',
        provider_transaction_id: paymentResult.transaction_id,
        provider_response: paymentResult.response
      })
      .eq('id', payment.id);

    if (updatePaymentError) {
      console.error("Payment update error:", updatePaymentError);
    }

    // Si le paiement réussit, mettre à jour la commande
    if (paymentResult.success) {
      await supabaseService
        .from('orders')
        .update({
          status: 'PAID',
          payment_method: paymentRequest.payment_method,
          transaction_id: paymentResult.transaction_id
        })
        .eq('id', paymentRequest.order_id);

      // Créer une notification de succès
      await supabaseService
        .from('notifications')
        .insert({
          user_id: user.id,
          type: 'payment_success',
          title: 'Paiement réussi',
          message: `Votre paiement pour la commande ${order.order_reference} a été traité avec succès.`,
          order_id: order.id
        });

      console.log("Payment processed successfully:", paymentResult.transaction_id);
    }

    return new Response(JSON.stringify({
      success: paymentResult.success,
      transaction_id: paymentResult.transaction_id,
      message: paymentResult.message,
      payment_id: payment.id
    }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 200,
    });

  } catch (error) {
    console.error("Error in process-payment function:", error);
    return new Response(JSON.stringify({ 
      error: error.message 
    }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 500,
    });
  }
});

// Fonctions de simulation de paiement
async function processOrangeMoneyPayment(request: PaymentRequest, order: any) {
  // Simulation Orange Money
  const phoneNumber = request.phone_number;
  
  if (!phoneNumber || !phoneNumber.startsWith('07')) {
    return {
      success: false,
      message: "Numéro Orange Money invalide (doit commencer par 07)",
      transaction_id: null,
      response: { error: "Invalid phone number" }
    };
  }

  // Simuler un délai de traitement
  await new Promise(resolve => setTimeout(resolve, 2000));

  // Simuler un succès 90% du temps
  const success = Math.random() > 0.1;
  const transactionId = success ? `OM${Date.now()}${Math.random().toString(36).substr(2, 9)}` : null;

  return {
    success,
    message: success ? "Paiement Orange Money réussi" : "Échec du paiement Orange Money",
    transaction_id: transactionId,
    response: {
      provider: "orange_money",
      phone: phoneNumber,
      amount: order.total_amount,
      status: success ? "success" : "failed"
    }
  };
}

async function processWavePayment(request: PaymentRequest, order: any) {
  // Simulation Wave
  const phoneNumber = request.phone_number;
  
  if (!phoneNumber || !phoneNumber.startsWith('78')) {
    return {
      success: false,
      message: "Numéro Wave invalide (doit commencer par 78)",
      transaction_id: null,
      response: { error: "Invalid phone number" }
    };
  }

  // Simuler un délai de traitement
  await new Promise(resolve => setTimeout(resolve, 1500));

  // Simuler un succès 90% du temps
  const success = Math.random() > 0.1;
  const transactionId = success ? `WAVE${Date.now()}${Math.random().toString(36).substr(2, 9)}` : null;

  return {
    success,
    message: success ? "Paiement Wave réussi" : "Échec du paiement Wave",
    transaction_id: transactionId,
    response: {
      provider: "wave",
      phone: phoneNumber,
      amount: order.total_amount,
      status: success ? "success" : "failed"
    }
  };
}

async function processCreditCardPayment(request: PaymentRequest, order: any) {
  // Simulation carte bancaire
  const cardDetails = request.card_details;
  
  if (!cardDetails || cardDetails.number !== '4242424242424242') {
    return {
      success: false,
      message: "Détails de carte invalides (utilisez 4242 4242 4242 4242 pour les tests)",
      transaction_id: null,
      response: { error: "Invalid card details" }
    };
  }

  // Simuler un délai de traitement
  await new Promise(resolve => setTimeout(resolve, 3000));

  // Simuler un succès 95% du temps
  const success = Math.random() > 0.05;
  const transactionId = success ? `CC${Date.now()}${Math.random().toString(36).substr(2, 9)}` : null;

  return {
    success,
    message: success ? "Paiement par carte réussi" : "Échec du paiement par carte",
    transaction_id: transactionId,
    response: {
      provider: "credit_card",
      card_last4: cardDetails.number.slice(-4),
      amount: order.total_amount,
      status: success ? "success" : "failed"
    }
  };
}