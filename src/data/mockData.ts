export interface AlunoLiterario {
  id: string;
  aluno: string;
  curso: string;
  livroFavorito: string;
  autorFavorito: string;
  ultimoLivroLido: string;
  genero: string; // Ex: Fantasia, Romance, Terror, Clássicos, etc.
  citacao: string;
  avatar: 'starter-fire' | 'starter-water' | 'starter-grass' | 'prof' | 'elite-red' | 'reader-girl' | 'reader-boy';
  dataCaptura: string;
}

export const GENEROS_LITERARIOS = [
  { nome: 'Fantasia', corBg: 'bg-amber-500', corBgSoft: 'bg-amber-50', corTexto: 'text-amber-700', corBorda: 'border-amber-200' },
  { nome: 'Ficção Científica', corBg: 'bg-sky-500', corBgSoft: 'bg-sky-50', corTexto: 'text-sky-700', corBorda: 'border-sky-200' },
  { nome: 'Romance', corBg: 'bg-orange-400', corBgSoft: 'bg-orange-50', corTexto: 'text-orange-700', corBorda: 'border-orange-200' },
  { nome: 'Terror / Suspense', corBg: 'bg-slate-700', corBgSoft: 'bg-slate-50', corTexto: 'text-slate-700', corBorda: 'border-slate-200' },
  { nome: 'Clássicos', corBg: 'bg-stone-600', corBgSoft: 'bg-stone-50', corTexto: 'text-stone-700', corBorda: 'border-stone-200' },
  { nome: 'Biografia', corBg: 'bg-emerald-500', corBgSoft: 'bg-emerald-50', corTexto: 'text-emerald-700', corBorda: 'border-emerald-200' },
  { nome: 'Poesia', corBg: 'bg-teal-500', corBgSoft: 'bg-teal-50', corTexto: 'text-teal-700', corBorda: 'border-teal-200' },
  { nome: 'Aventura', corBg: 'bg-orange-500', corBgSoft: 'bg-orange-50', corTexto: 'text-orange-700', corBorda: 'border-orange-200' }
];
