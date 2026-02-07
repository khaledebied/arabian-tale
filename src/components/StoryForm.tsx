import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Sparkles, Clock, BookOpen } from "lucide-react";

interface StoryFormProps {
  onGenerate: (title: string, duration: number) => void;
  isGenerating: boolean;
}

export const StoryForm = ({ onGenerate, isGenerating }: StoryFormProps) => {
  const [title, setTitle] = useState("");
  const [duration, setDuration] = useState(5);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (title.trim()) {
      onGenerate(title, duration);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Story Title Input */}
      <div className="space-y-3">
        <Label
          htmlFor="title"
          className="text-sm font-medium text-foreground flex items-center gap-2"
        >
          <BookOpen className="w-4 h-4 text-primary" />
          Story Title
        </Label>
        <Input
          id="title"
          placeholder="Enter your story title..."
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="text-lg"
          disabled={isGenerating}
        />
        <p className="text-xs text-muted-foreground">
          The AI will generate an original Arabic story inspired by this title
        </p>
      </div>

      {/* Duration Input */}
      <div className="space-y-3">
        <Label
          htmlFor="duration"
          className="text-sm font-medium text-foreground flex items-center gap-2"
        >
          <Clock className="w-4 h-4 text-primary" />
          Video Duration (minutes)
        </Label>
        <div className="flex items-center gap-4">
          <Input
            id="duration"
            type="number"
            min={1}
            max={30}
            value={duration}
            onChange={(e) => setDuration(Number(e.target.value))}
            className="w-24 text-center"
            disabled={isGenerating}
          />
          <div className="flex gap-2">
            {[3, 5, 10, 15].map((d) => (
              <button
                key={d}
                type="button"
                onClick={() => setDuration(d)}
                disabled={isGenerating}
                className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all duration-200 ${
                  duration === d
                    ? "bg-primary text-primary-foreground"
                    : "bg-secondary text-secondary-foreground hover:bg-secondary/80"
                }`}
              >
                {d}m
              </button>
            ))}
          </div>
        </div>
        <p className="text-xs text-muted-foreground">
          Longer videos will have more detailed stories
        </p>
      </div>

      {/* Submit Button */}
      <Button
        type="submit"
        variant="hero"
        size="xl"
        className="w-full"
        disabled={!title.trim() || isGenerating}
      >
        {isGenerating ? (
          <>
            <Sparkles className="w-5 h-5 animate-pulse" />
            Generating Video...
          </>
        ) : (
          <>
            <Sparkles className="w-5 h-5" />
            Generate Story Video
          </>
        )}
      </Button>
    </form>
  );
};
