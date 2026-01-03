
import React from 'react';
import { Hexagon, Zap, Globe, CheckCircle, ArrowRight, Shield, Activity, BarChart2 } from 'lucide-react';

interface LandingPageProps {
  onLogin: () => void;
}

const FeatureCard = ({ icon: Icon, title, description }: any) => (
  <div className="bg-white/5 border border-white/10 p-6 rounded-2xl hover:bg-white/10 transition-colors">
    <div className="w-12 h-12 bg-indigo-500/20 rounded-xl flex items-center justify-center mb-4">
      <Icon className="text-indigo-400 w-6 h-6" />
    </div>
    <h3 className="text-xl font-bold text-white mb-2">{title}</h3>
    <p className="text-slate-400 leading-relaxed">{description}</p>
  </div>
);

const PricingCard = ({ title, price, features, recommended, onSelect }: any) => (
  <div className={`relative p-8 rounded-2xl border ${recommended ? 'bg-indigo-600 border-indigo-500 shadow-2xl shadow-indigo-900/50 scale-105 z-10' : 'bg-slate-900 border-slate-800'} flex flex-col`}>
    {recommended && (
      <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-gradient-to-r from-pink-500 to-indigo-500 text-white text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider">
        Most Popular
      </div>
    )}
    <h3 className={`text-lg font-bold ${recommended ? 'text-white' : 'text-slate-200'}`}>{title}</h3>
    <div className="mt-4 mb-6">
      <span className="text-4xl font-bold text-white">${price}</span>
      <span className={`text-sm ${recommended ? 'text-indigo-200' : 'text-slate-500'}`}>/month</span>
    </div>
    <ul className="space-y-4 mb-8 flex-1">
      {features.map((feature: string, idx: number) => (
        <li key={idx} className="flex items-start gap-3">
          <CheckCircle className={`w-5 h-5 flex-shrink-0 ${recommended ? 'text-indigo-200' : 'text-indigo-500'}`} />
          <span className={`text-sm ${recommended ? 'text-white' : 'text-slate-400'}`}>{feature}</span>
        </li>
      ))}
    </ul>
    <button 
      onClick={onSelect}
      className={`w-full py-3 rounded-xl font-bold transition-all ${
        recommended 
        ? 'bg-white text-indigo-600 hover:bg-indigo-50' 
        : 'bg-indigo-600 text-white hover:bg-indigo-700'
      }`}
    >
      Start Free Trial
    </button>
  </div>
);

export const LandingPage: React.FC<LandingPageProps> = ({ onLogin }) => {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans selection:bg-indigo-500/30">
      {/* Navbar */}
      <nav className="border-b border-white/5 backdrop-blur-md sticky top-0 z-50 bg-slate-950/80">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center shadow-lg shadow-indigo-500/20">
              <Hexagon className="text-white w-6 h-6" fill="currentColor" />
            </div>
            <span className="font-bold text-xl tracking-tight">Nexus SaaS</span>
          </div>
          <div className="hidden md:flex gap-8 text-sm font-medium text-slate-400">
            <a href="#features" className="hover:text-white transition-colors">Features</a>
            <a href="#pricing" className="hover:text-white transition-colors">Pricing</a>
            <a href="#enterprise" className="hover:text-white transition-colors">Enterprise</a>
          </div>
          <div className="flex gap-4">
            <button onClick={onLogin} className="text-sm font-medium text-slate-300 hover:text-white transition-colors">Log In</button>
            <button onClick={onLogin} className="bg-white text-slate-950 px-5 py-2.5 rounded-full text-sm font-bold hover:bg-indigo-50 transition-colors">
              Get Started
            </button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative pt-24 pb-32 overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[600px] bg-indigo-600/20 rounded-full blur-[120px] -z-10 pointer-events-none"></div>
        
        <div className="max-w-7xl mx-auto px-6 text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-300 text-xs font-bold uppercase tracking-wider mb-8 animate-in fade-in slide-in-from-bottom-4">
            <Zap size={12} fill="currentColor" /> v2.1 Now Available
          </div>
          <h1 className="text-5xl md:text-7xl font-bold tracking-tight mb-8 leading-tight animate-in fade-in slide-in-from-bottom-6 duration-700">
            Automate your Newsroom.<br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-purple-400">Dominate the Feed.</span>
          </h1>
          <p className="text-xl text-slate-400 max-w-2xl mx-auto mb-12 leading-relaxed animate-in fade-in slide-in-from-bottom-8 duration-1000">
            The world's first Autonomous Operating System for publishers. Detect signals, generate content with AI, and syndicate globally in seconds.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center animate-in fade-in slide-in-from-bottom-10 duration-1000">
            <button onClick={onLogin} className="px-8 py-4 bg-indigo-600 text-white rounded-full text-lg font-bold hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-900/40 flex items-center justify-center gap-2">
              Start Your Free Trial <ArrowRight size={20} />
            </button>
            <button className="px-8 py-4 bg-white/5 border border-white/10 text-white rounded-full text-lg font-bold hover:bg-white/10 transition-all">
              Watch Demo
            </button>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section id="features" className="py-24 bg-slate-900/50 border-y border-white/5">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold mb-4">Why Top Publishers Choose Nexus</h2>
            <p className="text-slate-400">Built for speed, engineered for scale.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <FeatureCard 
              icon={Activity}
              title="AI Signal Detection"
              description="Monitor Reddit, Google Trends, and TikTok in real-time. Detect viral stories before they break."
            />
            <FeatureCard 
              icon={Globe}
              title="Omni-Channel Sync"
              description="Write once, publish everywhere. Auto-format for WP, LinkedIn, X, and Instagram Stories."
            />
            <FeatureCard 
              icon={BarChart2}
              title="SEO Dominance"
              description="Built-in competitor analysis and keyword optimization ensures you rank #1 on SERPs."
            />
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="py-24">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold mb-4">Simple, Transparent Pricing</h2>
            <p className="text-slate-400">Scale your newsroom without breaking the bank.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto items-center">
            <PricingCard 
              title="Starter"
              price="49"
              features={[
                "3 Active Signals",
                "1 AI Agent (Gemini Flash)",
                "WordPress Integration",
                "Community Support"
              ]}
              onSelect={onLogin}
            />
            <PricingCard 
              title="Pro Newsroom"
              price="149"
              recommended={true}
              features={[
                "Unlimited Signals",
                "5 AI Agents (GPT-4 / Claude)",
                "Social Syndication Module",
                "SEO Competitor Spy",
                "Priority Support"
              ]}
              onSelect={onLogin}
            />
            <PricingCard 
              title="Enterprise"
              price="499"
              features={[
                "Custom AI Models",
                "Dedicated Server Instance",
                "Video Studio Module",
                "SLA Guarantee",
                "API Access"
              ]}
              onSelect={onLogin}
            />
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 border-t border-white/5 bg-slate-950">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex items-center gap-2">
            <Hexagon className="text-indigo-600 w-6 h-6" fill="currentColor" />
            <span className="font-bold text-lg">Nexus SaaS</span>
          </div>
          <div className="text-slate-500 text-sm">
            © 2024 Nexus Operating Systems Inc. All rights reserved.
          </div>
          <div className="flex gap-6">
            <a href="#" className="text-slate-500 hover:text-white transition-colors">Privacy</a>
            <a href="#" className="text-slate-500 hover:text-white transition-colors">Terms</a>
            <a href="#" className="text-slate-500 hover:text-white transition-colors">Twitter</a>
          </div>
        </div>
      </footer>
    </div>
  );
};
