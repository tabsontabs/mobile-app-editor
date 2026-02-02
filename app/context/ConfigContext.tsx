import { createContext, useContext, useState, useCallback, type ReactNode } from 'react';
import type { MobileHomeConfig, CarouselConfig, TextConfig, CtaConfig } from '~/types/config';
import { defaultConfig } from '~/utils/defaults';

interface ConfigContextValue {
  config: MobileHomeConfig;
  updateCarousel: (updates: Partial<CarouselConfig>) => void;
  updateText: (updates: Partial<TextConfig>) => void;
  updateCta: (updates: Partial<CtaConfig>) => void;
  resetConfig: () => void;
  hasUnsavedChanges: boolean;
  setConfig: (config: MobileHomeConfig) => void;
}

const ConfigContext = createContext<ConfigContextValue | null>(null);

interface ConfigProviderProps {
  children: ReactNode;
  initialConfig?: MobileHomeConfig;
}

export function ConfigProvider({ children, initialConfig }: ConfigProviderProps) {
  const [config, setConfigState] = useState<MobileHomeConfig>(initialConfig ?? defaultConfig);
  const [originalConfig] = useState<MobileHomeConfig>(initialConfig ?? defaultConfig);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);

  const setConfig = useCallback((newConfig: MobileHomeConfig) => {
    setConfigState(newConfig);
    setHasUnsavedChanges(false);
  }, []);

  const updateCarousel = useCallback((updates: Partial<CarouselConfig>) => {
    setConfigState((prev) => ({
      ...prev,
      carousel: { ...prev.carousel, ...updates },
      lastUpdated: new Date().toISOString(),
    }));
    setHasUnsavedChanges(true);
  }, []);

  const updateText = useCallback((updates: Partial<TextConfig>) => {
    setConfigState((prev) => ({
      ...prev,
      text: { ...prev.text, ...updates },
      lastUpdated: new Date().toISOString(),
    }));
    setHasUnsavedChanges(true);
  }, []);

  const updateCta = useCallback((updates: Partial<CtaConfig>) => {
    setConfigState((prev) => ({
      ...prev,
      cta: { ...prev.cta, ...updates },
      lastUpdated: new Date().toISOString(),
    }));
    setHasUnsavedChanges(true);
  }, []);

  const resetConfig = useCallback(() => {
    setConfigState(originalConfig);
    setHasUnsavedChanges(false);
  }, [originalConfig]);

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
