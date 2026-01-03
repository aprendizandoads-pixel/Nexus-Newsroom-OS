import React, { useState, useEffect } from 'react';
import { Signal, SignalSource, ArticleType, Article, DiscoveryFilters, TrendAnalytics } from '../types';
import { MOCK_SIGNALS } from '../constants';
import { analyzeSignalWithGemini, generateArticleDraft, AnalysisResult, discoverTrends } from '../services/geminiService';
import { ArrowUpRight, Cpu, Search, Share2, Radio, Loader2, FilePlus, Check, TrendingUp, Clock, Target, ExternalLink, Filter, PlusCircle, Globe, Zap, X, SlidersHorizontal, Eye, BarChart2, Rss, Facebook, Instagram, Video, MessageCircle, BookOpen, Newspaper, Link, Plus, ChevronDown, ChevronUp, MapPin, Languages, Calendar, Lightbulb, Flame, CheckCircle2, XCircle, FileText, Trophy } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';

const ScoreBadge = ({ score }: { score: number }) => {
  let colorClass = 'bg-slate-100 text-slate-600';
  if (score >= 80) colorClass = 'bg-red-100 text-red-700 font-bold';
  else if (score >= 65) colorClass = 'bg-amber-100 text-amber-700 font-bold';
  else if (score >= 50) colorClass = 'bg-blue-100 text-blue-700';

  return (
    <div className={`flex flex-col items-center justify-center w-12 h-12 rounded-lg ${colorClass} border border-black/5`}>
      <span className="text-lg">{score}</span>
    </div>
  );
};

const SourceIcon = ({ source, className = "w-3 h-3" }: { source: string, className?: string }) => {
    switch(source) {
        case SignalSource.REDDIT: return <MessageCircle className={className} />;
        case SignalSource.TIKTOK: return <Video className={className} />;
        case SignalSource.INSTAGRAM: return <Instagram className={className} />;
        case SignalSource.FACEBOOK: return <Facebook className={className} />;
        case SignalSource.GOOGLE_TRENDS: return <TrendingUp className={className} />;
        case SignalSource.ARXIV: return <BookOpen className={className} />;
        case SignalSource.RSS: return <Rss className={className} />;
        case SignalSource.NEWS_API: return <Newspaper className={className} />;
        case SignalSource.GLIMPSE: return <Search className={className} />;
        default: return <Globe className={className} />;
    }
};

const SignalCard = ({ signal, onArticleGenerated }: { signal: Signal, onArticleGenerated: (article: Partial<Article>) => void }) => {
  const [analyzing, setAnalyzing] = useState(false);
  const [generating, setGenerating] = useState<string | null>(null);
  const [analysis, setAnalysis] = useState<AnalysisResult | null>(null);
  const [generatedLangs, setGeneratedLangs] = useState<string[]>([]);

  const isHot = signal.score.total >= 80;

  const handleAnalyze = async () => {
    setAnalyzing(true);
    const result = await analyzeSignalWithGemini(signal.title, signal.source, signal.score);
    setAnalysis(result);
    setAnalyzing(false);
  };

  const handleGenerate = async (lang: 'PT' | 'EN') => {
    setGenerating(lang);
    const type = analysis?.recommendedAction === 'PUBLISH_IMMEDIATELY' ? ArticleType.NEWS : ArticleType.GUIDE;
    
    const draft = await generateArticleDraft(signal, lang, type);
    
    if (draft) {
        onArticleGenerated({
            ...draft,
            language: lang,
            type: type,
            signalId: signal.id
        });
        setGeneratedLangs([...generatedLangs, lang]);
    }
    setGenerating(null);
  };

  const getSourceStyle = (source: string) => {
      switch(source) {
          case 'Reddit': return 'bg-orange-50 text-orange-700 border-orange-200';
          case 'TikTok': return 'bg-pink-50 text-pink-700 border-pink-200';
          case 'Instagram': return 'bg-fuchsia-50 text-fuchsia-700 border-fuchsia-200';
          case 'Facebook': return 'bg-blue-50 text-blue-700 border-blue-200';
          case 'arXiv': return 'bg-red-50 text-red-700 border-red-200';
          case 'Google Trends': return 'bg-blue-50 text-blue-700 border-blue-200';
          case 'RSS': return 'bg-amber-50 text-amber-700 border-amber-200';
          default: return 'bg-slate-50 text-slate-700 border-slate-200';
      }
  };

  const formatUrl = (url?: string) => {
      if (!url) return '';
      try {
          return new URL(url).hostname.replace('www.', '');
      } catch (e) {
          return url;
      }
  };

  const formatDate = (dateString?: string) => {
      if (!dateString) return 'Unknown date';
      if (dateString.includes('T')) {
          try {
              return new Date(dateString).toLocaleString(undefined, { 
                  month: 'short', 
                  day: 'numeric', 
                  hour: '2-digit', 
                  minute: '2-digit' 
              });
          } catch (e) {
              return dateString;
          }
      }
      return dateString;
  };

  // Parsing growth to separate value and period if possible
  const growthRaw = signal.metadata?.growth || 'Stable';
  const growthValue = growthRaw.split('(')[0].trim();
  const growthPeriod = growthRaw.includes('(') ? growthRaw.split('(')[1].replace(')', '') : '24h';

  return (
    <div className={`bg-white rounded-xl border ${isHot ? 'border-red-200 shadow-sm shadow-red-50' : 'border-slate-200'} hover:shadow-md transition-all duration-200 flex flex-col h-full animate-in fade-in duration-500 relative overflow-hidden group`}>
      {isHot && (
        <div className="absolute top-0 right-0 bg-gradient-to-l from-red-500 to-red-600 text-white text-[10px] font-bold px-3 py-1 rounded-bl-xl z-10 flex items-center gap-1 shadow-sm">
           <Zap size={10} fill="currentColor" /> HOT
        </div>
      )}
      
      <div className="p-5 flex-1 flex flex-col">
        <div className="flex justify-between items-start mb-3">
             <div className="flex items-center gap-2">
                 <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wide border truncate max-w-[140px] ${getSourceStyle(signal.source)}`}>
                    <SourceIcon source={signal.source} className="w-3 h-3" />
                    {signal.source}
                </span>
                {signal.metadata?.rank && (
                    <span 
                        className="inline-flex items-center gap-1 text-[10px] font-bold text-slate-500 bg-slate-100 px-2 py-1 rounded-full border border-slate-200"
                        title="Organic Rank on Platform"
                    >
                        <Trophy size={10} className={signal.metadata.rank <= 3 ? "text-amber-500 fill-amber-500" : "text-slate-400"} />
                        <span className="tabular-nums">#{signal.metadata.rank}</span>
                    </span>
                )}
            </div>
            <span className="text-[10px] text-slate-400 flex items-center gap-1 bg-slate-50 px-2 py-1 rounded-full border border-slate-100" title="Posted at">
                <Clock size={10} /> 
                {formatDate(signal.metadata?.postedAt)}
            </span>
        </div>

        <div className="flex gap-4 mb-3">
             <ScoreBadge score={signal.score.total} />
             <div className="flex-1 min-w-0">
                <h3 className="text-base font-bold text-slate-800 leading-tight group-hover:text-indigo-600 transition-colors line-clamp-2" title={signal.title}>
                    {signal.title}
                </h3>
                {signal.metadata?.officialUrl && (
                    <a href={signal.metadata.officialUrl} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1.5 text-xs text-indigo-600 hover:text-indigo-800 mt-2 font-medium bg-indigo-50 px-2 py-1 rounded hover:bg-indigo-100 transition-colors max-w-full">
                        <Link size={10} />
                        <span className="truncate">Source: {formatUrl(signal.metadata.officialUrl)}</span>
                        <ExternalLink size={10} className="opacity-50 flex-shrink-0" />
                    </a>
                )}
             </div>
        </div>
        
        <p className="text-slate-600 text-xs leading-relaxed mb-4 line-clamp-3 flex-grow">{signal.summary}</p>

        {/* Detailed Stats Grid */}
        <div className="grid grid-cols-2 gap-2 mb-3">
             <div className="bg-slate-50 p-2.5 rounded-lg border border-slate-100 flex flex-col justify-center hover:border-indigo-100 transition-colors">
                 <div className="text-[10px] text-slate-500 flex items-center gap-1.5 mb-1 uppercase tracking-wide font-semibold">
                    <Eye size={12} className="text-indigo-400"/> Views / Reach
                 </div>
                 <div className="font-bold text-slate-700 text-sm truncate" title="Views / Interactions">
                    {signal.metadata?.views || 'N/A'}
                 </div>
             </div>
             <div className="bg-slate-50 p-2.5 rounded-lg border border-slate-100 flex flex-col justify-center hover:border-emerald-100 transition-colors">
                 <div className="text-[10px] text-slate-500 flex items-center gap-1.5 mb-1 uppercase tracking-wide font-semibold">
                    <TrendingUp size={12} className={isHot ? "text-red-500" : "text-emerald-400"}/> 
                    Growth ({growthPeriod})
                 </div>
                 <div className={`font-bold text-sm truncate ${isHot ? "text-red-600" : "text-emerald-600"}`}>
                    {growthValue}
                 </div>
             </div>
        </div>

        {/* Actions Area */}
        <div className="mt-auto pt-3 border-t border-slate-100">
            {!analysis ? (
                <button 
                    onClick={handleAnalyze}
                    disabled={analyzing}
                    className="w-full inline-flex justify-center items-center gap-2 px-3 py-2 bg-slate-50 text-slate-600 text-xs font-medium rounded-lg hover:bg-indigo-50 hover:text-indigo-600 border border-transparent hover:border-indigo-200 transition-all"
                >
                    {analyzing ? <Loader2 className="animate-spin w-3.5 h-3.5" /> : <Cpu className="w-3.5 h-3.5" />}
                    AI Deep Analysis
                </button>
            ) : (
                <div className="space-y-2 animate-in fade-in">
                    <div className="flex justify-between items-center">
                        <span className="text-[10px] font-bold text-indigo-700 uppercase tracking-wide">
                            Rec: {analysis.recommendedAction.replace('_', ' ')}
                        </span>
                    </div>
                    <div className="flex gap-2">
                        <button 
                            onClick={() => handleGenerate('PT')}
                            disabled={!!generating || generatedLangs.includes('PT')}
                            className="flex-1 flex justify-center items-center gap-1 px-2 py-1.5 bg-indigo-600 text-white text-xs font-medium rounded-lg hover:bg-indigo-700 disabled:opacity-50 transition-colors shadow-sm"
                        >
                             {generating === 'PT' ? <Loader2 className="w-3 h-3 animate-spin"/> : 'PT'} Draft
                        </button>
                        <button 
                            onClick={() => handleGenerate('EN')}
                            disabled={!!generating || generatedLangs.includes('EN')}
                            className="flex-1 flex justify-center items-center gap-1 px-2 py-1.5 bg-white border border-indigo-200 text-indigo-700 text-xs font-medium rounded-lg hover:bg-indigo-50 disabled:opacity-50 transition-colors"
                        >
                             {generating === 'EN' ? <Loader2 className="w-3 h-3 animate-spin"/> : 'EN'} Draft
                        </button>
                    </div>
                </div>
            )}
        </div>
      </div>
    </div>
  );
};

const FILTERS = ['ALL', 'Google Trends', 'Reddit', 'arXiv', 'TikTok', 'Instagram', 'Facebook', 'RSS', 'Glimpse'];

interface DraftJob {
    id: string;
    signalId: string;
    title: string;
    status: 'pending' | 'generating' | 'completed' | 'failed';
    generatedTitle?: string;
}

export const SignalFeed: React.FC<{ onArticleGenerated: (article: Partial<Article>) => void, globalSearch: string }> = ({ onArticleGenerated, globalSearch }) => {
  const [activeSignals, setActiveSignals] = useState<Signal[]>(MOCK_SIGNALS);
  const [topicInput, setTopicInput] = useState('');
  const [isDiscovering, setIsDiscovering] = useState(false);
  const [discoveryMode, setDiscoveryMode] = useState(false);
  const [sourceFilter, setSourceFilter] = useState<string>('ALL');
  const [analytics, setAnalytics] = useState<TrendAnalytics | null>(null);
  
  // Pipeline Filters
  const [showConfig, setShowConfig] = useState(false);
  const [filters, setFilters] = useState<DiscoveryFilters>({
      region: 'Global',
      language: 'English',
      timeRange: '24h',
      minScore: 50
  });

  // RSS Feeds state
  const [showRssInput, setShowRssInput] = useState(false);
  const [rssInput, setRssInput] = useState('');
  const [rssFeeds, setRssFeeds] = useState<string[]>([]);
  
  // Auto-Generation Queue State
  const [draftJobs, setDraftJobs] = useState<DraftJob[]>([]);

  // Initialize with search if global search is present
  useEffect(() => {
      if (globalSearch && globalSearch.length > 3) {
          setTopicInput(globalSearch);
          handleDiscovery(globalSearch);
      }
  }, [globalSearch]);

  const handleDiscovery = async (topic: string, append: boolean = false) => {
      if (!topic) return;
      setIsDiscovering(true);
      if (!append) {
          setDiscoveryMode(true);
          setAnalytics(null); // Reset analytics on new search
      }
      
      // Pass custom RSS feeds and filters to discovery
      const { signals: newSignals, analytics: newAnalytics } = await discoverTrends(topic, 6, rssFeeds, filters);
      
      if (!append) {
        setAnalytics(newAnalytics);
      }

      // --- Auto-Draft Generation Logic ---
      const highValueSignals = newSignals.filter(s => s.score.total >= 80);
      
      if (highValueSignals.length > 0) {
          // 1. Create jobs
          const newJobs: DraftJob[] = highValueSignals.slice(0, 2).map(s => ({
              id: `job-${s.id}`,
              signalId: s.id,
              title: s.title,
              status: 'pending'
          }));
          
          setDraftJobs(prev => [...newJobs, ...prev]);

          // 2. Process jobs asynchronously (don't block UI)
          (async () => {
             for (const job of newJobs) {
                 // Update status to generating
                 setDraftJobs(prev => prev.map(j => j.id === job.id ? { ...j, status: 'generating' } : j));
                 
                 const signal = highValueSignals.find(s => s.id === job.signalId);
                 if (signal) {
                      // Map filter language to EN/PT
                      const targetLang = filters.language === 'Portuguese' ? 'PT' : 'EN';
                      
                      // Simulate slight delay for realism
                      await new Promise(r => setTimeout(r, 800));

                      const draft = await generateArticleDraft(signal, targetLang, ArticleType.NEWS);
                      
                      if (draft) {
                          onArticleGenerated({
                              ...draft,
                              language: targetLang,
                              type: ArticleType.NEWS,
                              signalId: signal.id
                          });
                          setDraftJobs(prev => prev.map(j => j.id === job.id ? { ...j, status: 'completed', generatedTitle: draft.title } : j));
                      } else {
                          setDraftJobs(prev => prev.map(j => j.id === job.id ? { ...j, status: 'failed' } : j));
                      }
                 }
             }
          })();
      }
      // -----------------------------------

      if (append) {
          setActiveSignals(prev => {
              // Deduplicate signals based on title to ensure "Load More" brings unique items
              const existingTitles = new Set(prev.map(s => s.title.toLowerCase().trim()));
              const uniqueNewSignals = newSignals.filter(s => !existingTitles.has(s.title.toLowerCase().trim()));

              const combined = [...prev, ...uniqueNewSignals];
              // STRICT 30 items limit
              return combined.slice(0, 30);
          });
      } else {
          setActiveSignals(newSignals);
      }
      setIsDiscovering(false);
  };

  const handleAddRss = () => {
      if (rssInput) {
          setRssFeeds([...rssFeeds, rssInput]);
          setRssInput('');
          setShowRssInput(false);
          // Auto-trigger discovery if we have a topic, considering the new feed
          if (topicInput) {
             handleDiscovery(topicInput);
          }
      }
  };

  const handleLoadMore = () => {
      const topic = topicInput || globalSearch || "Trending Tech";
      handleDiscovery(topic, true);
  };

  const clearSearch = () => {
      setTopicInput('');
      setDiscoveryMode(false);
      setActiveSignals(MOCK_SIGNALS);
      setSourceFilter('ALL');
      setAnalytics(null);
  };

  const displayedSignals = sourceFilter === 'ALL' 
    ? activeSignals 
    : activeSignals.filter(s => s.source === sourceFilter);

  return (
    <div className="space-y-6">
      {/* Search & Discovery Header */}
      <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm space-y-4">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div>
                <h2 className="text-2xl font-bold text-slate-800 flex items-center gap-2">
                    <Flame className="text-red-500 fill-red-500" /> 
                    Hot Trends & Live Signals
                </h2>
                <p className="text-slate-500 mt-1">Real-time "Hot" trends detection, viral signals, and market intelligence.</p>
            </div>
            
            <div className="flex flex-col items-end gap-2 w-full md:w-auto">
                <div className="flex items-center gap-2 w-full md:w-auto">
                    {/* RSS Input Toggle */}
                    {showRssInput ? (
                        <div className="flex items-center gap-2 bg-slate-50 p-1.5 rounded-lg border border-slate-200 animate-in fade-in slide-in-from-right-2">
                            <Rss size={16} className="text-amber-500 ml-2" />
                            <input 
                                type="text" 
                                className="bg-transparent border-none focus:ring-0 text-sm w-48 placeholder-slate-400"
                                placeholder="Paste RSS Feed URL..."
                                value={rssInput}
                                onChange={(e) => setRssInput(e.target.value)}
                                onKeyDown={(e) => e.key === 'Enter' && handleAddRss()}
                            />
                            <button onClick={handleAddRss} className="p-1 bg-amber-500 text-white rounded hover:bg-amber-600 transition-colors">
                                <Plus size={14} />
                            </button>
                            <button onClick={() => setShowRssInput(false)} className="p-1 text-slate-400 hover:text-slate-600">
                                <X size={14} />
                            </button>
                        </div>
                    ) : (
                        <button 
                            onClick={() => setShowRssInput(true)}
                            className="p-2 text-slate-500 hover:text-amber-600 hover:bg-amber-50 rounded-lg border border-transparent hover:border-amber-200 transition-all"
                            title="Add Custom RSS Feed"
                        >
                            <Rss size={20} />
                        </button>
                    )}

                    {/* Main Search */}
                    <div className="flex items-center gap-2 bg-slate-50 p-1.5 rounded-lg border border-slate-200 w-full md:w-auto transition-all focus-within:ring-2 focus-within:ring-indigo-500/20 focus-within:border-indigo-500">
                        <Globe className="text-slate-400 ml-2" size={16} />
                        <input 
                            type="text"
                            placeholder="Topic, URL, or Category..."
                            className="bg-transparent border-none focus:ring-0 text-sm w-full md:w-64 placeholder-slate-400"
                            value={topicInput}
                            onChange={(e) => setTopicInput(e.target.value)}
                            onKeyDown={(e) => e.key === 'Enter' && handleDiscovery(topicInput)}
                        />
                        {topicInput && (
                            <button onClick={clearSearch} className="text-slate-400 hover:text-slate-600">
                                <X size={14} />
                            </button>
                        )}
                        <button 
                            onClick={() => handleDiscovery(topicInput)}
                            disabled={isDiscovering || !topicInput}
                            className="bg-indigo-600 text-white px-4 py-1.5 rounded-md text-sm font-medium hover:bg-indigo-700 disabled:opacity-50 transition-colors flex items-center gap-2"
                        >
                            {isDiscovering ? <Loader2 className="animate-spin w-4 h-4"/> : <Search size={14}/>}
                            Scan
                        </button>
                    </div>
                </div>

                <button 
                    onClick={() => setShowConfig(!showConfig)}
                    className="text-xs text-slate-500 hover:text-indigo-600 flex items-center gap-1 transition-colors"
                >
                    {showConfig ? <ChevronUp size={12}/> : <ChevronDown size={12}/>}
                    {showConfig ? 'Hide Pipeline Config' : 'Configure Pipeline Parameters'}
                </button>
            </div>
        </div>

        {/* Configuration Panel */}
        {showConfig && (
            <div className="mt-4 pt-4 border-t border-slate-100 grid grid-cols-1 md:grid-cols-4 gap-4 animate-in slide-in-from-top-2 fade-in">
                <div>
                    <label className="block text-xs font-semibold text-slate-500 mb-1 flex items-center gap-1">
                        <MapPin size={12} /> Target Region
                    </label>
                    <select 
                        value={filters.region}
                        onChange={(e) => setFilters({...filters, region: e.target.value})}
                        className="w-full text-sm border-slate-200 rounded-lg focus:ring-indigo-500 focus:border-indigo-500 bg-slate-50"
                    >
                        <option>Global</option>
                        <option>United States</option>
                        <option>Brazil</option>
                        <option>Europe</option>
                        <option>Asia Pacific</option>
                    </select>
                </div>
                <div>
                    <label className="block text-xs font-semibold text-slate-500 mb-1 flex items-center gap-1">
                        <Languages size={12} /> Language
                    </label>
                    <select 
                        value={filters.language}
                        onChange={(e) => setFilters({...filters, language: e.target.value})}
                        className="w-full text-sm border-slate-200 rounded-lg focus:ring-indigo-500 focus:border-indigo-500 bg-slate-50"
                    >
                        <option>English</option>
                        <option>Portuguese</option>
                        <option>Spanish</option>
                        <option>French</option>
                        <option>German</option>
                    </select>
                </div>
                <div>
                    <label className="block text-xs font-semibold text-slate-500 mb-1 flex items-center gap-1">
                        <Calendar size={12} /> Time Range
                    </label>
                    <select 
                        value={filters.timeRange}
                        onChange={(e) => setFilters({...filters, timeRange: e.target.value as any})}
                        className="w-full text-sm border-slate-200 rounded-lg focus:ring-indigo-500 focus:border-indigo-500 bg-slate-50"
                    >
                        <option value="24h">Past 24 Hours</option>
                        <option value="7d">Past 7 Days</option>
                        <option value="30d">Past 30 Days</option>
                    </select>
                </div>
                <div>
                    <label className="block text-xs font-semibold text-slate-500 mb-1 flex items-center gap-1">
                        <Target size={12} /> Min. Relevance Score
                    </label>
                    <input 
                        type="range" 
                        min="0" 
                        max="100" 
                        value={filters.minScore} 
                        onChange={(e) => setFilters({...filters, minScore: parseInt(e.target.value)})}
                        className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-indigo-600"
                    />
                    <div className="flex justify-between text-[10px] text-slate-400 mt-1">
                        <span>Low (0)</span>
                        <span className="font-bold text-indigo-600">{filters.minScore}</span>
                        <span>High (100)</span>
                    </div>
                </div>
            </div>
        )}

        {/* Draft Generation Queue UI */}
        {draftJobs.length > 0 && (
            <div className="mt-4 pt-4 border-t border-slate-100 animate-in fade-in slide-in-from-top-2">
                 <div className="flex items-center justify-between mb-2">
                     <span className="text-xs font-bold text-slate-500 uppercase tracking-wide flex items-center gap-1">
                        <FilePlus size={12} /> Auto-Draft Queue
                     </span>
                     <button onClick={() => setDraftJobs([])} className="text-[10px] text-slate-400 hover:text-slate-600">Clear</button>
                 </div>
                 <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                     {draftJobs.map(job => (
                         <div key={job.id} className="bg-slate-50 p-3 rounded-lg border border-slate-200 flex items-center justify-between text-sm">
                             <div className="flex items-center gap-3 overflow-hidden">
                                {job.status === 'pending' && <div className="w-2 h-2 rounded-full bg-slate-300 shrink-0"></div>}
                                {job.status === 'generating' && <Loader2 size={14} className="animate-spin text-indigo-600 shrink-0" />}
                                {job.status === 'completed' && <CheckCircle2 size={14} className="text-emerald-500 shrink-0" />}
                                {job.status === 'failed' && <XCircle size={14} className="text-red-500 shrink-0" />}
                                
                                <div className="truncate">
                                    <div className="font-medium text-slate-700 truncate">{job.generatedTitle || job.title}</div>
                                    <div className="text-[10px] text-slate-400">
                                        {job.status === 'pending' && 'Queued for generation...'}
                                        {job.status === 'generating' && 'Writing draft with Gemini...'}
                                        {job.status === 'completed' && 'Sent to Content Manager'}
                                        {job.status === 'failed' && 'Generation failed'}
                                    </div>
                                </div>
                             </div>
                             {job.status === 'completed' && (
                                 <div className="bg-emerald-100 text-emerald-700 p-1.5 rounded-md">
                                     <FileText size={12} />
                                 </div>
                             )}
                         </div>
                     ))}
                 </div>
            </div>
        )}

        {/* Filters and Status Bar */}
        <div className="flex flex-col sm:flex-row gap-4 justify-between items-center pt-2 border-t border-slate-100 mt-2">
            <div className="flex items-center gap-2 overflow-x-auto w-full sm:w-auto pb-1 no-scrollbar">
                <SlidersHorizontal size={16} className="text-slate-400 mr-2 flex-shrink-0" />
                {FILTERS.map(filter => (
                    <button
                        key={filter}
                        onClick={() => setSourceFilter(filter)}
                        className={`px-3 py-1 text-xs font-medium rounded-full transition-colors whitespace-nowrap ${
                            sourceFilter === filter 
                            ? 'bg-indigo-100 text-indigo-700' 
                            : 'bg-slate-50 text-slate-600 hover:bg-slate-100'
                        }`}
                    >
                        {filter}
                    </button>
                ))}
            </div>

            <div className="flex items-center gap-2">
                {rssFeeds.length > 0 && (
                     <div className="text-xs text-slate-500 bg-amber-50 px-3 py-1 rounded-full border border-amber-100 flex items-center gap-1">
                        <Rss size={10} className="text-amber-600"/>
                        {rssFeeds.length} Custom Feeds Active
                     </div>
                )}
                
                {discoveryMode && (
                    <div className="flex items-center gap-2 text-xs text-slate-500 bg-blue-50 px-3 py-1 rounded-full border border-blue-100 animate-in fade-in">
                        <TrendingUp size={12} className="text-blue-600" />
                        <span className="truncate max-w-[200px] sm:max-w-none">Active Discovery: <strong>"{topicInput}"</strong></span>
                    </div>
                )}
            </div>
        </div>
      </div>

      {/* Analytics Dashboard (Shows only when analytics data is available) */}
      {analytics && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 animate-in fade-in slide-in-from-bottom-4">
              {/* Chart */}
              <div className="lg:col-span-2 bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
                  <h3 className="text-base font-bold text-slate-800 mb-4 flex items-center gap-2">
                      <BarChart2 size={18} className="text-indigo-600" />
                      Topic Volume Analysis: Day vs Week
                  </h3>
                  <div className="h-64 w-full">
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={analytics.volumeData} barGap={8}>
                            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                            <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fontSize: 12, fill: '#64748b'}} />
                            <YAxis axisLine={false} tickLine={false} tick={{fontSize: 12, fill: '#64748b'}} />
                            <Tooltip 
                                contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                                cursor={{ fill: '#f8fafc' }}
                            />
                            <Legend />
                            <Bar dataKey="daily" name="Last 24h Volume" fill="#ef4444" radius={[4, 4, 0, 0]} />
                            <Bar dataKey="weekly" name="Weekly Avg" fill="#e2e8f0" radius={[4, 4, 0, 0]} />
                        </BarChart>
                    </ResponsiveContainer>
                  </div>
              </div>

              {/* Market Intelligence */}
              <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm flex flex-col">
                  <h3 className="text-base font-bold text-slate-800 mb-4 flex items-center gap-2">
                      <Lightbulb size={18} className="text-amber-500" />
                      Market Intelligence
                  </h3>
                  
                  <div className="flex-1 space-y-6">
                      <div>
                          <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">High Intent Keywords</h4>
                          <div className="flex flex-wrap gap-2">
                              {analytics.highIntentKeywords.map((kw, i) => (
                                  <span key={i} className="px-2.5 py-1 bg-slate-50 text-slate-700 text-xs font-medium rounded-md border border-slate-200 hover:border-indigo-200 hover:text-indigo-600 transition-colors cursor-default">
                                      {kw}
                                  </span>
                              ))}
                          </div>
                      </div>

                      <div>
                          <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">Strategic Opportunities</h4>
                          <ul className="space-y-2">
                              {analytics.opportunities.map((opp, i) => (
                                  <li key={i} className="flex gap-2 text-sm text-slate-600 bg-emerald-50/50 p-2 rounded-lg border border-emerald-100/50">
                                      <Check className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                                      {opp}
                                  </li>
                              ))}
                          </ul>
                      </div>
                  </div>
              </div>
          </div>
      )}

      {/* Grid Layout for Signals */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {displayedSignals.map((signal, idx) => (
            <SignalCard key={signal.id || idx} signal={signal} onArticleGenerated={onArticleGenerated} />
        ))}
        
        {/* Loading Skeletons */}
        {isDiscovering && Array.from({ length: 3 }).map((_, i) => (
            <div key={`skel-${i}`} className="bg-white rounded-xl border border-slate-200 p-6 h-64 animate-pulse flex flex-col gap-4">
                <div className="h-6 bg-slate-100 rounded w-3/4"></div>
                <div className="h-4 bg-slate-100 rounded w-1/2"></div>
                <div className="flex-1 bg-slate-50 rounded"></div>
                <div className="h-8 bg-slate-100 rounded"></div>
            </div>
        ))}

        {!isDiscovering && displayedSignals.length === 0 && (
             <div className="col-span-full text-center py-12 bg-white rounded-xl border border-slate-200 border-dashed">
                <Search className="mx-auto h-12 w-12 text-slate-300" />
                <h3 className="mt-2 text-sm font-medium text-slate-900">No signals found</h3>
                <p className="mt-1 text-sm text-slate-500">Try adjusting your filters or search for a new topic.</p>
            </div>
        )}
      </div>

      {/* Load More Pagination */}
      {sourceFilter === 'ALL' && activeSignals.length > 0 && activeSignals.length < 30 && (
          <div className="flex justify-center pt-4">
              <button 
                onClick={handleLoadMore}
                disabled={isDiscovering}
                className="flex items-center gap-2 px-6 py-3 bg-white border border-slate-200 text-slate-600 font-medium rounded-xl hover:bg-slate-50 hover:text-indigo-600 hover:border-indigo-200 transition-all shadow-sm"
              >
                  {isDiscovering ? <Loader2 className="animate-spin w-5 h-5"/> : <PlusCircle className="w-5 h-5"/>}
                  Load More Trends ({activeSignals.length}/30)
              </button>
          </div>
      )}
      {activeSignals.length >= 30 && (
          <div className="text-center text-xs text-slate-400 mt-4">
              Maximum signal capacity reached for this session.
          </div>
      )}
    </div>
  );
};