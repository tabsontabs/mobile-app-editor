import { useConfig } from '~/context/ConfigContext';
import { ColorPickerInput } from './ColorPickerInput';

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

        <ColorPickerInput
          label="Background Color"
          value={cta.primaryColor}
          onChange={(value) => updateCta({ primaryColor: value })}
          placeholder="#000000"
        />

        <ColorPickerInput
          label="Text Color"
          value={cta.primaryTextColor}
          onChange={(value) => updateCta({ primaryTextColor: value })}
          placeholder="#ffffff"
        />

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
