import { createContext, useContext, useState, useCallback, type ReactNode } from 'react';
import type { ConfigPayload, CarouselConfig, TextConfig, CtaConfig } from '~/types/config';
import { defaultConfig } from '~/utils/defaults';

interface ConfigContextValue {
  config: ConfigPayload;
  updateCarousel: (updates: Partial<CarouselConfig>) => void;
  updateText: (updates: Partial<TextConfig>) => void;
  updateCta: (updates: Partial<CtaConfig>) => void;
  resetConfig: () => void;
  hasUnsavedChanges: boolean;
  setConfig: (config: ConfigPayload, markAsUnsaved?: boolean) => void;
  markAsSaved: () => void;
}

const ConfigContext = createContext<ConfigContextValue | null>(null);

interface ConfigProviderProps {
  children: ReactNode;
  initialConfig?: ConfigPayload;
}

export function ConfigProvider({ children, initialConfig }: ConfigProviderProps) {
  const [config, setConfigState] = useState<ConfigPayload>(initialConfig ?? defaultConfig);
  // savedConfig is what Reset goes back to - starts as initial, updates only on Save
  const [savedConfig, setSavedConfig] = useState<ConfigPayload>(initialConfig ?? defaultConfig);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);

  const setConfig = useCallback((newConfig: ConfigPayload, markAsUnsaved: boolean = false) => {
    setConfigState(newConfig);
    setHasUnsavedChanges(markAsUnsaved);
  }, []);

  const markAsSaved = useCallback(() => {
    setSavedConfig(config);
    setHasUnsavedChanges(false);
  }, [config]);

  const updateCarousel = useCallback((updates: Partial<CarouselConfig>) => {
    setConfigState((prev) => ({
      ...prev,
      carousel: { ...prev.carousel, ...updates },
    }));
    setHasUnsavedChanges(true);
  }, []);

  const updateText = useCallback((updates: Partial<TextConfig>) => {
    setConfigState((prev) => ({
      ...prev,
      text: { ...prev.text, ...updates },
    }));
    setHasUnsavedChanges(true);
  }, []);

  const updateCta = useCallback((updates: Partial<CtaConfig>) => {
    setConfigState((prev) => ({
      ...prev,
      cta: { ...prev.cta, ...updates },
    }));
    setHasUnsavedChanges(true);
  }, []);

  const resetConfig = useCallback(() => {
    setConfigState(savedConfig);
    setHasUnsavedChanges(false);
  }, [savedConfig]);

  return (
    <ConfigContext.Provider
      value={{
        config,
        updateCarousel,
        updateText,
        updateCta,
        resetConfig,
        hasUnsavedChanges,
        setConfig,
        markAsSaved,
      }}
    >
      {children}
    </ConfigContext.Provider>
  );
}

export function useConfig() {
  const context = useContext(ConfigContext);
  if (!context) {
    throw new Error('useConfig must be used within a ConfigProvider');
  }
  return context;
}
