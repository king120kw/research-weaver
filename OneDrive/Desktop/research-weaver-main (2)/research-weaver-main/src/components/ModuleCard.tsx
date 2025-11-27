import { Card } from "@/components/ui/card";
import { LucideIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

interface ModuleCardProps {
  icon: LucideIcon;
  title: string;
  description: string;
  features: string[];
  badge?: string;
}

const ModuleCard = ({ icon: Icon, title, description, features, badge }: ModuleCardProps) => {
  return (
    <Card className="p-8 bg-gradient-card shadow-medium hover:shadow-strong transition-all duration-300 border border-border/50 group">
      <div className="space-y-6">
        <div className="flex items-start justify-between">
          <div className="p-3 rounded-xl bg-primary/10 text-primary group-hover:bg-primary group-hover:text-primary-foreground transition-all duration-300">
            <Icon className="w-8 h-8" />
          </div>
          {badge && (
            <Badge variant="secondary" className="text-xs">
              {badge}
            </Badge>
          )}
        </div>
        
        <div className="space-y-3">
          <h3 className="text-2xl font-bold text-foreground">{title}</h3>
          <p className="text-muted-foreground leading-relaxed">{description}</p>
        </div>
        
        <div className="space-y-2">
          <h4 className="text-sm font-semibold text-foreground/70 uppercase tracking-wide">
            Key Capabilities
          </h4>
          <ul className="space-y-2">
            {features.map((feature, index) => (
              <li key={index} className="flex items-start gap-2 text-sm text-muted-foreground">
                <span className="text-accent mt-1">•</span>
                <span>{feature}</span>
              </li>
            ))}
          </ul>
        </div>
        
        <Button variant="outline" className="w-full group-hover:bg-primary group-hover:text-primary-foreground transition-all duration-300">
          Explore Module
        </Button>
      </div>
    </Card>
  );
};

export default ModuleCard;
