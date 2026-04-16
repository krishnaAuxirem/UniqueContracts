import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, Search, Filter, FileText, Download, Trash2, Eye, Edit, X } from 'lucide-react';
import { getContracts, deleteContract, createNewContract } from '@/lib/mockData';
import { getCurrentUser } from '@/lib/auth';
import { formatCurrency, formatDate, getStatusColor, getStatusLabel, getRiskColor, getRiskLabel } from '@/lib/utils';
import { toast } from 'sonner';

const CONTRACT_TYPES = ['All Types', 'NDA', 'Service Agreement', 'Employment', 'Partnership Agreement', 'Influencer Agreement', 'Retainer Agreement'];
const STATUS_OPTIONS = ['All Status', 'active', 'draft', 'pending_signature', 'pending_review', 'expired'];

export default function Contracts() {
  const navigate = useNavigate();
  const user = getCurrentUser();
  const [contracts, setContracts] = useState(getContracts());
  const [search, setSearch] = useState('');
  const [typeFilter, setTypeFilter] = useState('All Types');
  const [statusFilter, setStatusFilter] = useState('All Status');
  const [showCreate, setShowCreate] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newType, setNewType] = useState('Service Agreement');

  const filtered = contracts.filter(c => {
    const matchSearch = c.title.toLowerCase().includes(search.toLowerCase()) || c.type.toLowerCase().includes(search.toLowerCase());
    const matchType = typeFilter === 'All Types' || c.type === typeFilter;
    const matchStatus = statusFilter === 'All Status' || c.status === statusFilter;
    return matchSearch && matchType && matchStatus;
  });

  const handleDelete = (id: string) => {
    deleteContract(id);
    setContracts(getContracts());
    toast.success('Contract deleted');
  };

  const handleCreate = () => {
    if (!newTitle.trim()) { toast.error('Please enter a contract title'); return; }
    const contract = createNewContract(newTitle, newType, user?.id || 'u1');
    toast.success('Contract created!');
    setShowCreate(false);
    setNewTitle('');
    navigate(`/dashboard/editor/${contract.id}`);
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-heading font-bold text-[#111827] dark:text-white">Contract Repository</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">{contracts.length} contracts · {contracts.filter(c => c.status === 'active').length} active</p>
        </div>
        <button onClick={() => setShowCreate(true)} className="flex items-center gap-2 px-5 py-2.5 gradient-primary text-white text-sm font-semibold rounded-xl hover:opacity-90 shadow-md">
          <Plus size={16} /> New Contract
        </button>
      </div>

      {/* Create Modal */}
      {showCreate && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
          <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 w-full max-w-md shadow-2xl border border-gray-100 dark:border-gray-700">
            <div className="flex items-center justify-between mb-5">
              <h3 className="font-heading font-bold text-lg text-[#111827] dark:text-white">Create New Contract</h3>
              <button onClick={() => setShowCreate(false)} className="p-1.5 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100"><X size={16} /></button>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Contract Title</label>
                <input value={newTitle} onChange={e => setNewTitle(e.target.value)} placeholder="e.g. NDA with Partner Corp" className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-xl text-sm focus:outline-none focus:border-[#CF6DFC] text-gray-800 dark:text-white" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Contract Type</label>
                <select value={newType} onChange={e => setNewType(e.target.value)} className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-xl text-sm focus:outline-none focus:border-[#CF6DFC] text-gray-800 dark:text-white">
                  {CONTRACT_TYPES.slice(1).map(t => <option key={t}>{t}</option>)}
                </select>
              </div>
              <div className="flex gap-3 pt-2">
                <button onClick={() => setShowCreate(false)} className="flex-1 py-3 border border-gray-200 dark:border-gray-600 rounded-xl text-sm font-medium text-gray-600 dark:text-gray-300 hover:bg-gray-50">Cancel</button>
                <button onClick={handleCreate} className="flex-1 py-3 gradient-primary text-white text-sm font-semibold rounded-xl hover:opacity-90 shadow-lg">Create & Edit</button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Filters */}
      <div className="flex flex-wrap items-center gap-3">
        <div className="relative flex-1 min-w-[200px]">
          <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search contracts..." className="w-full pl-9 pr-4 py-2.5 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl text-sm focus:outline-none focus:border-[#CF6DFC] text-gray-700 dark:text-gray-300" />
        </div>
        <select value={typeFilter} onChange={e => setTypeFilter(e.target.value)} className="px-4 py-2.5 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl text-sm focus:outline-none text-gray-700 dark:text-gray-300">
          {CONTRACT_TYPES.map(t => <option key={t}>{t}</option>)}
        </select>
        <select value={statusFilter} onChange={e => setStatusFilter(e.target.value)} className="px-4 py-2.5 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl text-sm focus:outline-none text-gray-700 dark:text-gray-300">
          {STATUS_OPTIONS.map(s => <option key={s}>{s === 'All Status' ? s : getStatusLabel(s)}</option>)}
        </select>
        <span className="text-sm text-gray-400">{filtered.length} results</span>
      </div>

      {/* Contracts Table */}
      <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 dark:bg-gray-700/50">
              <tr>
                {['Contract', 'Type', 'Status', 'Value', 'Risk', 'Updated', 'Actions'].map(h => (
                  <th key={h} className="text-left text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide px-4 py-3">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50 dark:divide-gray-700">
              {filtered.length === 0 ? (
                <tr><td colSpan={7} className="text-center py-12 text-gray-400">No contracts found</td></tr>
              ) : filtered.map(c => (
                <tr key={c.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/30 transition-colors">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-xl bg-purple-50 dark:bg-purple-900/20 flex items-center justify-center shrink-0">
                        <FileText size={15} className="text-[#CF6DFC]" />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-800 dark:text-white max-w-[200px] truncate">{c.title}</p>
                        <p className="text-xs text-gray-400">v{c.version} · {c.parties.length} parties</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-600 dark:text-gray-400">{c.type}</td>
                  <td className="px-4 py-3">
                    <span className={`text-xs px-2.5 py-1 rounded-full font-medium ${getStatusColor(c.status)}`}>{getStatusLabel(c.status)}</span>
                  </td>
                  <td className="px-4 py-3 text-sm font-semibold text-[#CF6DFC]">{c.value ? formatCurrency(c.value) : '—'}</td>
                  <td className="px-4 py-3">
                    {c.riskScore !== undefined ? (
                      <span className={`text-xs font-semibold ${getRiskColor(c.riskScore)}`}>{getRiskLabel(c.riskScore)}</span>
                    ) : '—'}
                  </td>
                  <td className="px-4 py-3 text-xs text-gray-400">{formatDate(c.updatedAt)}</td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-1">
                      <button onClick={() => navigate(`/dashboard/editor/${c.id}`)} className="p-1.5 text-blue-400 hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-colors"><Edit size={14} /></button>
                      <button className="p-1.5 text-gray-400 hover:text-gray-600 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"><Download size={14} /></button>
                      <button onClick={() => handleDelete(c.id)} className="p-1.5 text-red-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"><Trash2 size={14} /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
