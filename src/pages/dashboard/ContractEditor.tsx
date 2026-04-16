import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Save, Send, GitBranch, Brain, AlertTriangle, CheckCircle, Plus, X, Zap, ArrowLeft } from 'lucide-react';
import { getContracts, saveContract, AI_SUGGESTIONS, RISK_ITEMS } from '@/lib/mockData';
import { CONTRACT_TEMPLATES } from '@/constants';
import { getCurrentUser } from '@/lib/auth';
import { createNewContract } from '@/lib/mockData';
import { getStatusColor, getStatusLabel, getRiskColor } from '@/lib/utils';
import { toast } from 'sonner';
import type { Contract } from '@/types';

export default function ContractEditor() {
  const { id } = useParams();
  const navigate = useNavigate();
  const user = getCurrentUser();
  const [contract, setContract] = useState<Contract | null>(null);
  const [content, setContent] = useState('');
  const [title, setTitle] = useState('');
  const [showAI, setShowAI] = useState(false);
  const [aiLoading, setAiLoading] = useState(false);
  const [activePanel, setActivePanel] = useState<'ai' | 'risk' | 'history' | null>(null);
  const [history, setHistory] = useState<{ version: number; date: string; content: string }[]>([]);

  useEffect(() => {
    if (id) {
      const found = getContracts().find(c => c.id === id);
      if (found) {
        setContract(found);
        setContent(found.content);
        setTitle(found.title);
        setHistory([{ version: found.version, date: found.updatedAt, content: found.content }]);
      }
    } else {
      const newC = createNewContract('Untitled Contract', 'Service Agreement', user?.id || 'u1');
      setContract(newC);
      setContent(newC.content);
      setTitle(newC.title);
    }
  }, [id]);

  const handleSave = () => {
    if (!contract) return;
    const updated = { ...contract, title, content, updatedAt: new Date().toISOString(), version: contract.version + 1 };
    saveContract(updated);
    setContract(updated);
    setHistory(prev => [{ version: updated.version, date: updated.updatedAt, content: updated.content }, ...prev]);
    toast.success('Contract saved successfully');
  };

  const handleSendForApproval = () => {
    if (!contract) return;
    const updated = { ...contract, status: 'pending_review' as const, updatedAt: new Date().toISOString() };
    saveContract(updated);
    setContract(updated);
    toast.success('Sent for approval');
  };

  const applyAISuggestion = (suggestion: string) => {
    setContent(prev => prev + '\n\n[AI Suggested Clause]\n' + suggestion);
    toast.success('AI clause applied to document');
  };

  const runAIAnalysis = () => {
    setAiLoading(true);
    setActivePanel('ai');
    setTimeout(() => setAiLoading(false), 1500);
  };

  if (!contract) return (
    <div className="flex items-center justify-center h-full">
      <div className="w-8 h-8 border-4 border-[#CF6DFC] border-t-transparent rounded-full animate-spin" />
    </div>
  );

  return (
    <div className="flex flex-col h-full bg-gray-50 dark:bg-gray-900">
      {/* Editor Toolbar */}
      <div className="bg-white dark:bg-gray-800 border-b border-gray-100 dark:border-gray-700 px-6 py-3 flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <button onClick={() => navigate('/dashboard/contracts')} className="p-1.5 text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors">
            <ArrowLeft size={16} />
          </button>
          <input
            value={title}
            onChange={e => setTitle(e.target.value)}
            className="text-base font-semibold text-gray-800 dark:text-white bg-transparent border-none outline-none max-w-xs"
          />
          <span className={`text-xs px-2.5 py-1 rounded-full font-medium ${getStatusColor(contract.status)}`}>{getStatusLabel(contract.status)}</span>
          <span className="text-xs text-gray-400">v{contract.version}</span>
        </div>
        <div className="flex items-center gap-2">
          <button onClick={() => setActivePanel(activePanel === 'risk' ? null : 'risk')} className="flex items-center gap-1.5 px-3 py-2 text-xs font-medium text-amber-600 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-lg hover:bg-amber-100 transition-colors">
            <AlertTriangle size={13} /> Risk Analysis
          </button>
          <button onClick={runAIAnalysis} className="flex items-center gap-1.5 px-3 py-2 text-xs font-medium text-[#CF6DFC] bg-purple-50 dark:bg-purple-900/20 border border-purple-200 dark:border-purple-700 rounded-lg hover:bg-purple-100 transition-colors">
            <Brain size={13} /> AI Assist
          </button>
          <button onClick={() => setActivePanel(activePanel === 'history' ? null : 'history')} className="flex items-center gap-1.5 px-3 py-2 text-xs font-medium text-gray-600 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 rounded-lg hover:bg-gray-200 transition-colors">
            <GitBranch size={13} /> History
          </button>
          <button onClick={handleSave} className="flex items-center gap-2 px-4 py-2 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-200 text-sm font-medium rounded-xl hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors">
            <Save size={15} /> Save
          </button>
          <button onClick={handleSendForApproval} className="flex items-center gap-2 px-4 py-2 gradient-primary text-white text-sm font-semibold rounded-xl hover:opacity-90 shadow-md">
            <Send size={15} /> Send for Approval
          </button>
        </div>
      </div>

      <div className="flex flex-1 overflow-hidden">
        {/* Editor */}
        <div className="flex-1 overflow-auto">
          <div className="max-w-4xl mx-auto p-8">
            {/* Document Header */}
            <div className="mb-8 pb-6 border-b border-gray-200 dark:border-gray-700">
              <div className="text-center">
                <h1 className="text-2xl font-heading font-bold text-gray-900 dark:text-white mb-2">{title}</h1>
                <p className="text-sm text-gray-500">Created: {new Date(contract.createdAt).toLocaleDateString('en-IN')} · {contract.type}</p>
              </div>
            </div>

            {/* Templates Quick-pick */}
            <div className="mb-6">
              <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">Quick Start Templates</p>
              <div className="flex gap-2 flex-wrap">
                {CONTRACT_TEMPLATES.slice(0, 4).map(t => (
                  <button
                    key={t.id}
                    onClick={() => { setContent(`This ${t.name} is entered into as of ${new Date().toLocaleDateString('en-IN')}...\n\n1. SCOPE\n\n2. PAYMENT TERMS\n\n3. CONFIDENTIALITY\n\n4. TERMINATION\n\n5. GOVERNING LAW`); toast.success(`Template "${t.name}" applied`); }}
                    className="text-xs px-3 py-1.5 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 rounded-lg hover:bg-purple-50 dark:hover:bg-purple-900/20 hover:text-[#CF6DFC] transition-colors"
                  >
                    {t.name}
                  </button>
                ))}
              </div>
            </div>

            {/* Content Editor */}
            <textarea
              value={content}
              onChange={e => setContent(e.target.value)}
              className="w-full min-h-[600px] text-sm text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-2xl p-6 focus:outline-none focus:border-[#CF6DFC] leading-relaxed resize-none shadow-sm font-mono"
              placeholder="Start writing your contract here, or apply a template above..."
            />
          </div>
        </div>

        {/* Right Panel */}
        {activePanel && (
          <div className="w-80 bg-white dark:bg-gray-800 border-l border-gray-100 dark:border-gray-700 flex flex-col">
            <div className="flex items-center justify-between p-4 border-b border-gray-100 dark:border-gray-700">
              <h3 className="font-semibold text-sm text-gray-800 dark:text-white">
                {activePanel === 'ai' ? 'AI Contract Assistant' : activePanel === 'risk' ? 'Risk Analysis' : 'Version History'}
              </h3>
              <button onClick={() => setActivePanel(null)} className="p-1 text-gray-400 hover:text-gray-600 rounded"><X size={14} /></button>
            </div>

            <div className="flex-1 overflow-y-auto p-4 space-y-3">
              {activePanel === 'ai' && (
                aiLoading ? (
                  <div className="flex flex-col items-center justify-center py-10 gap-3">
                    <div className="w-8 h-8 border-3 border-[#CF6DFC] border-t-transparent rounded-full animate-spin border-4" />
                    <p className="text-xs text-gray-400">Analyzing your contract...</p>
                  </div>
                ) : (
                  <>
                    <p className="text-xs text-gray-500 font-semibold uppercase tracking-wide mb-2">Suggested Clauses</p>
                    {AI_SUGGESTIONS.map((s, i) => (
                      <div key={i} className="p-3 bg-purple-50 dark:bg-purple-900/20 rounded-xl border border-purple-100 dark:border-purple-800">
                        <div className="flex items-start gap-2">
                          <Zap size={12} className="text-[#CF6DFC] mt-0.5 shrink-0" />
                          <p className="text-xs text-gray-700 dark:text-gray-300 flex-1">{s}</p>
                        </div>
                        <button onClick={() => applyAISuggestion(s)} className="mt-2 text-xs text-[#CF6DFC] font-semibold hover:underline">Apply →</button>
                      </div>
                    ))}
                  </>
                )
              )}

              {activePanel === 'risk' && (
                <>
                  <div className="p-3 bg-gray-50 dark:bg-gray-700 rounded-xl mb-2">
                    <p className="text-xs text-gray-500">Overall Risk Score</p>
                    <div className="flex items-center gap-2 mt-1">
                      <div className="flex-1 h-2 bg-gray-200 dark:bg-gray-600 rounded-full">
                        <div className="h-2 rounded-full bg-gradient-to-r from-green-400 to-yellow-400" style={{ width: `${contract.riskScore || 20}%` }} />
                      </div>
                      <span className={`text-sm font-bold ${getRiskColor(contract.riskScore || 20)}`}>{contract.riskScore || 20}/100</span>
                    </div>
                  </div>
                  {RISK_ITEMS.map((r, i) => (
                    <div key={i} className={`p-3 rounded-xl border ${r.severity === 'high' ? 'border-red-200 bg-red-50 dark:bg-red-900/10' : r.severity === 'medium' ? 'border-yellow-200 bg-yellow-50 dark:bg-yellow-900/10' : 'border-green-200 bg-green-50 dark:bg-green-900/10'}`}>
                      <div className="flex items-center gap-1.5 mb-1">
                        <AlertTriangle size={12} className={r.severity === 'high' ? 'text-red-500' : r.severity === 'medium' ? 'text-yellow-500' : 'text-green-500'} />
                        <span className={`text-xs font-semibold uppercase ${r.severity === 'high' ? 'text-red-600' : r.severity === 'medium' ? 'text-yellow-600' : 'text-green-600'}`}>{r.severity} risk</span>
                        <span className="text-xs text-gray-400 ml-auto">{r.clause}</span>
                      </div>
                      <p className="text-xs text-gray-600 dark:text-gray-400">{r.description}</p>
                    </div>
                  ))}
                </>
              )}

              {activePanel === 'history' && (
                <>
                  {history.map((h, i) => (
                    <div key={i} className="p-3 bg-gray-50 dark:bg-gray-700 rounded-xl border border-gray-200 dark:border-gray-600">
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-xs font-semibold text-gray-700 dark:text-white">Version {h.version}</span>
                        <span className="text-xs text-gray-400">{new Date(h.date).toLocaleDateString('en-IN')}</span>
                      </div>
                      <button onClick={() => setContent(h.content)} className="text-xs text-[#CF6DFC] hover:underline">Restore this version</button>
                    </div>
                  ))}
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
