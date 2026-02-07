import { Button } from "@/components/ui/button";
import { Download, Play, FileText, Volume2, Video, ExternalLink, Pause } from "lucide-react";
import { GenerationOutput } from "@/hooks/useVideoGenerator";
import { downloadFile, downloadAudioAsBlob, playAudio } from "@/lib/storyGenerator";
import heroImage from "@/assets/hero-arabian-night.jpg";
import { useState, useRef } from "react";

interface OutputPreviewProps {
  isComplete: boolean;
  storyTitle: string;
  output: GenerationOutput;
}

export const OutputPreview = ({ isComplete, storyTitle, output }: OutputPreviewProps) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const handlePlayVoiceover = () => {
    if (!output.voiceover) return;
    
    if (isPlaying && audioRef.current) {
      audioRef.current.pause();
      setIsPlaying(false);
      return;
    }

    audioRef.current = playAudio(output.voiceover.audioContent, output.voiceover.format);
    audioRef.current.onended = () => setIsPlaying(false);
    setIsPlaying(true);
  };

  const handleDownloadStory = () => {
    if (!output.story) return;
    downloadFile(output.story.story, `${storyTitle || "story"}.txt`, "text/plain;charset=utf-8");
  };

  const handleDownloadVoiceover = () => {
    if (!output.voiceover) return;
    const blob = downloadAudioAsBlob(output.voiceover.audioContent, output.voiceover.format);
    downloadFile(blob, `${storyTitle || "voiceover"}.mp3`);
  };

  const handleDownloadMusic = () => {
    if (!output.music) return;
    const blob = downloadAudioAsBlob(output.music.audioContent, output.music.format);
    downloadFile(blob, `${storyTitle || "music"}_background.mp3`);
  };

  if (!isComplete) {
    return (
      <div className="pipeline-card rounded-xl p-8 text-center">
        <div className="w-16 h-16 rounded-full bg-muted mx-auto mb-4 flex items-center justify-center">
          <Video className="w-8 h-8 text-muted-foreground" />
        </div>
        <h3 className="text-lg font-semibold text-foreground mb-2">
          No Output Yet
        </h3>
        <p className="text-sm text-muted-foreground">
          Configure your story and click Generate to create your video
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Video Preview */}
      <div className="pipeline-card completed rounded-xl overflow-hidden">
        <div className="aspect-video relative group">
          {/* Video preview thumbnail */}
          <img 
            src={heroImage} 
            alt="Story video preview" 
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-background/30 flex items-center justify-center">
            <button 
              onClick={handlePlayVoiceover}
              className="w-20 h-20 rounded-full bg-primary/20 flex items-center justify-center group-hover:scale-110 transition-transform duration-300 cursor-pointer hover:bg-primary/30"
            >
              {isPlaying ? (
                <Pause className="w-10 h-10 text-primary" />
              ) : (
                <Play className="w-10 h-10 text-primary ml-1" />
              )}
            </button>
          </div>
          
          {/* Video info overlay */}
          <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-background/90 to-transparent p-4">
            <p className="text-sm font-medium text-foreground truncate">
              {storyTitle}
            </p>
            <p className="text-xs text-muted-foreground">
              {output.story?.wordCount || 0} words • {isPlaying ? "Playing..." : "Click to preview audio"}
            </p>
          </div>
        </div>

        <div className="p-4 flex gap-3">
          <Button variant="hero" className="flex-1" onClick={handleDownloadVoiceover} disabled={!output.voiceover}>
            <Download className="w-4 h-4" />
            Download Audio
          </Button>
          <Button variant="cinematic" onClick={handleDownloadMusic} disabled={!output.music}>
            <ExternalLink className="w-4 h-4" />
            Background Music
          </Button>
        </div>
      </div>

      {/* Story Preview */}
      {output.story && (
        <div className="pipeline-card completed rounded-xl p-4 max-h-48 overflow-y-auto">
          <p className="text-sm text-foreground font-arabic leading-relaxed" dir="rtl">
            {output.story.story.substring(0, 500)}...
          </p>
        </div>
      )}

      {/* Additional Assets */}
      <div className="grid grid-cols-2 gap-4">
        {/* Story Text */}
        <div className="pipeline-card completed rounded-xl p-4">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 rounded-lg bg-success/20 flex items-center justify-center">
              <FileText className="w-5 h-5 text-success" />
            </div>
            <div>
              <p className="font-medium text-foreground text-sm">Story Text</p>
              <p className="text-xs text-muted-foreground">
                {output.story?.wordCount || 0} words
              </p>
            </div>
          </div>
          <Button variant="outline" size="sm" className="w-full" onClick={handleDownloadStory} disabled={!output.story}>
            <Download className="w-4 h-4" />
            Download .txt
          </Button>
        </div>

        {/* Voice Over */}
        <div className="pipeline-card completed rounded-xl p-4">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 rounded-lg bg-success/20 flex items-center justify-center">
              <Volume2 className="w-5 h-5 text-success" />
            </div>
            <div>
              <p className="font-medium text-foreground text-sm">Voice Over</p>
              <p className="text-xs text-muted-foreground">Arabic narration</p>
            </div>
          </div>
          <Button variant="outline" size="sm" className="w-full" onClick={handleDownloadVoiceover} disabled={!output.voiceover}>
            <Download className="w-4 h-4" />
            Download .mp3
          </Button>
        </div>
      </div>
    </div>
  );
};
