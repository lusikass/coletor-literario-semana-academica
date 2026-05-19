import React, { useState } from 'react';
import { AlunoLiterario, GENEROS_LITERARIOS } from '../data/mockData';
import { ArrowRight, Check, Star } from 'lucide-react';

interface CaptureFormProps {
  onAddAluno: (novoAluno: AlunoLiterario) => void | Promise<void>;
}

export const CaptureForm: React.FC<CaptureFormProps> = ({ onAddAluno }) => {
  const [aluno, setAluno] = useState('');
  const [curso, setCurso] = useState('');
  const [livroFavorito, setLivroFavorito] = useState('');
  const [autorFavorito, setAutorFavorito] = useState('');
  const [ultimoLivroLido, setUltimoLivroLido] = useState('');
  const [genero, setGenero] = useState('Fantasia');
  const [citacao, setCitacao] = useState('');
  const [passo, setPasso] = useState(0); // 0 = tela de boas-vindas
  const [mensagemSucesso, setMensagemSucesso] = useState(false);
  const [ultimoAlunoGerado, setUltimoAlunoGerado] = useState<AlunoLiterario | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const avatarPorGenero = (g: string): AlunoLiterario['avatar'] => {
    const map: Record<string, AlunoLiterario['avatar']> = {
      'Fantasia': 'starter-fire', 'Ficção Científica': 'starter-water', 'Romance': 'reader-girl',
      'Terror / Suspense': 'reader-boy', 'Clássicos': 'prof', 'Biografia': 'elite-red',
      'Poesia': 'starter-grass', 'Aventura': 'starter-fire'
    };
    return map[g] || 'reader-girl';
  };

  const handleSubmit = async () => {
    if (!aluno.trim() || !autorFavorito.trim() || !livroFavorito.trim()) return;
    if (isSubmitting) return;
    setIsSubmitting(true);
    setSubmitError(null);

    const novo: AlunoLiterario = {
      id: typeof crypto !== 'undefined' && 'randomUUID' in crypto ? crypto.randomUUID() : Date.now().toString(),
      aluno: aluno.trim(), curso: curso.trim() || 'Estudante',
      livroFavorito: livroFavorito.trim(), autorFavorito: autorFavorito.trim(),
      ultimoLivroLido: ultimoLivroLido.trim() || livroFavorito.trim(),
      genero, citacao: citacao.trim(), avatar: avatarPorGenero(genero),
      dataCaptura: new Date().toISOString().replace('T', ' ').substring(0, 16)
    };

    try {
      await onAddAluno(novo);
      setUltimoAlunoGerado(novo);
      setMensagemSucesso(true);
      setAluno(''); setCurso(''); setLivroFavorito(''); setAutorFavorito('');
      setUltimoLivroLido(''); setCitacao(''); setPasso(0);
    } catch {
      setSubmitError('Falha ao salvar. Tente de novo.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const canAdvance = (step: number) => {
    if (step === 1) return aluno.trim().length > 0;
    if (step === 2) return livroFavorito.trim().length > 0 && autorFavorito.trim().length > 0;
    return true;
  };

  const inputClass = 'w-full bg-transparent border-b-[3px] border-current py-3 text-2xl sm:text-3xl font-black font-display placeholder:opacity-30 outline-none';

  return (
    <section id="coletar">
      {/* CARD GIGANTE — muda conforme o passo */}

      {passo === 0 && (
        <div className="neo-card bg-[#ffcf44] p-8 sm:p-12 relative overflow-hidden animate-fade-up">
          {/* Decoração */}
          <div className="absolute -top-6 -right-6 w-28 h-28 rounded-full bg-[#ff6b35] border-[3px] border-black opacity-60 animate-spin-slow" />
          <div className="absolute bottom-8 right-12 w-16 h-16 rounded-full bg-[#2d6a4f] border-[3px] border-black opacity-40" />
          <Star className="absolute top-8 right-24 w-8 h-8 text-black opacity-20 animate-bob" fill="currentColor" />

          <div className="relative z-10 max-w-2xl">
            <div className="neo-pill bg-black text-white px-4 py-1.5 text-xs font-black inline-flex items-center gap-2 mb-6">
              <Star className="w-3.5 h-3.5 text-[#ffcf44]" fill="currentColor" />
              SEMANA ACADÊMICA 2026
            </div>

            <h2 className="font-display text-5xl sm:text-7xl lg:text-8xl font-black leading-[0.88] tracking-tighter">
              QUAL<br />
              AUTOR TE<br />
              <span className="text-[#2d6a4f]">INSPIRA</span>?
            </h2>

            <p className="mt-6 text-lg sm:text-xl text-zinc-800 max-w-md leading-snug">
              Conte pra gente seus livros e autores favoritos. Leva menos de 1 minuto e alimenta a nuvem do polo em tempo real.
            </p>

            <button
              onClick={() => setPasso(1)}
              className="neo-btn bg-[#2d6a4f] text-white px-8 py-4 text-lg font-black mt-8 inline-flex items-center gap-3"
            >
              Começar
              <ArrowRight className="w-5 h-5" />
            </button>
          </div>
        </div>
      )}

      {passo === 1 && (
        <div className="neo-card bg-[#2d6a4f] text-white p-8 sm:p-12 relative overflow-hidden animate-fade-up">
          <Star className="absolute top-6 right-8 w-10 h-10 text-[#ffcf44] opacity-40 animate-bob" fill="currentColor" />
          <div className="absolute -bottom-8 -left-8 w-32 h-32 rounded-full bg-[#b7e4c7] border-[3px] border-white/20 opacity-30" />

          <div className="relative z-10 max-w-xl">
            <div className="neo-pill bg-[#ffcf44] text-black px-3 py-1 text-[10px] font-black mb-5">01 / 04</div>

            <h2 className="font-display text-4xl sm:text-6xl font-black leading-[0.88] tracking-tighter mb-8">
              Olá 👋<br />quem é você?
            </h2>

            <div className="space-y-6">
              <div>
                <label className="text-sm font-bold text-[#b7e4c7] mb-1 block">Seu nome ou apelido</label>
                <input value={aluno} onChange={(e) => setAluno(e.target.value)} placeholder="Digite aqui" className={`${inputClass} border-white/40 text-white placeholder:text-white/20`} autoFocus />
              </div>
              <div>
                <label className="text-sm font-bold text-[#b7e4c7] mb-1 block">Qual seu curso?</label>
                <input value={curso} onChange={(e) => setCurso(e.target.value)} placeholder="Ex: Letras, ADS, Direito..." className={`${inputClass} border-white/40 text-white placeholder:text-white/20 text-xl sm:text-2xl`} />
              </div>
            </div>

            <div className="flex gap-3 mt-10">
              <button onClick={() => setPasso(0)} className="neo-btn bg-white/20 text-white px-6 py-3 text-sm font-bold">Voltar</button>
              <button disabled={!canAdvance(1)} onClick={() => setPasso(2)} className="neo-btn bg-[#ffcf44] text-black px-8 py-3 text-sm font-black inline-flex items-center gap-2 disabled:opacity-40">
                Próximo <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      )}

      {passo === 2 && (
        <div className="neo-card bg-[#ff6b35] text-white p-8 sm:p-12 relative overflow-hidden animate-fade-up">
          <div className="absolute top-6 right-6 neo-card-sm bg-[#ffcf44] text-black px-4 py-2 rotate-6 text-xs font-black">
            ESSE DADO<br/>VAI PRA NUVEM ✦
          </div>
          <div className="absolute -bottom-10 -right-10 w-40 h-40 rounded-full bg-[#2d6a4f] border-[3px] border-white/20 opacity-25" />

          <div className="relative z-10 max-w-xl">
            <div className="neo-pill bg-white text-black px-3 py-1 text-[10px] font-black mb-5">02 / 04</div>

            <h2 className="font-display text-4xl sm:text-6xl font-black leading-[0.88] tracking-tighter mb-8">
              O que você<br />anda <span className="text-[#ffcf44]">lendo</span>?
            </h2>

            <div className="space-y-6">
              <div>
                <label className="text-sm font-bold text-white/70 mb-1 block">Livro favorito</label>
                <input value={livroFavorito} onChange={(e) => setLivroFavorito(e.target.value)} placeholder="Qual te marcou?" className={`${inputClass} border-white/40 placeholder:text-white/20`} autoFocus />
              </div>
              <div>
                <label className="text-sm font-bold text-[#ffcf44] mb-1 block">Autor favorito ★</label>
                <input value={autorFavorito} onChange={(e) => setAutorFavorito(e.target.value)} placeholder="Esse nome cresce na nuvem" className={`${inputClass} border-[#ffcf44]/60 text-[#ffcf44] placeholder:text-[#ffcf44]/30`} />
              </div>
            </div>

            <div className="flex gap-3 mt-10">
              <button onClick={() => setPasso(1)} className="neo-btn bg-white/20 text-white px-6 py-3 text-sm font-bold">Voltar</button>
              <button disabled={!canAdvance(2)} onClick={() => setPasso(3)} className="neo-btn bg-[#ffcf44] text-black px-8 py-3 text-sm font-black inline-flex items-center gap-2 disabled:opacity-40">
                Próximo <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      )}

      {passo === 3 && (
        <div className="neo-card bg-[#b7e4c7] p-8 sm:p-12 relative overflow-hidden animate-fade-up">
          <div className="absolute -top-4 -left-4 w-24 h-24 rounded-full bg-[#2d6a4f] border-[3px] border-black opacity-20" />
          <Star className="absolute bottom-8 right-10 w-12 h-12 text-[#2d6a4f] opacity-20 animate-bob" fill="currentColor" />

          <div className="relative z-10 max-w-2xl">
            <div className="neo-pill bg-[#2d6a4f] text-white px-3 py-1 text-[10px] font-black mb-5">03 / 04</div>

            <h2 className="font-display text-4xl sm:text-6xl font-black leading-[0.88] tracking-tighter mb-2">
              Qual o seu<br /><span className="text-[#2d6a4f]">estilo</span>?
            </h2>
            <p className="text-base text-zinc-700 mb-6">Selecione o gênero que mais combina com você.</p>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
              {GENEROS_LITERARIOS.map((gen) => (
                <button key={gen.nome} type="button" onClick={() => setGenero(gen.nome)}
                  className={`neo-card-sm p-4 text-left transition-all hover:-translate-y-1 ${
                    genero === gen.nome ? 'bg-[#2d6a4f] text-white scale-[1.03]' : 'bg-white'
                  }`}
                >
                  <div className="font-display text-base font-black leading-tight">{gen.nome}</div>
                </button>
              ))}
            </div>

            <div>
              <label className="text-sm font-bold text-zinc-600 mb-1 block">Último livro lido (opcional)</label>
              <input value={ultimoLivroLido} onChange={(e) => setUltimoLivroLido(e.target.value)} placeholder="O mais recente" className={`${inputClass} text-xl sm:text-2xl border-[#2d6a4f]/30 text-[#2d6a4f] placeholder:text-[#2d6a4f]/20`} />
            </div>

            <div className="flex gap-3 mt-8">
              <button onClick={() => setPasso(2)} className="neo-btn bg-white px-6 py-3 text-sm font-bold">Voltar</button>
              <button onClick={() => setPasso(4)} className="neo-btn bg-[#2d6a4f] text-white px-8 py-3 text-sm font-black inline-flex items-center gap-2">
                Quase lá <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      )}

      {passo === 4 && (
        <div className="neo-card bg-[#e8dcc8] p-8 sm:p-12 relative overflow-hidden animate-fade-up">
          <div className="absolute top-4 right-6 text-6xl opacity-10 font-black font-display select-none">✦</div>

          <div className="relative z-10 max-w-xl">
            <div className="neo-pill bg-[#ff6b35] text-white px-3 py-1 text-[10px] font-black mb-5">04 / 04</div>

            <h2 className="font-display text-4xl sm:text-5xl font-black leading-[0.88] tracking-tighter mb-6">
              Uma citação<br />que ficou com<br />você?
            </h2>

            <textarea value={citacao} onChange={(e) => setCitacao(e.target.value)}
              placeholder="Pode ser uma frase, um trecho... ou deixar vazio."
              className="w-full bg-white neo-card-sm p-5 text-lg font-display font-medium min-h-[120px] resize-none outline-none placeholder:text-zinc-400"
            />

            {/* Resumo */}
            <div className="mt-6 grid grid-cols-2 gap-3">
              <div className="neo-card-sm bg-[#2d6a4f] text-white p-4">
                <div className="text-[10px] font-bold text-[#b7e4c7]">LEITOR</div>
                <div className="font-display text-lg font-black mt-0.5 truncate">{aluno || '—'}</div>
              </div>
              <div className="neo-card-sm bg-[#ff6b35] text-white p-4">
                <div className="text-[10px] font-bold text-[#ffcf44]">AUTOR → NUVEM</div>
                <div className="font-display text-lg font-black mt-0.5 truncate">{autorFavorito || '—'}</div>
              </div>
            </div>

            {submitError && <div className="neo-card-sm bg-[#ff6b35] text-white p-3 text-sm font-bold mt-4">{submitError}</div>}

            <div className="flex gap-3 mt-8">
              <button onClick={() => setPasso(3)} className="neo-btn bg-white px-6 py-3 text-sm font-bold">Voltar</button>
              <button disabled={isSubmitting || !aluno.trim() || !autorFavorito.trim() || !livroFavorito.trim()} onClick={handleSubmit}
                className="neo-btn bg-[#2d6a4f] text-white px-8 py-4 text-base font-black inline-flex items-center gap-2 disabled:opacity-40 disabled:cursor-wait"
              >
                <Check className="w-5 h-5" />
                {isSubmitting ? 'Salvando...' : 'Publicar na nuvem'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal de sucesso */}
      {mensagemSucesso && ultimoAlunoGerado && (
        <div className="fixed inset-0 bg-black/55 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-fade-in">
          <div className="neo-card bg-[#ffcf44] max-w-md w-full p-8 animate-scale-in relative overflow-hidden">
            <Star className="absolute -top-3 -right-3 w-16 h-16 text-black opacity-10 animate-spin-slow" fill="currentColor" />

            <div className="relative z-10">
              <div className="w-16 h-16 rounded-full bg-[#2d6a4f] border-[3px] border-black flex items-center justify-center mb-4">
                <Check className="w-8 h-8 text-white" />
              </div>

              <h3 className="font-display text-4xl font-black leading-none tracking-tighter">
                {ultimoAlunoGerado.autorFavorito} entrou na nuvem!
              </h3>
              <p className="text-base text-zinc-800 mt-3">Valeu, <strong>{ultimoAlunoGerado.aluno}</strong>. Sua participação já está ao vivo.</p>

              <div className="flex gap-3 mt-6">
                <button onClick={() => setMensagemSucesso(false)} className="neo-btn flex-1 bg-white px-5 py-3 text-sm font-bold">Fechar</button>
                <button onClick={() => { setMensagemSucesso(false); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
                  className="neo-btn flex-1 bg-black text-white px-5 py-3 text-sm font-black inline-flex items-center justify-center gap-2"
                >
                  Ver nuvem <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};
