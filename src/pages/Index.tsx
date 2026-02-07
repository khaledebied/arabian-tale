import { useState } from "react";
import { Header } from "@/components/Header";
import { StoryForm } from "@/components/StoryForm";
import { PipelineStep } from "@/components/PipelineStep";
import { OutputPreview } from "@/components/OutputPreview";
import {
  BookOpen,
  Volume2,
  Film,
  Music,
  Scissors,
  Download,
} from "lucide-react";

type StepStatus = "pending" | "active" | "completed";

interface PipelineState {
  storyGeneration: StepStatus;
  voiceOver: StepStatus;
  backgroundVideo: StepStatus;
  music: StepStatus;
  editing: StepStatus;
  export: StepStatus;
}

const pipelineSteps = [
  {
    key: "storyGeneration" as const,
    title: "Story Generation",
    titleAr: "تَوْلِيدُ القِصَّةِ",
    description:
      "Generating an original Arabic story with full diacritics (تَشْكِيلٌ كَامِلٌ). Calm, immersive tone suitable for narration.",
    icon: <BookOpen className="w-5 h-5" />,
  },
  {
    key: "voiceOver" as const,
    title: "Voice-Over Synthesis",
    titleAr: "تَحْوِيلُ النَّصِّ إِلَى صَوْتٍ",
    description:
      "Converting Arabic text to human-like speech. Calm, warm, deep voice with slow pacing.",
    icon: <Volume2 className="w-5 h-5" />,
  },
  {
    key: "backgroundVideo" as const,
    title: "Background Video",
    titleAr: "فِيدِيُو الخَلْفِيَّةِ",
    description:
      "Selecting cinematic background visuals. Slow motion, relaxing scenes: night sky, rain, forest.",
    icon: <Film className="w-5 h-5" />,
  },
  {
    key: "music" as const,
    title: "Ambient Music",
    titleAr: "المُوسِيقَى الهَادِئَةُ",
    description:
      "Adding soft, copyright-free background music. Low volume to complement the narration.",
    icon: <Music className="w-5 h-5" />,
  },
  {
    key: "editing" as const,
    title: "Auto Video Editing",
    titleAr: "تَحْرِيرُ الفِيدِيُو تِلْقَائِيًّا",
    description:
      "Combining all elements with smooth transitions. Full HD 1920x1080 at 16:9 aspect ratio.",
    icon: <Scissors className="w-5 h-5" />,
  },
  {
    key: "export" as const,
    title: "Export & Output",
    titleAr: "التَّصْدِيرُ وَالنَّتَائِجُ",
    description:
      "Exporting final MP4 video, story text file, and voice-over audio. Ready for YouTube.",
    icon: <Download className="w-5 h-5" />,
  },
];

const Index = () => {
  const [isGenerating, setIsGenerating] = useState(false);
  const [currentTitle, setCurrentTitle] = useState("");
  const [pipelineState, setPipelineState] = useState<PipelineState>({
    storyGeneration: "pending",
    voiceOver: "pending",
    backgroundVideo: "pending",
    music: "pending",
    editing: "pending",
    export: "pending",
  });
  const [isComplete, setIsComplete] = useState(false);

  const simulatePipeline = async (title: string, duration: number) => {
    setIsGenerating(true);
    setCurrentTitle(title);
    setIsComplete(false);

    const steps: (keyof PipelineState)[] = [
      "storyGeneration",
      "voiceOver",
      "backgroundVideo",
      "music",
      "editing",
      "export",
    ];

    // Reset all steps
    setPipelineState({
      storyGeneration: "pending",
      voiceOver: "pending",
      backgroundVideo: "pending",
      music: "pending",
      editing: "pending",
      export: "pending",
    });

    // Simulate each step
    for (let i = 0; i < steps.length; i++) {
      const step = steps[i];
      
      // Set current step to active
      setPipelineState((prev) => ({ ...prev, [step]: "active" }));
      
      // Wait for step to complete (simulated)
      await new Promise((resolve) => 
        setTimeout(resolve, 1500 + Math.random() * 1000)
      );
      
      // Mark step as completed
      setPipelineState((prev) => ({ ...prev, [step]: "completed" }));
    }

    setIsGenerating(false);
    setIsComplete(true);
  };

  return (
    <div className="min-h-screen ambient-bg">
      <Header />

      <main className="container mx-auto px-4 py-8">
        {/* Hero Section */}
        <div className="text-center mb-12 animate-fade-in">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            Create <span className="text-gradient">Stunning Story Videos</span>
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto mb-4">
            Automatically generate original Arabic stories with full diacritics,
            professional voice-over, and cinematic visuals.
          </p>
          <p
            className="text-xl font-arabic text-primary"
            dir="rtl"
          >
            قِصَصٌ عَرَبِيَّةٌ أَصْلِيَّةٌ بِتَشْكِيلٍ كَامِلٍ
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Left Column - Configuration */}
          <div className="lg:col-span-1 space-y-6">
            <div className="pipeline-card rounded-xl p-6">
              <h3 className="text-lg font-semibold text-foreground mb-6 flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-primary" />
                Configuration
              </h3>
              <StoryForm
                onGenerate={simulatePipeline}
                isGenerating={isGenerating}
              />
            </div>
          </div>

          {/* Middle Column - Pipeline */}
          <div className="lg:col-span-1 space-y-4">
            <h3 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-moonlight" />
              Generation Pipeline
            </h3>
            <div className="space-y-4">
              {pipelineSteps.map((step, index) => (
                <PipelineStep
                  key={step.key}
                  step={index + 1}
                  title={step.title}
                  titleAr={step.titleAr}
                  description={step.description}
                  icon={step.icon}
                  status={pipelineState[step.key]}
                  isLast={index === pipelineSteps.length - 1}
                />
              ))}
            </div>
          </div>

          {/* Right Column - Output */}
          <div className="lg:col-span-1 space-y-6">
            <h3 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-success" />
              Output Preview
            </h3>
            <OutputPreview isComplete={isComplete} storyTitle={currentTitle} />
          </div>
        </div>

        {/* Info Section */}
        <div className="mt-16 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-secondary border border-border">
            <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
            <span className="text-sm text-muted-foreground">
              Ready for automation with AI services
            </span>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Index;
