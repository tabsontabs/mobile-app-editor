import { useConfig } from '~/context/ConfigContext';
import { ColorPickerInput } from './ColorPickerInput';

export function TextEditor() {
  const { config, updateText } = useConfig();
  const { text } = config;

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

        <ColorPickerInput
          label="Heading Color"
          value={text.headingColor}
          onChange={(value) => updateText({ headingColor: value })}
          placeholder="#000000"
        />

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

        <ColorPickerInput
          label="Description Color"
          value={text.descriptionColor}
          onChange={(value) => updateText({ descriptionColor: value })}
          placeholder="#000000"
        />
      </div>
    </div>
  );
}
