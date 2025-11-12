import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Brain, MessageSquare, Send, Sparkles, TrendingUp, Calendar } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { BottomNav } from "@/components/BottomNav";

const AIFeatures = () => {
  const navigate = useNavigate();
  const [message, setMessage] = useState("");
  const [chatHistory, setChatHistory] = useState([
    { type: "ai", text: "Hello! I'm your AI Study Buddy. How can I help you learn today?" }
  ]);

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim()) return;

    setChatHistory([
      ...chatHistory,
      { type: "user", text: message },
      { type: "ai", text: "I understand you need help with that. Let me create a personalized study plan for you!" }
    ]);
    setMessage("");
  };

  return (
    <div className="min-h-screen bg-background pb-24">
      {/* Header */}
      <header className="border-b border-border bg-gradient-to-r from-primary/10 to-secondary/10 px-4 py-4">
        <div className="mx-auto max-w-6xl">
          <Button variant="ghost" onClick={() => navigate(-1)} className="mb-4">
            ← Back
          </Button>
          <div className="flex items-center gap-3">
            <div className="rounded-full bg-gradient-to-br from-primary to-secondary p-3">
              <Brain className="h-8 w-8 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-foreground">AI Study Buddy</h1>
              <p className="text-muted-foreground">Your personalized learning assistant</p>
            </div>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-4 py-6">
        <div className="grid gap-6 lg:grid-cols-3">
          {/* Chat Section */}
          <div className="lg:col-span-2">
            <Card className="h-[600px] flex flex-col">
              <CardHeader className="border-b">
                <CardTitle className="flex items-center gap-2">
                  <MessageSquare className="h-5 w-5" />
                  Chat with AI Study Buddy
                </CardTitle>
              </CardHeader>
              <CardContent className="flex-1 overflow-y-auto p-4 space-y-4">
                {chatHistory.map((msg, idx) => (
                  <div
                    key={idx}
                    className={`flex ${msg.type === "user" ? "justify-end" : "justify-start"}`}
                  >
                    <div
                      className={`max-w-[80%] rounded-2xl px-4 py-3 ${
                        msg.type === "user"
                          ? "bg-primary text-primary-foreground"
                          : "bg-muted"
                      }`}
                    >
                      <p className="text-sm">{msg.text}</p>
                    </div>
                  </div>
                ))}
              </CardContent>
              <div className="border-t p-4">
                <form onSubmit={handleSendMessage} className="flex gap-2">
                  <Input
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Ask me anything about your studies..."
                    className="flex-1"
                  />
                  <Button type="submit" size="icon">
                    <Send className="h-4 w-4" />
                  </Button>
                </form>
              </div>
            </Card>
          </div>

          {/* AI Features Sidebar */}
          <div className="space-y-6">
            {/* Personalized Study Plan */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg">
                  <Sparkles className="h-5 w-5 text-primary" />
                  Your Study Plan
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="rounded-lg bg-primary/5 p-3">
                  <div className="flex items-center justify-between mb-2">
                    <p className="text-sm font-medium">Spanish Grammar</p>
                    <Badge className="bg-primary/10 text-primary">Active</Badge>
                  </div>
                  <p className="text-xs text-muted-foreground mb-2">
                    Focus on verb conjugations this week
                  </p>
                  <div className="h-2 rounded-full bg-primary/20">
                    <div className="h-full w-3/4 rounded-full bg-primary" />
                  </div>
                </div>

                <div className="rounded-lg bg-secondary/5 p-3">
                  <div className="flex items-center justify-between mb-2">
                    <p className="text-sm font-medium">Mathematics</p>
                    <Badge variant="outline">Scheduled</Badge>
                  </div>
                  <p className="text-xs text-muted-foreground mb-2">
                    Algebra review sessions
                  </p>
                  <div className="h-2 rounded-full bg-secondary/20">
                    <div className="h-full w-1/2 rounded-full bg-secondary" />
                  </div>
                </div>

                <Button variant="outline" className="w-full" size="sm">
                  <Calendar className="h-4 w-4 mr-2" />
                  Adjust Study Plan
                </Button>
              </CardContent>
            </Card>

            {/* Class Summaries */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg">
                  <TrendingUp className="h-5 w-5 text-secondary" />
                  AI-Generated Summaries
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="rounded-lg border p-3 hover:bg-accent transition-colors cursor-pointer">
                  <p className="text-sm font-medium mb-1">Spanish Conversation - Week 3</p>
                  <p className="text-xs text-muted-foreground">
                    Key points: Present tense usage, common phrases, pronunciation tips
                  </p>
                </div>

                <div className="rounded-lg border p-3 hover:bg-accent transition-colors cursor-pointer">
                  <p className="text-sm font-medium mb-1">Math: Algebra Basics</p>
                  <p className="text-xs text-muted-foreground">
                    Topics covered: Linear equations, factoring, graphing functions
                  </p>
                </div>

                <Button variant="outline" className="w-full" size="sm">
                  View All Summaries
                </Button>
              </CardContent>
            </Card>

            {/* AI Suggestions */}
            <Card className="border-primary/50">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg">
                  <Sparkles className="h-5 w-5 text-warning" />
                  AI Suggestions
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <div className="rounded-lg bg-warning/5 border border-warning/20 p-3">
                  <p className="text-sm font-medium text-warning mb-1">💡 Practice Tip</p>
                  <p className="text-xs text-muted-foreground">
                    Spend 15 minutes on Spanish verb conjugations today for better retention
                  </p>
                </div>
                <div className="rounded-lg bg-success/5 border border-success/20 p-3">
                  <p className="text-sm font-medium text-success mb-1">📚 Recommended</p>
                  <p className="text-xs text-muted-foreground">
                    Book a revision session with Maria Garcia for advanced grammar
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>

      <BottomNav />
    </div>
  );
};

export default AIFeatures;
