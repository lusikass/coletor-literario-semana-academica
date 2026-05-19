import React, { useState } from 'react';
import { AlunoLiterario } from '../data/mockData';
import { Download, Trash2, LogOut, Lock, X, Search } from 'lucide-react';

interface AdminPanelProps {
  isOpen: boolean;
  onClose: () => void;
  alunos: AlunoLiterario[];
  onDeleteEntry: (id: string) => Promise<void>;
  onClearAll: () => Promise<void>;
  usingRemoteDatabase: boolean;
}

const ADMIN_LOGIN = 'LucasGOAT';
const ADMIN_PASSWORD = 'KanyeSon';

export const AdminPanel: React.FC<AdminPanelProps> = ({ isOpen, onClose, alunos, onDeleteEntry, onClearAll, usingRemoteDatabase }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [login, setLogin] = useState('');
  const [password, setPassword] = useState('');
  const [loginError, setLoginError] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  if (!isOpen) return null;

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (login === ADMIN_LOGIN && password === ADMIN_PASSWORD) {
      setIsLoggedIn(true);
      setLoginError('');
      setLogin('');
      setPassword('');
    } else {
      setLoginError('Login ou senha incorretos.');
    }
  };

  const handleLogout = () => { setIsLoggedIn(false); setLogin(''); setPassword(''); setSearchTerm(''); };

  const handleDelete = async (id: string, nome: string) => {
    if (!window.confirm(`Excluir registro de "${nome}"?`)) return;
    setIsProcessing(true);
    try { await onDeleteEntry(id); } catch { alert('Erro ao excluir.'); }
    finally { setIsProcessing(false); }
  };

  const handleClearAll = async () => {
    if (!window.confirm('⚠️ Apagar TODOS os registros?')) return;
    setIsProcessing(true);
    try { await onClearAll(); } catch { alert('Erro ao limpar.'); }
    finally { setIsProcessing(false); }
  };

  const exportCSV = () => {
    if (!alunos.length) return;
    const h = ['Nome', 'Curso', 'Livro', 'Autor', 'Último', 'Gênero', 'Citação', 'Data'];
    const rows = alunos.map(a => [a.aluno, a.curso, a.livroFavorito, a.autorFavorito, a.ultimoLivroLido, a.genero, a.citacao.replace(/"/g, '""'), a.dataCaptura]);
    const csv = [h.join(','), ...rows.map(r => r.map(c => `"${c}"`).join(','))].join('\n');
    const l = document.createElement('a');
    l.href = URL.createObjectURL(new Blob([csv], { type: 'text/csv;charset=utf-8;' }));
    l.download = `registros_${new Date().toISOString().split('T')[0]}.csv`;
    l.click();
  };

  const exportJSON = () => {
    if (!alunos.length) return;
    const l = document.createElement('a');
    l.href = URL.createObjectURL(new Blob([JSON.stringify(alunos, null, 2)], { type: 'application/json' }));
    l.download = `registros_${new Date().toISOString().split('T')[0]}.json`;
    l.click();
  };

  const filtered = alunos.filter(a =>
    a.aluno.toLowerCase().includes(searchTerm.toLowerCase()) ||
    a.autorFavorito.toLowerCase().includes(searchTerm.toLowerCase()) ||
    a.livroFavorito.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="fixed inset-0 bg-black/65 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-fade-in">
      <div className="neo-card bg-[#1a1a1a] w-full max-w-5xl max-h-[92vh] overflow-hidden flex flex-col text-white">

        {/* Header */}
        <div className="flex items-center justify-between border-b-2 border-zinc-700 p-4 bg-[#2d6a4f]">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-[#ffcf44] border-2 border-black flex items-center justify-center">
              <Lock className="w-5 h-5 text-black" />
            </div>
            <div>
              <h2 className="font-display text-xl font-black">PAINEL ADMIN</h2>
              <p className="text-xs text-white/70">Semana Acadêmica 2026</p>
            </div>
          </div>
          <button onClick={onClose} className="neo-btn bg-white text-black w-10 h-10 flex items-center justify-center">
            <X className="w-5 h-5" />
          </button>
        </div>

        {!isLoggedIn ? (
          <div className="p-8 flex flex-col items-center justify-center min-h-[400px]">
            <div className="w-full max-w-sm">
              <div className="text-center mb-8">
                <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-[#ffcf44] border-3 border-black flex items-center justify-center">
                  <Lock className="w-8 h-8 text-black" />
                </div>
                <h3 className="font-display text-2xl font-black">Acesso Restrito</h3>
                <p className="text-sm text-zinc-400 mt-2">Somente organizadores</p>
              </div>

              <form onSubmit={handleLogin} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-zinc-400 mb-1">LOGIN</label>
                  <input type="text" value={login} onChange={(e) => setLogin(e.target.value)} className="neo-input w-full px-4 py-3 text-base text-black" placeholder="Login" required />
                </div>
                <div>
                  <label className="block text-xs font-bold text-zinc-400 mb-1">SENHA</label>
                  <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} className="neo-input w-full px-4 py-3 text-base text-black" placeholder="Senha" required />
                </div>
                {loginError && <div className="neo-card-sm bg-[#ff6b35] text-white p-3 text-sm font-bold">{loginError}</div>}
                <button type="submit" className="neo-btn w-full bg-[#ffcf44] text-black py-4 text-base font-black">ENTRAR</button>
              </form>
            </div>
          </div>
        ) : (
          <div className="flex-1 overflow-hidden flex flex-col">
            {/* Toolbar */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 p-4 border-b border-zinc-700 bg-[#111]">
              <div className="flex items-center gap-2">
                <span className="neo-pill bg-[#b7e4c7] text-black px-3 py-1 text-sm font-black">{alunos.length} registros</span>
                <span className="text-xs text-zinc-500">{usingRemoteDatabase ? 'Firebase' : 'Local'}</span>
              </div>
              <div className="flex flex-wrap gap-2">
                <button onClick={exportCSV} className="neo-btn bg-[#b7e4c7] text-black px-3 py-1.5 text-xs font-bold inline-flex items-center gap-1.5"><Download className="w-3.5 h-3.5" />CSV</button>
                <button onClick={exportJSON} className="neo-btn bg-[#b7e4c7] text-black px-3 py-1.5 text-xs font-bold inline-flex items-center gap-1.5"><Download className="w-3.5 h-3.5" />JSON</button>
                <button onClick={handleClearAll} disabled={isProcessing || !alunos.length} className="neo-btn bg-[#ff6b35] text-white px-3 py-1.5 text-xs font-bold inline-flex items-center gap-1.5 disabled:opacity-50"><Trash2 className="w-3.5 h-3.5" />Limpar</button>
                <button onClick={handleLogout} className="neo-btn bg-white text-black px-3 py-1.5 text-xs font-bold inline-flex items-center gap-1.5"><LogOut className="w-3.5 h-3.5" />Sair</button>
              </div>
            </div>

            {/* Search */}
            <div className="p-4 border-b border-zinc-700">
              <div className="relative">
                <Search className="w-4 h-4 absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500" />
                <input type="text" placeholder="Buscar registros..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="neo-input w-full pl-11 pr-4 py-2.5 text-sm text-black" />
              </div>
            </div>

            {/* Lista */}
            <div className="flex-1 overflow-auto p-4">
              {filtered.length === 0 ? (
                <div className="text-center py-12 text-zinc-500">{alunos.length === 0 ? 'Nenhum registro.' : 'Nenhum resultado.'}</div>
              ) : (
                <div className="space-y-2">
                  {filtered.map((a) => (
                    <div key={a.id} className="neo-card-sm bg-[#222] p-4 flex flex-col md:flex-row md:items-center gap-3 hover:bg-[#2a2a2a] transition-colors">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="font-display text-lg font-black text-white">{a.aluno}</span>
                          <span className="text-xs text-zinc-500">{a.curso}</span>
                          <span className="neo-pill bg-[#2d6a4f] text-white px-2 py-0.5 text-[10px] font-bold">{a.genero}</span>
                        </div>
                        <div className="mt-1.5 text-sm text-zinc-400 space-y-0.5">
                          <div><span className="text-zinc-500">Autor:</span> {a.autorFavorito}</div>
                          <div><span className="text-zinc-500">Livro:</span> <span className="italic">{a.livroFavorito}</span></div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs text-zinc-600">{a.dataCaptura}</span>
                        <button onClick={() => handleDelete(a.id, a.aluno)} disabled={isProcessing}
                          className="neo-btn bg-[#ff6b35] text-white px-3 py-1.5 text-xs font-bold inline-flex items-center gap-1 disabled:opacity-50"
                        >
                          <Trash2 className="w-3 h-3" /> Excluir
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
