import { useMemo, useState } from 'react';
import { CaptureForm } from './components/CaptureForm';
import { AuthorCloud } from './components/AuthorCloud';
import { StatsAndDex } from './components/StatsAndDex';
import { AdminPanel } from './components/AdminPanel';
import { BookHeart, Shield, Star } from 'lucide-react';
import { useLiteraryEntries } from './hooks/useLiteraryEntries';

export default function App() {
  const [isAdminOpen, setIsAdminOpen] = useState(false);
  const { alunos, isLoading, error, usingRemoteDatabase, addEntry, replaceEntries, deleteEntry } = useLiteraryEntries();

  const stats = useMemo(() => {
    const autores = new Set(alunos.map((a) => a.autorFavorito.trim()).filter(Boolean)).size;
    const livros = new Set(alunos.map((a) => a.livroFavorito.trim()).filter(Boolean)).size;
    return { autores, livros, leitores: alunos.length };
  }, [alunos]);

  return (
    <div className="min-h-screen bg-[#1a1a1a] bg-typo">

      {/* ── HEADER ── */}
      <header className="max-w-6xl mx-auto px-4 sm:px-6 pt-6 sm:pt-8">
        <div className="neo-card bg-[#2d6a4f] text-white px-5 py-4 sm:px-7 sm:py-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-full border-[3px] border-white bg-[#ffcf44] flex items-center justify-center shadow-[4px_4px_0_#111] animate-bob shrink-0">
              <BookHeart className="w-7 h-7 text-black" />
            </div>
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="font-pixel text-[9px] tracking-widest opacity-80">SEMANA ACADÊMICA 2026</span>
                <Star className="w-3.5 h-3.5 text-[#ffcf44]" fill="#ffcf44" />
              </div>
              <h1 className="font-display text-2xl sm:text-3xl font-black leading-none">Coletor Literário</h1>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2.5">
            <CounterPill label="leitores" value={stats.leitores} bg="bg-white text-black" />
            <CounterPill label="autores" value={stats.autores} bg="bg-[#ffcf44] text-black" />
            <CounterPill label="livros" value={stats.livros} bg="bg-[#b7e4c7] text-black" />
            <div className={`neo-pill px-3 py-1 text-[10px] font-bold ${usingRemoteDatabase ? 'bg-[#b7e4c7] text-black' : 'bg-[#ffcf44] text-black'}`}>
              {usingRemoteDatabase ? '● LIVE' : '● LOCAL'}
            </div>
          </div>
        </div>
      </header>

      {/* ── HERO / NUVEM ── */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 pt-6 sm:pt-8">
        {error && (
          <div className="neo-card-sm bg-[#ffcf44] p-4 mb-5 text-sm font-bold animate-fade-up">⚠️ {error}</div>
        )}
        {isLoading && (
          <div className="neo-card-sm bg-white p-4 mb-5 text-sm font-bold animate-fade-up">Carregando...</div>
        )}
        <AuthorCloud alunos={alunos} heroMode />
      </section>

      {/* ── COLETA (card gigante, não formulário) ── */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 py-8 space-y-8">
        <CaptureForm onAddAluno={addEntry} />

        <div id="dados">
          <StatsAndDex
            alunos={alunos}
            onAtualizarAlunos={replaceEntries}
            onExcluirAluno={deleteEntry}
            allowDataManagement={!usingRemoteDatabase}
          />
        </div>
      </section>

      {/* ── FOOTER ── */}
      <footer className="max-w-6xl mx-auto px-4 sm:px-6 pb-8">
        <div className="neo-card bg-[#2d6a4f] text-white px-5 py-4 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <Star className="w-4 h-4 text-[#ffcf44]" fill="#ffcf44" />
            <span className="text-sm font-medium">Semana Acadêmica 2026</span>
          </div>
          <button onClick={() => setIsAdminOpen(true)} className="neo-btn bg-black text-white border-white px-4 py-1.5 text-xs font-bold inline-flex items-center gap-1.5">
            <Shield className="w-3.5 h-3.5" /> ADMIN
          </button>
        </div>
      </footer>

      <AdminPanel
        isOpen={isAdminOpen}
        onClose={() => setIsAdminOpen(false)}
        alunos={alunos}
        onDeleteEntry={deleteEntry}
        onClearAll={async () => await replaceEntries([])}
        usingRemoteDatabase={usingRemoteDatabase}
      />
    </div>
  );
}

function CounterPill({ label, value, bg }: { label: string; value: number; bg: string }) {
  return (
    <div className={`neo-pill ${bg} px-3 py-1.5 flex items-baseline gap-1.5`}>
      <span className="font-display font-black text-lg leading-none">{value}</span>
      <span className="text-[10px] font-bold opacity-70">{label}</span>
    </div>
  );
}
