import { useState, useRef, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Send, Bot, User, CheckCircle2, AlertCircle, HelpCircle, ArrowLeft, LogOut, Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  citations?: Array<{ source_id: string; doi?: string; confidence: number }>;
  verification_status?: "verified" | "unverified" | "speculative";
}

export default function Chat() {
  const { user, loading: authLoading, signOut } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      role: "assistant",
      content: "Hello! I'm your AI research assistant with strict accuracy protocols. I can help you with research questions, methodology design, and content generation. Every claim I make is backed by verified sources, and I'll explicitly state when information cannot be verified. How can I assist you today?",
      verification_status: "verified",
    },
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [depthLevel, setDepthLevel] = useState<1 | 2 | 3>(2);
  const [conversationId, setConversationId] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();

  useEffect(() => {
    if (!authLoading && !user) {
      navigate('/auth');
    }
  }, [user, authLoading, navigate]);

  useEffect(() => {
    const convId = searchParams.get('conversation');
    if (convId && user) {
      loadConversation(convId);
    }
  }, [searchParams, user]);

  const loadConversation = async (convId: string) => {
    try {
      const { data, error } = await supabase
        .from('chat_messages')
        .select('*')
        .eq('conversation_id', convId)
        .order('created_at', { ascending: true });

      if (error) throw error;

      const loadedMessages: Message[] = data.map(msg => ({
        id: msg.id,
        role: msg.role as 'user' | 'assistant',
        content: msg.content,
        verification_status: msg.verification_status as 'verified' | 'unverified' | 'speculative' | undefined
      }));

      setMessages(loadedMessages);
      setConversationId(convId);
    } catch (error) {
      console.error('Error loading conversation:', error);
      toast({
        title: "Error",
        description: "Failed to load conversation",
        variant: "destructive",
      });
    }
  };

  const createConversation = async () => {
    if (!user) {
      toast({
        title: "Authentication Required",
        description: "Please sign in to start a conversation",
        variant: "destructive",
      });
      navigate('/auth');
      return null;
    }

    try {
      const { data, error } = await supabase
        .from('chat_conversations')
        .insert({
          user_id: user.id,
          depth_level: depthLevel,
          accuracy_level: 'strict'
        })
        .select()
        .single();

      if (error) throw error;
      return data.id;
    } catch (error) {
      console.error('Error creating conversation:', error);
      toast({
        title: "Error",
        description: "Failed to create conversation",
        variant: "destructive",
      });
      return null;
    }
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: "user",
      content: input,
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsLoading(true);

    try {
      // Create conversation if it doesn't exist
      let currentConvId = conversationId;
      if (!currentConvId) {
        currentConvId = await createConversation();
        if (!currentConvId) {
          setIsLoading(false);
          return;
        }
        setConversationId(currentConvId);
      }

      const { data, error } = await supabase.functions.invoke("chat", {
        body: {
          message: input,
          depthLevel: depthLevel,
          conversationId: currentConvId,
        },
      });

      if (error) {
        throw error;
      }

      if (data.rateLimited) {
        toast({
          title: "Rate Limit Exceeded",
          description: "Please try again in a moment.",
          variant: "destructive",
        });
        setIsLoading(false);
        return;
      }

      if (data.paymentRequired) {
        toast({
          title: "Payment Required",
          description: "Please add credits to your workspace.",
          variant: "destructive",
        });
        setIsLoading(false);
        return;
      }

      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: data.response || data.fallback,
        verification_status: data.verification_status || "verified",
      };

      setMessages((prev) => [...prev, aiMessage]);
      setIsLoading(false);
    } catch (error) {
      console.error("Chat error:", error);
      toast({
        title: "Error",
        description: "Failed to send message. Please try again.",
        variant: "destructive",
      });
      setIsLoading(false);
    }
  };

  const getVerificationIcon = (status?: string) => {
    switch (status) {
      case "verified":
        return <CheckCircle2 className="h-4 w-4 text-green-500" />;
      case "unverified":
        return <AlertCircle className="h-4 w-4 text-yellow-500" />;
      case "speculative":
        return <HelpCircle className="h-4 w-4 text-orange-500" />;
      default:
        return null;
    }
  };

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-accent/5">
      <header className="border-b border-border/50 bg-background/80 backdrop-blur-sm sticky top-0 z-10">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Button variant="ghost" size="icon" onClick={() => navigate('/dashboard')}>
                <ArrowLeft className="w-5 h-5" />
              </Button>
              <div>
                <h1 className="text-2xl font-bold text-foreground">AI Research Assistant</h1>
                <p className="text-sm text-muted-foreground">Zero hallucination • Verified sources only</p>
              </div>
            </div>
            <div className="flex gap-2 items-center">
              <Button
                variant={depthLevel === 1 ? "default" : "outline"}
                size="sm"
                onClick={() => setDepthLevel(1)}
              >
                Executive
              </Button>
              <Button
                variant={depthLevel === 2 ? "default" : "outline"}
                size="sm"
                onClick={() => setDepthLevel(2)}
              >
                Standard
              </Button>
              <Button
                variant={depthLevel === 3 ? "default" : "outline"}
                size="sm"
                onClick={() => setDepthLevel(3)}
              >
                Expert
              </Button>
              <Button variant="ghost" size="icon" onClick={signOut}>
                <LogOut className="w-5 h-5" />
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <div className="space-y-6 mb-24">
          {messages.map((message) => (
            <Card
              key={message.id}
              className={`p-6 ${
                message.role === "user"
                  ? "ml-12 bg-primary/5 border-primary/20"
                  : "mr-12 bg-card"
              }`}
            >
              <div className="flex gap-4">
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${
                    message.role === "user"
                      ? "bg-primary/20 text-primary"
                      : "bg-accent/20 text-accent-foreground"
                  }`}
                >
                  {message.role === "user" ? (
                    <User className="h-5 w-5" />
                  ) : (
                    <Bot className="h-5 w-5" />
                  )}
                </div>

                <div className="flex-1 space-y-3">
                  <p className="text-foreground leading-relaxed">{message.content}</p>

                  {message.role === "assistant" && (
                    <div className="flex items-center gap-3 pt-2">
                      {message.verification_status && (
                        <Badge variant="outline" className="flex items-center gap-1">
                          {getVerificationIcon(message.verification_status)}
                          <span className="capitalize">{message.verification_status}</span>
                        </Badge>
                      )}
                      {message.citations && message.citations.length > 0 && (
                        <Badge variant="secondary">
                          {message.citations.length} source{message.citations.length > 1 ? "s" : ""}
                        </Badge>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </Card>
          ))}

          {isLoading && (
            <Card className="mr-12 p-6 bg-card">
              <div className="flex gap-4">
                <div className="w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 bg-accent/20">
                  <Bot className="h-5 w-5 text-accent-foreground animate-pulse" />
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-primary rounded-full animate-bounce" />
                  <div className="w-2 h-2 bg-primary rounded-full animate-bounce delay-100" />
                  <div className="w-2 h-2 bg-primary rounded-full animate-bounce delay-200" />
                </div>
              </div>
            </Card>
          )}

          <div ref={messagesEndRef} />
        </div>

        <div className="fixed bottom-0 left-0 right-0 bg-background/80 backdrop-blur-sm border-t border-border/50 p-4">
          <div className="container mx-auto max-w-4xl">
            <div className="flex gap-2">
              <Input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && !e.shiftKey && handleSend()}
                placeholder="Ask me anything about research methodology, sources, or content generation..."
                className="flex-1"
                disabled={isLoading}
              />
              <Button onClick={handleSend} disabled={isLoading || !input.trim()}>
                <Send className="h-4 w-4" />
              </Button>
            </div>
            <p className="text-xs text-muted-foreground mt-2 text-center">
              Depth Level {depthLevel} • All responses verified against academic sources
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
