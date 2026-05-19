import React, { useMemo, useState } from 'react';
import { AlunoLiterario, GENEROS_LITERARIOS } from '../data/mockData';
import { BarChart3, BookText, Database, Download, Search, Trash2, Trophy, Upload, Users } from 'lucide-react';

interface StatsAndDexProps {
  alunos: AlunoLiterario[];
  onAtualizarAlunos: (novaLista: AlunoLiterario[]) => void | Promise<void>;
  onExcluirAluno?: (id: string) => void | Promise<void>;
  allowDataManagement?: boolean;
}

export const StatsAndDex: React.FC<StatsAndDexProps> = ({ alunos, onAtualizarAlunos, onExcluirAluno, allowDataManagement = true }) => {
  const [abaAtiva, setAbaAtiva] = useState<'stats' | 'lista'>('stats');
  const [buscaDex, setBuscaDex] = useState('');
  const [isSyncing, setIsSyncing] = useState(false);

  const statsGenero = useMemo(() => {
    const mapa: Record<string, number> = {};
    GENEROS_LITERARIOS.forEach((g) => { mapa[g.nome] = 0; });
    alunos.forEach((a) => { mapa[a.genero || 'Fantasia'] = (mapa[a.genero || 'Fantasia'] || 0) + 1; });
    const max = Object.values(mapa).reduce((m, c) => (c > m ? c : m), 1);
    return GENEROS_LITERARIOS.map((g) => ({
      ...g, count: mapa[g.nome] || 0,
      pct: Math.round(((mapa[g.nome] || 0) / (alunos.length || 1)) * 100),
      bar: Math.max(2, Math.round(((mapa[g.nome] || 0) / max) * 100))
    })).sort((a, b) => b.count - a.count);
  }, [alunos]);

  const topLivros = useMemo(() => {
    const c: Record<string, number> = {};
    alunos.forEach((a) => { const n = a.livroFavorito.trim(); c[n] = (c[n] || 0) + 1; });
    return Object.keys(c).map((n) => ({ nome: n, count: c[n] })).sort((a, b) => b.count - a.count).slice(0, 5);
  }, [alunos]);

  const topAutores = useMemo(() => {
    const c: Record<string, number> = {};
    alunos.forEach((a) => { const n = a.autorFavorito.trim(); c[n] = (c[n] || 0) + 1; });
    return Object.keys(c).map((n) => ({ nome: n, count: c[n] })).sort((a, b) => b.count - a.count).slice(0, 5);
  }, [alunos]);

  const filtrados = useMemo(() => {
    return alunos.filter((a) =>
      a.aluno.toLowerCase().includes(buscaDex.toLowerCase()) ||
      a.autorFavorito.toLowerCase().includes(buscaDex.toLowerCase()) ||
      a.livroFavorito.toLowerCase().includes(buscaDex.toLowerCase()) ||
      a.curso.toLowerCase().includes(buscaDex.toLowerCase())
    );
  }, [alunos, buscaDex]);

  const handleExport = () => {
    if (!alunos.length) return;
    const d = document.createElement('a');
    d.href = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(alunos, null, 2));
    d.download = `coleta_${new Date().toISOString().split('T')[0]}.json`;
    d.click();
  };

  const handleImport = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.[0]) {
      const r = new FileReader();
      r.readAsText(e.target.files[0], 'UTF-8');
      r.onload = (ev) => {
        try {
          const p = JSON.parse(ev.target?.result as string);
          if (Array.isArray(p)) { setIsSyncing(true); Promise.resolve(onAtualizarAlunos(p)).finally(() => setIsSyncing(false)); }
        } catch { alert('JSON inválido.'); }
      };
    }
  };

  const handleClear = async () => {
    if (!window.confirm('Apagar todos os registros?')) return;
    setIsSyncing(true);
    try { await onAtualizarAlunos([]); } finally { setIsSyncing(false); }
  };

  const handleDel = async (id: string) => {
    setIsSyncing(true);
    try { onExcluirAluno ? await onExcluirAluno(id) : await onAtualizarAlunos(alunos.filter((a) => a.id !== id)); }
    finally { setIsSyncing(false); }
  };

  return (
    <section className="neo-card bg-[#2d6a4f] overflow-hidden">
      <div className="p-6 sm:p-8 border-b-[3px] border-black bg-[#e8dcc8] flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div>
          <span className="font-pixel text-[9px] tracking-widest">DATA HUB</span>
          <h2 className="font-display text-3xl sm:text-4xl font-black leading-none mt-1">Painel do polo.</h2>
          <p className="text-sm text-zinc-700 mt-2">{isSyncing ? 'Sincronizando...' : 'Tendências e gestão de registros.'}</p>
        </div>
        <div className="neo-card-sm bg-white p-1 inline-flex gap-1 w-fit">
          <button onClick={() => setAbaAtiva('stats')} className={`px-4 py-2 rounded-[14px] text-sm font-black transition-colors ${abaAtiva === 'stats' ? 'bg-[#2d6a4f] text-white' : ''}`}>
            Estatísticas
          </button>
          <button onClick={() => setAbaAtiva('lista')} className={`px-4 py-2 rounded-[14px] text-sm font-black transition-colors ${abaAtiva === 'lista' ? 'bg-[#ffcf44] text-black' : ''}`}>
            Registros ({alunos.length})
          </button>
        </div>
      </div>

      {abaAtiva === 'stats' && (
        <div className="p-6 sm:p-8 space-y-6 animate-fade-up">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <NeoStat icon={<Users className="w-5 h-5" />} label="Leitores" value={String(alunos.length)} bg="bg-white" />
            <NeoStat icon={<BookText className="w-5 h-5" />} label="Autores únicos" value={String(new Set(alunos.map((a) => a.autorFavorito)).size)} bg="bg-[#b7e4c7]" />
            <NeoStat icon={<Trophy className="w-5 h-5" />} label="Gênero campeão" value={statsGenero[0]?.count > 0 ? statsGenero[0].nome : '—'} bg="bg-[#ffcf44]" />
          </div>

          <div className="grid grid-cols-1 xl:grid-cols-[1.1fr_0.9fr] gap-5">
            <div className="neo-card bg-white p-5 sm:p-6">
              <div className="flex items-center gap-2 mb-4">
                <BarChart3 className="w-5 h-5" />
                <h3 className="font-display text-2xl font-black">Distribuição por gênero</h3>
              </div>
              <div className="space-y-3">
                {statsGenero.map((g) => (
                  <div key={g.nome}>
                    <div className="flex justify-between mb-1">
                      <span className="text-sm font-bold">{g.nome}</span>
                      <span className="neo-pill bg-[#e8dcc8] px-3 py-0.5 text-xs font-bold">{g.count} · {g.pct}%</span>
                    </div>
                    <div className="h-6 rounded-full border-2 border-black bg-zinc-100 overflow-hidden">
                      <div className={`h-full ${g.corBg} transition-all duration-700 rounded-full`} style={{ width: `${g.bar}%` }} />
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div className="space-y-5">
              <RankingCard title="Top autores" items={topAutores} bg="bg-[#ffcf44]" />
              <RankingCard title="Top livros" items={topLivros} bg="bg-[#b7e4c7]" italic />
            </div>
          </div>
        </div>
      )}

      {abaAtiva === 'lista' && (
        <div className="p-6 sm:p-8 space-y-4 animate-fade-up">
          <div className="neo-card bg-white p-4 flex flex-col lg:flex-row gap-3 lg:items-center">
            <div className="relative flex-1">
              <Search className="w-4 h-4 absolute left-4 top-1/2 -translate-y-1/2 text-zinc-400" />
              <input type="text" placeholder="Buscar..." value={buscaDex} onChange={(e) => setBuscaDex(e.target.value)} className="neo-input w-full pl-11 pr-4 py-2.5 text-sm" />
            </div>
            <div className="flex flex-wrap gap-2">
              <Btn onClick={handleExport} icon={<Download className="w-4 h-4" />} label="Exportar" bg="bg-[#b7e4c7]" />
              {allowDataManagement && (
                <>
                  <label className="cursor-pointer">
                    <Btn icon={<Upload className="w-4 h-4" />} label="Importar" bg="bg-[#e8dcc8]" />
                    <input type="file" accept=".json" onChange={handleImport} className="hidden" />
                  </label>
                  <Btn onClick={handleClear} icon={<Trash2 className="w-4 h-4" />} label="Limpar" bg="bg-[#ff6b35] text-white" />
                </>
              )}
            </div>
          </div>

          {filtrados.length === 0 ? (
            <div className="neo-card bg-white p-12 text-center">
              <Database className="w-10 h-10 mx-auto mb-3" />
              <h3 className="font-display text-3xl font-black">Sem resultados.</h3>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
              {filtrados.map((a, i) => {
                const gen = GENEROS_LITERARIOS.find((g) => g.nome === a.genero);
                const colors = ['bg-white', 'bg-[#e8dcc8]', 'bg-[#b7e4c7]', 'bg-[#ffcf44]'];
                return (
                  <article key={a.id} className={`neo-card-sm ${colors[i % colors.length]} p-4 flex items-start gap-3`}>
                    <div className="w-11 h-11 rounded-full border-2 border-black bg-[#2d6a4f] text-white flex items-center justify-center text-base font-black shrink-0">
                      {a.aluno.charAt(0).toUpperCase()}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <h4 className="font-display text-lg font-black leading-tight truncate">{a.aluno}</h4>
                          <p className="text-xs text-zinc-600">{a.curso}</p>
                        </div>
                        {allowDataManagement && (
                          <button onClick={() => handleDel(a.id)} className="neo-btn bg-white w-9 h-9 flex items-center justify-center shrink-0">
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        )}
                      </div>
                      <div className="mt-2 space-y-1 text-sm">
                        <div><span className="font-bold">Livro:</span> <span className="italic">{a.livroFavorito}</span></div>
                        <div><span className="font-bold">Autor:</span> {a.autorFavorito}</div>
                      </div>
                      <div className="mt-2">
                        <span className={`neo-pill px-3 py-0.5 text-xs font-bold ${gen?.corBgSoft || 'bg-white'} ${gen?.corTexto || ''}`}>{a.genero}</span>
                      </div>
                    </div>
                  </article>
                );
              })}
            </div>
          )}
        </div>
      )}
    </section>
  );
};

const NeoStat: React.FC<{ icon: React.ReactNode; label: string; value: string; bg: string }> = ({ icon, label, value, bg }) => (
  <div className={`neo-card ${bg} p-5`}>
    <div className="w-10 h-10 rounded-full border-2 border-black bg-white flex items-center justify-center mb-3">{icon}</div>
    <p className="text-xs font-bold text-zinc-600">{label}</p>
    <h3 className="font-display text-3xl font-black leading-none mt-1">{value}</h3>
  </div>
);

const RankingCard: React.FC<{ title: string; items: { nome: string; count: number }[]; bg: string; italic?: boolean }> = ({ title, items, bg, italic }) => (
  <div className={`neo-card ${bg} p-5`}>
    <h4 className="font-display text-xl font-black mb-3">{title}</h4>
    {items.length === 0 ? <p className="text-sm">Sem dados.</p> : (
      <div className="space-y-2.5">
        {items.map((item, idx) => (
          <div key={item.nome} className="neo-card-sm bg-white p-3 flex items-center gap-3">
            <span className="w-7 h-7 rounded-full border-2 border-black bg-black text-white flex items-center justify-center text-xs font-black">{idx + 1}</span>
            <span className={`flex-1 text-sm font-bold truncate ${italic ? 'italic' : ''}`}>{item.nome}</span>
            <span className="neo-pill bg-[#e8dcc8] px-2.5 py-0.5 text-xs font-bold">{item.count}</span>
          </div>
        ))}
      </div>
    )}
  </div>
);

const Btn: React.FC<{ onClick?: () => void; icon: React.ReactNode; label: string; bg: string }> = ({ onClick, icon, label, bg }) => (
  <button onClick={onClick} className={`neo-btn ${bg} px-4 py-2.5 text-sm font-bold inline-flex items-center gap-2`}>
    {icon}<span>{label}</span>
  </button>
);
