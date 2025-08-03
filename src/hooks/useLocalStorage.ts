import { useState, useEffect } from 'react';
import { Prompt } from '../types';

export function useLocalStorage<T>(key: string, initialValue: T, deserialize?: (value: any) => T) {
  const [storedValue, setStoredValue] = useState<T>(() => {
    try {
      const item = window.localStorage.getItem(key);
      if (item) {
        const parsed = JSON.parse(item);
        return deserialize ? deserialize(parsed) : parsed;
      }
      return initialValue;
    } catch (error) {
      console.error(`Error reading localStorage key "${key}":`, error);
      return initialValue;
    }
  });

  const setValue = (value: T | ((val: T) => T)) => {
    try {
      const valueToStore = value instanceof Function ? value(storedValue) : value;
      setStoredValue(valueToStore);
      window.localStorage.setItem(key, JSON.stringify(valueToStore));
    } catch (error) {
      console.error(`Error setting localStorage key "${key}":`, error);
    }
  };

  return [storedValue, setValue] as const;
}

export function usePrompts() {
  const deserializePrompts = (prompts: any[]): Prompt[] => {
    return prompts.map(prompt => ({
      ...prompt,
      createdAt: new Date(prompt.createdAt),
      updatedAt: new Date(prompt.updatedAt),
    }));
  };

  const [prompts, setPrompts] = useLocalStorage<Prompt[]>('prompts', [], deserializePrompts);

  const addPrompt = (promptData: Omit<Prompt, 'id' | 'createdAt' | 'updatedAt'>) => {
    const newPrompt: Prompt = {
      ...promptData,
      id: crypto.randomUUID(),
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    setPrompts(prev => [newPrompt, ...prev]);
    return newPrompt;
  };

  const updatePrompt = (id: string, updates: Partial<Prompt>) => {
    setPrompts(prev =>
      prev.map(prompt =>
        prompt.id === id
          ? { ...prompt, ...updates, updatedAt: new Date() }
          : prompt
      )
    );
  };

  const deletePrompt = (id: string) => {
    setPrompts(prev => prev.filter(prompt => prompt.id !== id));
  };

  const deletePrompts = (ids: string[]) => {
    setPrompts(prev => prev.filter(prompt => !ids.includes(prompt.id)));
  };

  return {
    prompts,
    addPrompt,
    updatePrompt,
    deletePrompt,
    deletePrompts,
    setPrompts,
  };
}
