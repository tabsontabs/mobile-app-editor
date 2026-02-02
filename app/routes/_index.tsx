import { useState, useEffect, useRef } from 'react';
import { useLoaderData, useFetcher } from 'react-router';
import type { Route } from './+types/_index';
import { ConfigProvider, useConfig } from '~/context/ConfigContext';
import { Layout } from '~/components/Layout';
import { getConfigById, updateConfig } from '~/services/config.server';
import type { ConfigPayload } from '~/types/config';
import { defaultConfig } from '~/utils/defaults';

export async function loader() {
  const result = await getConfigById('default');
  if (result.success && result.data) {
    return { config: result.data.data };
  }
  return { config: defaultConfig };
}

export async function action({ request }: Route.ActionArgs) {
  const formData = await request.formData();
  const configJson = formData.get('config');
  
  if (typeof configJson !== 'string') {
    return { success: false, error: 'invalid config data' };
  }

  try {
    const config = JSON.parse(configJson) as ConfigPayload;
    const result = await updateConfig('default', config);
    return { success: result.success, error: result.error?.message };
  } catch (error) {
    return { success: false, error: 'failed to parse config' };
  }
}

function EditorContent() {
  const fetcher = useFetcher<typeof action>();
  const { config, markAsSaved } = useConfig();
  const [isSaving, setIsSaving] = useState(false);
  const prevDataRef = useRef(fetcher.data);

  useEffect(() => {
    if (fetcher.data !== prevDataRef.current && fetcher.data?.success) {
      markAsSaved();
    }
    prevDataRef.current = fetcher.data;
  }, [fetcher.data, markAsSaved]);

  const handleSave = async () => {
    setIsSaving(true);
    fetcher.submit(
      { config: JSON.stringify(config) },
      { method: 'POST' }
    );
    // reset saving state after a short delay
    setTimeout(() => setIsSaving(false), 1000);
  };

  const saveError = fetcher.data && !fetcher.data.success ? fetcher.data.error : null;

  return <Layout onSave={handleSave} isSaving={isSaving || fetcher.state === 'submitting'} saveError={saveError} />;
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
