import { toast } from "sonner";

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL;
const SUPABASE_KEY = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY;

export interface StoryScene {
  text: string;
  imagePrompt: string;
  imageUrl?: string;
  voiceoverUrl?: string;
}

export interface GeneratedStory {
  scenes: StoryScene[];
  title: string;
  wordCount: number;
}

export interface GeneratedVoiceover {
  audioContent: string;
  format: string;
  duration: number;
}

export interface GeneratedMusic {
  audioContent: string;
  format: string;
}

export interface GenerationResult {
  story: GeneratedStory | null;
  voiceover: GeneratedVoiceover | null;
  music: GeneratedMusic | null;
}

async function callEdgeFunction<T>(functionName: string, body: object): Promise<T> {
  const response = await fetch(`${SUPABASE_URL}/functions/v1/${functionName}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      apikey: SUPABASE_KEY,
      Authorization: `Bearer ${SUPABASE_KEY}`,
    },
    body: JSON.stringify(body),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({ error: "Unknown error" }));

    if (response.status === 429) {
      toast.error("Rate limit exceeded. Please wait a moment and try again.");
      throw new Error("Rate limit exceeded");
    }
    if (response.status === 402) {
      toast.error("AI credits exhausted. Please add credits to continue.");
      throw new Error("Credits exhausted");
    }

    throw new Error(errorData.error || `Request failed: ${response.status}`);
  }

  return response.json();
}

export async function generateStory(title: string, durationMinutes: number): Promise<GeneratedStory> {
  return callEdgeFunction<GeneratedStory>("generate-story", {
    title,
    durationMinutes,
  });
}

export async function generateImage(prompt: string): Promise<{ imageUrl: string }> {
  return callEdgeFunction<{ imageUrl: string }>("generate-image", {
    prompt,
  });
}

export async function generateVoiceover(text: string): Promise<GeneratedVoiceover> {
  return callEdgeFunction<GeneratedVoiceover>("generate-voiceover", {
    text,
  });
}

export async function generateMusic(duration: number): Promise<GeneratedMusic> {
  return callEdgeFunction<GeneratedMusic>("generate-music", {
    duration,
  });
}

export function downloadAudioAsBlob(base64Audio: string, format: string): Blob {
  const audioUrl = `data:audio/${format};base64,${base64Audio}`;
  const byteString = atob(base64Audio);
  const ab = new ArrayBuffer(byteString.length);
  const ia = new Uint8Array(ab);
  for (let i = 0; i < byteString.length; i++) {
    ia[i] = byteString.charCodeAt(i);
  }
  return new Blob([ab], { type: `audio/${format}` });
}

export function playAudio(base64Audio: string, format: string = "mp3"): HTMLAudioElement {
  const audioUrl = `data:audio/${format};base64,${base64Audio}`;
  const audio = new Audio(audioUrl);
  audio.play();
  return audio;
}

export function downloadFile(content: string | Blob, filename: string, mimeType?: string) {
  let blob: Blob;

  if (content instanceof Blob) {
    blob = content;
  } else {
    blob = new Blob([content], { type: mimeType || "text/plain;charset=utf-8" });
  }

  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}
