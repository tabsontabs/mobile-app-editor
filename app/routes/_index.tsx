import { useState } from 'react';
import { useLoaderData, useFetcher } from 'react-router';
import type { Route } from './+types/_index';
import { ConfigProvider, useConfig } from '~/context/ConfigContext';
import { Layout } from '~/components/Layout';
import { getConfig, saveConfig } from '~/services/config.server';
import type { MobileHomeConfig } from '~/types/config';

export async function loader() {
  const config = await getConfig();
  return { config };
}

export async function action({ request }: Route.ActionArgs) {
  const formData = await request.formData();
  const configJson = formData.get('config');
  
  if (typeof configJson !== 'string') {
    return { success: false, error: 'invalid config data' };
  }

  try {
    const config = JSON.parse(configJson) as MobileHomeConfig;
    const result = await saveConfig(config);
    return result;
  } catch (error) {
    return { success: false, error: 'failed to parse config' };
  }
}

function EditorContent() {
  const fetcher = useFetcher<typeof action>();
  const { config } = useConfig();
  const [isSaving, setIsSaving] = useState(false);

  const handleSave = async () => {
    setIsSaving(true);
    fetcher.submit(
      { config: JSON.stringify(config) },
      { method: 'POST' }
    );
    // reset saving state after a short delay
    setTimeout(() => setIsSaving(false), 1000);
  };

  return <Layout onSave={handleSave} isSaving={isSaving || fetcher.state === 'submitting'} />;
}

export default function Index() {
  const { config } = useLoaderData<typeof loader>();

  return (
    <ConfigProvider initialConfig={config}>
      <EditorContent />
    </ConfigProvider>
  );
}

export function meta() {
  return [
    { title: 'Mobile App Editor' },
    { name: 'description', content: 'Configure your mobile app content' },
  ];
}
