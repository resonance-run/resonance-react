import { createContext, ReactNode, useContext } from 'react';
import { useLocalStorage } from '../hooks/useLocalStorage.js';

const ResonanceContextInternal = createContext({});

export const ResonanceContext = ({ children, value }) => {
  const [isEditorMode] = useLocalStorage('resonance-editor-mode', false);
  value = { contentValues: value ?? {}, isEditorMode };
  console.log('ResonanceContext value:', value);
  return <ResonanceContextInternal.Provider value={value}>{children}</ResonanceContextInternal.Provider>;
};

export const useResonance = () => {
  const context = useContext<{
    contentValues: Record<string, Record<string, string | number | boolean | ReactNode>>;
    isEditorMode: boolean;
  }>(ResonanceContextInternal);
  if (!context) {
    throw new Error('useResonance must be used within a ResonanceContext provider');
  }
  return context;
};
