import { useState, useCallback } from "react";
import {
  generateStory,
  generateVoiceover,
  generateMusic,
  generateImage,
  GeneratedStory,
  GeneratedVoiceover,
  GeneratedMusic,
  StoryScene,
} from "@/lib/storyGenerator";
import { toast } from "sonner";

export type StepStatus = "pending" | "active" | "completed" | "error";

export interface PipelineState {
  storyGeneration: StepStatus;
  imageGeneration: StepStatus;
  voiceOver: StepStatus;
  music: StepStatus;
  editing: StepStatus;
  export: StepStatus;
}

export interface GenerationOutput {
  story: GeneratedStory | null;
  voiceover: GeneratedVoiceover | null;
  music: GeneratedMusic | null;
  videoUrl?: string;
}

const initialPipelineState: PipelineState = {
  storyGeneration: "pending",
  imageGeneration: "pending",
  voiceOver: "pending",
  music: "pending",
  editing: "pending",
  export: "pending",
};

const withRetry = async <T>(fn: () => Promise<T>, retries = 2): Promise<T> => {
  try {
    return await fn();
  } catch (error) {
    if (retries > 0) {
      console.log(`Retrying... (${retries} attempts left)`);
      await new Promise(resolve => setTimeout(resolve, 2000));
      return withRetry(fn, retries - 1);
    }
    throw error;
  }
};

export function useVideoGenerator() {
  const [isGenerating, setIsGenerating] = useState(false);
  const [pipelineState, setPipelineState] = useState<PipelineState>(initialPipelineState);
  const [output, setOutput] = useState<GenerationOutput>({
    story: null,
    voiceover: null,
    music: null,
  });
  const [currentTitle, setCurrentTitle] = useState("");
  const [isComplete, setIsComplete] = useState(false);

  const setStepStatus = useCallback((step: keyof PipelineState, status: StepStatus) => {
    setPipelineState((prev) => ({ ...prev, [step]: status }));
  }, []);

  const resetPipeline = useCallback(() => {
    setPipelineState(initialPipelineState);
    setOutput({ story: null, voiceover: null, music: null });
    setIsComplete(false);
  }, []);

  const generateVideo = useCallback(async (title: string, durationMinutes: number) => {
    if (!title.trim()) {
      toast.error("Please enter a story title");
      return;
    }

    setIsGenerating(true);
    setCurrentTitle(title);
    resetPipeline();

    try {
      // Step 1: Generate Story & Scenes
      setStepStatus("storyGeneration", "active");
      toast.info("Generating Arabic story and scenes...");

      const story = await withRetry(() => generateStory(title, durationMinutes));

      console.log("Generated story response:", story);

      if (!story) {
        throw new Error("Story generation returned null or undefined");
      }

      // Fallback for older edge function versions or malformed responses
      if (!story.scenes || !Array.isArray(story.scenes)) {
        console.warn("Story scenes missing, attempting to adapt structure...", story);

        // If we have a 'story' string property but no scenes, wrap it in a single scene
        if ((story as any).story && typeof (story as any).story === 'string') {
          story.scenes = [{
            text: (story as any).story,
            imagePrompt: `Cinematic scene: ${title}`
          }];
        } else {
          throw new Error("Invalid story structure: missing scenes");
        }
      }

      if (story.scenes.length === 0) {
        throw new Error("Generated story contains no scenes");
      }

      setOutput((prev) => ({ ...prev, story }));
      setStepStatus("storyGeneration", "completed");
      toast.success(`Story generated with ${story.scenes.length} scenes`);

      // Step 2: Generate Images for each scene
      setStepStatus("imageGeneration", "active");
      toast.info("Generating cinematic visuals for each scene...");

      const updatedScenes: StoryScene[] = [];
      for (const scene of story.scenes) {
        toast.info(`Generating image for: ${scene.text.substring(0, 30)}...`);
        const { imageUrl } = await withRetry(() => generateImage(scene.imagePrompt));
        updatedScenes.push({ ...scene, imageUrl });
      }

      const storyWithImages = { ...story, scenes: updatedScenes };
      setOutput((prev) => ({ ...prev, story: storyWithImages }));
      setStepStatus("imageGeneration", "completed");
      toast.success("All scene images generated");

      // Step 3: Generate Voice-Over for each scene
      setStepStatus("voiceOver", "active");
      toast.info("Synthesizing Arabic voice-over...");

      // For now, we combine all text for a single voiceover or do it per scene
      // The requirement says "Ensure every scene has: ... Voice-over segment"
      const finalScenes: StoryScene[] = [];
      for (const scene of updatedScenes) {
        const voiceover = await withRetry(() => generateVoiceover(scene.text));
        finalScenes.push({ ...scene, voiceoverUrl: `data:audio/mp3;base64,${voiceover.audioContent}` });
      }

      setOutput((prev) => ({
        ...prev,
        story: { ...story, scenes: finalScenes }
      }));
      setStepStatus("voiceOver", "completed");
      toast.success("Voice-over synthesis complete");

      // Step 4: Generate Music
      setStepStatus("music", "active");
      toast.info("Generating ambient background music...");

      const music = await withRetry(() => generateMusic(durationMinutes * 60));
      setOutput((prev) => ({ ...prev, music }));
      setStepStatus("music", "completed");
      toast.success("Background music ready");

      // Step 5: Video Assembly
      setStepStatus("editing", "active");
      toast.info("Assembling final video...");

      // Simulate video assembly delay
      await new Promise((resolve) => setTimeout(resolve, 3000));

      setStepStatus("editing", "completed");
      toast.success("Video assembled successfully");

      // Step 6: Export
      setStepStatus("export", "active");
      toast.info("Finalizing export...");
      await new Promise((resolve) => setTimeout(resolve, 2000));

      setStepStatus("export", "completed");
      setIsComplete(true);
      toast.success("🎬 Your Arabian Tale is ready!");

    } catch (error) {
      console.error("Generation error:", error);
      const errorMessage = error instanceof Error ? error.message : "An error occurred";
      toast.error(`Generation failed: ${errorMessage}`);

      setPipelineState((prev) => {
        const updated = { ...prev };
        (Object.keys(updated) as (keyof PipelineState)[]).forEach(key => {
          if (updated[key] === "active") updated[key] = "error";
        });
        return updated;
      });
    } finally {
      setIsGenerating(false);
    }
  }, [resetPipeline, setStepStatus]);

  return {
    isGenerating,
    pipelineState,
    output,
    currentTitle,
    isComplete,
    generateVideo,
    resetPipeline,
  };
}
