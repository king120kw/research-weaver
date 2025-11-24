import { GoogleGenerativeAI } from '@google/generative-ai';
import { config } from './config';

// Initialize Gemini with centralized config
const genAI = config.gemini.apiKey ? new GoogleGenerativeAI(config.gemini.apiKey) : null;

if (!genAI) {
  console.warn('Google Gemini API key not found. AI features will be limited.');
}

export interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
  timestamp?: Date;
}

export interface ChatResponse {
  message: string;
  confidence?: number;
}

export interface UserContext {
  userId?: string;
  userName?: string;
  email?: string;
  recentDocuments?: string[];
}

export interface ProgressCallback {
  (stage: string, progress: number, message: string): void;
}

/**
 * Send a chat message to Google Gemini AI and get a response
 */
export async function sendChatMessage(
  messages: ChatMessage[],
  userContext?: UserContext
): Promise<ChatResponse> {
  try {
    if (!genAI) {
      throw new Error('Google Gemini AI is not configured. Please check your API key.');
    }

    // Use Gemini 2.0 Flash model
    const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash-exp' });

    // Build context-aware system prompt
    const systemPrompt = buildSystemPrompt(userContext);

    // Get the latest user message
    const userMessage = messages[messages.length - 1];

    // Build chat history - EXCLUDE the welcome message and last user message
    const conversationHistory = messages
      .slice(0, -1)
      .filter(msg => !msg.content.includes("Hello! I'm your AI assistant"))
      .map(msg => ({
        role: msg.role === 'assistant' ? 'model' : 'user',
        parts: [{ text: msg.content }],
      }));

    // Start chat with history
    const chat = model.startChat({
      history: conversationHistory,
      generationConfig: {
        maxOutputTokens: 2048,
        temperature: 0.7,
        topP: 0.8,
        topK: 40,
      },
    });

    // Send message with system context (only on first message)
    const fullPrompt = conversationHistory.length === 0
      ? systemPrompt + '\n\nUser: ' + userMessage.content
      : userMessage.content;

    const result = await chat.sendMessage(fullPrompt);
    const response = await result.response;
    const text = response.text();

    return {
      message: text,
      confidence: 0.95,
    };
  } catch (error: any) {
    console.error('AI Service Error:', error);

    if (error.message?.includes('API key')) {
      throw new Error('Invalid API key. Please check your Google Gemini API configuration.');
    } else if (error.message?.includes('quota')) {
      throw new Error('API quota exceeded. Please try again later.');
    } else {
      throw new Error('Failed to get AI response. Please try again.');
    }
  }
}

function buildSystemPrompt(userContext?: UserContext): string {
  let prompt = `You are an intelligent research assistant with expertise in academic research, writing, and general knowledge. You can help with:

1. Research Planning & Methodology
2. Literature Reviews & Source Analysis
3. Academic Writing & Citations
4. Data Analysis & Statistics
5. General Questions (recipes, directions, information, etc.)

You provide accurate, well-structured, and helpful responses. When users ask general questions outside of research (like recipes or directions), you answer them naturally and helpfully.`;

  if (userContext) {
    if (userContext.userName) {
      prompt += `\n\nYou are currently assisting ${userContext.userName}.`;
    }
    if (userContext.recentDocuments && userContext.recentDocuments.length > 0) {
      prompt += `\n\nThe user has recently worked on these documents: ${userContext.recentDocuments.join(', ')}.`;
    }
  }

  return prompt;
}

/**
 * Analyze and improve a document with AI, including real-time research
 */
export async function analyzeDocument(
  content: string,
  documentType: string,
  targetPageCount?: number,
  onProgress?: ProgressCallback
): Promise<string> {
  try {
    if (!genAI) {
      throw new Error('Google Gemini AI is not configured.');
    }

    const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash-exp' });

    // Step 1: Extract research topics (20%)
    onProgress?.('analyzing', 20, 'Extracting key research topics...');
    const { extractResearchTopics, searchRecentSources } = await import('./search-service');
    const topics = await extractResearchTopics(content);

    // Step 2: Search for recent sources (40%)
    onProgress?.('researching', 40, 'Searching for up-to-date information...');
    const searchPromises = topics.map(topic => searchRecentSources(topic, 3));
    const searchResults = await Promise.all(searchPromises);

    // Combine all search results
    const allSources = searchResults.flatMap(r => r.results);
    const recentContext = allSources.length > 0
      ? `\n\nRecent Research Context (${new Date().getFullYear()}):\n` +
      allSources.map((s, i) =>
        `${i + 1}. ${s.title}\n   Source: ${s.source}\n   ${s.snippet}\n   ${s.publishedDate ? `Published: ${s.publishedDate}` : ''}`
      ).join('\n\n')
      : '';

    // Step 3: Analyze and improve document (70%)
    onProgress?.('generating', 70, 'Improving document with AI...');

    const prompt = `You are an expert academic editor. Analyze and improve the following ${documentType} document.

${targetPageCount ? `Target length: approximately ${targetPageCount} pages.` : ''}

IMPORTANT: Use the most recent and up-to-date information available. The current year is ${new Date().getFullYear()}.

Instructions:
1. Improve clarity, structure, and academic tone
2. Fix grammar and spelling errors
3. Enhance arguments and evidence presentation
4. Incorporate recent research and current data (prioritize information from ${new Date().getFullYear() - 2}-${new Date().getFullYear()})
5. Update any outdated statistics or references with current information
6. Ensure proper academic formatting with citations
7. Maintain the original intent and key points
${targetPageCount ? `8. Adjust length to meet the target page count` : ''}

${recentContext}

Original Document:
${content}

Please provide the improved version with updated, current information:`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const improvedText = response.text();

    // Step 4: Complete (100%)
    onProgress?.('completed', 100, 'Document processing complete!');

    return improvedText;
  } catch (error: any) {
    console.error('Document Analysis Error:', error);
    throw new Error('Failed to analyze document. Please try again.');
  }
}

export async function generateResearchPlan(
  topic: string,
  documentType: string,
  pageCount: number
): Promise<string> {
  try {
    if (!genAI) {
      throw new Error('Google Gemini AI is not configured.');
    }

    const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash-exp' });

    const prompt = `Create a detailed research plan for a ${documentType} on the topic: "${topic}"

Requirements:
- Document type: ${documentType}
- Target length: ${pageCount} pages

Please provide:
1. Research Question/Thesis Statement
2. Literature Review Strategy
3. Methodology
4. Outline with main sections
5. Timeline and milestones
6. Key resources and databases to consult

Format the response in a clear, structured manner suitable for academic research.`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    return response.text();
  } catch (error: any) {
    console.error('Research Plan Generation Error:', error);
    throw new Error('Failed to generate research plan. Please try again.');
  }
}

export async function extractInsights(content: string): Promise<{
  summary: string;
  keyPoints: string[];
  suggestions: string[];
}> {
  try {
    if (!genAI) {
      throw new Error('Google Gemini AI is not configured.');
    }

    const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash-exp' });

    const prompt = `Analyze the following document and provide:
1. A concise summary (2-3 sentences)
2. Key points (bullet list)
3. Suggestions for improvement (bullet list)

Document:
${content}

Format your response as JSON with keys: summary, keyPoints (array), suggestions (array)`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    try {
      const jsonMatch = text.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        return JSON.parse(jsonMatch[0]);
      }
    } catch (e) {
      // If JSON parsing fails, return structured response
    }

    return {
      summary: text.substring(0, 200),
      keyPoints: ['Analysis completed'],
      suggestions: ['Review the full response above'],
    };
  } catch (error: any) {
    console.error('Extract Insights Error:', error);
    throw new Error('Failed to extract insights. Please try again.');
  }
}
