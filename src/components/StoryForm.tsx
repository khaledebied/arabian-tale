import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Sparkles, Clock, BookOpen } from "lucide-react";
import { toast } from "sonner";

interface StoryFormProps {
  onGenerate: (title: string, duration: number) => void;
  isGenerating: boolean;
}

export const StoryForm = ({ onGenerate, isGenerating }: StoryFormProps) => {
  const [title, setTitle] = useState("");
  const [duration, setDuration] = useState(5);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) {
      toast.error("Please enter a story title");
      return;
    }
    if (duration < 1 || duration > 30) {
      toast.error("Duration must be between 1 and 30 minutes");
      return;
    }
    onGenerate(title, duration);
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
          className="text-lg focus:ring-primary/20"
          disabled={isGenerating}
          autoComplete="off"
          autoCorrect="off"
          spellCheck="false"
          required
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
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
          <Input
            id="duration"
            type="number"
            inputMode="numeric"
            min={1}
            max={30}
            value={duration}
            onChange={(e) => setDuration(Number(e.target.value))}
            className="w-full sm:w-24 text-center text-lg"
            disabled={isGenerating}
          />
          <div className="flex flex-wrap gap-2 w-full sm:w-auto">
            {[3, 5, 10, 15].map((d) => (
              <button
                key={d}
                type="button"
                onClick={() => setDuration(d)}
                disabled={isGenerating}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 flex-1 sm:flex-none ${duration === d
                  ? "bg-primary text-primary-foreground shadow-glow"
                  : "bg-secondary text-secondary-foreground hover:bg-secondary/80"
                  }`}
              >
                {d}m
              </button>
            ))}
          </div>
        </div>
        <p className="text-xs text-muted-foreground">
          Longer videos will have more detailed stories and images
        </p>
      </div>

      {/* Submit Button */}
      <Button
        type="submit"
        variant="hero"
        size="xl"
        className="w-full transition-all duration-500"
        disabled={!title.trim() || isGenerating}
      >
        {isGenerating ? (
          <div className="flex items-center gap-3">
            <Sparkles className="w-5 h-5 animate-spin text-primary-foreground" />
            <span className="font-semibold tracking-wide">GENERATING TALE...</span>
          </div>
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
