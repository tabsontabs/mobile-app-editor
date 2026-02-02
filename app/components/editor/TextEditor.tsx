import { useConfig } from '~/context/ConfigContext';

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

        <div>
          <label className="block text-sm font-medium mb-1">Heading Color</label>
          <div className="flex gap-2">
            <input
              type="color"
              value={text.headingColor}
              onChange={(e) => updateText({ headingColor: e.target.value })}
              className="w-12 h-10 rounded border border-slate-200 cursor-pointer"
            />
            <input
              type="text"
              value={text.headingColor}
              onChange={(e) => updateText({ headingColor: e.target.value })}
              placeholder="#000000"
              className="flex-1 px-3 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent font-mono text-sm"
            />
          </div>
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
              onChange={(e) => updateText({ descriptionColor: e.target.value })}
              className="w-12 h-10 rounded border border-slate-200 cursor-pointer"
            />
            <input
              type="text"
              value={text.descriptionColor}
              onChange={(e) => updateText({ descriptionColor: e.target.value })}
              placeholder="#000000"
              className="flex-1 px-3 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent font-mono text-sm"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
