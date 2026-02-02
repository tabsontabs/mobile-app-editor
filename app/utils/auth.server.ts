// Server-side authentication utilities
// API key is stored only on the server and never exposed to the browser

// In production, this would come from environment variables
// For demo purposes, we use a hardcoded key that can be overridden by env

const API_KEY = process.env.CONFIG_API_KEY || 'dev-api-key-12345';

export interface AuthResult {
  isValid: boolean;
  error?: string;
}

/**
 * Validates the API key from request headers
 * This function runs only on the server
 */
export function validateApiKey(request: Request): AuthResult {
  const authHeader = request.headers.get('Authorization');
  
  if (!authHeader) {
    return { isValid: false, error: 'Missing Authorization header' };
  }

  // Expect format: "Bearer <api-key>"
  const parts = authHeader.split(' ');
  if (parts.length !== 2 || parts[0] !== 'Bearer') {
    return { isValid: false, error: 'Invalid Authorization header format. Expected: Bearer <api-key>' };
  }

  const providedKey = parts[1];
  if (providedKey !== API_KEY) {
    return { isValid: false, error: 'Invalid API key' };
  }

  return { isValid: true };
}
