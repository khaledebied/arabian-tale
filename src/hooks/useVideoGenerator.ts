import { useState, useCallback } from "react";
import {
  generateStory,
  generateVoiceover,
  generateMusic,
  GeneratedStory,
  GeneratedVoiceover,
  GeneratedMusic,
} from "@/lib/storyGenerator";
import { toast } from "sonner";

export type StepStatus = "pending" | "active" | "completed" | "error";

export interface PipelineState {
  storyGeneration: StepStatus;
  voiceOver: StepStatus;
  backgroundVideo: StepStatus;
  music: StepStatus;
  editing: StepStatus;
  export: StepStatus;
}

export interface GenerationOutput {
  story: GeneratedStory | null;
  voiceover: GeneratedVoiceover | null;
  music: GeneratedMusic | null;
}

const initialPipelineState: PipelineState = {
  storyGeneration: "pending",
  voiceOver: "pending",
  backgroundVideo: "pending",
  music: "pending",
  editing: "pending",
  export: "pending",
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
    setIsGenerating(true);
    setCurrentTitle(title);
    resetPipeline();

    try {
      // Step 1: Generate Story
      setStepStatus("storyGeneration", "active");
      toast.info("Generating Arabic story with full diacritics...");
      
      const story = await generateStory(title, durationMinutes);
      setOutput((prev) => ({ ...prev, story }));
      setStepStatus("storyGeneration", "completed");
      toast.success(`Story generated: ${story.wordCount} words`);

      // Step 2: Generate Voice-Over
      setStepStatus("voiceOver", "active");
      toast.info("Synthesizing Arabic voice-over...");
      
      const voiceover = await generateVoiceover(story.story);
      setOutput((prev) => ({ ...prev, voiceover }));
      setStepStatus("voiceOver", "completed");
      toast.success("Voice-over generated successfully");

      // Step 3: Background Video (simulated - would need video API)
      setStepStatus("backgroundVideo", "active");
      toast.info("Selecting cinematic background visuals...");
      await new Promise((resolve) => setTimeout(resolve, 2000));
      setStepStatus("backgroundVideo", "completed");
      toast.success("Background visuals ready");

      // Step 4: Generate Music
      setStepStatus("music", "active");
      toast.info("Generating ambient background music...");
      
      const music = await generateMusic(60);
      setOutput((prev) => ({ ...prev, music }));
      setStepStatus("music", "completed");
      toast.success("Background music generated");

      // Step 5: Auto Editing (simulated)
      setStepStatus("editing", "active");
      toast.info("Combining all elements...");
      await new Promise((resolve) => setTimeout(resolve, 2000));
      setStepStatus("editing", "completed");
      toast.success("Video assembled successfully");

      // Step 6: Export
      setStepStatus("export", "active");
      toast.info("Preparing final exports...");
      await new Promise((resolve) => setTimeout(resolve, 1500));
      setStepStatus("export", "completed");
      
      setIsComplete(true);
      toast.success("🎬 Video generation complete!");

    } catch (error) {
      console.error("Generation error:", error);
      const errorMessage = error instanceof Error ? error.message : "An error occurred";
      toast.error(`Generation failed: ${errorMessage}`);
      
      // Mark current active step as error
      setPipelineState((prev) => {
        const updated = { ...prev };
        for (const key of Object.keys(updated) as (keyof PipelineState)[]) {
          if (updated[key] === "active") {
            updated[key] = "error";
          }
        }
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
