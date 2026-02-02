/**
 * REST API endpoint for single configuration operations
 * 
 * GET /api/configs/:id - Get a configuration by ID
 * PUT /api/configs/:id - Update a configuration
 * DELETE /api/configs/:id - Delete a configuration
 */

import type { Route } from './+types/api.configs.$id';
import { validateApiKey } from '~/utils/auth.server';
import { getConfigById, updateConfig, deleteConfig } from '~/services/config.server';
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

// GET /api/configs/:id - Get a configuration by ID
export async function loader({ request, params }: Route.LoaderArgs) {
  // Validate authentication
  const auth = validateApiKey(request);
  if (!auth.isValid) {
    return errorResponse('UNAUTHORIZED', auth.error || 'Unauthorized', 401);
  }

  const { id } = params;
  if (!id) {
    return errorResponse('BAD_REQUEST', 'Configuration ID is required', 400);
  }

  const result = await getConfigById(id);

  if (!result.success) {
    const status = result.error?.code === 'NOT_FOUND' ? 404 : 500;
    return errorResponse(
      result.error?.code || 'INTERNAL_ERROR',
      result.error?.message || 'Failed to get configuration',
      status,
      result.error?.details
    );
  }

  return jsonResponse({ success: true, data: result.data }, 200);
}

// PUT /api/configs/:id - Update a configuration
// DELETE /api/configs/:id - Delete a configuration
export async function action({ request, params }: Route.ActionArgs) {
  // Validate authentication
  const auth = validateApiKey(request);
  if (!auth.isValid) {
    return errorResponse('UNAUTHORIZED', auth.error || 'Unauthorized', 401);
  }

  const { id } = params;
  if (!id) {
    return errorResponse('BAD_REQUEST', 'Configuration ID is required', 400);
  }

  // Handle different HTTP methods
  switch (request.method) {
    case 'PUT': {
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

      // Update the configuration
      const result = await updateConfig(id, payload);

      if (!result.success) {
        const status = result.error?.code === 'NOT_FOUND' ? 404 : 500;
        return errorResponse(
          result.error?.code || 'INTERNAL_ERROR',
          result.error?.message || 'Failed to update configuration',
          status,
          result.error?.details
        );
      }

      return jsonResponse({ success: true, data: result.data }, 200);
    }

    case 'DELETE': {
      const result = await deleteConfig(id);

      if (!result.success) {
        const status = result.error?.code === 'NOT_FOUND' ? 404 :
                       result.error?.code === 'FORBIDDEN' ? 403 : 500;
        return errorResponse(
          result.error?.code || 'INTERNAL_ERROR',
          result.error?.message || 'Failed to delete configuration',
          status,
          result.error?.details
        );
      }

      return jsonResponse({ success: true }, 204);
    }

    default:
      return errorResponse('METHOD_NOT_ALLOWED', `Method ${request.method} not allowed`, 405);
  }
}
