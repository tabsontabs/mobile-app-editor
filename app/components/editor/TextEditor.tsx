import { useState } from 'react';
import { useConfig } from '~/context/ConfigContext';

function isValidHex(color: string): boolean {
  return /^#[0-9A-Fa-f]{6}$/.test(color);
}

export function TextEditor() {
  const { config, updateText } = useConfig();
  const { text } = config;

  const [headingColorText, setHeadingColorText] = useState(text.headingColor);
  const [descriptionColorText, setDescriptionColorText] = useState(text.descriptionColor);

  const handleHeadingColorTextChange = (value: string) => {
    setHeadingColorText(value);
    if (isValidHex(value)) {
      updateText({ headingColor: value });
    }
  };

  const handleDescriptionColorTextChange = (value: string) => {
    setDescriptionColorText(value);
    if (isValidHex(value)) {
      updateText({ descriptionColor: value });
    }
  };

  const handleHeadingColorPickerChange = (value: string) => {
    setHeadingColorText(value);
    updateText({ headingColor: value });
  };

  const handleDescriptionColorPickerChange = (value: string) => {
    setDescriptionColorText(value);
    updateText({ descriptionColor: value });
  };

  return (
    <div className="space-y-6">
      <h3 className="text-lg font-semibold">Text Section</h3>

      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-1">Heading</label>
          <input
            type="text"
            value={text.heading}
            onChange={(e) => updateText({ heading: e.target.value })}
            placeholder="Enter heading..."
            className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Heading Color</label>
          <div className="flex gap-2">
            <input
              type="color"
              value={text.headingColor}
              onChange={(e) => handleHeadingColorPickerChange(e.target.value)}
              className="w-12 h-10 rounded border border-slate-200 cursor-pointer"
            />
            <input
              type="text"
              value={headingColorText}
              onChange={(e) => handleHeadingColorTextChange(e.target.value)}
              placeholder="#000000"
              className={`flex-1 px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent font-mono text-sm ${
                isValidHex(headingColorText) ? 'border-slate-200' : 'border-amber-300 bg-amber-50'
              }`}
            />
          </div>
          {!isValidHex(headingColorText) && headingColorText !== '' && (
            <p className="text-xs text-amber-600 mt-1">Enter a valid hex color (e.g., #000000)</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Description</label>
          <textarea
            value={text.description}
            onChange={(e) => updateText({ description: e.target.value })}
            placeholder="Enter description..."
            rows={4}
            className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Description Color</label>
          <div className="flex gap-2">
            <input
              type="color"
              value={text.descriptionColor}
              onChange={(e) => handleDescriptionColorPickerChange(e.target.value)}
              className="w-12 h-10 rounded border border-slate-200 cursor-pointer"
            />
            <input
              type="text"
              value={descriptionColorText}
              onChange={(e) => handleDescriptionColorTextChange(e.target.value)}
              placeholder="#000000"
              className={`flex-1 px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent font-mono text-sm ${
                isValidHex(descriptionColorText) ? 'border-slate-200' : 'border-amber-300 bg-amber-50'
              }`}
            />
          </div>
          {!isValidHex(descriptionColorText) && descriptionColorText !== '' && (
            <p className="text-xs text-amber-600 mt-1">Enter a valid hex color (e.g., #000000)</p>
          )}
        </div>
      </div>
    </div>
  );
}
