import { useState, useEffect } from 'react';
import { isValidHex } from '~/utils/isValidHex';

interface ColorPickerInputProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

export function ColorPickerInput({
  label,
  value,
  onChange,
  placeholder = '#000000',
}: ColorPickerInputProps) {
  const [textValue, setTextValue] = useState(value);

  useEffect(() => {
    setTextValue(value);
  }, [value]);

  const handleTextChange = (newValue: string) => {
    setTextValue(newValue);
    if (isValidHex(newValue)) {
      onChange(newValue);
    }
  };

  const handlePickerChange = (newValue: string) => {
    setTextValue(newValue);
    onChange(newValue);
  };

  const isValid = isValidHex(textValue);

  return (
    <div>
      <label className="block text-sm font-medium mb-1">{label}</label>
      <div className="flex gap-2">
        <input
          type="color"
          value={value}
          onChange={(e) => handlePickerChange(e.target.value)}
          className="w-12 h-10 rounded border border-slate-200 cursor-pointer"
        />
        <input
          type="text"
          value={textValue}
          onChange={(e) => handleTextChange(e.target.value)}
          placeholder={placeholder}
          className={`flex-1 px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent font-mono text-sm ${
            isValid ? 'border-slate-200' : 'border-amber-300 bg-amber-50'
          }`}
        />
      </div>
      {!isValid && textValue !== '' && (
        <p className="text-xs text-amber-600 mt-1">
          Enter a valid hex color (e.g., {placeholder})
        </p>
      )}
    </div>
  );
}
