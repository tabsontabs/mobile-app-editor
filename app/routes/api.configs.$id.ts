/**
 * REST API Resource Route: /api/configs/:id
 * 
 * GET    - Get a configuration by ID
 * PUT    - Update a configuration
 * DELETE - Delete a configuration
 * 
 * This is a Resource Route (returns JSON).
 * Protected by API key auth.
 */

import type { Route } from './+types/api.configs.$id';
import { validateApiKey } from '~/utils/auth.server';
import { getConfigById, updateConfig, deleteConfig } from '~/services/config.server';
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

export async function loader({ request, params }: Route.LoaderArgs) {
  const auth = validateApiKey(request);
  if (!auth.isValid) {
    return errorResponse('UNAUTHORIZED', auth.error || 'Unauthorized', 401);
  }

  const { id } = params;
  const result = await getConfigById(id);

  if (!result.success) {
    const status = result.error?.code === 'NOT_FOUND' ? 404 : 500;
    return errorResponse(
      result.error?.code || 'INTERNAL_ERROR',
      result.error?.message || 'Failed to get configuration',
      status
    );
  }

  return jsonResponse({ success: true, data: result.data });
}

export async function action({ request, params }: Route.ActionArgs) {
  // validate auth
  const auth = validateApiKey(request);
  if (!auth.isValid) {
    return errorResponse('UNAUTHORIZED', auth.error || 'Unauthorized', 401);
  }

  const { id } = params;

  switch (request.method) {
    case 'PUT': {
      let body: unknown;
      try {
        body = await request.json();
      } catch {
        return errorResponse('BAD_REQUEST', 'Invalid JSON in request body', 400);
      }
      // validate payload
      const payload = body as ConfigPayload;
      const validation = validateConfigPayload(payload);
      if (!validation.isValid) {
        return errorResponse('VALIDATION_ERROR', 'Invalid configuration payload', 400, validation.errors);
      }
      // update config
      const result = await updateConfig(id, payload);

      if (!result.success) {
        const status = result.error?.code === 'NOT_FOUND' ? 404 : 500;
        return errorResponse(
          result.error?.code || 'INTERNAL_ERROR',
          result.error?.message || 'Failed to update configuration',
          status
        );
      }

      return jsonResponse({ success: true, data: result.data });
    }

    case 'DELETE': {
      const result = await deleteConfig(id);

      if (!result.success) {
        const status = result.error?.code === 'NOT_FOUND' ? 404 :
                       result.error?.code === 'FORBIDDEN' ? 403 : 500;
        return errorResponse(
          result.error?.code || 'INTERNAL_ERROR',
          result.error?.message || 'Failed to delete configuration',
          status
        );
      }

      return new Response(null, { status: 204 });
    }

    default:
      return errorResponse('METHOD_NOT_ALLOWED', `Method ${request.method} not allowed`, 405);
  }
}
