
import React, { useState } from 'react';
import { Dashboard } from './components/Dashboard';
import { SignalFeed } from './components/SignalFeed';
import { ContentManager } from './components/ContentManager';
import { ModuleManager } from './components/ModuleManager';
import { SettingsManager } from './components/SettingsManager';
import { LandingPage } from './components/LandingPage';
import { LayoutDashboard, Radio, FileText, Settings, Bell, Search, Hexagon, Sliders, LogOut } from 'lucide-react';
import { MOCK_ARTICLES } from './constants';
import { Article, ContentStatus, UserProfile } from './types';

// Define view states
type ViewState = 'dashboard' | 'signals' | 'content' | 'modules' | 'settings';

const SidebarItem = ({ 
  icon: Icon, 
  label, 
  active, 
  onClick 
}: { 
  icon: any, 
  label: string, 
  active: boolean, 
  onClick: () => void 
}) => (
  <button 
    onClick={onClick}
    className={`w-full flex items-center gap-3 px-4 py-3 text-sm font-medium transition-colors rounded-lg ${
      active 
        ? 'bg-indigo-50 text-indigo-700' 
        : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
    }`}
  >
    <Icon className={`w-5 h-5 ${active ? 'text-indigo-600' : 'text-slate-400'}`} />
    {label}
  </button>
);

const App: React.FC = () => {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [currentView, setCurrentView] = useState<ViewState>('dashboard');
  const [articles, setArticles] = useState<Article[]>(MOCK_ARTICLES);
  const [searchQuery, setSearchQuery] = useState('');

  // Simulating Login
  const handleLogin = () => {
      setUser({
          name: "Demo User",
          email: "demo@nexus-saas.com",
          plan: "PRO"
      });
  };

  const handleLogout = () => {
      setUser(null);
      setCurrentView('dashboard');
  };

  const handleArticleGenerated = (draft: Partial<Article>) => {
      const newArticle: Article = {
          id: `gen-${Date.now()}`,
          title: draft.title || 'Untitled Draft',
          slug: draft.slug || '',
          language: draft.language || 'EN',
          type: draft.type as any,
          status: ContentStatus.DRAFT,
          views: 0,
          signalId: draft.signalId || '',
          content: draft.content || '',
          excerpt: draft.excerpt || '',
          tags: draft.tags || [],
          publishDate: new Date().toISOString()
      };
      setArticles([newArticle, ...articles]);
  };

  const handleUpdateArticle = (updatedArticle: Article) => {
    setArticles(prevArticles => 
      prevArticles.map(a => a.id === updatedArticle.id ? updatedArticle : a)
    );
  };

  // --- Render SaaS Landing Page if not logged in ---
  if (!user) {
      return <LandingPage onLogin={handleLogin} />;
  }

  // --- Render Application if logged in ---
  return (
    <div className="flex h-screen bg-slate-50 overflow-hidden font-sans">
      {/* Sidebar */}
      <aside className="w-64 bg-white border-r border-slate-200 flex flex-col h-full z-10">
        <div className="p-6 flex items-center gap-3">
          <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center shadow-lg shadow-indigo-200">
            <Hexagon className="text-white w-5 h-5" fill="currentColor" />
          </div>
          <span className="font-bold text-lg text-slate-800 tracking-tight">Nexus SaaS</span>
        </div>

        <div className="px-6 mb-6">
            <div className="p-3 bg-slate-50 rounded-xl border border-slate-100 flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-700 font-bold text-sm">
                    {user.name.charAt(0)}
                </div>
                <div className="overflow-hidden">
                    <p className="text-sm font-bold text-slate-900 truncate">{user.name}</p>
                    <p className="text-[10px] text-slate-500 font-medium bg-slate-200 inline-block px-1.5 rounded">{user.plan} PLAN</p>
                </div>
            </div>
        </div>

        <nav className="flex-1 px-3 space-y-1">
          <SidebarItem 
            icon={LayoutDashboard} 
            label="Dashboard" 
            active={currentView === 'dashboard'} 
            onClick={() => setCurrentView('dashboard')} 
          />
          <SidebarItem 
            icon={Radio} 
            label="Signal Pipeline" 
            active={currentView === 'signals'} 
            onClick={() => setCurrentView('signals')} 
          />
          <SidebarItem 
            icon={FileText} 
            label="Content CMS" 
            active={currentView === 'content'} 
            onClick={() => setCurrentView('content')} 
          />
          <SidebarItem 
            icon={Settings} 
            label="Modules & Store" 
            active={currentView === 'modules'} 
            onClick={() => setCurrentView('modules')} 
          />
          <SidebarItem 
            icon={Sliders} 
            label="AI Hub & Billing" 
            active={currentView === 'settings'} 
            onClick={() => setCurrentView('settings')} 
          />
        </nav>

        <div className="p-4 border-t border-slate-200">
          <button 
            onClick={handleLogout}
            className="flex items-center gap-2 text-sm font-medium text-slate-500 hover:text-red-600 transition-colors w-full px-2"
          >
            <LogOut size={16} /> Sign Out
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Header */}
        <header className="bg-white border-b border-slate-200 h-16 flex items-center justify-between px-8 shadow-sm z-20">
            <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-x-1/2 text-slate-400 w-4 h-4" />
                <input 
                    type="text" 
                    placeholder="Search signals, trends, or settings..." 
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm w-64 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 focus:outline-none transition-all focus:w-80"
                />
            </div>
            <div className="flex items-center gap-4">
                <button className="relative p-2 text-slate-400 hover:text-indigo-600 transition-colors">
                    <Bell className="w-5 h-5" />
                    <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>
                </button>
            </div>
        </header>

        {/* Scrollable Content Area */}
        <div className="flex-1 overflow-auto p-8">
            <div className="max-w-7xl mx-auto">
                {currentView === 'dashboard' && <Dashboard />}
                {currentView === 'signals' && <SignalFeed onArticleGenerated={handleArticleGenerated} globalSearch={searchQuery} />}
                {currentView === 'content' && <ContentManager articles={articles} onUpdateArticle={handleUpdateArticle} />}
                {currentView === 'modules' && <ModuleManager />}
                {currentView === 'settings' && <SettingsManager user={user} />}
            </div>
        </div>
      </main>
    </div>
  );
};

export default App;
