import { Button } from "@/components/ui/button";
import { Download, Play, FileText, Volume2, Video, ExternalLink, Pause, ChevronLeft, ChevronRight } from "lucide-react";
import { GenerationOutput } from "@/hooks/useVideoGenerator";
import { downloadFile, downloadAudioAsBlob } from "@/lib/storyGenerator";
import { useState, useRef } from "react";

interface OutputPreviewProps {
  isComplete: boolean;
  storyTitle: string;
  output: GenerationOutput;
}

export const OutputPreview = ({ isComplete, storyTitle, output }: OutputPreviewProps) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentSceneIndex, setCurrentSceneIndex] = useState(0);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const scenes = output.story?.scenes || [];
  const currentScene = scenes[currentSceneIndex];

  const handlePlayVoiceover = () => {
    if (!currentScene?.voiceoverUrl) return;

    if (isPlaying && audioRef.current) {
      audioRef.current.pause();
      setIsPlaying(false);
      return;
    }

    audioRef.current = new Audio(currentScene.voiceoverUrl);
    audioRef.current.onended = () => {
      setIsPlaying(false);
      // Auto advance to next scene
      if (currentSceneIndex < scenes.length - 1) {
        setCurrentSceneIndex(prev => prev + 1);
      }
    };
    audioRef.current.play();
    setIsPlaying(true);
  };

  const handleDownloadStory = () => {
    if (!output.story) return;
    const fullText = output.story.scenes.map(s => s.text).join("\n\n");
    downloadFile(fullText, `${storyTitle || "story"}.txt`, "text/plain;charset=utf-8");
  };

  const nextScene = () => {
    if (currentSceneIndex < scenes.length - 1) {
      setCurrentSceneIndex(prev => prev + 1);
      setIsPlaying(false);
      if (audioRef.current) audioRef.current.pause();
    }
  };

  const prevScene = () => {
    if (currentSceneIndex > 0) {
      setCurrentSceneIndex(prev => prev - 1);
      setIsPlaying(false);
      if (audioRef.current) audioRef.current.pause();
    }
  };

  if (!isComplete) {
    return (
      <div className="pipeline-card rounded-xl p-8 text-center min-h-[400px] flex flex-col justify-center">
        <div className="w-16 h-16 rounded-full bg-muted mx-auto mb-4 flex items-center justify-center">
          <Video className="w-8 h-8 text-muted-foreground" />
        </div>
        <h3 className="text-lg font-semibold text-foreground mb-2">
          Ready for Generation
        </h3>
        <p className="text-sm text-muted-foreground">
          Enter a title and duration to start the pipeline
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Scene Preview */}
      <div className="pipeline-card completed rounded-xl overflow-hidden shadow-2xl">
        <div className="aspect-video relative group">
          {/* Scene Image */}
          {currentScene?.imageUrl ? (
            <img
              src={currentScene.imageUrl}
              alt={`Scene ${currentSceneIndex + 1}`}
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
            />
          ) : (
            <div className="w-full h-full bg-muted flex items-center justify-center">
              <Film className="w-12 h-12 text-muted-foreground animate-pulse" />
            </div>
          )}

          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />

          {/* Controls */}
          <div className="absolute inset-0 flex items-center justify-between px-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <Button size="icon" variant="secondary" onClick={prevScene} disabled={currentSceneIndex === 0}>
              <ChevronLeft className="w-6 h-6" />
            </Button>
            <button
              onClick={handlePlayVoiceover}
              className="w-16 h-16 rounded-full bg-primary/90 flex items-center justify-center shadow-glow hover:scale-110 transition-transform duration-300 cursor-pointer"
            >
              {isPlaying ? (
                <Pause className="w-8 h-8 text-primary-foreground" />
              ) : (
                <Play className="w-8 h-8 text-primary-foreground ml-1" />
              )}
            </button>
            <Button size="icon" variant="secondary" onClick={nextScene} disabled={currentSceneIndex === scenes.length - 1}>
              <ChevronRight className="w-6 h-6" />
            </Button>
          </div>

          {/* Scene text overlay */}
          <div className="absolute bottom-0 left-0 right-0 p-6 text-right">
            <p className="text-lg font-arabic text-white mb-2 leading-relaxed drop-shadow-md" dir="rtl">
              {currentScene?.text}
            </p>
            <div className="flex items-center justify-between text-xs text-white/70">
              <div className="flex gap-1">
                {scenes.map((_, i) => (
                  <div
                    key={i}
                    className={`h-1 w-4 rounded-full transition-all ${i === currentSceneIndex ? "bg-primary w-8" : "bg-white/30"}`}
                  />
                ))}
              </div>
              <span>Scene {currentSceneIndex + 1} of {scenes.length}</span>
            </div>
          </div>
        </div>

        <div className="p-4 flex gap-3 bg-secondary/30">
          <Button variant="hero" className="flex-1" onClick={handleDownloadStory}>
            <Download className="w-4 h-4" />
            Export Story Text
          </Button>
          <Button variant="cinematic" disabled>
            <Video className="w-4 h-4" />
            Download Full Video
          </Button>
        </div>
      </div>

      {/* Generation Details */}
      <div className="grid grid-cols-1 gap-4">
        <div className="pipeline-card completed rounded-xl p-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-success/20 flex items-center justify-center">
              <FileText className="w-5 h-5 text-success" />
            </div>
            <div>
              <p className="font-medium text-foreground text-sm">{storyTitle}</p>
              <p className="text-xs text-muted-foreground">
                {output.story?.wordCount || 0} words • {scenes.length} Scenes
              </p>
            </div>
          </div>
          <Button variant="outline" size="sm" onClick={handleDownloadStory}>
            <Download className="w-4 h-4" />
            TXT
          </Button>
        </div>
      </div>
    </div>
  );
};
