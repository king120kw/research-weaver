import { LucideIcon } from "lucide-react";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface FeatureCardProps {
  title: string;
  description?: string;
  icon: LucideIcon;
  colorClass?: string;
  onClick?: () => void;
}

export const FeatureCard = ({ 
  title, 
  description, 
  icon: Icon, 
  colorClass = "bg-primary/10 text-primary",
  onClick 
}: FeatureCardProps) => {
  return (
    <Card 
      onClick={onClick}
      className={cn(
        "group cursor-pointer overflow-hidden transition-all hover:shadow-xl hover:scale-105",
        onClick && "active:scale-95"
      )}
    >
      <div className="p-6 text-center">
        <div className={cn(
          "mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl transition-transform group-hover:scale-110",
          colorClass
        )}>
          <Icon className="h-8 w-8" />
        </div>
        <h3 className="mb-1 font-semibold text-foreground">{title}</h3>
        {description && (
          <p className="text-sm text-muted-foreground">{description}</p>
        )}
      </div>
    </Card>
  );
};
