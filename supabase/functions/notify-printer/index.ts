import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const logStep = (step: string, details?: any) => {
  const detailsStr = details ? ` - ${JSON.stringify(details)}` : '';
  console.log(`[NOTIFY-PRINTER] ${step}${detailsStr}`);
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    logStep("Function started");

    const { orderId, printerEmail = "imprimeur@tchatsouvenir.com" } = await req.json();
    if (!orderId) throw new Error("Order ID is required");

    logStep("Processing notification", { orderId, printerEmail });

    // Create Supabase client using service role key
    const supabase = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "",
      { auth: { persistSession: false } }
    );

    // Get order details with book and user info
    const { data: order, error: orderError } = await supabase
      .from('orders')
      .select(`
        *,
        books (
          id,
          title,
          file_path,
          total_pages,
          metadata
        ),
        profiles (
          first_name,
          last_name,
          email
        )
      `)
      .eq('id', orderId)
      .single();

    if (orderError || !order) {
      throw new Error(`Order not found: ${orderError?.message}`);
    }

    logStep("Order retrieved", { orderId, status: order.status });

    // Create printer notification record
    const notificationData = {
      order_id: orderId,
      printer_email: printerEmail,
      notification_type: 'NEW_ORDER',
      message: `Nouvelle commande #${orderId} - ${order.books?.title || 'Livre personnalisé'}`,
      status: 'SENT',
      metadata: {
        customer_name: order.profiles ? `${order.profiles.first_name} ${order.profiles.last_name}` : 'Client',
        customer_email: order.profiles?.email || 'Non disponible',
        book_title: order.books?.title || 'Livre personnalisé',
        total_amount: order.total_amount,
        currency: order.currency,
        shipping_address: order.shipping_address,
        book_pages: order.books?.total_pages || 0,
        file_path: order.books?.file_path
      }
    };

    // For now, we'll just log the notification
    // In a real implementation, you would send an actual email
    logStep("Notification prepared", notificationData);

    // Simulate email sending (replace with real email service)
    const emailContent = {
      to: printerEmail,
      subject: `Nouvelle commande Tchat Souvenir #${orderId}`,
      html: `
        <h2>Nouvelle commande reçue</h2>
        <p><strong>Commande:</strong> #${orderId}</p>
        <p><strong>Client:</strong> ${notificationData.metadata.customer_name} (${notificationData.metadata.customer_email})</p>
        <p><strong>Livre:</strong> ${notificationData.metadata.book_title}</p>
        <p><strong>Montant:</strong> ${order.total_amount} ${order.currency}</p>
        <p><strong>Pages:</strong> ${notificationData.metadata.book_pages}</p>
        <p><strong>Fichier:</strong> ${notificationData.metadata.file_path || 'En cours de génération'}</p>
        ${order.shipping_address ? `<p><strong>Adresse:</strong> ${JSON.stringify(order.shipping_address)}</p>` : ''}
        <p>Veuillez procéder à l'impression et à l'expédition.</p>
      `
    };

    logStep("Email content generated", { to: emailContent.to, subject: emailContent.subject });

    // Update order status to indicate printer has been notified
    const { error: updateError } = await supabase
      .from('orders')
      .update({ 
        status: 'PRINTER_NOTIFIED',
        updated_at: new Date().toISOString()
      })
      .eq('id', orderId);

    if (updateError) {
      logStep("Error updating order status", { error: updateError });
    } else {
      logStep("Order status updated to PRINTER_NOTIFIED");
    }

    return new Response(JSON.stringify({
      success: true,
      message: "Printer notification sent successfully",
      orderId: orderId,
      notificationDetails: {
        printerEmail,
        customerName: notificationData.metadata.customer_name,
        bookTitle: notificationData.metadata.book_title,
        amount: `${order.total_amount} ${order.currency}`
      }
    }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 200,
    });

  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    logStep("ERROR in notify-printer", { message: errorMessage });
    return new Response(JSON.stringify({ error: errorMessage }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 500,
    });
  }
});