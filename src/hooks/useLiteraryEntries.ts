import { useCallback, useEffect, useState } from 'react';
import { AlunoLiterario } from '../data/mockData';
import { db, isFirebaseConfigured } from '../lib/firebase';
import {
  collection,
  addDoc,
  onSnapshot,
  query,
  serverTimestamp,
  Timestamp,
} from 'firebase/firestore';

const STORAGE_KEY = 'semana-academica-literary-entries-v1';
const COLLECTION_NAME = 'literary_entries';

function getLocalEntries(): AlunoLiterario[] {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function setLocalEntries(entries: AlunoLiterario[]) {
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(entries));
}

export function useLiteraryEntries() {
  const [alunos, setAlunos] = useState<AlunoLiterario[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const usingRemoteDatabase = isFirebaseConfigured && Boolean(db);

  // Modo local: carrega do localStorage
  useEffect(() => {
    if (usingRemoteDatabase) return;
    setAlunos(getLocalEntries());
    setIsLoading(false);
  }, [usingRemoteDatabase]);

  // Modo Firebase: escuta mudanças em tempo real
  useEffect(() => {
    if (!usingRemoteDatabase) {
        setAlunos(getLocalEntries());
        setIsLoading(false);
        return;
    }

    setIsLoading(true);
    const q = query(collection(db!, COLLECTION_NAME));

    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        const lista: AlunoLiterario[] = snapshot.docs.map((doc) => {
          const data = doc.data();
          const ts = data.createdAt as Timestamp | undefined;
          const dataCaptura = ts
            ? ts.toDate().toISOString().replace('T', ' ').substring(0, 16)
            : data.dataCaptura || '';

          return {
            id: doc.id,
            aluno: data.aluno || '',
            curso: data.curso || 'Estudante',
            livroFavorito: data.livroFavorito || '',
            autorFavorito: data.autorFavorito || '',
            ultimoLivroLido: data.ultimoLivroLido || '',
            genero: data.genero || 'Fantasia',
            citacao: data.citacao || '',
            avatar: data.avatar || 'reader-girl',
            dataCaptura,
          };
        });
        setAlunos(lista);
        setIsLoading(false);
      },
      (err) => {
        console.error('Erro ao escutar Firestore:', err);
        setError(err.message);
        setAlunos(getLocalEntries());
        setIsLoading(false);
      }
    );

    return () => unsubscribe();
  }, [usingRemoteDatabase]);

  const addEntry = useCallback(
    async (entry: AlunoLiterario) => {
      setError(null);

      if (usingRemoteDatabase && db) {
        try {
          await addDoc(collection(db, COLLECTION_NAME), {
            aluno: entry.aluno,
            curso: entry.curso,
            livroFavorito: entry.livroFavorito,
            autorFavorito: entry.autorFavorito,
            ultimoLivroLido: entry.ultimoLivroLido,
            genero: entry.genero,
            citacao: entry.citacao,
            avatar: entry.avatar,
            dataCaptura: entry.dataCaptura,
            createdAt: serverTimestamp(),
          });
          // O onSnapshot já vai atualizar a lista
          return;
        } catch (err) {
          const msg = err instanceof Error ? err.message : 'Erro ao salvar';
          setError(msg);
          throw err;
        }
      }

      setAlunos((prev) => {
        const next = [entry, ...prev];
        setLocalEntries(next);
        return next;
      });
    },
    [usingRemoteDatabase]
  );

  const replaceEntries = useCallback(
    async (entries: AlunoLiterario[]) => {
      setError(null);

      // No modo Firebase, edição em massa só pelo console (segurança)
      if (usingRemoteDatabase) {
        setError('Edição em massa só pelo painel do Firebase.');
        return;
      }

      setLocalEntries(entries);
      setAlunos(entries);
    },
    [usingRemoteDatabase]
  );

  const deleteEntry = useCallback(
    async (id: string) => {
      setError(null);

      if (usingRemoteDatabase) {
        setError('Exclusão só pelo painel do Firebase.');
        return;
      }

      setAlunos((prev) => {
        const next = prev.filter((entry) => entry.id !== id);
        setLocalEntries(next);
        return next;
      });
    },
    [usingRemoteDatabase]
  );

  return {
    alunos,
    isLoading,
    error,
    usingRemoteDatabase,
    addEntry,
    replaceEntries,
    deleteEntry,
  };
}
