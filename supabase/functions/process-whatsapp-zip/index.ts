import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? ""
    );

    const { zipFile, title, userId } = await req.json();
    
    // Create book record
    const { data: book, error: bookError } = await supabaseClient
      .from('books')
      .insert({
        user_id: userId,
        title: title || 'Mon livre WhatsApp',
        status: 'PROCESSING',
        total_messages: 0,
        processing_progress: 0
      })
      .select()
      .single();

    if (bookError) throw bookError;

    // Process ZIP file (simplified simulation)
    const processingSteps = [
      { progress: 20, message: "Extraction du fichier ZIP..." },
      { progress: 40, message: "Analyse des messages..." },
      { progress: 60, message: "Traitement des médias..." },
      { progress: 80, message: "Génération du PDF..." },
      { progress: 100, message: "Livre créé avec succès!" }
    ];

    // Simulate processing with progress updates
    for (const step of processingSteps) {
      await supabaseClient
        .from('books')
        .update({ 
          processing_progress: step.progress,
          status: step.progress === 100 ? 'COMPLETED' : 'PROCESSING'
        })
        .eq('id', book.id);
      
      // Simulate processing time
      await new Promise(resolve => setTimeout(resolve, 1000));
    }

    return new Response(
      JSON.stringify({ 
        success: true, 
        bookId: book.id,
        message: "Livre créé avec succès" 
      }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );

  } catch (error) {
    console.error('Error:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" }
      }
    );
  }
});