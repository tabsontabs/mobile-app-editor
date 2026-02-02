import { useState, type ReactNode } from 'react';
import { useConfig } from '~/context/ConfigContext';
import { CarouselEditor } from '~/components/editor/CarouselEditor';
import { TextEditor } from '~/components/editor/TextEditor';
import { CtaEditor } from '~/components/editor/CtaEditor';
import { CarouselPreview } from '~/components/preview/CarouselPreview';
import { TextPreview } from '~/components/preview/TextPreview';
import { CtaPreview } from '~/components/preview/CtaPreview';
import type { ConfigSection } from '~/types/config';

interface LayoutProps {
  children?: ReactNode;
  onSave?: () => void;
  isSaving?: boolean;
}

export function Layout({ onSave, isSaving }: LayoutProps) {
  const { hasUnsavedChanges, resetConfig } = useConfig();
  const [activeSection, setActiveSection] = useState<ConfigSection>('carousel');

  const sections: { id: ConfigSection; label: string }[] = [
    { id: 'carousel', label: 'Carousel' },
    { id: 'text', label: 'Text' },
    { id: 'cta', label: 'CTA' },
  ];

  return (
    <div className="min-h-screen bg-slate-100">
      <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 p-4 lg:px-8">
          <div className="flex items-center justify-between flex-col lg:flex-row">
            <div className="flex items-center gap-3 mb-2 lg:mb-0">
              <h1 className="text-xl font-bold text-slate-800">
                Mobile App Editor
              </h1>
            </div>

            <div className="flex items-center flex-col lg:flex-row gap-3">
              {hasUnsavedChanges && (
                <span className="text-sm text-amber-600 font-medium">Unsaved changes</span>
              )}
              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={resetConfig}
                  disabled={!hasUnsavedChanges}
                  className="px-4 py-2 text-sm font-medium text-slate-600 bg-slate-100 rounded-lg hover:bg-slate-200 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  Reset
                </button>
                <button
                  type="button"
                  onClick={onSave}
                  disabled={!hasUnsavedChanges || isSaving}
                  className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  {isSaving ? 'Saving...' : 'Save Changes'}
                </button>
              </div>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Editor Panel */}
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
