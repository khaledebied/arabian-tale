import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Headers":
        "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

serve(async (req) => {
    if (req.method === "OPTIONS") {
        return new Response(null, { headers: corsHeaders });
    }

    try {
        let prompt;
        try {
            const body = await req.json();
            prompt = body.prompt;
        } catch {
            return new Response(
                JSON.stringify({ error: "Invalid request body" }),
                { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
            );
        }

        if (!prompt) {
            return new Response(
                JSON.stringify({ error: "Prompt is required" }),
                { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
            );
        }

        const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
        if (!LOVABLE_API_KEY) {
            console.error("LOVABLE_API_KEY is not configured");
            throw new Error("LOVABLE_API_KEY is not configured");
        }

        console.log("Generating image for prompt:", prompt);

        const enhancedPrompt = `Cinematic, high-quality, realistic Arabian tale scene: ${prompt}. Dramatic lighting, 8k resolution, detailed background.`;
        console.log("Enhanced prompt:", enhancedPrompt);

        const response = await fetch("https://ai.gateway.lovable.dev/v1/images/generations", {
            method: "POST",
            headers: {
                Authorization: `Bearer ${LOVABLE_API_KEY}`,
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                prompt: enhancedPrompt,
                model: "recraft-v3",
                n: 1,
                size: "1024x1024",
            }),
        });

        console.log("Image API response status:", response.status);

        if (!response.ok) {
            const errorText = await response.text();
            console.error("Image generation API error:", response.status, errorText);

            if (response.status === 429) {
                throw new Error("Rate limit exceeded. Please try again later.");
            }
            if (response.status === 402) {
                throw new Error("AI credits exhausted. Please add credits.");
            }

            throw new Error(`Image API error: ${response.status} - ${errorText}`);
        }

        const data = await response.json();
        console.log("Image API response data:", JSON.stringify(data).substring(0, 200));

        const imageUrl = data.data?.[0]?.url;

        if (!imageUrl) {
            console.error("No image URL in response:", data);
            throw new Error("No image generated - empty response");
        }

        console.log("Successfully generated image:", imageUrl);

        return new Response(
            JSON.stringify({ imageUrl }),
            { headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
    } catch (error) {
        console.error("Image generation error:", error);
        const errorMessage = error instanceof Error ? error.message : "Unknown error";
        return new Response(
            JSON.stringify({ error: errorMessage }),
            { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
    }
});
