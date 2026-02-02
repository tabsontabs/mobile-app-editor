import { useConfig } from '~/context/ConfigContext';

export function CtaPreview() {
  const { config } = useConfig();
  const { cta } = config;

  return (
    <div className="py-6 px-4 flex flex-wrap items-center justify-center gap-3">
      <a
        href={cta.primaryUrl}
        style={{ backgroundColor: cta.primaryColor, color: cta.primaryTextColor }}
        className="px-6 py-3 font-medium rounded-lg shadow-md hover:opacity-90 transition-opacity"
      >
        {cta.primaryText}
      </a>
    </div>
  );
}
