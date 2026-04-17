import { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Save, Send, GitBranch, Brain, AlertTriangle, CheckCircle, Plus, X, Zap, ArrowLeft,
  PenTool, MessageSquare, Clock, RotateCcw, GitCompare, ChevronDown, ChevronUp,
  Bell, User, Send as SendIcon, Check, ChevronRight
} from 'lucide-react';
import { getContracts, saveContract, AI_SUGGESTIONS, RISK_ITEMS, createNewContract } from '@/lib/mockData';
import { CONTRACT_TEMPLATES } from '@/constants';
import { getCurrentUser } from '@/lib/auth';
import { getStatusColor, getStatusLabel, getRiskColor, formatDate } from '@/lib/utils';
import { toast } from 'sonner';
import type { Contract } from '@/types';

interface VersionEntry { version: number; date: string; content: string; author: string; changes: string; }
interface Comment { id: string; author: string; text: string; time: string; resolved: boolean; selection?: string; }
interface Approver { id: string; name: string; email: string; role: string; status: 'pending' | 'approved' | 'rejected'; order: number; comment?: string; }
interface Signer { id: string; name: string; email: string; role: string; status: 'pending' | 'signed'; signedAt?: string; }
interface Notification { id: string; type: 'info' | 'warning' | 'success'; message: string; time: string; read: boolean; }

const DEFAULT_APPROVERS: Approver[] = [
  { id: 'a1', name: 'Priya Sharma', email: 'priya@company.com', role: 'Legal Counsel', status: 'pending', order: 1 },
  { id: 'a2', name: 'Rahul Mehta', email: 'rahul@company.com', role: 'Finance Head', status: 'pending', order: 2 },
];

const DEFAULT_SIGNERS: Signer[] = [
  { id: 's1', name: 'Ananya Krishnan', email: 'ananya@growfast.com', role: 'Client – Authorized Signatory', status: 'pending' },
  { id: 's2', name: 'Vikram Rao', email: 'vikram@company.com', role: 'Company Representative', status: 'pending' },
];

const NOTIFICATION_MOCK: Notification[] = [
  { id: 'n1', type: 'warning', message: 'Contract expires in 30 days — renewal reminder sent', time: '2h ago', read: false },
  { id: 'n2', type: 'info', message: 'Priya Sharma has reviewed your contract', time: '4h ago', read: false },
  { id: 'n3', type: 'success', message: 'Signature request sent to all parties', time: '1d ago', read: true },
];

function DiffView({ oldText, newText }: { oldText: string; newText: string }) {
  const oldLines = oldText.split('\n');
  const newLines = newText.split('\n');
  const maxLen = Math.max(oldLines.length, newLines.length);
  const rows = Array.from({ length: maxLen }, (_, i) => ({
    old: oldLines[i] ?? '',
    new: newLines[i] ?? '',
    changed: oldLines[i] !== newLines[i],
  }));
  return (
    <div className="font-mono text-xs overflow-auto max-h-[400px] rounded-xl border border-gray-200 dark:border-gray-700">
      {rows.map((row, i) => (
        <div key={i} className={`flex ${row.changed ? '' : ''}`}>
          <div className={`flex-1 px-3 py-0.5 border-r border-gray-200 dark:border-gray-700 whitespace-pre-wrap ${row.changed ? 'bg-red-50 dark:bg-red-900/10 text-red-600 dark:text-red-400' : 'text-gray-500 dark:text-gray-500'}`}>
            {row.old || ' '}
          </div>
          <div className={`flex-1 px-3 py-0.5 whitespace-pre-wrap ${row.changed ? 'bg-green-50 dark:bg-green-900/10 text-green-700 dark:text-green-400' : 'text-gray-500 dark:text-gray-500'}`}>
            {row.new || ' '}
          </div>
        </div>
      ))}
    </div>
  );
}

export default function ContractEditor() {
  const { id } = useParams();
  const navigate = useNavigate();
  const user = getCurrentUser();
  const [contract, setContract] = useState<Contract | null>(null);
  const [content, setContent] = useState('');
  const [title, setTitle] = useState('');
  const [activePanel, setActivePanel] = useState<'ai' | 'risk' | 'history' | 'comments' | 'esign' | 'approval' | 'notifications' | null>(null);
  const [aiLoading, setAiLoading] = useState(false);

  // Version history
  const [history, setHistory] = useState<VersionEntry[]>([]);
  const [diffMode, setDiffMode] = useState<{ a: VersionEntry; b: VersionEntry } | null>(null);
  const [compareSelA, setCompareSelA] = useState<number>(0);
  const [compareSelB, setCompareSelB] = useState<number>(1);

  // Comments
  const [comments, setComments] = useState<Comment[]>([
    { id: 'c1', author: 'Priya Sharma', text: 'Please clarify the payment schedule in clause 4.', time: '2h ago', resolved: false, selection: 'payment schedule' },
    { id: 'c2', author: 'Admin User', text: 'Force majeure clause should specify natural disasters explicitly.', time: '1d ago', resolved: false },
  ]);
  const [newComment, setNewComment] = useState('');

  // Approval workflow
  const [approvers, setApprovers] = useState<Approver[]>(DEFAULT_APPROVERS);
  const [approvalMode, setApprovalMode] = useState<'sequential' | 'parallel'>('sequential');
  const [newApproverName, setNewApproverName] = useState('');
  const [newApproverEmail, setNewApproverEmail] = useState('');

  // E-signature
  const [signers, setSigners] = useState<Signer[]>(DEFAULT_SIGNERS);
  const [signMode, setSignMode] = useState<'sequential' | 'parallel'>('parallel');
  const [showSignModal, setShowSignModal] = useState(false);
  const [signType, setSignType] = useState<'typed' | 'drawn'>('typed');
  const [typedSig, setTypedSig] = useState('');
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isDrawing, setIsDrawing] = useState(false);

  // Notifications
  const [notifications, setNotifications] = useState<Notification[]>(NOTIFICATION_MOCK);

  useEffect(() => {
    if (id) {
      const found = getContracts().find(c => c.id === id);
      if (found) {
        setContract(found);
        setContent(found.content);
        setTitle(found.title);
        setHistory([{ version: found.version, date: found.updatedAt, content: found.content, author: user?.name || 'You', changes: 'Current version' }]);
      }
    } else {
      const newC = createNewContract('Untitled Contract', 'Service Agreement', user?.id || 'u1');
      setContract(newC);
      setContent(newC.content);
      setTitle(newC.title);
      setHistory([{ version: 1, date: new Date().toISOString(), content: newC.content, author: user?.name || 'You', changes: 'Initial draft' }]);
    }
  }, [id]);

  const handleSave = () => {
    if (!contract) return;
    const oldContent = content;
    const updated = { ...contract, title, content, updatedAt: new Date().toISOString(), version: contract.version + 1 };
    saveContract(updated);
    setContract(updated);
    const newEntry: VersionEntry = {
      version: updated.version,
      date: updated.updatedAt,
      content: updated.content,
      author: user?.name || 'You',
      changes: `${Math.abs(content.split('\n').length - oldContent.split('\n').length)} line${Math.abs(content.split('\n').length - oldContent.split('\n').length) !== 1 ? 's' : ''} changed`,
    };
    setHistory(prev => [newEntry, ...prev]);
    toast.success('Contract saved — version ' + updated.version);
  };

  const handleRollback = (entry: VersionEntry) => {
    setContent(entry.content);
    toast.success(`Rolled back to version ${entry.version}`);
  };

  const handleSendApproval = () => {
    const updated = approvers.map(a => ({ ...a, status: 'pending' as const }));
    setApprovers(updated);
    // simulate first approver getting notified
    setNotifications(prev => [{ id: Date.now().toString(), type: 'info', message: `Approval request sent to ${approvers[0]?.name}`, time: 'Just now', read: false }, ...prev]);
    toast.success('Approval workflow triggered — notifications sent');
  };

  const handleApproverAction = (id: string, action: 'approved' | 'rejected') => {
    setApprovers(prev => prev.map(a => a.id === id ? { ...a, status: action, comment: action === 'rejected' ? 'Please revise clause 3.' : undefined } : a));
    toast.success(`Marked as ${action}`);
  };

  const handleAddApprover = () => {
    if (!newApproverName.trim()) { toast.error('Enter approver name'); return; }
    const newA: Approver = { id: Date.now().toString(), name: newApproverName, email: newApproverEmail, role: 'Reviewer', status: 'pending', order: approvers.length + 1 };
    setApprovers(prev => [...prev, newA]);
    setNewApproverName(''); setNewApproverEmail('');
    toast.success('Approver added');
  };

  const handleSign = () => {
    if (signType === 'typed' && !typedSig.trim()) { toast.error('Please type your signature'); return; }
    const mySigner = signers.find(s => s.name === (user?.name || 'You'));
    if (mySigner) {
      setSigners(prev => prev.map(s => s.id === mySigner.id ? { ...s, status: 'signed', signedAt: new Date().toISOString() } : s));
    } else {
      setSigners(prev => prev.map((s, i) => i === 0 ? { ...s, status: 'signed', signedAt: new Date().toISOString() } : s));
    }
    setShowSignModal(false);
    setNotifications(prev => [{ id: Date.now().toString(), type: 'success', message: 'Your signature has been recorded', time: 'Just now', read: false }, ...prev]);
    toast.success('Document signed successfully');
  };

  const startDraw = (e: React.MouseEvent<HTMLCanvasElement>) => {
    setIsDrawing(true);
    const ctx = canvasRef.current?.getContext('2d');
    if (ctx) { ctx.beginPath(); ctx.moveTo(e.nativeEvent.offsetX, e.nativeEvent.offsetY); }
  };
  const draw = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isDrawing) return;
    const ctx = canvasRef.current?.getContext('2d');
    if (ctx) { ctx.lineWidth = 2; ctx.strokeStyle = '#CF6DFC'; ctx.lineTo(e.nativeEvent.offsetX, e.nativeEvent.offsetY); ctx.stroke(); }
  };
  const clearCanvas = () => { const ctx = canvasRef.current?.getContext('2d'); if (ctx && canvasRef.current) ctx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height); };

  const addComment = () => {
    if (!newComment.trim()) return;
    setComments(prev => [...prev, { id: Date.now().toString(), author: user?.name || 'You', text: newComment, time: 'Just now', resolved: false }]);
    setNewComment('');
    toast.success('Comment added');
  };

  const resolveComment = (id: string) => setComments(prev => prev.map(c => c.id === id ? { ...c, resolved: true } : c));
  const unreadCount = notifications.filter(n => !n.read).length;

  if (!contract) return (
    <div className="flex items-center justify-center h-full">
      <div className="w-8 h-8 border-4 border-[#CF6DFC] border-t-transparent rounded-full animate-spin" />
    </div>
  );

  const PANEL_BUTTONS = [
    { id: 'ai', label: 'AI Assist', icon: Brain, color: 'text-[#CF6DFC] bg-purple-50 dark:bg-purple-900/20 border-purple-200 dark:border-purple-700' },
    { id: 'risk', label: 'Risk', icon: AlertTriangle, color: 'text-amber-600 bg-amber-50 dark:bg-amber-900/20 border-amber-200 dark:border-amber-800' },
    { id: 'history', label: 'History', icon: GitBranch, color: 'text-blue-600 bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-700' },
    { id: 'comments', label: 'Comments', icon: MessageSquare, color: 'text-green-600 bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-700' },
    { id: 'approval', label: 'Approval', icon: CheckCircle, color: 'text-indigo-600 bg-indigo-50 dark:bg-indigo-900/20 border-indigo-200 dark:border-indigo-700' },
    { id: 'esign', label: 'E-Sign', icon: PenTool, color: 'text-pink-600 bg-pink-50 dark:bg-pink-900/20 border-pink-200 dark:border-pink-700' },
    { id: 'notifications', label: `Alerts${unreadCount > 0 ? ` (${unreadCount})` : ''}`, icon: Bell, color: 'text-orange-600 bg-orange-50 dark:bg-orange-900/20 border-orange-200 dark:border-orange-700' },
  ] as const;

  return (
    <div className="flex flex-col h-full bg-gray-50 dark:bg-gray-900">
      {/* Toolbar */}
      <div className="bg-white dark:bg-gray-800 border-b border-gray-100 dark:border-gray-700 px-4 py-2.5 flex flex-wrap items-center gap-2">
        <button onClick={() => navigate('/dashboard/contracts')} className="p-1.5 text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors">
          <ArrowLeft size={16} />
        </button>
        <input value={title} onChange={e => setTitle(e.target.value)} className="text-sm font-semibold text-gray-800 dark:text-white bg-transparent border-none outline-none max-w-[200px]" />
        <span className={`text-xs px-2.5 py-1 rounded-full font-medium ${getStatusColor(contract.status)}`}>{getStatusLabel(contract.status)}</span>
        <span className="text-xs text-gray-400">v{contract.version}</span>

        <div className="ml-auto flex flex-wrap items-center gap-1.5">
          {PANEL_BUTTONS.map(btn => {
            const Icon = btn.icon;
            const isActive = activePanel === btn.id;
            return (
              <button
                key={btn.id}
                onClick={() => { setActivePanel(activePanel === btn.id ? null : btn.id as typeof activePanel); if (btn.id === 'ai') { setAiLoading(true); setTimeout(() => setAiLoading(false), 1400); } }}
                className={`flex items-center gap-1 px-2.5 py-1.5 text-xs font-medium rounded-lg border transition-colors ${isActive ? btn.color + ' ring-2 ring-offset-1 ring-current ring-opacity-30' : btn.color}`}
              >
                <Icon size={12} /> {btn.label}
              </button>
            );
          })}
          <button onClick={handleSave} className="flex items-center gap-1.5 px-3 py-1.5 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-200 text-xs font-medium rounded-lg hover:bg-gray-200 transition-colors">
            <Save size={13} /> Save
          </button>
          <button onClick={() => { handleSave(); setActivePanel('approval'); }} className="flex items-center gap-1.5 px-3 py-1.5 gradient-primary text-white text-xs font-semibold rounded-lg hover:opacity-90 shadow-sm">
            <Send size={13} /> Send for Approval
          </button>
        </div>
      </div>

      <div className="flex flex-1 overflow-hidden">
        {/* Editor */}
        <div className="flex-1 overflow-auto">
          <div className="max-w-4xl mx-auto p-8">
            <div className="mb-6 pb-5 border-b border-gray-200 dark:border-gray-700 text-center">
              <h1 className="text-xl font-heading font-bold text-gray-900 dark:text-white">{title}</h1>
              <p className="text-xs text-gray-400 mt-1">Created: {formatDate(contract.createdAt)} · {contract.type}</p>
            </div>
            <div className="mb-5">
              <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">Quick Start Templates</p>
              <div className="flex gap-2 flex-wrap">
                {CONTRACT_TEMPLATES.slice(0, 5).map(t => (
                  <button key={t.id} onClick={() => { setContent(`This ${t.name} is entered into as of ${new Date().toLocaleDateString('en-IN')} between the parties named herein.\n\n1. SCOPE OF WORK\n[Describe the services/work]\n\n2. PAYMENT TERMS\n[Define payment schedule and amounts]\n\n3. CONFIDENTIALITY\n[Non-disclosure obligations]\n\n4. INTELLECTUAL PROPERTY\n[Ownership of deliverables]\n\n5. FORCE MAJEURE\nNeither party shall be liable for delays caused by circumstances beyond their reasonable control.\n\n6. TERMINATION\nEither party may terminate this agreement upon 30 days written notice.\n\n7. GOVERNING LAW\nThis agreement shall be governed by the laws of India.`); toast.success(`Template "${t.name}" applied`); }}
                    className="text-xs px-3 py-1.5 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 rounded-lg hover:bg-purple-50 dark:hover:bg-purple-900/20 hover:text-[#CF6DFC] transition-colors">
                    {t.name}
                  </button>
                ))}
              </div>
            </div>
            <textarea
              value={content}
              onChange={e => setContent(e.target.value)}
              className="w-full min-h-[580px] text-sm text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-2xl p-6 focus:outline-none focus:border-[#CF6DFC] leading-relaxed resize-none shadow-sm font-mono"
              placeholder="Start writing your contract here, or apply a template above..."
            />
          </div>
        </div>

        {/* Right Panel */}
        {activePanel && (
          <div className="w-80 bg-white dark:bg-gray-800 border-l border-gray-100 dark:border-gray-700 flex flex-col shrink-0">
            <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100 dark:border-gray-700">
              <h3 className="font-semibold text-sm text-gray-800 dark:text-white">
                {activePanel === 'ai' ? '🤖 AI Assistant' : activePanel === 'risk' ? '⚠️ Risk Analysis' : activePanel === 'history' ? '🕐 Version History' : activePanel === 'comments' ? '💬 Comments' : activePanel === 'approval' ? '✅ Approval Flow' : activePanel === 'esign' ? '✍️ E-Signature' : '🔔 Notifications'}
              </h3>
              <button onClick={() => setActivePanel(null)} className="p-1 text-gray-400 hover:text-gray-600 rounded"><X size={14} /></button>
            </div>

            <div className="flex-1 overflow-y-auto p-4 space-y-3">
              {/* ── AI Panel ── */}
              {activePanel === 'ai' && (
                aiLoading ? (
                  <div className="flex flex-col items-center justify-center py-10 gap-3">
                    <div className="w-8 h-8 border-4 border-[#CF6DFC] border-t-transparent rounded-full animate-spin" />
                    <p className="text-xs text-gray-400">Analyzing your contract...</p>
                  </div>
                ) : (
                  <>
                    <p className="text-xs text-gray-500 font-semibold uppercase tracking-wide">Suggested Clauses</p>
                    {AI_SUGGESTIONS.map((s, i) => (
                      <div key={i} className="p-3 bg-purple-50 dark:bg-purple-900/20 rounded-xl border border-purple-100 dark:border-purple-800">
                        <div className="flex items-start gap-2 mb-2">
                          <Zap size={11} className="text-[#CF6DFC] mt-0.5 shrink-0" />
                          <p className="text-xs text-gray-700 dark:text-gray-300">{s}</p>
                        </div>
                        <button onClick={() => { setContent(prev => prev + '\n\n[AI Suggested Clause]\n' + s); toast.success('Clause applied'); }} className="text-xs text-[#CF6DFC] font-semibold hover:underline">Apply →</button>
                      </div>
                    ))}
                    <div className="mt-2 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-xl border border-blue-200 dark:border-blue-800">
                      <p className="text-xs font-semibold text-blue-700 dark:text-blue-300 mb-2">Generate Custom Clause</p>
                      <textarea className="w-full text-xs bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg p-2 resize-none outline-none text-gray-700 dark:text-gray-300" rows={3} placeholder="Describe what clause you need..." />
                      <button className="mt-2 text-xs bg-blue-600 text-white px-3 py-1.5 rounded-lg w-full font-medium">Generate with AI</button>
                    </div>
                  </>
                )
              )}

              {/* ── Risk Panel ── */}
              {activePanel === 'risk' && (
                <>
                  <div className="p-3 bg-gray-50 dark:bg-gray-700 rounded-xl">
                    <div className="flex items-center justify-between mb-2">
                      <p className="text-xs font-semibold text-gray-600 dark:text-gray-300">Overall Risk Score</p>
                      <span className={`text-sm font-bold ${getRiskColor(contract.riskScore || 20)}`}>{contract.riskScore || 20}/100</span>
                    </div>
                    <div className="h-2 bg-gray-200 dark:bg-gray-600 rounded-full">
                      <div className="h-2 rounded-full transition-all" style={{ width: `${contract.riskScore || 20}%`, background: (contract.riskScore || 20) < 30 ? '#10B981' : (contract.riskScore || 20) < 60 ? '#F59E0B' : '#EF4444' }} />
                    </div>
                  </div>
                  {/* Risk Indicators */}
                  <div className="space-y-2">
                    <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Risk Indicators</p>
                    {[
                      { label: 'Payment Risk', score: 15, desc: 'Payment terms are well-defined' },
                      { label: 'Liability Risk', score: 45, desc: 'Liability cap missing — recommend adding' },
                      { label: 'IP Risk', score: 30, desc: 'IP ownership clause present but vague' },
                      { label: 'Termination Risk', score: 20, desc: 'Termination clause is standard' },
                    ].map(ri => (
                      <div key={ri.label} className="p-2.5 bg-gray-50 dark:bg-gray-700 rounded-lg">
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-xs font-medium text-gray-700 dark:text-gray-300">{ri.label}</span>
                          <span className={`text-xs font-bold ${ri.score < 30 ? 'text-green-500' : ri.score < 60 ? 'text-amber-500' : 'text-red-500'}`}>{ri.score}</span>
                        </div>
                        <div className="h-1.5 bg-gray-200 dark:bg-gray-600 rounded-full mb-1">
                          <div className="h-1.5 rounded-full" style={{ width: `${ri.score}%`, background: ri.score < 30 ? '#10B981' : ri.score < 60 ? '#F59E0B' : '#EF4444' }} />
                        </div>
                        <p className="text-xs text-gray-500">{ri.desc}</p>
                      </div>
                    ))}
                  </div>
                  {RISK_ITEMS.map((r, i) => (
                    <div key={i} className={`p-3 rounded-xl border ${r.severity === 'high' ? 'border-red-200 bg-red-50 dark:bg-red-900/10' : r.severity === 'medium' ? 'border-yellow-200 bg-yellow-50 dark:bg-yellow-900/10' : 'border-green-200 bg-green-50 dark:bg-green-900/10'}`}>
                      <div className="flex items-center gap-1.5 mb-1">
                        <AlertTriangle size={11} className={r.severity === 'high' ? 'text-red-500' : r.severity === 'medium' ? 'text-yellow-500' : 'text-green-500'} />
                        <span className={`text-xs font-semibold uppercase ${r.severity === 'high' ? 'text-red-600' : r.severity === 'medium' ? 'text-yellow-600' : 'text-green-600'}`}>{r.severity}</span>
                        <span className="text-xs text-gray-400 ml-auto">{r.clause}</span>
                      </div>
                      <p className="text-xs text-gray-600 dark:text-gray-400">{r.description}</p>
                    </div>
                  ))}
                </>
              )}

              {/* ── Version History Panel ── */}
              {activePanel === 'history' && (
                <>
                  {history.length > 1 && (
                    <div className="p-3 bg-blue-50 dark:bg-blue-900/20 rounded-xl border border-blue-200 dark:border-blue-700 mb-2">
                      <p className="text-xs font-semibold text-blue-700 dark:text-blue-300 mb-2 flex items-center gap-1"><GitCompare size={12} /> Compare Versions</p>
                      <div className="flex gap-2 items-center mb-2">
                        <select className="flex-1 text-xs bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg p-1.5 outline-none text-gray-700 dark:text-gray-300" value={compareSelA} onChange={e => setCompareSelA(Number(e.target.value))}>
                          {history.map((h, i) => <option key={i} value={i}>v{h.version}</option>)}
                        </select>
                        <span className="text-xs text-gray-400">vs</span>
                        <select className="flex-1 text-xs bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg p-1.5 outline-none text-gray-700 dark:text-gray-300" value={compareSelB} onChange={e => setCompareSelB(Number(e.target.value))}>
                          {history.map((h, i) => <option key={i} value={i}>v{h.version}</option>)}
                        </select>
                        <button onClick={() => setDiffMode({ a: history[compareSelA], b: history[compareSelB] })} className="text-xs bg-blue-600 text-white px-2.5 py-1.5 rounded-lg font-medium whitespace-nowrap">Compare</button>
                      </div>
                      {diffMode && (
                        <div>
                          <div className="flex items-center justify-between mb-1">
                            <span className="text-xs text-gray-500">v{diffMode.a.version} → v{diffMode.b.version}</span>
                            <button onClick={() => setDiffMode(null)} className="text-xs text-red-500"><X size={11} /></button>
                          </div>
                          <DiffView oldText={diffMode.a.content} newText={diffMode.b.content} />
                        </div>
                      )}
                    </div>
                  )}
                  {history.map((h, i) => (
                    <div key={i} className="p-3 bg-gray-50 dark:bg-gray-700 rounded-xl border border-gray-200 dark:border-gray-600">
                      <div className="flex items-center justify-between mb-1">
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-bold text-[#CF6DFC]">v{h.version}</span>
                          <span className="text-xs font-medium text-gray-700 dark:text-white">{h.changes}</span>
                        </div>
                        <span className="text-xs text-gray-400">{formatDate(h.date)}</span>
                      </div>
                      <p className="text-xs text-gray-400 mb-2">by {h.author}</p>
                      <div className="flex gap-2">
                        <button onClick={() => handleRollback(h)} className="flex items-center gap-1 text-xs text-[#CF6DFC] font-semibold hover:underline"><RotateCcw size={10} /> Restore</button>
                        <button onClick={() => setDiffMode({ a: h, b: history[0] })} className="flex items-center gap-1 text-xs text-blue-500 font-semibold hover:underline"><GitCompare size={10} /> Diff</button>
                      </div>
                    </div>
                  ))}
                </>
              )}

              {/* ── Comments Panel ── */}
              {activePanel === 'comments' && (
                <>
                  <div className="space-y-3">
                    {comments.map(c => (
                      <div key={c.id} className={`p-3 rounded-xl border ${c.resolved ? 'border-gray-100 dark:border-gray-700 bg-gray-50 dark:bg-gray-700/30 opacity-60' : 'border-green-200 dark:border-green-800 bg-green-50 dark:bg-green-900/10'}`}>
                        <div className="flex items-center justify-between mb-1.5">
                          <div className="flex items-center gap-1.5">
                            <div className="w-6 h-6 rounded-full bg-gradient-to-br from-purple-400 to-pink-500 flex items-center justify-center">
                              <span className="text-white text-xs font-bold">{c.author[0]}</span>
                            </div>
                            <span className="text-xs font-semibold text-gray-800 dark:text-white">{c.author}</span>
                          </div>
                          <span className="text-xs text-gray-400">{c.time}</span>
                        </div>
                        {c.selection && <p className="text-xs italic text-gray-400 bg-yellow-50 dark:bg-yellow-900/20 px-2 py-1 rounded mb-1.5">"{c.selection}"</p>}
                        <p className="text-xs text-gray-700 dark:text-gray-300 mb-2">{c.text}</p>
                        {!c.resolved && (
                          <button onClick={() => resolveComment(c.id)} className="flex items-center gap-1 text-xs text-green-600 font-semibold hover:underline">
                            <Check size={11} /> Resolve
                          </button>
                        )}
                        {c.resolved && <span className="text-xs text-gray-400 italic">Resolved</span>}
                      </div>
                    ))}
                  </div>
                  <div className="border-t border-gray-100 dark:border-gray-700 pt-3">
                    <textarea value={newComment} onChange={e => setNewComment(e.target.value)} placeholder="Add a comment or suggestion..." className="w-full text-xs bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-xl p-3 resize-none outline-none focus:border-[#CF6DFC] text-gray-700 dark:text-gray-300" rows={3} />
                    <button onClick={addComment} className="mt-2 w-full flex items-center justify-center gap-1.5 text-xs bg-green-600 text-white py-2 rounded-lg font-semibold hover:bg-green-700 transition-colors">
                      <SendIcon size={11} /> Post Comment
                    </button>
                  </div>
                </>
              )}

              {/* ── Approval Workflow Panel ── */}
              {activePanel === 'approval' && (
                <>
                  <div className="p-3 bg-indigo-50 dark:bg-indigo-900/20 rounded-xl border border-indigo-200 dark:border-indigo-700">
                    <p className="text-xs font-semibold text-indigo-700 dark:text-indigo-300 mb-2">Approval Mode</p>
                    <div className="flex gap-2">
                      {(['sequential', 'parallel'] as const).map(mode => (
                        <button key={mode} onClick={() => setApprovalMode(mode)} className={`flex-1 py-1.5 text-xs font-semibold rounded-lg transition-colors ${approvalMode === mode ? 'bg-indigo-600 text-white' : 'bg-white dark:bg-gray-700 text-gray-600 dark:text-gray-300 border border-gray-200 dark:border-gray-600'}`}>
                          {mode === 'sequential' ? '📋 Sequential' : '⚡ Parallel'}
                        </button>
                      ))}
                    </div>
                    <p className="text-xs text-gray-500 mt-2">{approvalMode === 'sequential' ? 'Approvers are notified one at a time in order.' : 'All approvers are notified simultaneously.'}</p>
                  </div>

                  <div className="space-y-2">
                    <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Approval Chain</p>
                    {approvers.map((a, idx) => (
                      <div key={a.id} className={`p-3 rounded-xl border ${a.status === 'approved' ? 'border-green-200 bg-green-50 dark:bg-green-900/10' : a.status === 'rejected' ? 'border-red-200 bg-red-50 dark:bg-red-900/10' : 'border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-700'}`}>
                        <div className="flex items-center gap-2">
                          <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${a.status === 'approved' ? 'bg-green-500 text-white' : a.status === 'rejected' ? 'bg-red-500 text-white' : 'bg-gray-300 dark:bg-gray-600 text-gray-700 dark:text-gray-300'}`}>
                            {a.status === 'approved' ? '✓' : a.status === 'rejected' ? '✗' : idx + 1}
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-xs font-semibold text-gray-800 dark:text-white">{a.name}</p>
                            <p className="text-xs text-gray-400">{a.role}</p>
                          </div>
                          <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${a.status === 'approved' ? 'bg-green-100 text-green-700' : a.status === 'rejected' ? 'bg-red-100 text-red-700' : 'bg-gray-100 dark:bg-gray-600 text-gray-500 dark:text-gray-400'}`}>{a.status}</span>
                        </div>
                        {a.comment && <p className="text-xs text-red-600 dark:text-red-400 mt-1.5 italic">"{a.comment}"</p>}
                        {a.status === 'pending' && (
                          <div className="flex gap-2 mt-2">
                            <button onClick={() => handleApproverAction(a.id, 'approved')} className="flex-1 text-xs py-1 bg-green-600 text-white rounded-lg font-medium hover:bg-green-700 transition-colors">Approve</button>
                            <button onClick={() => handleApproverAction(a.id, 'rejected')} className="flex-1 text-xs py-1 bg-red-500 text-white rounded-lg font-medium hover:bg-red-600 transition-colors">Reject</button>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>

                  {/* Add Approver */}
                  <div className="p-3 bg-gray-50 dark:bg-gray-700 rounded-xl border border-dashed border-gray-300 dark:border-gray-600">
                    <p className="text-xs font-semibold text-gray-500 mb-2">Add Approver</p>
                    <input value={newApproverName} onChange={e => setNewApproverName(e.target.value)} placeholder="Name" className="w-full text-xs bg-white dark:bg-gray-600 border border-gray-200 dark:border-gray-500 rounded-lg px-2.5 py-1.5 mb-2 outline-none focus:border-[#CF6DFC] text-gray-700 dark:text-gray-200" />
                    <input value={newApproverEmail} onChange={e => setNewApproverEmail(e.target.value)} placeholder="Email" className="w-full text-xs bg-white dark:bg-gray-600 border border-gray-200 dark:border-gray-500 rounded-lg px-2.5 py-1.5 mb-2 outline-none focus:border-[#CF6DFC] text-gray-700 dark:text-gray-200" />
                    <button onClick={handleAddApprover} className="w-full text-xs bg-indigo-600 text-white py-1.5 rounded-lg font-medium hover:bg-indigo-700 transition-colors">Add to Chain</button>
                  </div>

                  <button onClick={handleSendApproval} className="w-full flex items-center justify-center gap-2 py-2.5 gradient-primary text-white text-xs font-semibold rounded-xl hover:opacity-90 shadow-sm">
                    <SendIcon size={13} /> Trigger Approval Workflow
                  </button>
                </>
              )}

              {/* ── E-Signature Panel ── */}
              {activePanel === 'esign' && (
                <>
                  <div className="p-3 bg-pink-50 dark:bg-pink-900/20 rounded-xl border border-pink-200 dark:border-pink-700">
                    <p className="text-xs font-semibold text-pink-700 dark:text-pink-300 mb-2">Signing Mode</p>
                    <div className="flex gap-2">
                      {(['sequential', 'parallel'] as const).map(mode => (
                        <button key={mode} onClick={() => setSignMode(mode)} className={`flex-1 py-1.5 text-xs font-semibold rounded-lg transition-colors ${signMode === mode ? 'bg-pink-600 text-white' : 'bg-white dark:bg-gray-700 text-gray-600 dark:text-gray-300 border border-gray-200 dark:border-gray-600'}`}>
                          {mode === 'sequential' ? '📋 Sequential' : '⚡ Parallel'}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="space-y-2">
                    <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Signatories</p>
                    {signers.map((s, idx) => (
                      <div key={s.id} className={`p-3 rounded-xl border ${s.status === 'signed' ? 'border-green-200 bg-green-50 dark:bg-green-900/10' : 'border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-700'}`}>
                        <div className="flex items-center gap-2">
                          <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${s.status === 'signed' ? 'bg-green-500 text-white' : 'bg-gray-300 dark:bg-gray-500 text-gray-700 dark:text-gray-300'}`}>
                            {s.status === 'signed' ? '✓' : idx + 1}
                          </div>
                          <div className="flex-1">
                            <p className="text-xs font-semibold text-gray-800 dark:text-white">{s.name}</p>
                            <p className="text-xs text-gray-400">{s.role}</p>
                            {s.signedAt && <p className="text-xs text-green-600 mt-0.5">Signed {formatDate(s.signedAt)}</p>}
                          </div>
                          <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${s.status === 'signed' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>{s.status}</span>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="space-y-2">
                    <button onClick={() => setShowSignModal(true)} className="w-full flex items-center justify-center gap-2 py-2.5 gradient-primary text-white text-xs font-semibold rounded-xl hover:opacity-90 shadow-sm">
                      <PenTool size={13} /> Sign Document Now
                    </button>
                    <button onClick={() => { setNotifications(prev => [{ id: Date.now().toString(), type: 'info', message: 'Signature request sent to all signatories', time: 'Just now', read: false }, ...prev]); toast.success('Signature request sent to all parties'); }} className="w-full flex items-center justify-center gap-2 py-2.5 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-200 text-xs font-semibold rounded-xl hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors">
                      <SendIcon size={13} /> Send Signature Request
                    </button>
                  </div>

                  <div className="p-3 bg-gray-50 dark:bg-gray-700 rounded-xl">
                    <div className="flex items-center gap-2 mb-2">
                      <CheckCircle size={12} className="text-green-500" />
                      <p className="text-xs font-semibold text-gray-700 dark:text-gray-300">Signature Progress</p>
                    </div>
                    <div className="h-2 bg-gray-200 dark:bg-gray-600 rounded-full">
                      <div className="h-2 rounded-full bg-gradient-to-r from-green-400 to-emerald-500 transition-all" style={{ width: `${(signers.filter(s => s.status === 'signed').length / signers.length) * 100}%` }} />
                    </div>
                    <p className="text-xs text-gray-500 mt-1">{signers.filter(s => s.status === 'signed').length} of {signers.length} signed</p>
                  </div>
                </>
              )}

              {/* ── Notifications Panel ── */}
              {activePanel === 'notifications' && (
                <>
                  <div className="flex items-center justify-between">
                    <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide">{unreadCount} unread</p>
                    <button onClick={() => setNotifications(prev => prev.map(n => ({ ...n, read: true })))} className="text-xs text-[#CF6DFC] hover:underline">Mark all read</button>
                  </div>
                  {notifications.map(n => (
                    <div key={n.id} onClick={() => setNotifications(prev => prev.map(no => no.id === n.id ? { ...no, read: true } : no))} className={`p-3 rounded-xl border cursor-pointer transition-all ${!n.read ? n.type === 'warning' ? 'border-amber-200 bg-amber-50 dark:bg-amber-900/10' : n.type === 'success' ? 'border-green-200 bg-green-50 dark:bg-green-900/10' : 'border-blue-200 bg-blue-50 dark:bg-blue-900/10' : 'border-gray-100 dark:border-gray-700 bg-gray-50 dark:bg-gray-700/30 opacity-60'}`}>
                      <div className="flex items-start gap-2">
                        <div className={`w-2 h-2 rounded-full mt-1.5 shrink-0 ${n.type === 'warning' ? 'bg-amber-400' : n.type === 'success' ? 'bg-green-400' : 'bg-blue-400'} ${!n.read ? 'animate-pulse' : ''}`} />
                        <div>
                          <p className="text-xs text-gray-700 dark:text-gray-300">{n.message}</p>
                          <p className="text-xs text-gray-400 mt-1">{n.time}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                  <div className="pt-2 border-t border-gray-100 dark:border-gray-700">
                    <p className="text-xs font-semibold text-gray-500 mb-2">Smart Reminders</p>
                    {[
                      { label: 'Expiry Alert', desc: '90 / 30 / 7 days before', active: true },
                      { label: 'Signature Pending', desc: 'After 48h without action', active: true },
                      { label: 'Approval Overdue', desc: 'After 24h of inaction', active: false },
                    ].map(r => (
                      <div key={r.label} className="flex items-center justify-between py-2 border-b border-gray-50 dark:border-gray-700 last:border-0">
                        <div>
                          <p className="text-xs font-medium text-gray-700 dark:text-gray-300">{r.label}</p>
                          <p className="text-xs text-gray-400">{r.desc}</p>
                        </div>
                        <button onClick={() => toast.success(`Reminder ${r.active ? 'disabled' : 'enabled'}`)} className={`w-9 h-5 rounded-full transition-colors relative ${r.active ? 'bg-[#CF6DFC]' : 'bg-gray-300 dark:bg-gray-600'}`}>
                          <div className={`w-4 h-4 bg-white rounded-full shadow absolute top-0.5 transition-all ${r.active ? 'right-0.5' : 'left-0.5'}`} />
                        </button>
                      </div>
                    ))}
                  </div>
                </>
              )}
            </div>
          </div>
        )}
      </div>

      {/* ── E-Signature Modal ── */}
      {showSignModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
          <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-2xl w-full max-w-md mx-4 overflow-hidden border border-gray-100 dark:border-gray-700">
            <div className="px-6 pt-6 pb-4 border-b border-gray-100 dark:border-gray-700">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-9 h-9 gradient-primary rounded-xl flex items-center justify-center">
                    <PenTool size={16} className="text-white" />
                  </div>
                  <div>
                    <h3 className="font-heading font-bold text-gray-900 dark:text-white">Sign Document</h3>
                    <p className="text-xs text-gray-500">{title}</p>
                  </div>
                </div>
                <button onClick={() => setShowSignModal(false)} className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-xl transition-colors"><X size={16} /></button>
              </div>
            </div>

            <div className="p-6 space-y-5">
              {/* Signature type */}
              <div>
                <p className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Signature Type</p>
                <div className="flex gap-2">
                  {(['typed', 'drawn'] as const).map(t => (
                    <button key={t} onClick={() => setSignType(t)} className={`flex-1 py-2 rounded-xl text-sm font-semibold border transition-colors ${signType === t ? 'bg-[#CF6DFC] text-white border-[#CF6DFC]' : 'border-gray-200 dark:border-gray-600 text-gray-600 dark:text-gray-300'}`}>
                      {t === 'typed' ? '⌨️ Type' : '✏️ Draw'}
                    </button>
                  ))}
                </div>
              </div>

              {signType === 'typed' ? (
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Type your full name</label>
                  <input value={typedSig} onChange={e => setTypedSig(e.target.value)} placeholder="e.g. Ananya Krishnan" className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-xl outline-none focus:border-[#CF6DFC] text-gray-800 dark:text-white" style={{ fontFamily: 'cursive', fontSize: '20px', letterSpacing: '1px' }} />
                  {typedSig && (
                    <div className="mt-3 p-4 bg-purple-50 dark:bg-purple-900/20 rounded-xl border border-purple-200 dark:border-purple-700 text-center">
                      <p className="text-xs text-gray-400 mb-1">Your signature will appear as:</p>
                      <p style={{ fontFamily: 'cursive', fontSize: '24px', color: '#1a1a2e', letterSpacing: '2px' }} className="text-gray-900 dark:text-white">{typedSig}</p>
                    </div>
                  )}
                </div>
              ) : (
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Draw your signature</label>
                    <button onClick={clearCanvas} className="text-xs text-red-500 hover:underline">Clear</button>
                  </div>
                  <canvas ref={canvasRef} width={380} height={120} className="w-full border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-xl cursor-crosshair bg-white dark:bg-gray-700"
                    onMouseDown={startDraw} onMouseMove={draw} onMouseUp={() => setIsDrawing(false)} onMouseLeave={() => setIsDrawing(false)} />
                  <p className="text-xs text-gray-400 mt-1 text-center">Draw your signature above using your mouse</p>
                </div>
              )}

              {/* Consent */}
              <div className="p-3 bg-blue-50 dark:bg-blue-900/20 rounded-xl border border-blue-200 dark:border-blue-700">
                <div className="flex items-start gap-2">
                  <CheckCircle size={14} className="text-blue-500 mt-0.5 shrink-0" />
                  <p className="text-xs text-gray-600 dark:text-gray-400">By signing, I agree this is a legally binding electronic signature under the IT Act 2000. I confirm I have read and agree to all terms.</p>
                </div>
              </div>

              <div className="flex gap-3">
                <button onClick={() => setShowSignModal(false)} className="flex-1 py-3 border border-gray-200 dark:border-gray-600 rounded-xl text-sm font-medium text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">Cancel</button>
                <button onClick={handleSign} className="flex-1 py-3 gradient-primary text-white text-sm font-bold rounded-xl hover:opacity-90 shadow-lg transition-all active:scale-95">
                  ✍️ Confirm Signature
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
