import { useEffect, useReducer } from 'react';

export function usePersistentReducer(reducer, initialState, storageKey) {
  const [state, dispatch] = useReducer(reducer, initialState, (initial) => {
    try {
      const saved = localStorage.getItem(storageKey);
      return saved ? JSON.parse(saved) : initial;
    } catch {
      return initial;
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem(storageKey, JSON.stringify(state));
    } catch {
      /* ignore */
    }
  }, [state, storageKey]);

  return [state, dispatch];
}