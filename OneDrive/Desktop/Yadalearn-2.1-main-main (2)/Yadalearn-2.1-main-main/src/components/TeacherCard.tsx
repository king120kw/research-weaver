import { Star, Globe } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";

interface TeacherCardProps {
  id: string;
  name: string;
  rating: number;
  reviews: number;
  languages: string[];
  hourlyRate: number;
  avatar?: string;
  isTopRated?: boolean;
  onViewProfile: (id: string) => void;
}

export const TeacherCard = ({
  id,
  name,
  rating,
  reviews,
  languages,
  hourlyRate,
  avatar,
  isTopRated,
  onViewProfile,
}: TeacherCardProps) => {
  return (
    <Card className="group overflow-hidden transition-all hover:shadow-xl hover:scale-105">
      <div className="p-6">
        <div className="mb-4 flex items-start justify-between">
          <div className="flex gap-4">
            <Avatar className="h-16 w-16">
              <AvatarImage src={avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${name}`} />
              <AvatarFallback>{name[0]}</AvatarFallback>
            </Avatar>
            <div>
              <h3 className="text-lg font-bold text-foreground">{name}</h3>
              <div className="flex items-center gap-1 text-sm text-muted-foreground">
                <Star className="h-4 w-4 fill-warning text-warning" />
                <span className="font-semibold">{rating}</span>
                <span>({reviews} reviews)</span>
              </div>
            </div>
          </div>
          {isTopRated && (
            <Badge variant="secondary" className="bg-warning/10 text-warning">
              Top Rated
            </Badge>
          )}
        </div>
        
        <div className="mb-4 flex flex-wrap gap-2">
          {languages.map((lang) => (
            <Badge key={lang} variant="outline" className="gap-1">
              <Globe className="h-3 w-3" />
              {lang}
            </Badge>
          ))}
        </div>
        
        <div className="flex items-center justify-between">
          <div>
            <span className="text-2xl font-bold text-primary">${hourlyRate}</span>
            <span className="text-sm text-muted-foreground">/hour</span>
          </div>
          <Button onClick={() => onViewProfile(id)} className="rounded-full">
            View Profile
          </Button>
        </div>
      </div>
    </Card>
  );
};
