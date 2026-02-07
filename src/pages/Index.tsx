import { Header } from "@/components/Header";
import { StoryForm } from "@/components/StoryForm";
import { PipelineStep } from "@/components/PipelineStep";
import { OutputPreview } from "@/components/OutputPreview";
import { useVideoGenerator } from "@/hooks/useVideoGenerator";
import {
  BookOpen,
  Volume2,
  Film,
  Music,
  Scissors,
  Download,
} from "lucide-react";

const pipelineSteps = [
  {
    key: "storyGeneration" as const,
    title: "Story & Scene Breakdown",
    titleAr: "تَوْلِيدُ القِصَّةِ وَالمَشَاهِدِ",
    description:
      "Generating an original Arabic story with full diacritics and breaking it into visual scenes.",
    icon: <BookOpen className="w-5 h-5" />,
  },
  {
    key: "imageGeneration" as const,
    title: "Cinematic Image Generation",
    titleAr: "تَوْلِيدُ الصُّوَرِ السِّينِمَائِيَّةِ",
    description:
      "Creating unique AI-generated high-resolution visuals for every scene in the story.",
    icon: <Film className="w-5 h-5" />,
  },
  {
    key: "voiceOver" as const,
    title: "Voice-Over Synthesis",
    titleAr: "تَحْوِيلُ النَّصِّ إِلَى صَوْتٍ",
    description:
      "Converting Arabic text to human-like speech with professional narration for each scene.",
    icon: <Volume2 className="w-5 h-5" />,
  },
  {
    key: "music" as const,
    title: "Ambient Music",
    titleAr: "المُوسِيقَى الهَادِئَةُ",
    description:
      "Adding soft, copyright-free background music to create an immersive atmosphere.",
    icon: <Music className="w-5 h-5" />,
  },
  {
    key: "editing" as const,
    title: "Auto Video Editing",
    titleAr: "تَحْرِيرُ الفِيدِيُو تِلْقَائِيًّا",
    description:
      "Combining scenes, voice-overs, and music with professional transitions and effects.",
    icon: <Scissors className="w-5 h-5" />,
  },
  {
    key: "export" as const,
    title: "Export & Output",
    titleAr: "التَّصْدِيرُ وَالنَّتَائِجُ",
    description:
      "Finalizing the MP4 video in Full HD. Ready for download and social media sharing.",
    icon: <Download className="w-5 h-5" />,
  },
];

const Index = () => {
  const {
    isGenerating,
    pipelineState,
    output,
    currentTitle,
    isComplete,
    generateVideo,
  } = useVideoGenerator();

  return (
    <div className="min-h-screen ambient-bg">
      <Header />

      <main className="container mx-auto px-4 py-8 relative z-10">
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
                onGenerate={generateVideo}
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
            <OutputPreview
              isComplete={isComplete}
              storyTitle={currentTitle}
              output={output}
            />
          </div>
        </div>

        {/* Info Section */}
        <div className="mt-16 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-secondary border border-border">
            <span className="w-2 h-2 rounded-full bg-success animate-pulse" />
            <span className="text-sm text-muted-foreground">
              Powered by Lovable AI & ElevenLabs
            </span>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Index;
