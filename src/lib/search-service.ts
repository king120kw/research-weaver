// Search service for fetching real-time, up-to-date information
import { GoogleGenerativeAI } from '@google/generative-ai';
import { config } from './config';

export interface SearchResult {
    title: string;
    url: string;
    snippet: string;
    publishedDate?: string;
    source: string;
}

export interface SearchResponse {
    results: SearchResult[];
    query: string;
    timestamp: string;
}

/**
 * Search for recent information using Google's Gemini with grounding
 * This uses Gemini's built-in search capabilities for up-to-date information
 */
export async function searchRecentSources(
    query: string,
    maxResults: number = 5
): Promise<SearchResponse> {
    try {
        if (!config.gemini.apiKey) {
            throw new Error('Gemini API key not configured');
        }

        const genAI = new GoogleGenerativeAI(config.gemini.apiKey);
        const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

        // Use Gemini to search for recent information
        const searchPrompt = `Search for the most recent and up-to-date information about: "${query}". 
        
Focus on:
- Academic papers and research from the last 2 years
- Recent developments and findings
- Credible sources (universities, research institutions, peer-reviewed journals)
- Current statistics and data

Provide ${maxResults} relevant sources with:
1. Title
2. Brief description
3. Source/publication
4. Publication date (if available)

Format as JSON array with fields: title, snippet, source, publishedDate`;

        const result = await model.generateContent(searchPrompt);
        const response = await result.response;
        const text = response.text();

        // Parse the response to extract search results
        const results = parseSearchResults(text, maxResults);

        return {
            results,
            query,
            timestamp: new Date().toISOString()
        };
    } catch (error: any) {
        console.error('Search error:', error);
        // Return empty results on error rather than failing
        return {
            results: [],
            query,
            timestamp: new Date().toISOString()
        };
    }
}

/**
 * Parse AI response to extract search results
 */
function parseSearchResults(text: string, maxResults: number): SearchResult[] {
    try {
        // Try to parse as JSON first
        const jsonMatch = text.match(/\[[\s\S]*\]/);
        if (jsonMatch) {
            const parsed = JSON.parse(jsonMatch[0]);
            return parsed.slice(0, maxResults);
        }

        // Fallback: parse structured text
        const results: SearchResult[] = [];
        const lines = text.split('\n');
        let currentResult: Partial<SearchResult> = {};

        for (const line of lines) {
            const trimmed = line.trim();

            if (trimmed.match(/^\d+\./)) {
                // New result starting
                if (currentResult.title) {
                    results.push(currentResult as SearchResult);
                }
                currentResult = {};
            } else if (trimmed.toLowerCase().startsWith('title:')) {
                currentResult.title = trimmed.substring(6).trim();
            } else if (trimmed.toLowerCase().startsWith('snippet:') || trimmed.toLowerCase().startsWith('description:')) {
                currentResult.snippet = trimmed.substring(trimmed.indexOf(':') + 1).trim();
            } else if (trimmed.toLowerCase().startsWith('source:')) {
                currentResult.source = trimmed.substring(7).trim();
            } else if (trimmed.toLowerCase().startsWith('published:') || trimmed.toLowerCase().startsWith('date:')) {
                currentResult.publishedDate = trimmed.substring(trimmed.indexOf(':') + 1).trim();
            }
        }

        if (currentResult.title) {
            results.push(currentResult as SearchResult);
        }

        return results.slice(0, maxResults);
    } catch (error) {
        console.error('Parse error:', error);
        return [];
    }
}

/**
 * Extract key research topics from document text
 */
export async function extractResearchTopics(documentText: string): Promise<string[]> {
    try {
        if (!config.gemini.apiKey) {
            throw new Error('Gemini API key not configured');
        }

        const genAI = new GoogleGenerativeAI(config.gemini.apiKey);
        const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash-exp' });

        const prompt = `Analyze this research document and extract 3-5 key topics or concepts that would benefit from recent, up-to-date information:

${documentText.substring(0, 3000)}

Return only the topics as a JSON array of strings, e.g., ["topic1", "topic2", "topic3"]`;

        const result = await model.generateContent(prompt);
        const response = await result.response;
        const text = response.text();

        // Parse topics
        const jsonMatch = text.match(/\[[\s\S]*?\]/);
        if (jsonMatch) {
            return JSON.parse(jsonMatch[0]);
        }

        // Fallback: split by lines
        return text.split('\n')
            .filter(line => line.trim().length > 0)
            .map(line => line.replace(/^[-*\d.]+\s*/, '').trim())
            .slice(0, 5);
    } catch (error) {
        console.error('Topic extraction error:', error);
        return [];
    }
}

/**
 * Verify if a source is recent (within specified years)
 */
export function isSourceRecent(publishedDate?: string, yearsThreshold: number = 2): boolean {
    if (!publishedDate) return false;

    try {
        const date = new Date(publishedDate);
        const now = new Date();
        const yearsDiff = (now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24 * 365);

        return yearsDiff <= yearsThreshold;
    } catch {
        return false;
    }
}
