/**
 * REST API Resource Route: /api/configs
 * 
 * GET  - List all configurations
 * POST - Create a new configuration
 * 
 * This is a Resource Route (returns JSON).
 * Protected by API key auth.
 */

import type { Route } from './+types/api.configs';
import { validateApiKey } from '~/utils/auth.server';
import { listConfigs, createConfig } from '~/services/config.server';
import { validateConfigPayload } from '~/utils/validation.server';
import type { ConfigPayload, ApiResponse } from '~/types/config';

function jsonResponse<T>(data: ApiResponse<T>, status: number = 200): Response {
  return new Response(JSON.stringify(data), {
    status,
    headers: { 'Content-Type': 'application/json' },
  });
}

function errorResponse(code: string, message: string, status: number, details?: string[]): Response {
  return jsonResponse({ success: false, error: { code, message, details } }, status);
}

// GET /api/configs
export async function loader({ request }: Route.LoaderArgs) {
  const auth = validateApiKey(request);
  if (!auth.isValid) {
    return errorResponse('UNAUTHORIZED', auth.error || 'Unauthorized', 401);
  }

  const result = await listConfigs();
  
  if (!result.success) {
    return errorResponse(
      result.error?.code || 'INTERNAL_ERROR',
      result.error?.message || 'Failed to list configurations',
      500
    );
  }

  return jsonResponse({ success: true, data: result.data });
}

// POST /api/configs
export async function action({ request }: Route.ActionArgs) {
  if (request.method !== 'POST') {
    return errorResponse('METHOD_NOT_ALLOWED', `Method ${request.method} not allowed`, 405);
  }

  const auth = validateApiKey(request);
  if (!auth.isValid) {
    return errorResponse('UNAUTHORIZED', auth.error || 'Unauthorized', 401);
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return errorResponse('BAD_REQUEST', 'Invalid JSON in request body', 400);
  }

  const payload = body as ConfigPayload;
  const validation = validateConfigPayload(payload);
  if (!validation.isValid) {
    return errorResponse('VALIDATION_ERROR', 'Invalid configuration payload', 400, validation.errors);
  }

  const result = await createConfig(payload);

  if (!result.success) {
    const status = result.error?.code === 'ALREADY_EXISTS' ? 409 : 500;
    return errorResponse(
      result.error?.code || 'INTERNAL_ERROR',
      result.error?.message || 'Failed to create configuration',
      status
    );
  }

  return jsonResponse({ success: true, data: result.data }, 201);
}
