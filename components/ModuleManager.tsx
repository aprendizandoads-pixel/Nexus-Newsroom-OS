import React, { useState, useEffect } from 'react';
import { MOCK_MODULES } from '../constants';
import { SystemModule } from '../types';
import { Box, CheckCircle, XCircle, AlertTriangle, Shield, Upload, Settings, Terminal, FileCode, Loader2, X, Play, Square, FileText, Database, HardDrive, Hammer, Check, Link as LinkIcon, Lock, User, Info, ExternalLink } from 'lucide-react';

const TypeBadge = ({ type }: { type: string }) => {
    const styles = {
        'worker-only': 'bg-blue-100 text-blue-700 border-blue-200',
        'declarative': 'bg-purple-100 text-purple-700 border-purple-200',
        'full': 'bg-emerald-100 text-emerald-700 border-emerald-200'
    };
    
    const icon = {
        'worker-only': <Terminal size={10} className="mr-1" />,
        'declarative': <FileCode size={10} className="mr-1" />,
        'full': <Box size={10} className="mr-1" />
    };

    return (
        <span className={`flex items-center px-1.5 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider border ${styles[type as keyof typeof styles] || 'bg-slate-100'}`}>
            {icon[type as keyof typeof styles]}
            {type}
        </span>
    );
};

const ModuleCard = ({ module, onConfigure, onToggle, onAnalyze }: { module: SystemModule, onConfigure: (m: SystemModule) => void, onToggle: (id: string) => void, onAnalyze: (m: SystemModule) => void }) => {
  const isWP = module.manifest.name === 'wordpress-core-integrator';

  return (
    <div className="bg-white rounded-xl border border-slate-200 p-6 flex flex-col justify-between h-full hover:border-indigo-300 transition-colors group relative">
      <div>
        <div className="flex justify-between items-start mb-4">
          <div className="p-3 bg-indigo-50 rounded-lg group-hover:bg-indigo-100 transition-colors">
            <Box className="w-6 h-6 text-indigo-600" />
          </div>
          <div className="flex items-center gap-2">
             <TypeBadge type={module.manifest.type} />
            {module.status === 'RUNNING' && <span className="flex h-2 w-2 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]"></span>}
            {module.status === 'STOPPED' && <span className="flex h-2 w-2 rounded-full bg-slate-300"></span>}
            {module.status === 'ERROR' && <span className="flex h-2 w-2 rounded-full bg-red-500"></span>}
          </div>
        </div>
        
        <h3 className="font-bold text-slate-900 text-lg">{module.manifest.name}</h3>
        <p className="text-xs text-slate-400 font-mono mb-2">v{module.manifest.version} • {module.installedAt}</p>
        <p className="text-slate-600 text-sm mb-4 line-clamp-2">{module.manifest.description}</p>
        
        <div className="space-y-2">
            <div className="flex flex-wrap gap-1">
                {module.manifest.permissions.map(perm => (
                    <span key={perm} className="px-2 py-0.5 bg-slate-50 border border-slate-100 rounded text-[10px] text-slate-500 font-mono">
                        {perm}
                    </span>
                ))}
            </div>
        </div>
      </div>

      <div className="mt-6 pt-4 border-t border-slate-100 flex justify-between items-center">
        <div className="flex items-center gap-2">
            {module.manifest.configSchema && (
                <button 
                    onClick={() => onConfigure(module)}
                    className="p-1.5 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-md transition-colors"
                    title="Configure Module"
                >
                    <Settings size={16} />
                </button>
            )}
            
            {isWP && module.active && (
                <button 
                    onClick={() => onAnalyze(module)}
                    className="p-1.5 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-md transition-colors"
                    title="Run Deep Analysis"
                >
                    <Play size={16} />
                </button>
            )}

            <button className="text-xs font-medium text-slate-400 hover:text-red-500 transition-colors">Uninstall</button>
        </div>

        <button 
            onClick={() => onToggle(module.id)}
            className={`relative inline-flex items-center h-5 w-9 rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 ${module.active ? 'bg-indigo-600' : 'bg-slate-200'}`}
        >
            <span className={`inline-block w-3.5 h-3.5 transform bg-white rounded-full transition-transform ${module.active ? 'translate-x-4.5' : 'translate-x-0.5'}`} style={{ transform: module.active ? 'translateX(18px)' : 'translateX(2px)' }}/>
        </button>
      </div>
    </div>
  );
};

const ReportModal = ({ onClose }: { onClose: () => void }) => {
    const [fixingImages, setFixingImages] = useState(false);
    const [fixingDB, setFixingDB] = useState(false);
    const [imagesFixed, setImagesFixed] = useState(false);
    const [dbFixed, setDbFixed] = useState(false);

    const handleFixImages = () => {
        setFixingImages(true);
        setTimeout(() => {
            setFixingImages(false);
            setImagesFixed(true);
        }, 2000);
    };

    const handleFixDB = () => {
        setFixingDB(true);
        setTimeout(() => {
            setFixingDB(false);
            setDbFixed(true);
        }, 2500);
    };

    return (
        <div className="fixed inset-0 bg-slate-900/50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-xl shadow-xl w-full max-w-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200 flex flex-col max-h-[90vh]">
                <div className="flex justify-between items-center p-4 border-b border-slate-100 bg-slate-50">
                    <h3 className="font-bold text-slate-800 flex items-center gap-2">
                        <FileText size={18} className="text-indigo-600"/> 
                        System Health Report
                    </h3>
                    <button onClick={onClose} className="text-slate-400 hover:text-slate-600">
                        <X size={20} />
                    </button>
                </div>
                
                <div className="p-6 overflow-y-auto space-y-6">
                    {!imagesFixed || !dbFixed ? (
                         <div className="flex items-center gap-4 bg-red-50 p-4 rounded-lg border border-red-100">
                            <AlertTriangle className="text-red-500 w-8 h-8 shrink-0" />
                            <div>
                                <h4 className="font-bold text-red-700">Critical Issues Detected</h4>
                                <p className="text-sm text-red-600">The deep scan identified issues that may impact performance or security.</p>
                            </div>
                        </div>
                    ) : (
                         <div className="flex items-center gap-4 bg-emerald-50 p-4 rounded-lg border border-emerald-100 animate-in fade-in">
                            <CheckCircle className="text-emerald-500 w-8 h-8 shrink-0" />
                            <div>
                                <h4 className="font-bold text-emerald-700">System Optimized</h4>
                                <p className="text-sm text-emerald-600">All critical issues have been resolved successfully.</p>
                            </div>
                        </div>
                    )}

                    <div className="space-y-4">
                        <h4 className="font-bold text-slate-700 text-sm uppercase tracking-wide flex items-center gap-2">
                            <HardDrive size={16} /> Public Folder Analysis
                        </h4>
                        <div className="bg-slate-50 rounded-lg p-4 border border-slate-200 transition-all">
                            <ul className="space-y-3">
                                <li className="flex justify-between items-start text-sm">
                                    <span className="text-slate-600">Large uncompressed images (>2MB)</span>
                                    <span className={`font-mono ${imagesFixed ? 'text-slate-400 line-through' : 'text-red-600'}`}>14 Files (48MB)</span>
                                </li>
                                <li className="flex justify-between items-start text-sm">
                                    <span className="text-slate-600">Orphaned uploads (not in DB)</span>
                                    <span className={`font-mono ${imagesFixed ? 'text-slate-400 line-through' : 'text-amber-600'}`}>23 Files</span>
                                </li>
                                <li className="flex justify-between items-start text-sm">
                                    <span className="text-slate-600">Directory listing enabled</span>
                                    <span className="font-mono text-green-600">Disabled (Safe)</span>
                                </li>
                            </ul>
                            <div className="mt-3">
                                {imagesFixed ? (
                                    <span className="text-xs flex items-center gap-1 text-emerald-600 font-medium">
                                        <Check size={12} /> Optimization Complete
                                    </span>
                                ) : (
                                    <button 
                                        onClick={handleFixImages}
                                        disabled={fixingImages}
                                        className="text-xs flex items-center gap-1 text-indigo-600 hover:text-indigo-800 font-medium disabled:opacity-50"
                                    >
                                        {fixingImages ? <Loader2 size={12} className="animate-spin" /> : <Hammer size={12} />}
                                        {fixingImages ? 'Optimizing...' : 'Auto-Optimize Images'}
                                    </button>
                                )}
                            </div>
                        </div>
                    </div>

                    <div className="space-y-4">
                        <h4 className="font-bold text-slate-700 text-sm uppercase tracking-wide flex items-center gap-2">
                            <Database size={16} /> Database Integrity
                        </h4>
                        <div className="bg-slate-50 rounded-lg p-4 border border-slate-200 transition-all">
                             <ul className="space-y-3">
                                <li className="flex justify-between items-start text-sm">
                                    <span className="text-slate-600">wp_options autoload size</span>
                                    <span className={`font-mono ${dbFixed ? 'text-slate-400 line-through' : 'text-red-600'}`}>1.2MB (High)</span>
                                </li>
                                <li className="flex justify-between items-start text-sm">
                                    <span className="text-slate-600">Expired Transients</span>
                                    <span className={`font-mono ${dbFixed ? 'text-slate-400 line-through' : 'text-slate-600'}`}>1,204 Rows</span>
                                </li>
                                <li className="flex justify-between items-start text-sm">
                                    <span className="text-slate-600">Post Revisions</span>
                                    <span className={`font-mono ${dbFixed ? 'text-slate-400 line-through' : 'text-slate-600'}`}>452 Rows</span>
                                </li>
                            </ul>
                            <div className="mt-3">
                                {dbFixed ? (
                                    <span className="text-xs flex items-center gap-1 text-emerald-600 font-medium">
                                        <Check size={12} /> Cleanup Complete
                                    </span>
                                ) : (
                                    <button 
                                        onClick={handleFixDB}
                                        disabled={fixingDB}
                                        className="text-xs flex items-center gap-1 text-indigo-600 hover:text-indigo-800 font-medium disabled:opacity-50"
                                    >
                                        {fixingDB ? <Loader2 size={12} className="animate-spin" /> : <Hammer size={12} />}
                                        {fixingDB ? 'Cleaning...' : 'Clean Database Overhead'}
                                    </button>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
                
                <div className="p-4 border-t border-slate-100 bg-slate-50 flex justify-between items-center">
                    <span className="text-xs text-slate-400">Generated: Just now</span>
                    <button onClick={onClose} className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg">
                        Close Report
                    </button>
                </div>
            </div>
        </div>
    );
}

const AnalysisModal = ({ onClose, onComplete }: { onClose: () => void, onComplete: () => void }) => {
    const [progress, setProgress] = useState(0);
    const [stage, setStage] = useState('Initializing connection...');

    useEffect(() => {
        const interval = setInterval(() => {
            setProgress(prev => {
                if (prev >= 100) {
                    clearInterval(interval);
                    onComplete();
                    return 100;
                }
                // Simulate stages
                if (prev === 10) setStage('Scanning /public/uploads recursively...');
                if (prev === 40) setStage('Analyzing wp_options table size...');
                if (prev === 60) setStage('Checking for orphaned metadata...');
                if (prev === 80) setStage('Generating optimization report...');
                
                // Slow increment
                return prev + 2;
            });
        }, 100); // 100ms * 50 steps = 5 seconds roughly

        return () => clearInterval(interval);
    }, [onComplete]);

    return (
        <div className="fixed inset-0 bg-slate-900/50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-xl shadow-xl w-full max-w-md overflow-hidden animate-in fade-in zoom-in-95 duration-200 p-8 text-center">
                <Loader2 className="w-12 h-12 text-indigo-600 animate-spin mx-auto mb-4" />
                <h3 className="text-lg font-bold text-slate-800">Running Deep System Analysis</h3>
                <p className="text-slate-500 text-sm mt-2 mb-6 min-h-[20px]">{stage}</p>
                
                <div className="w-full bg-slate-100 rounded-full h-2.5 mb-2 overflow-hidden">
                    <div className="bg-indigo-600 h-2.5 rounded-full transition-all duration-300" style={{ width: `${progress}%` }}></div>
                </div>
                <div className="flex justify-between text-xs text-slate-400 font-mono">
                    <span>{progress}%</span>
                    <span>100%</span>
                </div>
            </div>
        </div>
    );
};

const ConfigModal = ({ module, onClose, onSave }: { module: SystemModule, onClose: () => void, onSave: (id: string, newConfig: any) => void }) => {
    const [config, setConfig] = useState(module.config || {});
    const isWP = module.manifest.name === 'wordpress-core-integrator';

    const handleChange = (key: string, value: any) => {
        setConfig({ ...config, [key]: value });
    };

    if (!module.manifest.configSchema) return null;

    return (
        <div className="fixed inset-0 bg-slate-900/50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-xl shadow-xl w-full max-w-lg overflow-hidden animate-in fade-in zoom-in-95 duration-200 flex flex-col max-h-[90vh]">
                <div className="flex justify-between items-center p-4 border-b border-slate-100 bg-slate-50">
                    <h3 className="font-bold text-slate-800 flex items-center gap-2">
                        <Settings size={18} className="text-slate-500"/> 
                        Configure {module.manifest.name}
                    </h3>
                    <button onClick={onClose} className="text-slate-400 hover:text-slate-600">
                        <X size={20} />
                    </button>
                </div>
                <div className="p-6 space-y-4 overflow-y-auto">
                    {Object.entries(module.manifest.configSchema.properties).map(([key, prop]) => {
                         const isPassword = prop.format === 'password' || key.toLowerCase().includes('password') || key === 'appPassword';
                         const isUrl = key === 'wpUrl' || prop.format === 'url';
                         const isUsername = key === 'username';
                         
                         const showWPHelp = isWP && key === 'appPassword';

                         // Determine appropriate autocomplete
                         let autoComplete = 'off';
                         if (isPassword) autoComplete = 'new-password';
                         if (isUsername) autoComplete = 'username';
                         if (isUrl) autoComplete = 'url';

                         return (
                            <div key={key}>
                                <label className="block text-sm font-medium text-slate-700 mb-1">
                                    {prop.description || key} {module.manifest.configSchema?.required?.includes(key) && <span className="text-red-500">*</span>}
                                </label>
                                {prop.type === 'boolean' ? (
                                    <div className="flex items-center gap-2 mt-2">
                                        <input 
                                            type="checkbox" 
                                            checked={config[key] ?? prop.default} 
                                            onChange={(e) => handleChange(key, e.target.checked)}
                                            className="rounded text-indigo-600 focus:ring-indigo-500 h-4 w-4 border-slate-300"
                                        />
                                        <span className="text-sm text-slate-600">Enable {prop.description}</span>
                                    </div>
                                ) : (
                                    <div className="relative">
                                        {isUrl && <LinkIcon className="absolute left-3 top-2.5 w-4 h-4 text-slate-400" />}
                                        {isPassword && <Lock className="absolute left-3 top-2.5 w-4 h-4 text-slate-400" />}
                                        {isUsername && <User className="absolute left-3 top-2.5 w-4 h-4 text-slate-400" />}
                                        
                                        <input 
                                            type={isPassword ? 'password' : isUrl ? 'url' : 'text'}
                                            value={config[key] ?? prop.default ?? ''}
                                            onChange={(e) => handleChange(key, e.target.value)}
                                            autoComplete={autoComplete}
                                            className={`w-full ${isUrl || isPassword || isUsername ? 'pl-9' : 'px-3'} py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all`}
                                            placeholder={isUrl ? 'https://...' : `Enter ${prop.description || key}...`}
                                        />
                                        {prop.description && prop.description !== key && !showWPHelp && (
                                            <p className="text-xs text-slate-500 mt-1">{prop.description}</p>
                                        )}
                                        {showWPHelp && (
                                            <p className="text-[10px] text-indigo-600 mt-1.5 flex items-center gap-1">
                                                <Info size={12} />
                                                Generate in WP Admin &gt; Users &gt; Profile &gt; Application Passwords
                                            </p>
                                        )}
                                    </div>
                                )}
                            </div>
                        );
                    })}
                </div>
                <div className="p-4 border-t border-slate-100 bg-slate-50 flex justify-end gap-2">
                    <button onClick={onClose} className="px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-100 rounded-lg">Cancel</button>
                    <button onClick={() => { onSave(module.id, config); onClose(); }} className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg shadow-sm">Save Configuration</button>
                </div>
            </div>
        </div>
    );
};

export const ModuleManager: React.FC = () => {
  const [modules, setModules] = useState<SystemModule[]>(MOCK_MODULES);
  const [isInstalling, setIsInstalling] = useState(false);
  const [editingModule, setEditingModule] = useState<SystemModule | null>(null);
  const [analyzingModule, setAnalyzingModule] = useState<SystemModule | null>(null);
  const [showReport, setShowReport] = useState(false);

  const handleToggle = (id: string) => {
    setModules(modules.map(m => {
        if (m.id === id) {
            return {
                ...m,
                active: !m.active,
                status: !m.active ? 'RUNNING' : 'STOPPED'
            };
        }
        return m;
    }));
  };

  const handleSaveConfig = (id: string, newConfig: any) => {
      setModules(modules.map(m => m.id === id ? { ...m, config: newConfig } : m));
  };

  const handleInstallSimulation = () => {
      setIsInstalling(true);
      setTimeout(() => {
          const newModule: SystemModule = {
              id: `m-${Date.now()}`,
              manifest: {
                  name: 'hello-module',
                  version: '1.0.0',
                  description: 'Example module from guide showing declarative config.',
                  type: 'worker-only',
                  compatibility: { core: '>=0.1.0' },
                  permissions: ['CMS:READ', 'LOG:WRITE'],
                  configSchema: {
                      type: 'object',
                      properties: {
                          message: { type: 'string', default: 'Olá', description: 'Greeting message to display in logs' }
                      },
                      required: ['message']
                  }
              },
              active: false,
              status: 'STOPPED',
              installedAt: new Date().toISOString().split('T')[0]
          };
          setModules([...modules, newModule]);
          setIsInstalling(false);
      }, 2000);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-slate-800">System Modules</h2>
          <p className="text-slate-500 mt-1">Manage plugins, integrations, and operational capabilities.</p>
        </div>
        <button 
            onClick={handleInstallSimulation}
            disabled={isInstalling}
            className="flex items-center gap-2 bg-indigo-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-indigo-700 transition-colors disabled:opacity-75 disabled:cursor-not-allowed"
        >
          {isInstalling ? <Loader2 className="animate-spin w-4 h-4"/> : <Upload size={16} />}
          {isInstalling ? 'Installing...' : 'Upload Package (.zip)'}
        </button>
      </div>

      <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 flex items-start gap-3">
        <Shield className="w-5 h-5 text-amber-600 mt-0.5 flex-shrink-0" />
        <div>
            <h4 className="text-sm font-bold text-amber-800">Sandbox Environment Active</h4>
            <p className="text-sm text-amber-700 mt-1">All third-party modules are running in isolated processes with restricted access to system secrets. See <code>SPEC.md</code> RM5 for details.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {modules.map(mod => (
          <ModuleCard 
            key={mod.id} 
            module={mod} 
            onConfigure={setEditingModule}
            onToggle={handleToggle}
            onAnalyze={setAnalyzingModule}
          />
        ))}
        
        {/* Drop Zone */}
        <div 
            onClick={handleInstallSimulation}
            className="border-2 border-dashed border-slate-200 rounded-xl p-6 flex flex-col items-center justify-center text-center hover:border-indigo-300 hover:bg-indigo-50/50 transition-all cursor-pointer h-full min-h-[250px] group"
        >
            <div className="p-4 bg-slate-50 rounded-full mb-4 group-hover:bg-white group-hover:shadow-sm transition-all">
                {isInstalling ? <Loader2 className="w-8 h-8 text-indigo-600 animate-spin" /> : <Upload className="w-8 h-8 text-slate-400 group-hover:text-indigo-500" />}
            </div>
            <h3 className="font-semibold text-slate-700 group-hover:text-indigo-700">Install New Module</h3>
            <p className="text-sm text-slate-500 mt-2 max-w-xs">Drag and drop a <code>.zip</code> file containing a valid <code>manifest.json</code>.</p>
        </div>
      </div>

      {editingModule && (
          <ConfigModal 
            module={editingModule} 
            onClose={() => setEditingModule(null)} 
            onSave={handleSaveConfig} 
          />
      )}

      {analyzingModule && (
          <AnalysisModal 
            onClose={() => setAnalyzingModule(null)} 
            onComplete={() => {
                setAnalyzingModule(null);
                setShowReport(true);
            }} 
          />
      )}

      {showReport && (
          <ReportModal onClose={() => setShowReport(false)} />
      )}
    </div>
  );
};