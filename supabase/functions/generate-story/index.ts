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
    const { title, durationMinutes } = await req.json();

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

    // Calculate approximate word count based on duration
    // Arabic narration: ~100-120 words per minute for calm pacing
    const wordsPerMinute = 100;
    const targetWordCount = wordsPerMinute * (durationMinutes || 5);

    const systemPrompt = `أنت راوٍ محترف للقصص العربية. مهمتك كتابة قصص عربية أصلية بالتشكيل الكامل (تَشْكِيلٌ كَامِلٌ لِكُلِّ حَرْفٍ).

القواعد الصارمة:
1. اكتب القصة بالعربية الفصحى مع التشكيل الكامل لكل كلمة
2. الأسلوب: هادئ، غامر، مناسب للسرد الصوتي
3. لا تستخدم الحوار المباشر (علامات التنصيص)
4. لا تستخدم الرموز التعبيرية
5. لا تذكر الذكاء الاصطناعي أو أي أدوات
6. اجعل القصة متماسكة من البداية إلى النهاية
7. استخدم وصفاً حسياً غنياً
8. الطول المستهدف: حوالي ${targetWordCount} كلمة

ابدأ القصة مباشرة دون مقدمات أو تعليقات.`;

    const userPrompt = `اكتب قصة عربية أصلية مستوحاة من هذا العنوان: "${title}"

تذكر: التشكيل الكامل إلزامي لكل كلمة في القصة.`;

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-2.5-pro",
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: userPrompt },
        ],
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
    const storyText = data.choices?.[0]?.message?.content;

    if (!storyText) {
      throw new Error("No story generated");
    }

    return new Response(
      JSON.stringify({
        story: storyText,
        title,
        wordCount: storyText.split(/\s+/).length,
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
