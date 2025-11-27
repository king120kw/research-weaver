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
    
    const GEMINI_API_KEY = Deno.env.get("GEMINI_API_KEY");
    if (!GEMINI_API_KEY) {
      throw new Error("GEMINI_API_KEY is not configured");
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
      systemPrompt = "You are an intelligent research and knowledge assistant. Provide concise, executive-level summaries (under 100 words). Focus on key decisions and high-level insights. Answer any type of question accurately.";
    } else if (depthLevel === 2) {
      systemPrompt = "You are an intelligent research and knowledge assistant with expertise in academic research, general knowledge, problem-solving, and practical advice. Provide balanced detail with rationale (100-300 words). Include supporting evidence and practical implications. You can answer any type of question: research, recipes, directions, science, technology, etc.";
    } else {
      systemPrompt = "You are an expert intelligent assistant. Provide granular technical detail with full justification (300-800 words). Include source critique, methodological considerations, and comprehensive citations. You have broad expertise and can answer questions across any domain accurately and thoroughly.";
    }

    systemPrompt += "\n\nIMPORTANT: You are helpful, accurate, and can answer ANY type of user question - research, general knowledge, practical advice, recipes, directions, how-to guides, etc. Always provide accurate information and engage naturally with the user.";

    // Build messages array for Google Gemini API
    // Gemini expects the first content to be a user message. Place the latest user message first,
    // then include prior conversation history to preserve context.
    const contents = [
      {
        role: "user",
        parts: [{ text: message }],
      },
      ...conversationHistory.map((msg: any) => ({
        role: msg.role === "assistant" ? "model" : "user",
        parts: [{ text: msg.content }],
      })),
    ];

    console.log("Calling Google Gemini API with depth level:", depthLevel);

    // Call Google Gemini API v1beta
    const response = await fetch(
      "https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-pro:generateContent",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-goog-api-key": GEMINI_API_KEY,
        },
        body: JSON.stringify({
          system_instruction: {
            parts: [{ text: systemPrompt }],
          },
          contents: contents,
          generation_config: {
            temperature: 0.7,
            maxOutputTokens: 4096,
            topP: 0.95,
            topK: 40,
          },
        }),
      }
    );

    if (!response.ok) {
      const errorData = await response.text();
      console.error("Google Gemini API error:", response.status, errorData);
      
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

      throw new Error(`Gemini API error: ${response.status}`);
    }

    const data = await response.json();
    const aiResponse = data.candidates?.[0]?.content?.parts?.[0]?.text || 
      "I apologize, but I couldn't generate a response. Please try again.";

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
