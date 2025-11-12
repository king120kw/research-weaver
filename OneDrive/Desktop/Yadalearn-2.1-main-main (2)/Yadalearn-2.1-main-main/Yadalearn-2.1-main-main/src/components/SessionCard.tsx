import { Calendar, Clock, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface SessionCardProps {
  teacherName?: string;
  studentName?: string;
  subject: string;
  date: string;
  time: string;
  status: "upcoming" | "completed" | "cancelled";
  onJoin?: () => void;
  onReschedule?: () => void;
  onReview?: () => void;
  onCancel?: () => void;
}

export const SessionCard = ({
  teacherName,
  studentName,
  subject,
  date,
  time,
  status,
  onJoin,
  onReschedule,
  onReview,
  onCancel,
}: SessionCardProps) => {
  const getStatusColor = (status: string) => {
    switch (status) {
      case "upcoming":
        return "bg-primary/10 text-primary";
      case "completed":
        return "bg-success/10 text-success";
      case "cancelled":
        return "bg-destructive/10 text-destructive";
      default:
        return "bg-muted text-muted-foreground";
    }
  };

  const displayName = teacherName || studentName;
  const nameLabel = teacherName ? "Teacher" : "Student";

  return (
    <Card className="overflow-hidden transition-all hover:shadow-md">
      <div className="p-6">
        <div className="mb-4 flex items-start justify-between">
          <div className="flex gap-3">
            <Avatar className="h-12 w-12">
              <AvatarImage src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${displayName}`} />
              <AvatarFallback>{displayName?.[0] || "U"}</AvatarFallback>
            </Avatar>
            <div>
              <p className="text-xs text-muted-foreground">{nameLabel}</p>
              <p className="font-semibold text-foreground">{displayName}</p>
              <p className="text-sm text-muted-foreground">{subject}</p>
            </div>
          </div>
          <Badge className={getStatusColor(status)}>
            {status.charAt(0).toUpperCase() + status.slice(1)}
          </Badge>
        </div>

        <div className="mb-4 flex gap-4 text-sm text-muted-foreground">
          <div className="flex items-center gap-1">
            <Calendar className="h-4 w-4" />
            <span>{date}</span>
          </div>
          <div className="flex items-center gap-1">
            <Clock className="h-4 w-4" />
            <span>{time}</span>
          </div>
        </div>

        <div className="flex gap-2">
          {status === "upcoming" && onJoin && (
            <Button onClick={onJoin} size="sm" className="flex-1">
              Join Lesson
            </Button>
          )}
          {status === "upcoming" && onReschedule && (
            <Button onClick={onReschedule} variant="outline" size="sm">
              Reschedule
            </Button>
          )}
          {status === "upcoming" && onCancel && (
            <Button onClick={onCancel} variant="ghost" size="sm">
              Cancel
            </Button>
          )}
          {status === "completed" && onReview && (
            <Button onClick={onReview} size="sm" className="flex-1">
              Leave Review
            </Button>
          )}
        </div>
      </div>
    </Card>
  );
};
