import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { supabase } from '@/integrations/supabase/client';
import { Loader2, MessageSquare, Upload, FileText, LogOut, User } from 'lucide-react';
import { toast } from 'sonner';

interface Conversation {
  id: string;
  created_at: string;
  updated_at: string;
  depth_level: number;
  accuracy_level: string;
}

interface Document {
  id: string;
  file_name: string;
  file_type: string;
  created_at: string;
  project_id: string;
}

export default function Dashboard() {
  const { user, loading, signOut } = useAuth();
  const navigate = useNavigate();
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [documents, setDocuments] = useState<Document[]>([]);
  const [loadingData, setLoadingData] = useState(true);

  useEffect(() => {
    if (!loading && !user) {
      navigate('/auth');
    }
  }, [user, loading, navigate]);

  useEffect(() => {
    if (user) {
      loadUserData();
    }
  }, [user]);

  const loadUserData = async () => {
    try {
      setLoadingData(true);

      // Load conversations
      const { data: convData, error: convError } = await supabase
        .from('chat_conversations')
        .select('*')
        .eq('user_id', user!.id)
        .order('updated_at', { ascending: false });

      if (convError) throw convError;
      setConversations(convData || []);

      // Load documents
      const { data: docData, error: docError } = await supabase
        .from('documents')
        .select('*')
        .order('created_at', { ascending: false });

      if (docError && docError.code !== 'PGRST116') {
        console.error('Error loading documents:', docError);
      }
      setDocuments(docData || []);
    } catch (error) {
      console.error('Error loading user data:', error);
      toast.error('Failed to load your data');
    } finally {
      setLoadingData(false);
    }
  };

  const handleStartChat = () => {
    navigate('/chat');
  };

  const handleOpenConversation = (conversationId: string) => {
    navigate(`/chat?conversation=${conversationId}`);
  };

  if (loading || !user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5">
      <header className="border-b border-border/50 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary to-primary/60 flex items-center justify-center text-primary-foreground font-bold">
              {user.email?.[0].toUpperCase()}
            </div>
            <div>
              <h2 className="text-sm font-semibold">{user.email}</h2>
              <p className="text-xs text-muted-foreground">Research Workspace</p>
            </div>
          </div>
          <Button onClick={signOut} variant="outline" size="sm">
            <LogOut className="w-4 h-4 mr-2" />
            Sign Out
          </Button>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto space-y-8">
          <div>
            <h1 className="text-4xl font-bold mb-2 bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
              Welcome Back
            </h1>
            <p className="text-muted-foreground">
              Continue your research or start something new
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-4">
            <Card className="hover:shadow-lg transition-shadow cursor-pointer border-primary/20 hover:border-primary/50" onClick={handleStartChat}>
              <CardHeader>
                <MessageSquare className="w-8 h-8 text-primary mb-2" />
                <CardTitle>New Chat</CardTitle>
                <CardDescription>Start a conversation with AI</CardDescription>
              </CardHeader>
            </Card>

            <Card className="hover:shadow-lg transition-shadow cursor-pointer border-primary/20 hover:border-primary/50" onClick={() => navigate('/')}>
              <CardHeader>
                <Upload className="w-8 h-8 text-primary mb-2" />
                <CardTitle>Upload Document</CardTitle>
                <CardDescription>Process research papers</CardDescription>
              </CardHeader>
            </Card>

            <Card className="hover:shadow-lg transition-shadow border-primary/20">
              <CardHeader>
                <FileText className="w-8 h-8 text-primary mb-2" />
                <CardTitle>{documents.length} Documents</CardTitle>
                <CardDescription>Processed and verified</CardDescription>
              </CardHeader>
            </Card>
          </div>

          <Tabs defaultValue="conversations" className="w-full">
            <TabsList className="grid w-full max-w-md grid-cols-2">
              <TabsTrigger value="conversations">Conversations</TabsTrigger>
              <TabsTrigger value="documents">Documents</TabsTrigger>
            </TabsList>

            <TabsContent value="conversations" className="space-y-4 mt-6">
              {loadingData ? (
                <div className="flex justify-center py-8">
                  <Loader2 className="h-6 w-6 animate-spin text-primary" />
                </div>
              ) : conversations.length === 0 ? (
                <Card>
                  <CardContent className="py-8 text-center">
                    <MessageSquare className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
                    <p className="text-muted-foreground">No conversations yet</p>
                    <Button onClick={handleStartChat} className="mt-4">
                      Start Your First Chat
                    </Button>
                  </CardContent>
                </Card>
              ) : (
                conversations.map((conv) => (
                  <Card
                    key={conv.id}
                    className="hover:shadow-md transition-all cursor-pointer border-border/50 hover:border-primary/50"
                    onClick={() => handleOpenConversation(conv.id)}
                  >
                    <CardHeader>
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <CardTitle className="text-lg">
                            Conversation
                          </CardTitle>
                          <CardDescription>
                            Depth Level {conv.depth_level} • {conv.accuracy_level}
                          </CardDescription>
                        </div>
                        <MessageSquare className="w-5 h-5 text-primary" />
                      </div>
                      <p className="text-xs text-muted-foreground">
                        Updated {new Date(conv.updated_at).toLocaleDateString()}
                      </p>
                    </CardHeader>
                  </Card>
                ))
              )}
            </TabsContent>

            <TabsContent value="documents" className="space-y-4 mt-6">
              {loadingData ? (
                <div className="flex justify-center py-8">
                  <Loader2 className="h-6 w-6 animate-spin text-primary" />
                </div>
              ) : documents.length === 0 ? (
                <Card>
                  <CardContent className="py-8 text-center">
                    <FileText className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
                    <p className="text-muted-foreground">No documents yet</p>
                    <Button onClick={() => navigate('/')} className="mt-4">
                      Upload Your First Document
                    </Button>
                  </CardContent>
                </Card>
              ) : (
                documents.map((doc) => (
                  <Card key={doc.id} className="hover:shadow-md transition-all border-border/50">
                    <CardHeader>
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <CardTitle className="text-lg">{doc.file_name}</CardTitle>
                          <CardDescription>{doc.file_type.toUpperCase()}</CardDescription>
                        </div>
                        <FileText className="w-5 h-5 text-primary" />
                      </div>
                      <p className="text-xs text-muted-foreground">
                        Uploaded {new Date(doc.created_at).toLocaleDateString()}
                      </p>
                    </CardHeader>
                  </Card>
                ))
              )}
            </TabsContent>
          </Tabs>
        </div>
      </main>
    </div>
  );
}
