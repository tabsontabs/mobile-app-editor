import { useConfig } from '~/context/ConfigContext';

export function TextPreview() {
  const { config } = useConfig();
  const { text } = config;

  return (
    <div className="py-8 px-4 text-center">
      {text.heading && (
        <h2 
          className="text-2xl font-bold mb-3"
          style={{ color: text.headingColor }}
        >
          {text.heading}
        </h2>
      )}
      {text.description && (
        <p
          style={{ color: text.descriptionColor }}
        >
          {text.description}
        </p>
      )}
    </div>
  );
}
