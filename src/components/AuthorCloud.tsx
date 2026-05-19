import React, { useEffect, useMemo, useRef, useState } from 'react';
import { AlunoLiterario, GENEROS_LITERARIOS } from '../data/mockData';
import { BookOpen, Quote, Search, Sparkles, X, Zap, Star } from 'lucide-react';

interface AuthorCloudProps {
  alunos: AlunoLiterario[];
  heroMode?: boolean;
}

const PALETTE = [
  { bg: 'bg-[#ff6b35]', text: 'text-white', shape: 'rounded-[40%_60%_70%_30%/40%_50%_60%_50%]' },
  { bg: 'bg-[#ffcf44]', text: 'text-black', shape: 'rounded-[60%_40%_30%_70%/60%_30%_70%_40%]' },
  { bg: 'bg-[#2d6a4f]', text: 'text-white', shape: 'rounded-[30%_70%_50%_50%/50%_30%_70%_50%]' },
  { bg: 'bg-[#b7e4c7]', text: 'text-black', shape: 'rounded-[50%_50%_20%_80%/30%_70%_50%_50%]' },
  { bg: 'bg-[#ffcf44]', text: 'text-black', shape: 'rounded-[40%_40%_40%_40%]' }, // Mais retangular
  { bg: 'bg-[#ff6b35]', text: 'text-white', shape: 'rounded-[20px_50px_30px_60px]' },
  { bg: 'bg-white', text: 'text-black', shape: 'rounded-[50%]' }, // Círculo
  { bg: 'bg-[#1a1a1a]', text: 'text-white', shape: 'rounded-[10px_40px_10px_40px]' },
];

export const AuthorCloud: React.FC<AuthorCloudProps> = ({ alunos, heroMode = false }) => {
  const [generoFiltro, setGeneroFiltro] = useState('Todos');
  const [autorSelecionado, setAutorSelecionado] = useState<string | null>(null);
  const [termoBusca, setTermoBusca] = useState('');
  const vistoRef = useRef<Set<string>>(new Set());
  const [novosNomes, setNovosNomes] = useState<Set<string>>(new Set());

  const autoresAgrupados = useMemo(() => {
    const mapa: Record<string, { count: number; generos: string[]; livros: string[]; alunosInfo: AlunoLiterario[] }> = {};
    alunos.forEach((a) => {
      if (generoFiltro !== 'Todos' && a.genero !== generoFiltro) return;
      const autor = a.autorFavorito.trim() || 'Desconhecido';
      if (!mapa[autor]) mapa[autor] = { count: 0, generos: [], livros: [], alunosInfo: [] };
      mapa[autor].count += 1;
      if (!mapa[autor].generos.includes(a.genero)) mapa[autor].generos.push(a.genero);
      if (!mapa[autor].livros.includes(a.livroFavorito)) mapa[autor].livros.push(a.livroFavorito);
      mapa[autor].alunosInfo.push(a);
    });
    return Object.keys(mapa)
      .map((nome) => ({ nome, ...mapa[nome], generoPrincipal: mapa[nome].generos[0] || 'Fantasia' }))
      .filter((i) => i.nome.toLowerCase().includes(termoBusca.toLowerCase()))
      .sort((a, b) => b.count - a.count);
  }, [alunos, generoFiltro, termoBusca]);

  useEffect(() => {
    const novos = new Set<string>();
    autoresAgrupados.forEach(({ nome }) => {
      if (!vistoRef.current.has(nome)) { novos.add(nome); vistoRef.current.add(nome); }
    });
    if (novos.size > 0) {
      setNovosNomes(novos);
      const t = setTimeout(() => setNovosNomes(new Set()), 800);
      return () => clearTimeout(t);
    }
  }, [autoresAgrupados]);

  const maxCount = useMemo(() => autoresAgrupados.reduce((m, i) => Math.max(m, i.count), 1), [autoresAgrupados]);
  const detalhesAutor = useMemo(() => (!autorSelecionado ? null : autoresAgrupados.find((a) => a.nome === autorSelecionado) ?? null), [autorSelecionado, autoresAgrupados]);
  const getGenObj = (g: string) => GENEROS_LITERARIOS.find((x) => x.nome === g);

  return (
    <section className={`neo-card overflow-hidden ${heroMode ? 'bg-[#2d6a4f]' : 'bg-[#b7e4c7]'}`}>
      <div className={`grid grid-cols-1 ${detalhesAutor ? 'xl:grid-cols-[1.2fr_0.8fr]' : ''} gap-0`}>
        <div className="flex flex-col">
          {/* Header */}
          <div className={`px-6 sm:px-8 pt-6 sm:pt-8 pb-4 ${heroMode ? 'text-white' : ''}`}>
            <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
              <div className="flex-1">
                {heroMode && (
                  <div className="flex items-center gap-2 mb-3">
                    <Zap className="w-4 h-4 text-[#ffcf44]" />
                    <span className="font-pixel text-[9px] tracking-widest text-[#b7e4c7]">AO VIVO · ATUALIZA EM TEMPO REAL</span>
                  </div>
                )}
                <h2 className="font-display text-4xl sm:text-6xl font-black leading-[0.9] tracking-tighter">
                  {heroMode ? (
                    <>Quem o polo<br />está <span className="text-[#ffcf44]">lendo</span>?</>
                  ) : 'Nuvem de autores.'}
                </h2>
                {heroMode && (
                  <p className="mt-4 text-base sm:text-lg text-white/80 max-w-xl leading-relaxed">
                    Cada bloco é um autor citado por participantes reais.
                    <strong className="text-white"> Quanto maior, mais leitores.</strong>{' '}
                    Toque para explorar.
                  </p>
                )}
              </div>
              <div className="flex gap-2 shrink-0 flex-wrap">
                <div className="neo-pill bg-black text-white px-3 py-1.5 text-sm font-bold flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-[#b7e4c7] animate-pulse-soft" />
                  {autoresAgrupados.length} autores
                </div>
                <div className="neo-pill bg-[#ffcf44] text-black px-3 py-1.5 text-sm font-bold">
                  {autoresAgrupados.reduce((s, i) => s + i.count, 0)} leituras
                </div>
              </div>
            </div>
          </div>

          {/* Filtros */}
          <div className={`px-6 sm:px-8 pb-4 ${heroMode ? '' : ''}`}>
            <div className="flex flex-wrap gap-2 items-center">
              <div className="relative">
                <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-zinc-600" />
                <input
                  type="text"
                  placeholder="Buscar..."
                  value={termoBusca}
                  onChange={(e) => setTermoBusca(e.target.value)}
                  className="neo-input pl-9 pr-8 py-2 text-sm w-40 sm:w-48"
                />
                {termoBusca && (
                  <button onClick={() => setTermoBusca('')} className="absolute right-2 top-1/2 -translate-y-1/2">
                    <X className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
              <button onClick={() => setGeneroFiltro('Todos')} className={`neo-btn px-3 py-1.5 text-xs font-bold ${generoFiltro === 'Todos' ? 'bg-black text-white' : 'bg-white'}`}>
                Todos
              </button>
              {GENEROS_LITERARIOS.map((gen) => (
                <button key={gen.nome} onClick={() => setGeneroFiltro(gen.nome)} className={`neo-btn px-3 py-1.5 text-xs font-bold hidden sm:inline-flex ${generoFiltro === gen.nome ? `${gen.corBg} text-white` : `${gen.corBgSoft}`}`}>
                  {gen.nome}
                </button>
              ))}
              <select className="neo-input px-3 py-1.5 text-xs font-bold sm:hidden" value={generoFiltro} onChange={(e) => setGeneroFiltro(e.target.value)}>
                <option value="Todos">Todos</option>
                {GENEROS_LITERARIOS.map((g) => <option key={g.nome} value={g.nome}>{g.nome}</option>)}
              </select>
            </div>
          </div>

          {/* Nuvem */}
          <div className="relative flex flex-wrap content-center items-center justify-center gap-6 sm:gap-8 p-6 sm:p-16 min-h-[520px] sm:min-h-[650px] bg-[#111] border-t-[3px] border-black overflow-hidden">
            {/* Elementos de fundo sutil */}
            <div className="absolute inset-0 opacity-10 pointer-events-none flex flex-wrap gap-20 p-10">
               <Star className="w-20 h-20 text-white" />
               <Star className="w-12 h-12 text-white" />
               <Star className="w-32 h-32 text-white" />
            </div>
            <div className="absolute top-4 left-4 neo-pill bg-white px-3 py-1 text-[10px] font-pixel z-10">toque em um autor ✦</div>

            {autoresAgrupados.length === 0 ? (
              <div className="text-center py-16 animate-fade-up">
                <div className="w-20 h-20 rounded-full border-[3px] border-black bg-[#ffcf44] flex items-center justify-center mx-auto mb-4 animate-bob">
                  <BookOpen className="w-8 h-8" />
                </div>
                <p className="font-display text-3xl font-black">A nuvem está esperando.</p>
                <p className="text-sm text-zinc-600 mt-2">Seja o primeiro a registrar um autor favorito.</p>
              </div>
            ) : (
              autoresAgrupados.map((item, idx) => {
                const scale = maxCount > 1 ? (item.count - 1) / (maxCount - 1) : 0.4;
                const size = 0.9 + scale * 1.8;
                const isNew = novosNomes.has(item.nome);
                const isActive = autorSelecionado === item.nome;
                const floatClass = `float-${idx % 8}`;
                const styleConfig = PALETTE[idx % PALETTE.length];
                const floatDelay = `${(idx * 0.37) % 5}s`;

                return (
                  <button
                    key={item.nome}
                    onClick={() => setAutorSelecionado(isActive ? null : item.nome)}
                    style={{ 
                      fontSize: `${size}rem`, 
                      animationDelay: isNew ? '0s' : floatDelay,
                    }}
                    className={`
                      ${isActive ? 'bg-black text-white rounded-2xl' : `${styleConfig.bg} ${styleConfig.text} ${styleConfig.shape}`}
                      border-[3px] border-black shadow-[4px_4px_0_#000]
                      px-6 py-4 font-display font-black leading-tight cursor-pointer select-none
                      ${isNew ? 'animate-pop-in' : floatClass}
                      hover:scale-110 hover:z-10 transition-[transform,box-shadow,border-radius]
                      ${isActive ? 'ring-4 ring-[#ffcf44] ring-offset-4' : ''}
                      flex items-center gap-2 text-center justify-center
                    `}
                  >
                    <span className="uppercase tracking-tighter">{item.nome}</span>
                    <sup className="text-[0.45em] font-black">{item.count}</sup>
                  </button>
                );
              })
            )}
          </div>
        </div>

        {/* Painel lateral */}
        {detalhesAutor && (
          <div className="bg-[#ffcf44] border-t-[3px] xl:border-t-0 xl:border-l-[3px] border-black p-6 sm:p-8 animate-fade-up">
            <div className="flex items-start justify-between gap-3 mb-5">
              <div>
                <span className="font-pixel text-[9px] tracking-widest">AUTHOR FOCUS</span>
                <h3 className="font-display text-3xl sm:text-4xl font-black leading-none mt-1">{detalhesAutor.nome}</h3>
              </div>
              <button onClick={() => setAutorSelecionado(null)} className="neo-btn bg-white w-10 h-10 flex items-center justify-center shrink-0">
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="flex flex-wrap gap-2 mb-5">
              <span className="neo-pill bg-black text-white px-4 py-1.5 text-sm font-bold">{detalhesAutor.count} leitor{detalhesAutor.count > 1 ? 'es' : ''}</span>
              {detalhesAutor.generos.map((g) => {
                const obj = getGenObj(g);
                return <span key={g} className={`neo-pill px-3 py-1.5 text-sm font-bold ${obj?.corBgSoft ?? 'bg-white'} ${obj?.corTexto ?? ''}`}>{g}</span>;
              })}
            </div>

            <div className="neo-card-sm bg-white p-5 mb-4">
              <div className="flex items-center gap-2 mb-3">
                <BookOpen className="w-4 h-4" />
                <h4 className="text-sm font-black">Livros citados</h4>
              </div>
              <div className="flex flex-wrap gap-2">
                {detalhesAutor.livros.map((l, i) => (
                  <span key={i} className="neo-pill bg-[#f5f0e8] px-3 py-1.5 text-sm font-medium">{l}</span>
                ))}
              </div>
            </div>

            <div className="neo-card-sm bg-[#b7e4c7] p-5">
              <div className="flex items-center gap-2 mb-3">
                <Sparkles className="w-4 h-4" />
                <h4 className="text-sm font-black">Quem está lendo</h4>
              </div>
              <div className="space-y-2.5 max-h-[360px] overflow-y-auto pr-1">
                {detalhesAutor.alunosInfo.map((al) => (
                  <div key={al.id} className="neo-card-sm bg-white p-4">
                    <div className="flex items-center justify-between gap-2 mb-1">
                      <div>
                        <div className="font-display text-lg font-black leading-tight">{al.aluno}</div>
                        <div className="text-xs text-zinc-600">{al.curso}</div>
                      </div>
                      <span className="neo-pill bg-[#ffcf44] px-2 py-0.5 text-[10px] font-bold">{al.genero}</span>
                    </div>
                    {al.citacao && (
                      <div className="text-sm text-zinc-700 flex gap-2 italic mt-2">
                        <Quote className="w-3.5 h-3.5 shrink-0 mt-0.5 text-zinc-400" />
                        <span>"{al.citacao}"</span>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};
