import { cn } from "@/lib/utils";
import { CheckCircle2, Circle, Loader2 } from "lucide-react";

interface PipelineStepProps {
  step: number;
  title: string;
  titleAr: string;
  description: string;
  icon: React.ReactNode;
  status: "pending" | "active" | "completed";
  isLast?: boolean;
}

export const PipelineStep = ({
  step,
  title,
  titleAr,
  description,
  icon,
  status,
  isLast = false,
}: PipelineStepProps) => {
  return (
    <div className="relative">
      <div
        className={cn(
          "pipeline-card rounded-xl p-6 relative overflow-hidden",
          status === "active" && "active",
          status === "completed" && "completed"
        )}
      >
        {/* Background glow for active state */}
        {status === "active" && (
          <div className="absolute inset-0 bg-gradient-to-br from-primary/10 to-transparent pointer-events-none" />
        )}

        <div className="relative z-10">
          {/* Header */}
          <div className="flex items-start justify-between mb-4">
            <div className="flex items-center gap-3">
              <div
                className={cn(
                  "w-10 h-10 rounded-lg flex items-center justify-center transition-colors duration-300",
                  status === "pending" && "bg-muted text-muted-foreground",
                  status === "active" && "bg-primary text-primary-foreground",
                  status === "completed" && "bg-success text-success-foreground"
                )}
              >
                {icon}
              </div>
              <div>
                <p className="text-xs text-muted-foreground uppercase tracking-wider">
                  Step {step}
                </p>
                <h3 className="font-semibold text-foreground">{title}</h3>
              </div>
            </div>

            {/* Status indicator */}
            <div className="flex items-center">
              {status === "pending" && (
                <Circle className="w-5 h-5 text-muted-foreground" />
              )}
              {status === "active" && (
                <Loader2 className="w-5 h-5 text-primary animate-spin" />
              )}
              {status === "completed" && (
                <CheckCircle2 className="w-5 h-5 text-success" />
              )}
            </div>
          </div>

          {/* Arabic title */}
          <p className="text-sm text-primary font-arabic mb-2" dir="rtl">
            {titleAr}
          </p>

          {/* Description */}
          <p className="text-sm text-muted-foreground leading-relaxed">
            {description}
          </p>

          {/* Progress bar for active state */}
          {status === "active" && (
            <div className="mt-4 h-1 bg-muted rounded-full overflow-hidden">
              <div className="h-full bg-primary progress-glow animate-shimmer bg-shimmer bg-[length:200%_100%] w-full" />
            </div>
          )}
        </div>
      </div>

      {/* Connector line */}
      {!isLast && (
        <div className="absolute left-1/2 -translate-x-1/2 w-px h-6 bg-gradient-to-b from-border to-transparent mt-2" />
      )}
    </div>
  );
};
