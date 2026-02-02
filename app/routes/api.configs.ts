/**
 * REST API endpoint for listing configurations and creating new ones
 * 
 * GET /api/configs - List all configurations
 * POST /api/configs - Create a new configuration
 */

import type { Route } from './+types/api.configs';
import { validateApiKey } from '~/utils/auth.server';
import { listConfigs, createConfig } from '~/services/config.server';
import { validateConfigPayload } from '~/utils/validation.server';
import type { ConfigPayload, ApiResponse } from '~/types/config';

function jsonResponse<T>(data: ApiResponse<T>, status: number = 200): Response {
  return new Response(JSON.stringify(data), {
    status,
    headers: {
      'Content-Type': 'application/json',
    },
  });
}

function errorResponse(code: string, message: string, status: number, details?: string[]): Response {
  return jsonResponse({
    success: false,
    error: { code, message, details },
  }, status);
}

// GET /api/configs - List all configurations
export async function loader({ request }: Route.LoaderArgs) {
  // Validate authentication
  const auth = validateApiKey(request);
  if (!auth.isValid) {
    return errorResponse('UNAUTHORIZED', auth.error || 'Unauthorized', 401);
  }

  const result = await listConfigs();
  
  if (!result.success) {
    return errorResponse(
      result.error?.code || 'INTERNAL_ERROR',
      result.error?.message || 'Failed to list configurations',
      500,
      result.error?.details
    );
  }

  return jsonResponse({ success: true, data: result.data }, 200);
}

// POST /api/configs - Create a new configuration
export async function action({ request }: Route.ActionArgs) {
  // Only allow POST method
  if (request.method !== 'POST') {
    return errorResponse('METHOD_NOT_ALLOWED', `Method ${request.method} not allowed`, 405);
  }

  // Validate authentication
  const auth = validateApiKey(request);
  if (!auth.isValid) {
    return errorResponse('UNAUTHORIZED', auth.error || 'Unauthorized', 401);
  }

  // Parse request body
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return errorResponse('BAD_REQUEST', 'Invalid JSON in request body', 400);
  }

  // Validate payload
  const payload = body as ConfigPayload;
  const validation = validateConfigPayload(payload);
  if (!validation.isValid) {
    return errorResponse('VALIDATION_ERROR', 'Invalid configuration payload', 400, validation.errors);
  }

  // Create the configuration
  const result = await createConfig(payload);

  if (!result.success) {
    const status = result.error?.code === 'ALREADY_EXISTS' ? 409 : 500;
    return errorResponse(
      result.error?.code || 'INTERNAL_ERROR',
      result.error?.message || 'Failed to create configuration',
      status,
      result.error?.details
    );
  }

  return jsonResponse({ success: true, data: result.data }, 201);
}
