import { useState, useEffect } from 'react';
import { BenchNote } from '../types';

const STORAGE_KEY = 'voltcraft_bench_notes_v1';
const EVENT_KEY = 'voltcraft_notes_updated';

export const getStoredBenchNotes = (): BenchNote[] => {
  if (typeof window === 'undefined') return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    return JSON.parse(raw);
  } catch (e) {
    console.error('Failed to load notes from localStorage', e);
    return [];
  }
};

export const saveStoredBenchNotes = (notes: BenchNote[]): void => {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(notes));
    window.dispatchEvent(new CustomEvent(EVENT_KEY));
  } catch (e) {
    console.error('Failed to save notes to localStorage', e);
  }
};

export const addBenchNote = (note: Omit<BenchNote, 'id' | 'timestamp'>): BenchNote => {
  const current = getStoredBenchNotes();
  const newNote: BenchNote = {
    ...note,
    id: `note-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
    timestamp: Date.now(),
    pinned: false
  };
  const updated = [newNote, ...current];
  saveStoredBenchNotes(updated);
  return newNote;
};

export const deleteBenchNote = (id: string): void => {
  const current = getStoredBenchNotes();
  const updated = current.filter(n => n.id !== id);
  saveStoredBenchNotes(updated);
};

export const togglePinBenchNote = (id: string): void => {
  const current = getStoredBenchNotes();
  const updated = current.map(n => n.id === id ? { ...n, pinned: !n.pinned } : n);
  saveStoredBenchNotes(updated);
};

export const useBenchNotes = () => {
  const [notes, setNotes] = useState<BenchNote[]>(getStoredBenchNotes);

  useEffect(() => {
    const handler = () => {
      setNotes(getStoredBenchNotes());
    };
    window.addEventListener(EVENT_KEY, handler);
    window.addEventListener('storage', handler);
    return () => {
      window.removeEventListener(EVENT_KEY, handler);
      window.removeEventListener('storage', handler);
    };
  }, []);

  return {
    notes,
    addNote: addBenchNote,
    deleteNote: deleteBenchNote,
    togglePin: togglePinBenchNote
  };
};
