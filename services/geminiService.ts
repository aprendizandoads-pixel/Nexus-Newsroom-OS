import { GoogleGenAI, Type } from "@google/genai";
import { SignalScore, ArticleType, Signal, SignalSource, DiscoveryFilters, TrendAnalytics } from "../types";

const getAiClient = () => {
  const apiKey = process.env.API_KEY;
  if (!apiKey) {
    console.warn("Gemini API Key not found in process.env. Functionality will be limited.");
    return null;
  }
  return new GoogleGenAI({ apiKey });
};

export interface AnalysisResult {
  reasoning: string;
  recommendedAction: 'PUBLISH_IMMEDIATELY' | 'CREATE_GUIDE' | 'MONITOR' | 'IGNORE';
  suggestedTitlePT: string;
  suggestedTitleEN: string;
}

export interface DraftGenerationResult {
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  tags: string[];
}

export interface DiscoveryResult {
  signals: Signal[];
  analytics: TrendAnalytics;
}

export const discoverTrends = async (
    topic: string, 
    count: number = 6, 
    customSources: string[] = [],
    filters?: DiscoveryFilters
): Promise<DiscoveryResult> => {
    const ai = getAiClient();
    const defaultAnalytics: TrendAnalytics = { highIntentKeywords: [], opportunities: [], volumeData: [] };
    
    if (!ai) return { signals: [], analytics: defaultAnalytics };

    try {
        const sourceContext = customSources.length > 0 
            ? `\nPRIORITY INSTRUCTION: The user has provided specific RSS feeds to scan: ${customSources.join(', ')}. Ensure at least one signal comes from these custom sources if relevant.` 
            : '';

        const filterContext = filters ? `
            CONFIGURATION PARAMETERS:
            - Target Region: ${filters.region}
            - Content Language: ${filters.language}
            - Time Range Analysis: ${filters.timeRange}
            - Minimum Relevance Score: ${filters.minScore}
            
            IMPORTANT: Ensure the discovered signals match the Region and Language preferences. 
        ` : '';

        const prompt = `
            Act as a high-precision trend detection engine for a newsroom.
            
            TASK 1: Discover ${count} distinct, high-relevance signals specifically related to the topic: "${topic}".
            ${sourceContext}
            ${filterContext}
            
            STRICT SOURCE REQUIREMENTS:
            - Mix of sources: 'Google Trends', 'Reddit', 'NewsAPI', 'arXiv', 'Glimpse', 'TikTok', 'Instagram', 'Facebook', 'RSS'.
            - Include at least 1 social media signal (TikTok/Instagram/Reddit) if relevant to topic.
            - Include at least 1 technical/search signal (arXiv/Google Trends/Glimpse).
            
            TASK 2: Generate Market Intelligence Analytics for this topic.
            - Identify 5 "High Intent Keywords" (SEO terms people are searching for related to this topic).
            - Identify 3 "Strategic Opportunities" (Content gaps or angles competitors are missing).
            - Estimate "Volume Data" for a chart: Create 5 data points representing key aspects of this topic (e.g., "Search Vol", "Social Mentions", "News Articles"), with estimated values for 'Daily' vs 'Weekly' volume to show trends.

            DATA EXTRACTION RULES:
            - Title: Catchy, clear headline of the trend.
            - Source: Exact string from list above.
            - Rank: Estimate the organic position (1-10) on the source platform (e.g. #1 Trending, #5 on Subreddit).
            - Summary: 2 sentences max context.
            - Score: 0-100 based on virality + longevity.
            - Metadata Needed:
              - 'views': e.g., "1.2M views", "500k searches", "High Volume"
              - 'growth': e.g., "+300% (24h)", "Trending #1", "Viral"
              - 'postedAt': Approximate ISO timestamp or relative time (e.g. "2 hours ago")
              - 'officialUrl': Real URL to the source content (or search query URL if generic).
            
            Return ONLY a JSON object with two root properties: 'signals' (array) and 'analytics' (object).
        `;

        const response = await ai.models.generateContent({
            model: 'gemini-3-flash-preview',
            contents: prompt,
            config: {
                responseMimeType: "application/json",
                responseSchema: {
                    type: Type.OBJECT,
                    properties: {
                        signals: {
                            type: Type.ARRAY,
                            items: {
                                type: Type.OBJECT,
                                properties: {
                                    title: { type: Type.STRING },
                                    source: { type: Type.STRING },
                                    rank: { type: Type.INTEGER, description: "Organic rank/position 1-20" },
                                    summary: { type: Type.STRING },
                                    scoreTotal: { type: Type.INTEGER },
                                    views: { type: Type.STRING },
                                    growth: { type: Type.STRING },
                                    officialUrl: { type: Type.STRING },
                                    postedAt: { type: Type.STRING },
                                    pros: { type: Type.ARRAY, items: { type: Type.STRING } },
                                    cons: { type: Type.ARRAY, items: { type: Type.STRING } },
                                    expectedResult: { type: Type.STRING },
                                    timeToResult: { type: Type.STRING }
                                }
                            }
                        },
                        analytics: {
                            type: Type.OBJECT,
                            properties: {
                                highIntentKeywords: { type: Type.ARRAY, items: { type: Type.STRING } },
                                opportunities: { type: Type.ARRAY, items: { type: Type.STRING } },
                                volumeData: {
                                    type: Type.ARRAY,
                                    items: {
                                        type: Type.OBJECT,
                                        properties: {
                                            name: { type: Type.STRING },
                                            daily: { type: Type.INTEGER },
                                            weekly: { type: Type.INTEGER }
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
            }
        });

        if (response.text) {
            const rawData = JSON.parse(response.text);
            
            const processedSignals = rawData.signals.map((item: any, index: number) => ({
                id: `gen-sig-${Date.now()}-${index}`,
                title: item.title,
                source: item.source as SignalSource || SignalSource.GOOGLE_TRENDS,
                timestamp: new Date().toISOString(),
                score: {
                    total: item.scoreTotal || 75,
                    searchDemand: 20,
                    coverage: 15,
                    social: 25,
                    innovation: 5,
                    seo: 10
                },
                summary: item.summary,
                status: 'PENDING',
                metadata: {
                    views: item.views || 'N/A',
                    growth: item.growth || 'Stable',
                    postedAt: item.postedAt || new Date().toISOString(),
                    officialUrl: item.officialUrl || '#',
                    rank: item.rank || index + 1
                },
                analysis: {
                    pros: item.pros || [],
                    cons: item.cons || [],
                    expectedResult: item.expectedResult || 'Organic Growth',
                    timeToResult: item.timeToResult || '1-2 Weeks',
                    originalUrl: item.officialUrl || '#'
                }
            }));

            return {
                signals: processedSignals,
                analytics: rawData.analytics || defaultAnalytics
            };
        }
        return { signals: [], analytics: defaultAnalytics };
    } catch (error) {
        console.error("Discovery Failed:", error);
        return { signals: [], analytics: defaultAnalytics };
    }
}

export const analyzeSignalWithGemini = async (signalTitle: string, signalSource: string, currentScore: SignalScore): Promise<AnalysisResult | null> => {
  const ai = getAiClient();
  if (!ai) return null;

  try {
    const prompt = `
      Analyze this content signal for a newsroom.
      Signal: "${signalTitle}" from ${signalSource}.
      Current automated scores:
      - Search Demand: ${currentScore.searchDemand}/25
      - Social Engagement: ${currentScore.social}/30
      - Breaking/Coverage: ${currentScore.coverage}/25
      
      Determine the best editorial action based on the "Content Monitoring Pipeline" rules:
      - Score >= 80: PUBLISH_IMMEDIATELY (Breaking)
      - Score 65-79: CREATE_GUIDE (Deep dive)
      - Score 50-64: MONITOR (Evergreen)
      - Score < 50: IGNORE

      Provide a short reasoning, the action, and suggested titles in Portuguese and English.
    `;

    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            reasoning: { type: Type.STRING },
            recommendedAction: { type: Type.STRING, enum: ['PUBLISH_IMMEDIATELY', 'CREATE_GUIDE', 'MONITOR', 'IGNORE'] },
            suggestedTitlePT: { type: Type.STRING },
            suggestedTitleEN: { type: Type.STRING }
          },
          required: ['reasoning', 'recommendedAction', 'suggestedTitlePT', 'suggestedTitleEN']
        }
      }
    });

    if (response.text) {
        return JSON.parse(response.text) as AnalysisResult;
    }
    return null;

  } catch (error) {
    console.error("Gemini Analysis Failed:", error);
    return null;
  }
};

export const generateArticleDraft = async (
  signal: Signal, 
  language: 'PT' | 'EN', 
  type: ArticleType
): Promise<DraftGenerationResult | null> => {
  const ai = getAiClient();
  if (!ai) return null;

  try {
    const prompt = `
      You are an expert journalist for 'Nexus Newsroom'.
      Task: Write a complete article draft based on the following signal.
      
      Signal Title: ${signal.title}
      Source: ${signal.source}
      Summary: ${signal.summary}
      
      Target Language: ${language}
      Article Type: ${type}
      
      Requirements:
      1. Write in Markdown format. Use H2 (##) for section headers.
      2. Structure:
         - Engaging Lead/Intro
         - "What we know" (Facts)
         - "Context/Background"
         - "What is unconfirmed/missing" (If applicable)
      3. Tone: Professional, objective, yet engaging.
      4. SEO: Include an optimized excerpt and SEO-friendly slug.
      5. Tags: 3-5 relevant tags.

      Return the result as JSON.
    `;

    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            title: { type: Type.STRING },
            slug: { type: Type.STRING, description: 'URL friendly slug' },
            excerpt: { type: Type.STRING, description: 'SEO meta description, max 160 chars' },
            content: { type: Type.STRING, description: 'Full article body in Markdown' },
            tags: { type: Type.ARRAY, items: { type: Type.STRING } }
          },
          required: ['title', 'slug', 'excerpt', 'content', 'tags']
        }
      }
    });

    if (response.text) {
        return JSON.parse(response.text) as DraftGenerationResult;
    }
    return null;

  } catch (error) {
    console.error("Gemini Generation Failed:", error);
    return null;
  }
};