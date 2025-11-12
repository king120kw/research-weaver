import { User } from "lucide-react";

interface LearningPackageCardProps {
  title: string;
  subtitle: string;
  teacherAvatar?: string;
  onClick?: () => void;
}

export const LearningPackageCard = ({ 
  title, 
  subtitle, 
  teacherAvatar,
  onClick 
}: LearningPackageCardProps) => {
  return (
    <button
      onClick={onClick}
      className="relative w-full overflow-hidden rounded-2xl bg-gradient-to-br from-primary via-primary/90 to-secondary p-6 text-left transition-all hover:scale-[1.02] hover:shadow-xl"
    >
      <div className="relative z-10">
        <h3 className="mb-2 text-2xl font-bold text-white">{title}</h3>
        <p className="mb-4 text-sm text-white/90">{subtitle}</p>
        
        {teacherAvatar && (
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-white/20">
              <User className="h-5 w-5 text-white" />
            </div>
          </div>
        )}
      </div>
      
      {/* Decorative illustration area */}
      <div className="absolute right-0 top-0 h-full w-1/3 opacity-20">
        <div className="flex h-full items-center justify-center">
          <div className="h-24 w-24 rounded-full bg-white/30" />
        </div>
      </div>
    </button>
  );
};
