import React, { useState } from 'react';
import { Article, ContentStatus } from '../types';
import { FileText, Eye, Edit3, Globe, X, Search, LayoutTemplate, Save } from 'lucide-react';

const StatusBadge = ({ status }: { status: ContentStatus }) => {
  const styles = {
    [ContentStatus.PUBLISHED]: 'bg-emerald-100 text-emerald-700',
    [ContentStatus.DRAFT]: 'bg-slate-100 text-slate-700',
    [ContentStatus.REVIEW]: 'bg-amber-100 text-amber-700',
    [ContentStatus.ARCHIVED]: 'bg-slate-100 text-slate-400',
  };

  return (
    <span className={`px-2 py-1 rounded text-xs font-semibold ${styles[status]}`}>
      {status}
    </span>
  );
};

interface ArticleEditorProps {
    article: Article;
    onClose: () => void;
    onSave: (article: Article) => void;
}

const ArticleEditor = ({ article, onClose, onSave }: ArticleEditorProps) => {
    const [formData, setFormData] = useState<Article>({
        ...article,
        metaTitle: article.metaTitle || article.title,
        focusKeyword: article.focusKeyword || '',
    });

    const handleChange = (field: keyof Article, value: any) => {
        setFormData(prev => ({ ...prev, [field]: value }));
    };

    const handleSave = (status: ContentStatus) => {
        onSave({ ...formData, status });
        onClose();
    };

    return (
        <div className="fixed inset-0 bg-slate-900/50 flex items-center justify-center z-50 p-6">
            <div className="bg-white rounded-xl shadow-xl w-full max-w-7xl h-[90vh] flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-200">
                {/* Header */}
                <div className="flex justify-between items-center p-4 border-b border-slate-100 bg-slate-50">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-indigo-100 rounded text-indigo-700">
                            <Edit3 size={18} />
                        </div>
                        <div>
                            <input 
                                className="font-bold text-slate-800 text-lg bg-transparent border-none focus:ring-0 p-0 placeholder-slate-400 w-full"
                                value={formData.title}
                                onChange={(e) => handleChange('title', e.target.value)}
                            />
                            <div className="flex items-center gap-1 text-xs text-slate-500 font-mono">
                                <span>/</span>
                                <input 
                                    className="bg-transparent border-none focus:ring-0 p-0 text-slate-500 w-64"
                                    value={formData.slug}
                                    onChange={(e) => handleChange('slug', e.target.value)}
                                />
                            </div>
                        </div>
                    </div>
                    <div className="flex gap-2">
                        <button 
                            onClick={() => handleSave(ContentStatus.DRAFT)}
                            className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-200 rounded-lg transition-colors"
                        >
                            <Save size={16} /> Save Draft
                        </button>
                        <button onClick={onClose} className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-200 rounded-lg transition-colors">
                            <X size={20} />
                        </button>
                    </div>
                </div>

                {/* Main Content Area */}
                <div className="flex-1 flex flex-col min-h-0">
                    {/* SEO Settings Panel */}
                    <div className="bg-white border-b border-slate-200 p-4">
                        <div className="flex items-center gap-2 mb-3 text-xs font-bold text-slate-500 uppercase tracking-wide">
                            <Search size={14} /> SEO Metadata
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                             <div>
                                <label className="block text-xs font-medium text-slate-700 mb-1">Meta Title</label>
                                <input 
                                    type="text"
                                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                    placeholder="SEO Optimized Title"
                                    value={formData.metaTitle}
                                    onChange={(e) => handleChange('metaTitle', e.target.value)}
                                />
                                <div className="flex justify-end mt-1">
                                    <span className={`text-[10px] ${(formData.metaTitle?.length || 0) > 60 ? 'text-red-500' : 'text-slate-400'}`}>
                                        {(formData.metaTitle?.length || 0)}/60
                                    </span>
                                </div>
                             </div>
                             <div>
                                <label className="block text-xs font-medium text-slate-700 mb-1">Focus Keyword</label>
                                <input 
                                    type="text"
                                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                    placeholder="Main keyword phrase"
                                    value={formData.focusKeyword}
                                    onChange={(e) => handleChange('focusKeyword', e.target.value)}
                                />
                             </div>
                             <div>
                                <label className="block text-xs font-medium text-slate-700 mb-1">Meta Description</label>
                                <input 
                                    type="text"
                                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                    placeholder="Description for search results"
                                    value={formData.excerpt}
                                    onChange={(e) => handleChange('excerpt', e.target.value)}
                                />
                                <div className="flex justify-end mt-1">
                                    <span className={`text-[10px] ${(formData.excerpt?.length || 0) > 160 ? 'text-red-500' : 'text-slate-400'}`}>
                                        {(formData.excerpt?.length || 0)}/160
                                    </span>
                                </div>
                             </div>
                        </div>
                    </div>

                    {/* Split Editor */}
                    <div className="flex-1 flex overflow-hidden">
                        {/* Markdown Source */}
                        <div className="w-1/2 flex flex-col border-r border-slate-200 bg-slate-50">
                            <div className="px-4 py-2 border-b border-slate-200 flex justify-between items-center bg-white">
                                <span className="text-xs font-semibold text-slate-500 flex items-center gap-1">
                                    <FileText size={12} /> MARKDOWN
                                </span>
                            </div>
                            <textarea 
                                className="flex-1 w-full p-4 resize-none focus:outline-none font-mono text-sm bg-slate-50 text-slate-800 leading-relaxed"
                                value={formData.content}
                                onChange={(e) => handleChange('content', e.target.value)}
                                spellCheck={false}
                            />
                        </div>

                        {/* Live Preview */}
                        <div className="w-1/2 flex flex-col bg-white">
                             <div className="px-4 py-2 border-b border-slate-200 flex justify-between items-center bg-slate-50/50">
                                <span className="text-xs font-semibold text-slate-500 flex items-center gap-1">
                                    <Eye size={12} /> PREVIEW
                                </span>
                            </div>
                            <div className="flex-1 overflow-y-auto p-8 prose prose-slate max-w-none">
                                <h1 className="text-3xl font-bold text-slate-900 mb-4">{formData.title}</h1>
                                {formData.content?.split('\n').map((line, i) => {
                                    if (line.startsWith('## ')) return <h2 key={i} className="text-xl font-bold mt-6 mb-3 text-slate-800">{line.replace('## ', '')}</h2>;
                                    if (line.startsWith('### ')) return <h3 key={i} className="text-lg font-bold mt-4 mb-2 text-slate-800">{line.replace('### ', '')}</h3>;
                                    if (line.startsWith('- ')) return <li key={i} className="ml-4 list-disc text-slate-600">{line.replace('- ', '')}</li>;
                                    if (line.trim() === '') return <br key={i}/>;
                                    return <p key={i} className="mb-2 text-slate-600 leading-relaxed">{line}</p>;
                                })}
                            </div>
                        </div>
                    </div>
                </div>

                <div className="p-4 border-t border-slate-100 bg-white flex justify-between items-center">
                    <div className="text-xs text-slate-500">
                        {formData.content?.length} chars • {formData.content?.split(/\s+/).length} words
                    </div>
                    <div className="flex gap-3">
                        <button onClick={onClose} className="px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-100 rounded-lg">Cancel</button>
                        <button 
                            onClick={() => handleSave(ContentStatus.PUBLISHED)}
                            className="px-4 py-2 text-sm font-medium text-white bg-emerald-600 hover:bg-emerald-700 rounded-lg shadow-sm shadow-emerald-200"
                        >
                            Publish Now
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

const ArticleRow = ({ article, onEdit }: { article: Article, onEdit: (a: Article) => void }) => (
  <tr className="border-b border-slate-100 hover:bg-slate-50 transition-colors group">
    <td className="p-4">
      <div className="flex items-center gap-3">
        <div className="p-2 bg-indigo-50 rounded text-indigo-600 group-hover:bg-indigo-100 transition-colors">
          <FileText size={20} />
        </div>
        <div>
          <div className="font-medium text-slate-900 hover:text-indigo-600 cursor-pointer" onClick={() => onEdit(article)}>{article.title}</div>
          <div className="text-xs text-slate-500 font-mono mt-0.5">ID: {article.id} • Signal: {article.signalId}</div>
        </div>
      </div>
    </td>
    <td className="p-4">
        <div className="flex items-center gap-1">
            <Globe size={14} className="text-slate-400"/>
            <span className="text-sm font-medium text-slate-700">{article.language}</span>
        </div>
    </td>
    <td className="p-4">
      <StatusBadge status={article.status} />
    </td>
    <td className="p-4 text-sm text-slate-600">
      <div className="flex items-center gap-2">
        <Eye size={14} />
        {article.views.toLocaleString()}
      </div>
    </td>
    <td className="p-4 text-sm text-slate-500">
      {article.publishDate ? new Date(article.publishDate).toLocaleDateString() : '-'}
    </td>
    <td className="p-4 text-right">
      <button 
        onClick={() => onEdit(article)}
        className="text-slate-400 hover:text-indigo-600 transition-colors p-2 hover:bg-indigo-50 rounded-full"
      >
        <Edit3 size={18} />
      </button>
    </td>
  </tr>
);

export const ContentManager: React.FC<{ articles: Article[], onUpdateArticle: (a: Article) => void }> = ({ articles, onUpdateArticle }) => {
  const [editingArticle, setEditingArticle] = useState<Article | null>(null);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-slate-800">Content Management</h2>
          <p className="text-slate-500 mt-1">Review drafts, manage translations, and monitor publishing.</p>
        </div>
        <button className="bg-indigo-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-indigo-700 transition-colors">
          + New Manual Entry
        </button>
      </div>

      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="border-b border-slate-200 bg-slate-50 px-6 py-3 flex gap-4">
             <button className="text-sm font-medium text-indigo-600 border-b-2 border-indigo-600 pb-2.5 -mb-3.5">All Content</button>
             <button className="text-sm font-medium text-slate-500 hover:text-slate-700 pb-2.5 -mb-3.5">Drafts ({articles.filter(a => a.status === ContentStatus.DRAFT).length})</button>
             <button className="text-sm font-medium text-slate-500 hover:text-slate-700 pb-2.5 -mb-3.5">Published</button>
        </div>
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-50 text-slate-500 text-xs uppercase tracking-wider font-semibold border-b border-slate-200">
              <th className="p-4">Title</th>
              <th className="p-4">Lang</th>
              <th className="p-4">Status</th>
              <th className="p-4">Performance</th>
              <th className="p-4">Date</th>
              <th className="p-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {articles.map(article => (
              <ArticleRow key={article.id} article={article} onEdit={setEditingArticle} />
            ))}
          </tbody>
        </table>
      </div>

      {editingArticle && (
          <ArticleEditor 
            article={editingArticle} 
            onClose={() => setEditingArticle(null)} 
            onSave={onUpdateArticle}
          />
      )}
    </div>
  );
};