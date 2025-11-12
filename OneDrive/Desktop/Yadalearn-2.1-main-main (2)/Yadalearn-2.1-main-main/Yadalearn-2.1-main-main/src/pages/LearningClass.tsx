import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FileText, Video, Download, CheckCircle, Clock, BookOpen, Upload } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { BottomNav } from "@/components/BottomNav";
import VideoPlayer from "@/components/VideoPlayer";

const LearningClass = () => {
  const navigate = useNavigate();
  const [userRole] = useState<"student" | "teacher">("student"); // Toggle for demo

  return (
    <div className="min-h-screen bg-background pb-24">
      {/* Header */}
      <header className="border-b border-border bg-card px-4 py-4">
        <div className="mx-auto max-w-6xl">
          <Button variant="ghost" onClick={() => navigate(-1)} className="mb-4">
            ← Back
          </Button>
          <h1 className="text-3xl font-bold text-foreground">
            {userRole === "student" ? "My Learning" : "Class Management"}
          </h1>
          <p className="text-muted-foreground">
            {userRole === "student" 
              ? "Access your study materials and upcoming classes"
              : "Manage your scheduled classes and materials"}
          </p>
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-4 py-6">
        {userRole === "student" ? (
          <Tabs defaultValue="materials" className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="materials">Study Materials</TabsTrigger>
              <TabsTrigger value="upcoming">Upcoming Classes</TabsTrigger>
              <TabsTrigger value="revision">Revision Content</TabsTrigger>
            </TabsList>

            {/* Study Materials Tab */}
            <TabsContent value="materials" className="space-y-4 mt-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <BookOpen className="h-5 w-5" />
                    Spanish Conversation - Week 3
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex items-center justify-between rounded-lg border p-4 hover:bg-accent transition-colors">
                    <div className="flex items-center gap-3">
                      <div className="rounded-full bg-primary/10 p-2">
                        <FileText className="h-5 w-5 text-primary" />
                      </div>
                      <div>
                        <p className="font-medium">Lesson Notes - Conversation Practice</p>
                        <p className="text-sm text-muted-foreground">PDF • 2.4 MB</p>
                      </div>
                    </div>
                    <Button size="sm" variant="outline">
                      <Download className="h-4 w-4" />
                    </Button>
                  </div>

                  <div className="rounded-lg border p-4 hover:bg-accent transition-colors">
                    <div className="mb-3">
                      <p className="font-medium">Recorded Session - Grammar Deep Dive</p>
                      <p className="text-sm text-muted-foreground">Interactive Video Lesson</p>
                    </div>
                    <VideoPlayer
                      src="/learning-video.mp4"
                      className="w-full h-48 mb-3"
                    />
                    <Button className="w-full" variant="outline">
                      Watch Full Lesson
                    </Button>
                  </div>

                  <div className="flex items-center justify-between rounded-lg border p-4 hover:bg-accent transition-colors">
                    <div className="flex items-center gap-3">
                      <div className="rounded-full bg-warning/10 p-2">
                        <FileText className="h-5 w-5 text-warning" />
                      </div>
                      <div>
                        <p className="font-medium">Practice Exercises</p>
                        <p className="text-sm text-muted-foreground">PDF • 1.8 MB</p>
                      </div>
                    </div>
                    <Button size="sm" variant="outline">
                      <Download className="h-4 w-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Upcoming Classes Tab */}
            <TabsContent value="upcoming" className="space-y-4 mt-6">
              <Card className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle>Spanish Conversation</CardTitle>
                    <Badge className="bg-primary/10 text-primary">Tomorrow</Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <Clock className="h-4 w-4" />
                      <span className="text-sm">10:00 AM - 11:00 AM</span>
                    </div>
                    <p className="text-sm">Teacher: Maria Garcia</p>
                    <p className="text-sm text-muted-foreground">
                      Topic: Daily conversations and common phrases
                    </p>
                    <Button className="w-full mt-4">Join Class</Button>
                  </div>
                </CardContent>
              </Card>

              <Card className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle>Advanced Mathematics</CardTitle>
                    <Badge variant="outline">Friday</Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <Clock className="h-4 w-4" />
                      <span className="text-sm">2:00 PM - 3:00 PM</span>
                    </div>
                    <p className="text-sm">Teacher: John Peterson</p>
                    <p className="text-sm text-muted-foreground">
                      Topic: Calculus fundamentals and applications
                    </p>
                    <Button variant="outline" className="w-full mt-4">View Details</Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Revision Content Tab */}
            <TabsContent value="revision" className="space-y-4 mt-6">
              <Card>
                <CardHeader>
                  <CardTitle>Flashcard Sets</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="rounded-lg border p-4 hover:bg-accent transition-colors cursor-pointer">
                    <div className="flex items-center justify-between mb-2">
                      <p className="font-medium">Spanish Vocabulary - Food & Dining</p>
                      <Badge className="bg-success/10 text-success">
                        <CheckCircle className="h-3 w-3 mr-1" />
                        Completed
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground">48 cards • Last reviewed 2 days ago</p>
                  </div>

                  <div className="rounded-lg border p-4 hover:bg-accent transition-colors cursor-pointer">
                    <div className="flex items-center justify-between mb-2">
                      <p className="font-medium">Math Formulas - Algebra</p>
                      <Badge variant="outline">In Progress</Badge>
                    </div>
                    <p className="text-sm text-muted-foreground">32 cards • 18 remaining</p>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        ) : (
          // Teacher View
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Scheduled Classes</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="rounded-lg border p-4">
                  <div className="flex items-center justify-between mb-3">
                    <div>
                      <h3 className="font-bold">Spanish Conversation - Beginner</h3>
                      <p className="text-sm text-muted-foreground">10:00 AM - 11:00 AM • Tomorrow</p>
                    </div>
                    <Badge className="bg-success/10 text-success">Confirmed</Badge>
                  </div>
                  <p className="text-sm mb-3">Student: Sarah Johnson</p>
                  <div className="flex gap-2">
                    <Button size="sm">Start Class</Button>
                    <Button size="sm" variant="outline">Reschedule</Button>
                  </div>
                </div>

                <div className="rounded-lg border p-4">
                  <div className="flex items-center justify-between mb-3">
                    <div>
                      <h3 className="font-bold">Advanced Grammar</h3>
                      <p className="text-sm text-muted-foreground">2:00 PM - 3:00 PM • Friday</p>
                    </div>
                    <Badge variant="outline">Pending</Badge>
                  </div>
                  <p className="text-sm mb-3">Student: Michael Brown</p>
                  <div className="flex gap-2">
                    <Button size="sm">Approve</Button>
                    <Button size="sm" variant="destructive">Reject</Button>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Upload Teaching Materials</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="rounded-lg border-2 border-dashed p-8 text-center">
                  <Upload className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
                  <p className="text-sm text-muted-foreground mb-4">
                    Drag and drop files here, or click to browse
                  </p>
                  <Button>Choose Files</Button>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </main>

      <BottomNav />
    </div>
  );
};

export default LearningClass;
