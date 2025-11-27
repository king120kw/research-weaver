-- Create research projects table
CREATE TABLE public.research_projects (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  title TEXT NOT NULL,
  project_type TEXT NOT NULL CHECK (project_type IN ('template_adaptation', 'contextual_generation', 'pdf_manipulation', 'chat_conversation')),
  status TEXT NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'processing', 'completed', 'failed')),
  parameters JSONB,
  style_dna JSONB,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create sources table
CREATE TABLE public.sources (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  project_id UUID NOT NULL REFERENCES public.research_projects(id) ON DELETE CASCADE,
  source_type TEXT NOT NULL CHECK (source_type IN ('peer_reviewed', 'institutional', 'database', 'open_access')),
  title TEXT NOT NULL,
  authors TEXT[],
  doi TEXT,
  url TEXT,
  publication_year INTEGER,
  reliability_score INTEGER CHECK (reliability_score >= 0 AND reliability_score <= 100),
  metadata JSONB,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create verifications table
CREATE TABLE public.verifications (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  project_id UUID NOT NULL REFERENCES public.research_projects(id) ON DELETE CASCADE,
  source_id UUID REFERENCES public.sources(id) ON DELETE SET NULL,
  claim_text TEXT NOT NULL,
  verification_status TEXT NOT NULL CHECK (verification_status IN ('verified', 'unverified', 'pending', 'flagged')),
  confidence_score INTEGER CHECK (confidence_score >= 0 AND confidence_score <= 100),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create chat conversations table
CREATE TABLE public.chat_conversations (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  project_id UUID REFERENCES public.research_projects(id) ON DELETE CASCADE,
  conversation_memory JSONB DEFAULT '[]'::jsonb,
  accuracy_level TEXT NOT NULL DEFAULT 'strict' CHECK (accuracy_level IN ('strict', 'moderate', 'exploratory')),
  depth_level INTEGER NOT NULL DEFAULT 2 CHECK (depth_level >= 1 AND depth_level <= 3),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create chat messages table
CREATE TABLE public.chat_messages (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  conversation_id UUID NOT NULL REFERENCES public.chat_conversations(id) ON DELETE CASCADE,
  role TEXT NOT NULL CHECK (role IN ('user', 'assistant', 'system')),
  content TEXT NOT NULL,
  citations JSONB DEFAULT '[]'::jsonb,
  verification_status TEXT CHECK (verification_status IN ('verified', 'unverified', 'speculative')),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create documents table
CREATE TABLE public.documents (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  project_id UUID NOT NULL REFERENCES public.research_projects(id) ON DELETE CASCADE,
  file_name TEXT NOT NULL,
  file_path TEXT NOT NULL,
  file_size INTEGER,
  file_type TEXT NOT NULL,
  content_text TEXT,
  structural_metadata JSONB,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.research_projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.sources ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.verifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.chat_conversations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.chat_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.documents ENABLE ROW LEVEL SECURITY;

-- RLS Policies for research_projects
CREATE POLICY "Users can view their own projects"
ON public.research_projects FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own projects"
ON public.research_projects FOR INSERT
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own projects"
ON public.research_projects FOR UPDATE
USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own projects"
ON public.research_projects FOR DELETE
USING (auth.uid() = user_id);

-- RLS Policies for sources
CREATE POLICY "Users can view sources for their projects"
ON public.sources FOR SELECT
USING (EXISTS (
  SELECT 1 FROM public.research_projects
  WHERE research_projects.id = sources.project_id
  AND research_projects.user_id = auth.uid()
));

CREATE POLICY "Users can create sources for their projects"
ON public.sources FOR INSERT
WITH CHECK (EXISTS (
  SELECT 1 FROM public.research_projects
  WHERE research_projects.id = sources.project_id
  AND research_projects.user_id = auth.uid()
));

-- RLS Policies for verifications
CREATE POLICY "Users can view verifications for their projects"
ON public.verifications FOR SELECT
USING (EXISTS (
  SELECT 1 FROM public.research_projects
  WHERE research_projects.id = verifications.project_id
  AND research_projects.user_id = auth.uid()
));

CREATE POLICY "Users can create verifications for their projects"
ON public.verifications FOR INSERT
WITH CHECK (EXISTS (
  SELECT 1 FROM public.research_projects
  WHERE research_projects.id = verifications.project_id
  AND research_projects.user_id = auth.uid()
));

-- RLS Policies for chat_conversations
CREATE POLICY "Users can view their own conversations"
ON public.chat_conversations FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own conversations"
ON public.chat_conversations FOR INSERT
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own conversations"
ON public.chat_conversations FOR UPDATE
USING (auth.uid() = user_id);

-- RLS Policies for chat_messages
CREATE POLICY "Users can view messages from their conversations"
ON public.chat_messages FOR SELECT
USING (EXISTS (
  SELECT 1 FROM public.chat_conversations
  WHERE chat_conversations.id = chat_messages.conversation_id
  AND chat_conversations.user_id = auth.uid()
));

CREATE POLICY "Users can create messages in their conversations"
ON public.chat_messages FOR INSERT
WITH CHECK (EXISTS (
  SELECT 1 FROM public.chat_conversations
  WHERE chat_conversations.id = chat_messages.conversation_id
  AND chat_conversations.user_id = auth.uid()
));

-- RLS Policies for documents
CREATE POLICY "Users can view documents for their projects"
ON public.documents FOR SELECT
USING (EXISTS (
  SELECT 1 FROM public.research_projects
  WHERE research_projects.id = documents.project_id
  AND research_projects.user_id = auth.uid()
));

CREATE POLICY "Users can create documents for their projects"
ON public.documents FOR INSERT
WITH CHECK (EXISTS (
  SELECT 1 FROM public.research_projects
  WHERE research_projects.id = documents.project_id
  AND research_projects.user_id = auth.uid()
));

-- Create function to update timestamps
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

-- Create triggers for automatic timestamp updates
CREATE TRIGGER update_research_projects_updated_at
BEFORE UPDATE ON public.research_projects
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_chat_conversations_updated_at
BEFORE UPDATE ON public.chat_conversations
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();