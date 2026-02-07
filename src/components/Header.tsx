import { Video, Moon } from "lucide-react";

export const Header = () => {
  return (
    <header className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-50">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-amber-glow flex items-center justify-center shadow-lg shadow-primary/30">
              <Video className="w-5 h-5 text-primary-foreground" />
            </div>
            <div>
              <h1 className="text-lg font-bold text-foreground">
                Story Video Generator
              </h1>
              <p className="text-xs text-muted-foreground">
                Arabic YouTube Content Automation
              </p>
            </div>
          </div>

          {/* Arabic title */}
          <div className="hidden md:flex items-center gap-2 text-right" dir="rtl">
            <div>
              <p className="text-sm font-arabic font-semibold text-primary">
                مُولِّدُ فِيدِيُوهَاتِ القِصَصِ
              </p>
              <p className="text-xs font-arabic text-muted-foreground">
                قِصَصٌ عَرَبِيَّةٌ بِالتَّشْكِيلِ الكَامِلِ
              </p>
            </div>
            <div className="w-8 h-8 rounded-lg bg-moonlight/20 flex items-center justify-center">
              <Moon className="w-4 h-4 text-moonlight" />
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};
