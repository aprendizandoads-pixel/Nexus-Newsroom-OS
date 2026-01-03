import React from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, Cell } from 'recharts';
import { Activity, Zap, FileText, Globe, Star } from 'lucide-react';

const data = [
  { name: '00:00', signals: 12, published: 2 },
  { name: '04:00', signals: 18, published: 3 },
  { name: '08:00', signals: 45, published: 8 },
  { name: '12:00', signals: 62, published: 12 },
  { name: '16:00', signals: 55, published: 10 },
  { name: '20:00', signals: 30, published: 5 },
  { name: '23:59', signals: 20, published: 3 },
];

const sourceData = [
  { name: 'Google Trends', value: 40, color: '#3b82f6' },
  { name: 'Reddit', value: 30, color: '#f97316' },
  { name: 'NewsAPI', value: 20, color: '#22c55e' },
  { name: 'arXiv', value: 10, color: '#a855f7' },
];

const StatCard = ({ title, value, subtext, icon: Icon, trend }: any) => (
  <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
    <div className="flex justify-between items-start">
      <div>
        <p className="text-sm font-medium text-slate-500">{title}</p>
        <h3 className="text-2xl font-bold text-slate-900 mt-2">{value}</h3>
      </div>
      <div className="p-2 bg-indigo-50 rounded-lg">
        <Icon className="w-5 h-5 text-indigo-600" />
      </div>
    </div>
    <div className="mt-4 flex items-center">
      <span className={`text-sm font-medium ${trend === 'up' ? 'text-emerald-600' : 'text-slate-600'}`}>
        {subtext}
      </span>
    </div>
  </div>
);

export const Dashboard: React.FC = () => {
  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-slate-800">Mission Control</h2>
        <div className="flex items-center gap-2 text-sm text-slate-500">
          <span className="relative flex h-3 w-3">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500"></span>
          </span>
          System Operational
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard title="Active Signals" value="1,284" subtext="+12% from yesterday" icon={Activity} trend="up" />
        <StatCard title="High Potential" value="12" subtext="Score > 80 (Publish Now)" icon={Star} trend="up" />
        <StatCard title="Published Content" value="892" subtext="Total Archive" icon={FileText} />
        <StatCard title="Global Reach" value="45k" subtext="Daily Views" icon={Globe} trend="up" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-96">
        <div className="lg:col-span-2 bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
          <h3 className="text-lg font-semibold text-slate-800 mb-4">Signal vs. Publishing Volume</h3>
          <ResponsiveContainer width="100%" height="100%" maxHeight={300}>
            <AreaChart data={data}>
              <defs>
                <linearGradient id="colorSignals" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#6366f1" stopOpacity={0.1}/>
                  <stop offset="95%" stopColor="#6366f1" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
              <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#64748b'}} />
              <YAxis axisLine={false} tickLine={false} tick={{fill: '#64748b'}} />
              <Tooltip 
                contentStyle={{ backgroundColor: '#fff', borderRadius: '8px', border: '1px solid #e2e8f0' }}
                itemStyle={{ color: '#1e293b' }}
              />
              <Area type="monotone" dataKey="signals" stroke="#6366f1" strokeWidth={2} fillOpacity={1} fill="url(#colorSignals)" />
              <Area type="monotone" dataKey="published" stroke="#10b981" strokeWidth={2} fill="none" />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
          <h3 className="text-lg font-semibold text-slate-800 mb-4">Source Distribution</h3>
          <ResponsiveContainer width="100%" height="100%" maxHeight={300}>
            <BarChart data={sourceData} layout="vertical">
              <CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={false} stroke="#e2e8f0" />
              <XAxis type="number" hide />
              <YAxis dataKey="name" type="category" width={100} tick={{fontSize: 12, fill: '#64748b'}} />
              <Tooltip cursor={{fill: 'transparent'}} />
              <Bar dataKey="value" radius={[0, 4, 4, 0]} barSize={20}>
                {sourceData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};