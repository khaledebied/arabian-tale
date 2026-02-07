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
    const { title, durationSeconds } = await req.json();

    if (!title) {
      return new Response(
        JSON.stringify({ error: "Title is required" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) {
      throw new Error("LOVABLE_API_KEY is not configured");
    }

    // Calculate scene count based on duration (approx 20 seconds per scene)
    // 60s -> 3 scenes
    // 10s -> 1 scene
    const sceneCount = Math.max(1, Math.round((durationSeconds || 60) / 20));

    const systemPrompt = `أنت راوٍ محترف للقصص العربية ومخرج بصري. مهمتك كتابة قصص عربية أصلية بالتشكيل الكامل مقسمة إلى مشاهِد.

القواعد الصارمة:
1. اكتب القصة بالعربية الفصحى مع التشكيل الكامل (تَشْكِيلٌ كَامِلٌ) لكل حرف.
2. الأسلوب: هادئ، غامر، مناسب للسرد الصوتي.
3. قسّم القصة إلى ${sceneCount} مشهد بالضبط.
4. لكل مشهد، قدم:
   - "text": نص السرد بالتشكيل الكامل.
   - "imagePrompt": وصف بصري دقيق باللغة الإنجليزية لإنشاء صورة لهذا المشهد (أسلوب سينمائي، واقعي، إضاءة درامية).
5. يجب أن تكون المخرجات بتنسيق JSON حصراً كالتالي:
   {
     "title": "عنوان القصة",
     "scenes": [
       { "text": "...", "imagePrompt": "..." },
       ...
     ]
   }
6. لا تستخدم الحوار المباشر.
7. لا تذكر الذكاء الاصطناعي.`;

    const userPrompt = `اكتب قصة من ${sceneCount} مشهد مستوحاة من: "${title}" بالتشكيل الكامل.`;

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-2.0-flash-exp",
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: userPrompt },
        ],
        response_format: { type: "json_object" }
      }),
    });

    if (!response.ok) {
      if (response.status === 429) {
        return new Response(
          JSON.stringify({ error: "Rate limit exceeded. Please try again later." }),
          { status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      if (response.status === 402) {
        return new Response(
          JSON.stringify({ error: "AI credits exhausted. Please add credits." }),
          { status: 402, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      const errorText = await response.text();
      console.error("AI gateway error:", response.status, errorText);
      throw new Error(`AI gateway error: ${response.status}`);
    }

    const data = await response.json();
    const content = JSON.parse(data.choices?.[0]?.message?.content || "{}");

    if (!content.scenes || !Array.isArray(content.scenes) || content.scenes.length === 0) {
      console.error("Invalid scenes format:", content);
      throw new Error("No scenes generated or invalid format");
    }

    const totalWordCount = content.scenes.reduce((acc: number, s: any) => {
      if (!s || typeof s.text !== 'string') return acc;
      return acc + s.text.split(/\s+/).length;
    }, 0);

    return new Response(
      JSON.stringify({
        title: content.title || title,
        scenes: content.scenes,
        wordCount: totalWordCount,
      }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("Story generation error:", error);
    const errorMessage = error instanceof Error ? error.message : "Unknown error";
    return new Response(
      JSON.stringify({ error: errorMessage }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
