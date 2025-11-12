import { cn } from "@/lib/utils";
import { LucideIcon } from "lucide-react";

interface CategoryCardProps {
  title: string;
  subtitle: string;
  icon: LucideIcon;
  colorClass: string;
  onClick?: () => void;
}

export const CategoryCard = ({ title, subtitle, icon: Icon, colorClass, onClick }: CategoryCardProps) => {
  return (
    <button
      onClick={onClick}
      className={cn(
        "relative w-full rounded-2xl p-6 text-left transition-all hover:scale-[1.02] hover:shadow-lg",
        colorClass
      )}
    >
      <div className="mb-3">
        <Icon className="h-8 w-8" />
      </div>
      <h3 className="mb-1 text-xl font-semibold text-foreground">{title}</h3>
      <p className="text-sm text-muted-foreground">{subtitle}</p>
      
      {/* Decorative books stack */}
      <div className="absolute bottom-4 right-4 opacity-30">
        <div className="flex gap-1">
          <div className="h-12 w-2 rounded-sm bg-current" />
          <div className="h-10 w-2 rounded-sm bg-current" />
          <div className="h-14 w-2 rounded-sm bg-current" />
        </div>
      </div>
    </button>
  );
};
