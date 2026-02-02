import { useState, useRef, type ReactNode } from 'react';
import { useConfig } from '~/context/ConfigContext';
import { CarouselEditor } from '~/components/editor/CarouselEditor';
import { TextEditor } from '~/components/editor/TextEditor';
import { CtaEditor } from '~/components/editor/CtaEditor';
import { CarouselPreview } from '~/components/preview/CarouselPreview';
import { TextPreview } from '~/components/preview/TextPreview';
import { CtaPreview } from '~/components/preview/CtaPreview';
import type { ConfigSection, ConfigPayload, StoredConfig } from '~/types/config';
import { CURRENT_SCHEMA_VERSION } from '~/types/config';

interface LayoutProps {
  children?: ReactNode;
  onSave?: () => void;
  isSaving?: boolean;
  saveError?: string | null;
}

export function Layout({ onSave, isSaving, saveError }: LayoutProps) {
  const { config, hasUnsavedChanges, resetConfig, setConfig } = useConfig();
  const [activeSection, setActiveSection] = useState<ConfigSection>('carousel');
  const [importError, setImportError] = useState<string | null>(null);
  const [importedFileName, setImportedFileName] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const sections: { id: ConfigSection; label: string }[] = [
    { id: 'carousel', label: 'Carousel' },
    { id: 'text', label: 'Text' },
    { id: 'cta', label: 'CTA' },
  ];

  const handleExport = () => {
    const now = new Date().toISOString();
    const exportData: StoredConfig = {
      id: 'exported-config',
      schemaVersion: CURRENT_SCHEMA_VERSION,
      createdAt: now,
      updatedAt: now,
      data: config,
    };

    const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    link.download = `mobile-app-config-${timestamp}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const handleImportClick = () => {
    setImportError(null);
    setImportedFileName(null);
    fileInputRef.current?.click();
  };

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    try {
      const text = await file.text();
      const data = JSON.parse(text);

      let payload: ConfigPayload;

      if (data.data && data.data.carousel && data.data.text && data.data.cta) {
        payload = data.data;
      }
      else if (data.carousel && data.text && data.cta) {
        payload = {
          carousel: data.carousel,
          text: data.text,
          cta: data.cta,
        };
      } else {
        throw new Error('invalid configuration format. must contain carousel, text, and cta sections.');
      }

      if (!Array.isArray(payload.carousel.slides)) {
        throw new Error('carousel slides must be an array');
      }

      setConfig(payload, true);

      setImportError(null);
      setImportedFileName(file.name);
    } catch (error) {
      setImportError(error instanceof Error ? error.message : 'failed to import configuration');
      setImportedFileName(null);
    }

    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div className="min-h-screen bg-slate-100">
      <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 py-3 lg:px-8">
          <div className="flex items-center justify-between flex-col lg:flex-row gap-2">
            <div className="flex items-center gap-3">
              <h1 className="text-xl font-bold text-slate-800">
                Mobile App Editor
              </h1>
            </div>

            <div className="flex items-center gap-3">
              {hasUnsavedChanges && (
                <span className="text-sm text-amber-600 font-medium">Unsaved changes</span>
              )}
              <button
                type="button"
                onClick={() => {
                  resetConfig();
                  setImportedFileName(null);
                }}
                disabled={!hasUnsavedChanges}
                className="px-3 py-2 text-sm font-medium text-slate-600 bg-slate-100 rounded-lg hover:bg-slate-200 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                Reset
              </button>
              <button
                type="button"
                onClick={() => {
                  onSave?.();
                  setImportedFileName(null);
                }}
                disabled={!hasUnsavedChanges || isSaving}
                className="px-3 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {isSaving ? 'Saving...' : 'Save Changes'}
              </button>
            </div>
          </div>

          <div className="flex items-center justify-center lg:justify-end gap-3 mt-2 pt-2 border-t border-slate-100">
            <div className="flex items-center gap-2">
              {importedFileName && (
                <span className="text-sm text-green-600">
                  Imported: <span className="font-medium">{importedFileName}</span>
                </span>
              )}
              <button
                type="button"
                onClick={handleImportClick}
                className="px-3 py-1.5 text-sm font-medium text-slate-600 bg-slate-100 rounded-lg hover:bg-slate-200 transition-colors"
              >
                Import
              </button>
              <input
                ref={fileInputRef}
                type="file"
                accept=".json,application/json"
                onChange={handleFileChange}
                className="hidden"
              />
              <button
                type="button"
                onClick={handleExport}
                className="px-3 py-1.5 text-sm font-medium text-slate-600 bg-slate-100 rounded-lg hover:bg-slate-200 transition-colors"
              >
                Export
              </button>
            </div>
          </div>

          {importError && (
            <div className="mt-2 p-2 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-sm text-red-600">{importError}</p>
            </div>
          )}

          {saveError && (
            <div className="mt-2 p-2 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-sm text-red-600">Save failed: {saveError}</p>
            </div>
          )}
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="bg-white rounded-2xl shadow-xl border border-slate-200 overflow-hidden order-2 lg:order-1">
            <div className="border-b border-slate-200">
              <nav className="flex">
                {sections.map((section) => (
                  <button
                    key={section.id}
                    onClick={() => setActiveSection(section.id)}
                    className={`flex-1 px-4 py-3 text-sm font-medium transition-colors border-b-2 ${
                      activeSection === section.id
                        ? 'text-blue-600 border-blue-600 bg-blue-50/50'
                        : 'text-slate-600 border-transparent hover:text-slate-800 hover:bg-slate-50'
                    }`}
                  >
                    {section.label}
                  </button>
                ))}
              </nav>
            </div>

            <div className="p-6">
              {activeSection === 'carousel' && <CarouselEditor />}
              {activeSection === 'text' && <TextEditor />}
              {activeSection === 'cta' && <CtaEditor />}
            </div>
          </div>

          <div className="space-y-4 order-1 lg:order-2">
            <h2 className="text-lg text-center font-semibold">Preview</h2>

            <div className="flex justify-center">
              <div className="relative w-[375px] bg-slate-900 rounded-[3rem] p-3 shadow-2xl">
                <div className="bg-white rounded-[2.5rem] overflow-hidden h-[667px] flex flex-col">
                  <div className="h-12 bg-slate-900 flex items-end justify-between px-6 pb-2 text-white text-xs shrink-0">
                    <span>9:41</span>
                    <div className="flex gap-1">
                      <span>📶</span>
                      <span>🔋</span>
                    </div>
                  </div>
                  <div className="bg-white flex-1 overflow-y-auto">
                    <CarouselPreview />
                    <TextPreview />
                    <CtaPreview />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
