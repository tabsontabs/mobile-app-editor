import { useState } from 'react';
import { useConfig } from '~/context/ConfigContext';

function isValidHex(color: string): boolean {
  return /^#[0-9A-Fa-f]{6}$/.test(color);
}

export function CtaEditor() {
  const { config, updateCta } = useConfig();
  const { cta } = config;

  const [primaryColorText, setPrimaryColorText] = useState(cta.primaryColor);
  const [textColorText, setTextColorText] = useState(cta.primaryTextColor);

  const handlePrimaryColorTextChange = (value: string) => {
    setPrimaryColorText(value);
    if (isValidHex(value)) {
      updateCta({ primaryColor: value });
    }
  };

  const handleTextColorTextChange = (value: string) => {
    setTextColorText(value);
    if (isValidHex(value)) {
      updateCta({ primaryTextColor: value });
    }
  };

  const handlePrimaryColorPickerChange = (value: string) => {
    setPrimaryColorText(value);
    updateCta({ primaryColor: value });
  };

  const handleTextColorPickerChange = (value: string) => {
    setTextColorText(value);
    updateCta({ primaryTextColor: value });
  };

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
              onChange={(e) => handlePrimaryColorPickerChange(e.target.value)}
              className="w-12 h-10 rounded border border-slate-200 cursor-pointer"
            />
            <input
              type="text"
              value={primaryColorText}
              onChange={(e) => handlePrimaryColorTextChange(e.target.value)}
              placeholder="#000000"
              className={`flex-1 px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent font-mono text-sm ${
                isValidHex(primaryColorText) ? 'border-slate-200' : 'border-amber-300 bg-amber-50'
              }`}
            />
          </div>
          {!isValidHex(primaryColorText) && primaryColorText !== '' && (
            <p className="text-xs text-amber-600 mt-1">Enter a valid hex color (e.g., #000000)</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Text Color</label>
          <div className="flex gap-2">
            <input
              type="color"
              value={cta.primaryTextColor}
              onChange={(e) => handleTextColorPickerChange(e.target.value)}
              className="w-12 h-10 rounded border border-slate-200 cursor-pointer"
            />
            <input
              type="text"
              value={textColorText}
              onChange={(e) => handleTextColorTextChange(e.target.value)}
              placeholder="#ffffff"
              className={`flex-1 px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent font-mono text-sm ${
                isValidHex(textColorText) ? 'border-slate-200' : 'border-amber-300 bg-amber-50'
              }`}
            />
          </div>
          {!isValidHex(textColorText) && textColorText !== '' && (
            <p className="text-xs text-amber-600 mt-1">Enter a valid hex color (e.g., #ffffff)</p>
          )}
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
