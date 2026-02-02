import { useConfig } from '~/context/ConfigContext';

export function CtaEditor() {
  const { config, updateCta } = useConfig();
  const { cta } = config;

  return (
    <div className="space-y-6">
      <h3 className="text-lg font-semibold">Call to Action</h3>

      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-1">Button Text</label>
          <input
            type="text"
            value={cta.primaryText}
            onChange={(e) => updateCta({ primaryText: e.target.value })}
            placeholder="Shop Now"
            className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Background Color</label>
          <div className="flex gap-2">
            <input
              type="color"
              value={cta.primaryColor}
              onChange={(e) => updateCta({ primaryColor: e.target.value })}
              className="w-12 h-10 rounded border border-slate-200 cursor-pointer"
            />
            <input
              type="text"
              value={cta.primaryColor}
              onChange={(e) => updateCta({ primaryColor: e.target.value })}
              placeholder="#000000"
              className="flex-1 px-3 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent font-mono text-sm"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Text Color</label>
          <div className="flex gap-2">
            <input
              type="color"
              value={cta.primaryTextColor}
              onChange={(e) => updateCta({ primaryTextColor: e.target.value })}
              className="w-12 h-10 rounded border border-slate-200 cursor-pointer"
            />
            <input
              type="text"
              value={cta.primaryTextColor}
              onChange={(e) => updateCta({ primaryTextColor: e.target.value })}
              placeholder="#ffffff"
              className="flex-1 px-3 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent font-mono text-sm"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">URL</label>
          <input
            type="text"
            value={cta.primaryUrl}
            onChange={(e) => updateCta({ primaryUrl: e.target.value })}
            placeholder="/shop"
            className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
      </div>
    </div>
  );
}
