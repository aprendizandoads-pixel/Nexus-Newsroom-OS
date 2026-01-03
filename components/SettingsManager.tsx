import React, { useState, useEffect } from 'react';
import { INITIAL_AI_CONFIGS } from '../constants';
import { AIProviderConfig, UserProfile } from '../types';
import { Save, Plus, Trash2, Key, Bot, Image as ImageIcon, Code, Search, CheckCircle, AlertCircle, Loader2, Play, Layers, RefreshCw, ExternalLink, Info, Zap, Brain, DollarSign, Shield, Download, FileText, Package, Server, HardDrive, LayoutTemplate, CreditCard, User, Activity } from 'lucide-react';
import { GoogleGenAI } from "@google/genai";

// --- Model Knowledge Base ---
interface ModelDefinition {
    id: string;
    name: string;
    description: string;
    cost: 'Free' | '$' | '$$' | '$$$';
    tags: string[];
    isFree?: boolean;
}

const MODEL_REGISTRY: Record<string, ModelDefinition[]> = {
    'Gemini': [
        { id: 'gemini-3-flash-preview', name: 'Gemini 3 Flash', description: 'Fast, cost-efficient, high volume.', cost: 'Free', tags: ['FAST', 'SEO'], isFree: true },
        { id: 'gemini-3-pro-preview', name: 'Gemini 3 Pro', description: 'Complex reasoning, coding, data extraction.', cost: '$$', tags: ['REASONING', 'CODE'] },
        { id: 'gemini-flash-latest', name: 'Gemini Flash', description: 'Balanced performance for general tasks.', cost: 'Free', tags: ['GENERAL'], isFree: true },
    ],
    'OpenAI': [
        { id: 'gpt-4o', name: 'GPT-4 Omni', description: 'Flagship model, multimodal, fast.', cost: '$$', tags: ['SMART', 'FAST'] },
        { id: 'gpt-4-turbo', name: 'GPT-4 Turbo', description: 'High intelligence, updated knowledge.', cost: '$$', tags: ['REASONING'] },
        { id: 'gpt-3.5-turbo', name: 'GPT-3.5 Turbo', description: 'Fast, inexpensive, good for simple tasks.', cost: '$', tags: ['FAST'], isFree: false },
    ],
    'Anthropic': [
        { id: 'claude-3-opus-20240229', name: 'Claude 3 Opus', description: 'Highest intelligence, expensive.', cost: '$$$', tags: ['WRITING', 'CODE'] },
        { id: 'claude-3-sonnet-20240229', name: 'Claude 3 Sonnet', description: 'Balance of speed and intelligence.', cost: '$$', tags: ['BALANCED'] },
        { id: 'claude-3-haiku-20240307', name: 'Claude 3 Haiku', description: 'Fastest, compact model.', cost: '$', tags: ['FAST'] },
    ],
    'Midjourney': [
        { id: 'v6', name: 'Version 6.0', description: 'Latest photorealistic model.', cost: '$$', tags: ['IMAGE'] },
        { id: 'niji-6', name: 'Niji 6', description: 'Optimized for anime/illustrative styles.', cost: '$$', tags: ['ANIME'] },
    ],
    'StableDiffusion': [
        { id: 'sd-3-large', name: 'SD 3.0 Large', description: 'High fidelity text-to-image.', cost: '$$', tags: ['IMAGE'] },
        { id: 'sd-xl-1.0', name: 'SD XL 1.0', description: 'Reliable, widely used base model.', cost: '$', tags: ['IMAGE'] },
    ]
};

const PROVIDER_URLS: Record<string, string> = {
    'Gemini': 'https://aistudio.google.com/app/apikey',
    'OpenAI': 'https://platform.openai.com/api-keys',
    'Anthropic': 'https://console.anthropic.com/settings/keys',
    'Midjourney': 'https://docs.midjourney.com/docs/api',
    'StableDiffusion': 'https://platform.stability.ai/account/keys'
};

const ProviderIcon = ({ type, className }: { type: string, className?: string }) => {
    switch(type) {
        case 'TEXT': return <Bot className={`text-blue-500 ${className}`} />;
        case 'IMAGE': return <ImageIcon className={`text-purple-500 ${className}`} />;
        case 'CODE': return <Code className={`text-slate-500 ${className}`} />;
        case 'SEO': return <Search className={`text-emerald-500 ${className}`} />;
        case 'RESEARCH': return <Brain className={`text-amber-500 ${className}`} />;
        default: return <Bot className={`text-slate-400 ${className}`} />;
    }
};

interface SettingsManagerProps {
    user?: UserProfile;
}

export const SettingsManager: React.FC<SettingsManagerProps> = ({ user }) => {
    const [configs, setConfigs] = useState<AIProviderConfig[]>(INITIAL_AI_CONFIGS);
    const [selectedConfigId, setSelectedConfigId] = useState<string | null>(INITIAL_AI_CONFIGS[0].id);
    const [fetchingModels, setFetchingModels] = useState<string | null>(null);
    const [testResults, setTestResults] = useState<Record<string, { status: 'idle' | 'loading' | 'success' | 'error', message?: string }>>({});
    const [viewMode, setViewMode] = useState<'ai' | 'billing'>('ai');

    const activeConfig = configs.find(c => c.id === selectedConfigId);

    const handleUpdate = (id: string, field: keyof AIProviderConfig, value: any) => {
        setConfigs(configs.map(c => c.id === id ? { ...c, [field]: value } : c));
        if (field === 'apiKey' || field === 'provider') {
             setTestResults(prev => {
                const newState = { ...prev };
                delete newState[id];
                return newState;
             });
        }
        if (field === 'apiKey' && value.length > 10) {
            handleFetchModels(id, configs.find(c => c.id === id)?.provider || 'Gemini');
        }
    };

    const handleFetchModels = async (id: string, provider: string) => {
        setFetchingModels(id);
        await new Promise(resolve => setTimeout(resolve, 1000));
        setFetchingModels(null);
    };

    const toggleActive = (id: string) => {
        setConfigs(configs.map(c => c.id === id ? { ...c, active: !c.active } : c));
    };

    const handleDelete = (id: string) => {
        const newConfigs = configs.filter(c => c.id !== id);
        setConfigs(newConfigs);
        if (selectedConfigId === id) {
            setSelectedConfigId(newConfigs[0]?.id || null);
        }
    };

    const handleAddAgent = (type: 'SEO' | 'TEXT' | 'IMAGE') => {
        const newConfig: AIProviderConfig = {
            id: `agent-${Date.now()}`,
            type: type,
            name: `New ${type} Agent`,
            provider: 'Gemini',
            model: 'gemini-3-flash-preview',
            apiKey: '',
            active: true
        };
        setConfigs([...configs, newConfig]);
        setSelectedConfigId(newConfig.id);
    };

    const handleTestConnection = async (config: AIProviderConfig) => {
        if (!config.apiKey) {
            setTestResults(prev => ({ ...prev, [config.id]: { status: 'error', message: 'API Key is missing' } }));
            return;
        }

        setTestResults(prev => ({ ...prev, [config.id]: { status: 'loading' } }));

        try {
            if (config.provider === 'Gemini') {
                const ai = new GoogleGenAI({ apiKey: config.apiKey });
                await ai.models.generateContent({
                    model: config.model || 'gemini-3-flash-preview',
                    contents: 'Test connection'
                });
            } else {
                await new Promise(resolve => setTimeout(resolve, 1500));
                if (config.apiKey.length < 5) throw new Error("Invalid API Key format");
            }
            setTestResults(prev => ({ ...prev, [config.id]: { status: 'success', message: 'Connection Verified' } }));
        } catch (error: any) {
            setTestResults(prev => ({ ...prev, [config.id]: { status: 'error', message: error.message || 'Connection Failed' } }));
        }
    };

    if (viewMode === 'billing') {
        return (
            <div className="flex flex-col h-[calc(100vh-8rem)]">
                 <div className="flex justify-between items-center mb-6">
                    <div>
                        <h2 className="text-2xl font-bold text-slate-800 flex items-center gap-2">
                            <CreditCard className="text-indigo-500 fill-indigo-500" />
                            Subscription & Billing
                        </h2>
                        <p className="text-slate-500 mt-1">Manage your plan, invoices, and payment methods.</p>
                    </div>
                    <button 
                        onClick={() => setViewMode('ai')}
                        className="flex items-center gap-2 px-5 py-2.5 bg-white border border-slate-200 rounded-xl text-sm font-medium hover:bg-slate-50 transition-all shadow-sm"
                    >
                        <Zap size={18} /> Back to AI Hub
                    </button>
                </div>

                <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
                    <div className="p-8 border-b border-slate-200 bg-slate-50 flex justify-between items-center">
                        <div className="flex items-center gap-4">
                            <div className="w-16 h-16 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold text-2xl shadow-lg">
                                {user?.plan.charAt(0) || 'S'}
                            </div>
                            <div>
                                <h3 className="text-xl font-bold text-slate-900">{user?.plan || 'STARTER'} PLAN</h3>
                                <p className="text-slate-500 text-sm">Next billing date: <strong>Nov 24, 2023</strong></p>
                            </div>
                        </div>
                        <div className="text-right">
                            <div className="text-2xl font-bold text-slate-900">$149.00</div>
                            <div className="text-slate-500 text-sm">/ month</div>
                        </div>
                    </div>

                    <div className="p-8 grid grid-cols-1 md:grid-cols-3 gap-8">
                        <div>
                            <h4 className="font-bold text-slate-700 mb-4 flex items-center gap-2"><Activity size={18}/> Usage Limits</h4>
                            <div className="space-y-4">
                                <div>
                                    <div className="flex justify-between text-sm mb-1">
                                        <span className="text-slate-600">Signals Processed</span>
                                        <span className="font-bold text-indigo-600">854 / ∞</span>
                                    </div>
                                    <div className="w-full bg-slate-100 rounded-full h-2">
                                        <div className="bg-indigo-500 h-2 rounded-full" style={{ width: '15%' }}></div>
                                    </div>
                                </div>
                                <div>
                                    <div className="flex justify-between text-sm mb-1">
                                        <span className="text-slate-600">AI Tokens Generated</span>
                                        <span className="font-bold text-indigo-600">1.2M / 2M</span>
                                    </div>
                                    <div className="w-full bg-slate-100 rounded-full h-2">
                                        <div className="bg-amber-500 h-2 rounded-full" style={{ width: '60%' }}></div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div>
                            <h4 className="font-bold text-slate-700 mb-4 flex items-center gap-2"><CreditCard size={18}/> Payment Method</h4>
                            <div className="bg-slate-50 p-4 rounded-lg border border-slate-200 flex items-center gap-3 mb-3">
                                <div className="bg-white p-1 rounded border border-slate-200">
                                    <div className="w-8 h-5 bg-slate-800 rounded"></div>
                                </div>
                                <div className="flex-1">
                                    <div className="text-sm font-bold text-slate-700">Visa ending in 4242</div>
                                    <div className="text-xs text-slate-500">Expires 12/25</div>
                                </div>
                            </div>
                            <button className="text-sm text-indigo-600 font-medium hover:underline">Update Payment Method</button>
                        </div>

                        <div>
                            <h4 className="font-bold text-slate-700 mb-4">Quick Actions</h4>
                            <div className="space-y-2">
                                <button className="w-full py-2 bg-indigo-600 text-white rounded-lg text-sm font-medium hover:bg-indigo-700 transition-colors">Upgrade to Enterprise</button>
                                <button className="w-full py-2 bg-white border border-slate-200 text-slate-700 rounded-lg text-sm font-medium hover:bg-slate-50 transition-colors">Download Invoices</button>
                                <button className="w-full py-2 bg-white border border-red-200 text-red-600 rounded-lg text-sm font-medium hover:bg-red-50 transition-colors">Cancel Subscription</button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="flex flex-col h-[calc(100vh-8rem)]">
            <div className="flex justify-between items-center mb-6">
                <div>
                    <h2 className="text-2xl font-bold text-slate-800 flex items-center gap-2">
                        <Zap className="text-indigo-500 fill-indigo-500" />
                        AI Intelligence Hub
                    </h2>
                    <p className="text-slate-500 mt-1">Configure and operationalize your AI workforce. Manage credentials, models, and capabilities.</p>
                </div>
                <div className="flex gap-2">
                    <button 
                        onClick={() => setViewMode('billing')}
                        className="flex items-center gap-2 px-5 py-2.5 bg-white border border-amber-200 text-amber-700 rounded-xl text-sm font-medium hover:bg-amber-50 transition-all shadow-sm"
                    >
                        <DollarSign size={18} /> {user?.plan || 'PRO'} Plan Active
                    </button>
                    <button className="flex items-center gap-2 bg-indigo-600 text-white px-5 py-2.5 rounded-xl text-sm font-medium hover:bg-indigo-700 transition-all shadow-sm hover:shadow-md">
                        <Save size={18} /> Save Network Config
                    </button>
                </div>
            </div>

            <div className="flex flex-1 gap-6 min-h-0">
                {/* Sidebar */}
                <div className="w-1/3 bg-white rounded-xl border border-slate-200 flex flex-col overflow-hidden shadow-sm">
                    <div className="p-4 bg-slate-50 border-b border-slate-200">
                        <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider">Active Agents</h3>
                    </div>
                    <div className="flex-1 overflow-y-auto p-2 space-y-2">
                        {configs.map(config => (
                            <div 
                                key={config.id}
                                onClick={() => setSelectedConfigId(config.id)}
                                className={`group flex items-center gap-3 p-3 rounded-lg cursor-pointer transition-all border ${
                                    selectedConfigId === config.id
                                    ? 'bg-indigo-50 border-indigo-200 shadow-sm' 
                                    : 'bg-white border-transparent hover:bg-slate-50 hover:border-slate-200'
                                }`}
                            >
                                <div className={`p-2 rounded-lg ${selectedConfigId === config.id ? 'bg-white shadow-sm' : 'bg-slate-100 group-hover:bg-white'}`}>
                                    <ProviderIcon type={config.type} className="w-5 h-5" />
                                </div>
                                <div className="flex-1 min-w-0">
                                    <div className="font-semibold text-sm text-slate-900 truncate">{config.name}</div>
                                    <div className="text-xs text-slate-500 truncate flex items-center gap-1">
                                        {config.provider} • {config.model}
                                    </div>
                                </div>
                                <div className={`w-2 h-2 rounded-full ${config.active ? 'bg-emerald-500' : 'bg-slate-300'}`} />
                            </div>
                        ))}
                    </div>
                    <div className="p-3 border-t border-slate-200 bg-slate-50 grid grid-cols-2 gap-2">
                        <button onClick={() => handleAddAgent('TEXT')} className="flex items-center justify-center gap-1.5 px-3 py-2 bg-white border border-slate-200 hover:border-indigo-300 text-slate-600 hover:text-indigo-600 rounded-lg text-xs font-medium transition-colors">
                            <Plus size={14} /> Add Text Agent
                        </button>
                        <button onClick={() => handleAddAgent('SEO')} className="flex items-center justify-center gap-1.5 px-3 py-2 bg-white border border-slate-200 hover:border-emerald-300 text-slate-600 hover:text-emerald-600 rounded-lg text-xs font-medium transition-colors">
                            <Plus size={14} /> Add SEO Agent
                        </button>
                    </div>
                </div>

                {/* Main Content */}
                <div className="flex-1 bg-white rounded-xl border border-slate-200 flex flex-col shadow-sm relative overflow-hidden">
                    {activeConfig ? (
                        <>
                            {/* Header */}
                            <div className="p-6 border-b border-slate-100 flex justify-between items-start bg-slate-50/50">
                                <div className="flex items-start gap-4">
                                    <div className="p-3 bg-white rounded-xl border border-slate-200 shadow-sm">
                                        <ProviderIcon type={activeConfig.type} className="w-8 h-8" />
                                    </div>
                                    <div>
                                        <h3 className="text-xl font-bold text-slate-900 flex items-center gap-2">
                                            <input 
                                                value={activeConfig.name}
                                                onChange={(e) => handleUpdate(activeConfig.id, 'name', e.target.value)}
                                                className="bg-transparent border-none focus:ring-0 p-0 focus:bg-white rounded hover:bg-white/50 transition-colors"
                                            />
                                        </h3>
                                        <div className="flex items-center gap-2 mt-1">
                                            <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-slate-200 text-slate-600">
                                                {activeConfig.type} INTELLIGENCE
                                            </span>
                                            {activeConfig.active ? (
                                                <span className="flex items-center gap-1 text-xs text-emerald-600 font-medium bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-100">
                                                    <CheckCircle size={10} /> Active
                                                </span>
                                            ) : (
                                                 <span className="flex items-center gap-1 text-xs text-slate-500 font-medium bg-slate-100 px-2 py-0.5 rounded-full">
                                                    Paused
                                                </span>
                                            )}
                                        </div>
                                    </div>
                                </div>
                                <div className="flex items-center gap-2">
                                    <button 
                                        onClick={() => toggleActive(activeConfig.id)}
                                        className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors ${activeConfig.active ? 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-50' : 'bg-emerald-600 text-white hover:bg-emerald-700'}`}
                                    >
                                        {activeConfig.active ? 'Pause Agent' : 'Activate Agent'}
                                    </button>
                                    <button 
                                        onClick={() => handleDelete(activeConfig.id)}
                                        className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                                        title="Delete Agent"
                                    >
                                        <Trash2 size={18} />
                                    </button>
                                </div>
                            </div>

                            {/* Config Body */}
                            <div className="p-6 space-y-8 overflow-y-auto">
                                
                                {/* Provider & Key Section */}
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div>
                                        <label className="block text-sm font-semibold text-slate-700 mb-2">Service Provider</label>
                                        <select 
                                            value={activeConfig.provider}
                                            onChange={(e) => handleUpdate(activeConfig.id, 'provider', e.target.value)}
                                            className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition-all"
                                        >
                                            {Object.keys(MODEL_REGISTRY).map(p => <option key={p} value={p}>{p}</option>)}
                                        </select>
                                        <p className="mt-2 text-xs text-slate-500">
                                            Select the foundational model provider for this agent.
                                        </p>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-semibold text-slate-700 mb-2 flex justify-between">
                                            <span>API Secret Key</span>
                                            <a 
                                                href={PROVIDER_URLS[activeConfig.provider]} 
                                                target="_blank" 
                                                rel="noopener noreferrer"
                                                className="text-xs text-indigo-600 hover:text-indigo-700 flex items-center gap-1 font-normal"
                                            >
                                                Get API Key <ExternalLink size={10} />
                                            </a>
                                        </label>
                                        <div className="relative group">
                                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                                <Key className={`h-4 w-4 ${!activeConfig.apiKey ? 'text-red-400' : 'text-slate-400'}`} />
                                            </div>
                                            <input 
                                                type="password"
                                                value={activeConfig.apiKey}
                                                onChange={(e) => handleUpdate(activeConfig.id, 'apiKey', e.target.value)}
                                                onBlur={() => handleFetchModels(activeConfig.id, activeConfig.provider)}
                                                className={`w-full pl-10 pr-4 py-2.5 bg-white border rounded-xl text-sm focus:ring-2 outline-none transition-all font-mono ${!activeConfig.apiKey ? 'border-red-200 focus:border-red-500 focus:ring-red-200' : 'border-slate-200 focus:border-indigo-500 focus:ring-indigo-500/20'}`}
                                                placeholder={`sk-... (Enter ${activeConfig.provider} Key)`}
                                            />
                                            {!activeConfig.apiKey && (
                                                <div className="absolute right-3 top-2.5 text-xs text-red-500 font-medium flex items-center gap-1 animate-pulse">
                                                    <AlertCircle size={12} /> Required
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>

                                {/* Connection Test & Auto-Fetch */}
                                <div className="flex items-center gap-4 bg-slate-50 p-4 rounded-xl border border-slate-200">
                                    <button 
                                        onClick={() => handleTestConnection(activeConfig)}
                                        disabled={!activeConfig.apiKey || testResults[activeConfig.id]?.status === 'loading'}
                                        className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 text-slate-700 text-sm font-medium rounded-lg hover:border-indigo-300 hover:text-indigo-600 disabled:opacity-50 transition-all shadow-sm"
                                    >
                                        {testResults[activeConfig.id]?.status === 'loading' ? <Loader2 className="animate-spin w-4 h-4"/> : <Zap className="w-4 h-4"/>}
                                        Test Connection
                                    </button>

                                    <div className="h-6 w-px bg-slate-300 mx-2"></div>

                                    <div className="flex-1 flex items-center justify-between">
                                        <div className="flex items-center gap-2">
                                            {testResults[activeConfig.id]?.status === 'success' ? (
                                                <span className="text-sm text-emerald-600 flex items-center gap-1.5 font-medium animate-in fade-in">
                                                    <CheckCircle size={16}/> Verified & Synced
                                                </span>
                                            ) : testResults[activeConfig.id]?.status === 'error' ? (
                                                <span className="text-sm text-red-600 flex items-center gap-1.5 font-medium animate-in fade-in">
                                                    <AlertCircle size={16}/> {testResults[activeConfig.id]?.message}
                                                </span>
                                            ) : (
                                                <span className="text-sm text-slate-400 italic">Enter key to verify and fetch models...</span>
                                            )}
                                        </div>
                                        
                                        {activeConfig.apiKey && (
                                            <span className="text-xs text-slate-400 flex items-center gap-1">
                                                {fetchingModels === activeConfig.id ? (
                                                    <><Loader2 size={12} className="animate-spin"/> Syncing Models...</>
                                                ) : (
                                                    <><RefreshCw size={12}/> Auto-Synced</>
                                                )}
                                            </span>
                                        )}
                                    </div>
                                </div>

                                {/* Model Selection (Smart) */}
                                <div>
                                    <label className="block text-sm font-semibold text-slate-700 mb-4 flex items-center gap-2">
                                        Selected Model
                                        <div className="group relative">
                                            <Info size={14} className="text-slate-400 cursor-help" />
                                            <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-64 p-2 bg-slate-800 text-white text-xs rounded-lg opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-10">
                                                Models determine the cost, speed, and intelligence of the agent. Check tags for guidance.
                                            </div>
                                        </div>
                                    </label>

                                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                        {MODEL_REGISTRY[activeConfig.provider]?.map((model) => (
                                            <div 
                                                key={model.id}
                                                onClick={() => handleUpdate(activeConfig.id, 'model', model.id)}
                                                className={`relative p-4 rounded-xl border-2 cursor-pointer transition-all ${
                                                    activeConfig.model === model.id 
                                                    ? 'border-indigo-600 bg-indigo-50/50' 
                                                    : 'border-slate-200 hover:border-indigo-300 bg-white hover:shadow-md'
                                                }`}
                                            >
                                                {activeConfig.model === model.id && (
                                                    <div className="absolute -top-3 -right-3 bg-indigo-600 text-white p-1 rounded-full shadow-sm">
                                                        <CheckCircle size={14} />
                                                    </div>
                                                )}
                                                
                                                <div className="flex justify-between items-start mb-2">
                                                    <h4 className={`font-bold text-sm ${activeConfig.model === model.id ? 'text-indigo-900' : 'text-slate-700'}`}>{model.name}</h4>
                                                    {model.isFree ? (
                                                        <span className="bg-emerald-100 text-emerald-700 text-[10px] font-bold px-2 py-0.5 rounded-full border border-emerald-200">FREE</span>
                                                    ) : (
                                                        <span className="text-slate-400 text-[10px] flex items-center"><DollarSign size={10} />{model.cost}</span>
                                                    )}
                                                </div>
                                                
                                                <p className="text-xs text-slate-500 mb-3 leading-relaxed">{model.description}</p>
                                                
                                                <div className="flex flex-wrap gap-1">
                                                    {model.tags.map(tag => (
                                                        <span key={tag} className="text-[10px] font-medium px-1.5 py-0.5 bg-slate-100 text-slate-500 rounded border border-slate-200">
                                                            {tag}
                                                        </span>
                                                    ))}
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </>
                    ) : (
                        <div className="flex-1 flex flex-col items-center justify-center text-slate-400">
                            <Layers size={48} className="mb-4 opacity-20" />
                            <p className="text-sm">Select an agent to configure or create a new one.</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};