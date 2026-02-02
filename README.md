# Mobile App Editor

A full-stack React application for configuring mobile app content, built with React Router v7.

## Features

- **Preview Screen Components**
  - Carousel section with horizontally scrolling images
    - Support for portrait, landscape, and square aspect ratios
  - Text section with editable heading, description, and colors
  - Call-to-Action button with customizable label, URL, and colors

- **Editor Behavior**
  - Real-time preview updates
  - Responsive, user-friendly interface
  - Import/Export JSON configuration files

- **Backend & API**
  - REST API for configuration management
  - Server-side authentication with API keys
  - File-based JSON storage


### Installation

```bash
npm install
```

### Environment Variables

Create a `.env` file with:

```
CONFIG_API_KEY=your-secure-api-key-here
```

The API key is used for authenticating external requests to the REST API. In development, a default key is used if not specified.

### Development

```bash
npm run dev
```

Application available at `http://localhost:5173`

## Architecture


### Server-Side Data Access

The application follows React Router best practices:

- **Loaders**: Fetch configuration data on initial page load
- **Actions**: Persist configuration updates when the user saves

The browser never directly accesses the configuration service. The `.server.ts` suffix guarantees this code only runs on the server.
## REST API

### Authentication

All API endpoints require Bearer token authentication:

```
Authorization: Bearer <CONFIG_API_KEY>
```

### Endpoints

#### List Configurations
```
GET /api/configs
```

**Response:** `200 OK`
```json
{
  "success": true,
  "data": [
    {
      "id": "default",
      "schemaVersion": 1,
      "createdAt": "2024-01-01T00:00:00.000Z",
      "updatedAt": "2024-01-02T00:00:00.000Z"
    }
  ]
}
```

#### Get Configuration by ID
```
GET /api/configs/:id
```

**Response:** `200 OK`
```json
{
  "success": true,
  "data": {
    "id": "default",
    "schemaVersion": 1,
    "createdAt": "2024-01-01T00:00:00.000Z",
    "updatedAt": "2024-01-02T00:00:00.000Z",
    "data": {
      "carousel": { ... },
      "text": { ... },
      "cta": { ... }
    }
  }
}
```

#### Create Configuration
```
POST /api/configs
Content-Type: application/json
```

**Request Body:**
```json
{
  "carousel": {
    "slides": [
      {
        "id": "slide-1",
        "imageUrl": "https://example.com/image.jpg",
        "altText": "Description",
        "aspectRatio": "landscape"
      }
    ]
  },
  "text": {
    "heading": "Welcome",
    "headingColor": "#000000",
    "description": "Description text",
    "descriptionColor": "#333333"
  },
  "cta": {
    "primaryText": "Get Started",
    "primaryUrl": "/start",
    "primaryColor": "#0066cc",
    "primaryTextColor": "#ffffff"
  }
}
```

**Response:** `201 Created`

#### Update Configuration
```
PUT /api/configs/:id
Content-Type: application/json
```

**Request Body:** Same as Create

**Response:** `200 OK`

#### Delete Configuration
```
DELETE /api/configs/:id
```

**Response:** `204 No Content`

### Error Responses

```json
{
  "success": false,
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Invalid configuration payload",
    "details": ["Text headingColor must be a valid hex color"]
  }
}
```

| Code | HTTP Status | Description |
|------|-------------|-------------|
| UNAUTHORIZED | 401 | Missing or invalid API key |
| BAD_REQUEST | 400 | Invalid request format |
| VALIDATION_ERROR | 400 | Invalid configuration data |
| NOT_FOUND | 404 | Configuration not found |
| ALREADY_EXISTS | 409 | Configuration ID already exists |
| FORBIDDEN | 403 | Operation not allowed |
| METHOD_NOT_ALLOWED | 405 | HTTP method not supported |
| INTERNAL_ERROR | 500 | Server error |

### Validation Rules

| Field | Validation |
|-------|------------|
| Hex colors | Must match `/^#[0-9A-Fa-f]{6}$/` |
| URLs | Must start with `http://`, `https://`, `/`, or `#` |
| Aspect ratios | Must be `portrait`, `landscape`, or `square` |
| Slides | Required: `id`, `imageUrl`, `altText`, `aspectRatio` |

## Configuration Structure

```typescript
interface StoredConfig {
  id: string;              // Unique identifier
  schemaVersion: number;   // For schema evolution
  createdAt: string;       // ISO timestamp
  updatedAt: string;       // ISO timestamp
  data: {
    carousel: CarouselConfig;
    text: TextConfig;
    cta: CtaConfig;
  };
}
```

## Storage

**Approach: File-based JSON storage**

**Rationale:**
- Zero dependencies — works out of the box
- Simple deployment — no database setup required
- Human-readable — easy debugging
- Suitable for single-user/low-traffic scenarios

**Limitations:**
- Not suitable for high-concurrency
- No complex querying
- Use a database for production with multiple users

## Import/Export

Users can backup and restore configurations via JSON files:

- **Export**: Downloads current configuration as JSON
- **Import**: Uploads JSON file to restore configuration

## Project Structure

```
app/
├── components/
│   ├── editor/          # Editor UI components
│   └── preview/         # Preview UI components
├── context/
│   └── ConfigContext.tsx
├── routes/
│   ├── _index.tsx       # Main page (loader + action)
│   ├── api.configs.ts   # REST API: list, create
│   └── api.configs.$id.ts # REST API: get, update, delete
├── services/
│   └── config.server.ts # Configuration service
├── types/
│   └── config.ts        # TypeScript definitions
└── utils/
    ├── auth.server.ts   # API authentication
    ├── defaults.ts      # Default values
    └── validation.server.ts
data/
└── configs/             # Stored configurations
```