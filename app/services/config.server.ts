import { readFile, writeFile, mkdir } from 'fs/promises';
import { existsSync } from 'fs';
import path from 'path';
import type { MobileHomeConfig } from '~/types/config';
import { defaultConfig } from '~/utils/defaults';
import { validateConfig } from '~/utils/validation.server';

const CONFIG_PATH = path.join(process.cwd(), 'data', 'config.json');

export async function getConfig(): Promise<MobileHomeConfig> {
  try {
    if (!existsSync(CONFIG_PATH)) {
      await saveConfig(defaultConfig);
      return defaultConfig;
    }

    const fileContent = await readFile(CONFIG_PATH, 'utf-8');
    const config = JSON.parse(fileContent) as MobileHomeConfig;
    
    const validation = validateConfig(config);
    if (!validation.isValid) {
      console.warn('config validation failed, using defaults', validation.errors);
      return defaultConfig;
    }

    return config;
  } catch (error) {
    console.error(error);
    return defaultConfig;
  }
}

export async function saveConfig(config: MobileHomeConfig): Promise<{ success: boolean; error?: string }> {
  try {
    const validation = validateConfig(config);
    if (!validation.isValid) {
      return { success: false, error: validation.errors.join(', ') };
    }

    const dataDir = path.dirname(CONFIG_PATH);
    if (!existsSync(dataDir)) {
      await mkdir(dataDir, { recursive: true });
    }

    const configToSave: MobileHomeConfig = {
      ...config,
      lastUpdated: new Date().toISOString(),
    };

    await writeFile(CONFIG_PATH, JSON.stringify(configToSave, null, 2), 'utf-8');
    return { success: true };
  } catch (error) {
    console.error('Error saving config:', error);
    return { success: false, error: error instanceof Error ? error.message : 'Unknown error' };
  }
}
