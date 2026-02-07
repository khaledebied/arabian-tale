import { Button } from "@/components/ui/button";
import { Download, Play, FileText, Volume2, Video, ExternalLink } from "lucide-react";
import heroImage from "@/assets/hero-arabian-night.jpg";

interface OutputPreviewProps {
  isComplete: boolean;
  storyTitle: string;
}

export const OutputPreview = ({ isComplete, storyTitle }: OutputPreviewProps) => {
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
            <div className="w-20 h-20 rounded-full bg-primary/20 flex items-center justify-center group-hover:scale-110 transition-transform duration-300 cursor-pointer">
              <Play className="w-10 h-10 text-primary ml-1" />
            </div>
          </div>
          
          {/* Video info overlay */}
          <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-background/90 to-transparent p-4">
            <p className="text-sm font-medium text-foreground truncate">
              {storyTitle}
            </p>
            <p className="text-xs text-muted-foreground">
              1920x1080 • MP4 • Ready for YouTube
            </p>
          </div>
        </div>

        <div className="p-4 flex gap-3">
          <Button variant="hero" className="flex-1">
            <Download className="w-4 h-4" />
            Download Video
          </Button>
          <Button variant="cinematic">
            <ExternalLink className="w-4 h-4" />
            Upload to YouTube
          </Button>
        </div>
      </div>

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
              <p className="text-xs text-muted-foreground">Arabic with diacritics</p>
            </div>
          </div>
          <Button variant="outline" size="sm" className="w-full">
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
              <p className="text-xs text-muted-foreground">Audio narration</p>
            </div>
          </div>
          <Button variant="outline" size="sm" className="w-full">
            <Download className="w-4 h-4" />
            Download .mp3
          </Button>
        </div>
      </div>
    </div>
  );
};
