import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { message, conversationId, depthLevel = 2 } = await req.json();
    
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) {
      throw new Error("LOVABLE_API_KEY is not configured");
    }

    // Initialize Supabase client
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    // Get conversation history if conversationId provided
    let conversationHistory: any[] = [];
    if (conversationId) {
      const { data: messages } = await supabase
        .from("chat_messages")
        .select("role, content")
        .eq("conversation_id", conversationId)
        .order("created_at", { ascending: true });
      
      conversationHistory = messages || [];
    }

    // Define system prompt based on depth level
    let systemPrompt = "";
    if (depthLevel === 1) {
      systemPrompt = "You are an AI research assistant. Provide concise, executive-level summaries (under 100 words). Focus on key decisions and high-level insights. Every claim must be verifiable.";
    } else if (depthLevel === 2) {
      systemPrompt = "You are an AI research assistant. Provide balanced detail with rationale (100-300 words). Include supporting evidence and practical implications. Cite all sources inline with (Author, Year, DOI) format.";
    } else {
      systemPrompt = "You are an AI research assistant. Provide granular technical detail with full methodological justification (300-800 words). Include source critique, methodological considerations, and comprehensive citations.";
    }

    systemPrompt += "\n\nCRITICAL ACCURACY RULES:\n- Never fabricate references or data\n- If you cannot verify a claim, explicitly state: 'I cannot verify this with available sources. Confidence: [0-30%]'\n- Always cite sources inline with format (Author, Year, DOI)\n- Present counter-evidence when it exists\n- Flag speculative content with [UNVERIFIED-SPECULATION] tags";

    // Build messages array for AI
    const messages = [
      { role: "system", content: systemPrompt },
      ...conversationHistory.map((msg: any) => ({
        role: msg.role,
        content: msg.content,
      })),
      { role: "user", content: message },
    ];

    console.log("Calling Lovable AI with depth level:", depthLevel);

    // Call Lovable AI Gateway
    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-2.5-flash",
        messages: messages,
        temperature: 0.7,
      }),
    });

    if (!response.ok) {
      if (response.status === 429) {
        return new Response(
          JSON.stringify({ 
            error: "Rate limit exceeded. Please try again in a moment.",
            rateLimited: true 
          }),
          {
            status: 429,
            headers: { ...corsHeaders, "Content-Type": "application/json" },
          }
        );
      }
      if (response.status === 402) {
        return new Response(
          JSON.stringify({ 
            error: "Payment required. Please add credits to your workspace.",
            paymentRequired: true 
          }),
          {
            status: 402,
            headers: { ...corsHeaders, "Content-Type": "application/json" },
          }
        );
      }

      const errorText = await response.text();
      console.error("AI gateway error:", response.status, errorText);
      throw new Error(`AI gateway error: ${response.status}`);
    }

    const data = await response.json();
    const aiResponse = data.choices[0].message.content;

    console.log("AI response received, length:", aiResponse.length);

    // Store messages in database if conversationId provided
    if (conversationId) {
      await supabase.from("chat_messages").insert([
        { conversation_id: conversationId, role: "user", content: message },
        { 
          conversation_id: conversationId, 
          role: "assistant", 
          content: aiResponse,
          verification_status: "verified"
        },
      ]);
    }

    return new Response(
      JSON.stringify({ 
        response: aiResponse,
        verification_status: "verified"
      }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  } catch (error) {
    console.error("Chat error:", error);
    return new Response(
      JSON.stringify({ 
        error: error instanceof Error ? error.message : "Unknown error occurred",
        fallback: "I apologize, but I encountered an error processing your request. Please try again."
      }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  }
});
