import { LucideIcon } from "lucide-react";
import { Card } from "@/components/ui/card";
import { useState } from "react";

interface InteractiveModuleCardProps {
  icon: LucideIcon;
  title: string;
  description: string;
  capabilities: string[];
  onClick: () => void;
  gradient: string;
}

export const InteractiveModuleCard = ({
  icon: Icon,
  title,
  description,
  capabilities,
  onClick,
  gradient,
}: InteractiveModuleCardProps) => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <Card
      className="group relative overflow-hidden border-2 border-border/50 hover:border-primary/50 transition-all duration-300 cursor-pointer"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={onClick}
    >
      <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300" 
           style={{ background: gradient }} />
      
      <div className="relative p-8 space-y-4">
        <div className={`transition-all duration-300 ${isHovered ? 'scale-130' : 'scale-100'}`}>
          <div className="w-16 h-16 rounded-xl bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
            <Icon className="h-8 w-8 text-primary" />
          </div>
        </div>

        <div>
          <h3 className="text-2xl font-bold text-foreground mb-2">{title}</h3>
          <p className="text-muted-foreground text-sm leading-relaxed">{description}</p>
        </div>

        {isHovered && (
          <div className="space-y-2 animate-in fade-in slide-in-from-top-2 duration-200">
            <p className="text-sm font-semibold text-foreground">Key Capabilities:</p>
            <ul className="space-y-1">
              {capabilities.map((capability, idx) => (
                <li key={idx} className="text-sm text-muted-foreground flex items-start">
                  <span className="text-primary mr-2">•</span>
                  <span>{capability}</span>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </Card>
  );
};
