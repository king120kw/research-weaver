import { Calendar } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { BottomNav } from "@/components/BottomNav";
import { SessionCard } from "@/components/SessionCard";

interface Session {
  id: string;
  teacherName: string;
  subject: string;
  date: string;
  time: string;
  status: "upcoming" | "completed" | "cancelled";
}

const mockSessions: Session[] = [
  {
    id: "1",
    teacherName: "Maria Garcia",
    subject: "Spanish Grammar",
    date: "2025-10-05",
    time: "10:00 AM",
    status: "upcoming",
  },
  {
    id: "2",
    teacherName: "John Smith",
    subject: "English Conversation",
    date: "2025-09-28",
    time: "2:00 PM",
    status: "completed",
  },
];

const Bookings = () => {
  return (
    <div className="min-h-screen bg-background pb-24">
      {/* Header */}
      <header className="border-b border-border bg-card px-4 py-4">
        <div className="mx-auto max-w-4xl">
          <h1 className="text-2xl font-bold text-foreground">My Lessons</h1>
        </div>
      </header>

      {/* Main Content */}
      <main className="mx-auto max-w-4xl px-4 py-6">
        <Tabs defaultValue="upcoming" className="w-full">
          <TabsList className="mb-6 grid w-full grid-cols-3">
            <TabsTrigger value="upcoming">Upcoming</TabsTrigger>
            <TabsTrigger value="completed">Completed</TabsTrigger>
            <TabsTrigger value="cancelled">Cancelled</TabsTrigger>
          </TabsList>

          <TabsContent value="upcoming" className="space-y-4">
            {mockSessions
              .filter((s) => s.status === "upcoming")
              .map((session) => (
                <SessionCard 
                  key={session.id} 
                  teacherName={session.teacherName}
                  subject={session.subject}
                  date={new Date(session.date).toLocaleDateString()}
                  time={session.time}
                  status={session.status}
                  onJoin={() => console.log("Join session")}
                  onReschedule={() => console.log("Reschedule")}
                  onCancel={() => console.log("Cancel")}
                />
              ))}
          </TabsContent>

          <TabsContent value="completed" className="space-y-4">
            {mockSessions
              .filter((s) => s.status === "completed")
              .map((session) => (
                <SessionCard 
                  key={session.id} 
                  teacherName={session.teacherName}
                  subject={session.subject}
                  date={new Date(session.date).toLocaleDateString()}
                  time={session.time}
                  status={session.status}
                  onReview={() => console.log("Leave review")}
                />
              ))}
          </TabsContent>

          <TabsContent value="cancelled" className="space-y-4">
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <Calendar className="mb-4 h-16 w-16 text-muted-foreground" />
              <h3 className="mb-2 text-lg font-semibold">No cancelled lessons</h3>
              <p className="text-sm text-muted-foreground">
                You don't have any cancelled lessons
              </p>
            </div>
          </TabsContent>
        </Tabs>
      </main>

      <BottomNav />
    </div>
  );
};

export default Bookings;
