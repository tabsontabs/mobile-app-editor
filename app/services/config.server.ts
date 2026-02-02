import { readFile, writeFile, mkdir, readdir, unlink } from 'fs/promises';
import { existsSync } from 'fs';
import path from 'path';
import type { StoredConfig, ConfigPayload, ApiResponse } from '~/types/config';
import { CURRENT_SCHEMA_VERSION } from '~/types/config';
import { defaultConfig } from '~/utils/defaults';
import { validateConfigPayload } from '~/utils/validation.server';

const DATA_DIR = path.join(process.cwd(), 'data', 'configs');
const DEFAULT_CONFIG_ID = 'default';

/**
 * Generates a unique configuration ID
 */
export function generateConfigId(): string {
  return 'config-' + Date.now() + '-' + Math.random().toString(36).substring(2, 11);
}

/**
 * Gets the file path for a configuration
 */
function getConfigPath(id: string): string {
  return path.join(DATA_DIR, `${id}.json`);
}

/**
 * Ensures the data directory exists
 */
async function ensureDataDir(): Promise<void> {
  if (!existsSync(DATA_DIR)) {
    await mkdir(DATA_DIR, { recursive: true });
  }
}

/**
 * Creates default stored config from defaults
 */
function createDefaultStoredConfig(): StoredConfig {
  const now = new Date().toISOString();
  return {
    id: DEFAULT_CONFIG_ID,
    schemaVersion: CURRENT_SCHEMA_VERSION,
    createdAt: now,
    updatedAt: now,
    data: {
      carousel: defaultConfig.carousel,
      text: defaultConfig.text,
      cta: defaultConfig.cta,
    },
  };
}

/**
 * Gets a configuration by ID
 */
export async function getConfigById(id: string): Promise<ApiResponse<StoredConfig>> {
  try {
    await ensureDataDir();
    const configPath = getConfigPath(id);

    if (!existsSync(configPath)) {
      // If requesting default and it doesn't exist, create it
      if (id === DEFAULT_CONFIG_ID) {
        const defaultStored = createDefaultStoredConfig();
        await writeFile(configPath, JSON.stringify(defaultStored, null, 2), 'utf-8');
        return { success: true, data: defaultStored };
      }
      return {
        success: false,
        error: {
          code: 'NOT_FOUND',
          message: `Configuration with id '${id}' not found`,
        },
      };
    }

    const fileContent = await readFile(configPath, 'utf-8');
    const config = JSON.parse(fileContent) as StoredConfig;

    const validation = validateConfigPayload(config.data);
    if (!validation.isValid) {
      return {
        success: false,
        error: {
          code: 'INVALID_CONFIG',
          message: 'Stored configuration is invalid',
          details: validation.errors,
        },
      };
    }

    return { success: true, data: config };
  } catch (error) {
    console.error('Error loading config:', error);
    return {
      success: false,
      error: {
        code: 'INTERNAL_ERROR',
        message: error instanceof Error ? error.message : 'Unknown error loading configuration',
      },
    };
  }
}

/**
 * Creates a new configuration
 */
export async function createConfig(payload: ConfigPayload, customId?: string): Promise<ApiResponse<StoredConfig>> {
  try {
    const validation = validateConfigPayload(payload);
    if (!validation.isValid) {
      return {
        success: false,
        error: {
          code: 'VALIDATION_ERROR',
          message: 'Invalid configuration payload',
          details: validation.errors,
        },
      };
    }

    await ensureDataDir();
    
    const id = customId || generateConfigId();
    const configPath = getConfigPath(id);

    if (existsSync(configPath)) {
      return {
        success: false,
        error: {
          code: 'ALREADY_EXISTS',
          message: `Configuration with id '${id}' already exists`,
        },
      };
    }

    const now = new Date().toISOString();
    const storedConfig: StoredConfig = {
      id,
      schemaVersion: CURRENT_SCHEMA_VERSION,
      createdAt: now,
      updatedAt: now,
      data: payload,
    };

    await writeFile(configPath, JSON.stringify(storedConfig, null, 2), 'utf-8');
    return { success: true, data: storedConfig };
  } catch (error) {
    console.error('Error creating config:', error);
    return {
      success: false,
      error: {
        code: 'INTERNAL_ERROR',
        message: error instanceof Error ? error.message : 'Unknown error creating configuration',
      },
    };
  }
}

/**
 * Updates an existing configuration
 */
export async function updateConfig(id: string, payload: ConfigPayload): Promise<ApiResponse<StoredConfig>> {
  try {
    const validation = validateConfigPayload(payload);
    if (!validation.isValid) {
      return {
        success: false,
        error: {
          code: 'VALIDATION_ERROR',
          message: 'Invalid configuration payload',
          details: validation.errors,
        },
      };
    }

    await ensureDataDir();
    const configPath = getConfigPath(id);

    if (!existsSync(configPath)) {
      if (id === DEFAULT_CONFIG_ID) {
        return createConfig(payload, id);
      }
      return {
        success: false,
        error: {
          code: 'NOT_FOUND',
          message: `Configuration with id '${id}' not found`,
        },
      };
    }

    const existingContent = await readFile(configPath, 'utf-8');
    const existingConfig = JSON.parse(existingContent) as StoredConfig;

    const updatedConfig: StoredConfig = {
      id,
      schemaVersion: CURRENT_SCHEMA_VERSION,
      createdAt: existingConfig.createdAt,
      updatedAt: new Date().toISOString(),
      data: payload,
    };

    await writeFile(configPath, JSON.stringify(updatedConfig, null, 2), 'utf-8');
    return { success: true, data: updatedConfig };
  } catch (error) {
    console.error('error updating config:', error);
    return {
      success: false,
      error: {
        code: 'INTERNAL_ERROR',
        message: error instanceof Error ? error.message : 'unknown error updating configuration',
      },
    };
  }
}

/**
 * Deletes a configuration
 */
export async function deleteConfig(id: string): Promise<ApiResponse<void>> {
  try {
    if (id === DEFAULT_CONFIG_ID) {
      return {
        success: false,
        error: {
          code: 'FORBIDDEN',
          message: 'Cannot delete the default configuration',
        },
      };
    }

    const configPath = getConfigPath(id);

    if (!existsSync(configPath)) {
      return {
        success: false,
        error: {
          code: 'NOT_FOUND',
          message: `configuration with id '${id}' not found`,
        },
      };
    }

    await unlink(configPath);
    return { success: true };
  } catch (error) {
    console.error('error deleting config:', error);
    return {
      success: false,
      error: {
        code: 'INTERNAL_ERROR',
        message: error instanceof Error ? error.message : 'unknown error deleting configuration',
      },
    };
  }
}

/**
 * Lists all configurations (metadata only)
 */
export async function listConfigs(): Promise<ApiResponse<Array<Omit<StoredConfig, 'data'>>>> {
  try {
    await ensureDataDir();
    
    const files = await readdir(DATA_DIR);
    const configs: Array<Omit<StoredConfig, 'data'>> = [];

    for (const file of files) {
      if (!file.endsWith('.json')) continue;
      
      try {
        const content = await readFile(path.join(DATA_DIR, file), 'utf-8');
        const config = JSON.parse(content) as StoredConfig;
        configs.push({
          id: config.id,
          schemaVersion: config.schemaVersion,
          createdAt: config.createdAt,
          updatedAt: config.updatedAt,
        });
      } catch {
        continue;
      }
    }

    configs.sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime());

    return { success: true, data: configs };
  } catch (error) {
    console.error('Error listing configs:', error);
    return {
      success: false,
      error: {
        code: 'INTERNAL_ERROR',
        message: error instanceof Error ? error.message : 'Unknown error listing configurations',
      },
    };
  }
}

