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

The API key is used for authenticating requests to the configuration API. In development, a default key is used if not specified.

### Development

```bash
npm run dev
```

Application available at `http://localhost:5173`

## Architecture

### Storage Approach

**Choice: File-based JSON storage**

**Rationale:**
- Zero dependencies - works out of the box
- Simple deployment - no database setup required
- Human-readable configs - easy debugging
- Suitable for single-user/low-traffic scenarios
- Easy migration to database later if needed

**Limitations:**
- Not suitable for high-concurrency scenarios
- No complex querying capabilities
- Should use database for production with multiple users

### Configuration Structure

```typescript
interface StoredConfig {
  id: string;              // Unique identifier
  schemaVersion: number;   // For schema evolution
  updatedAt: string;       // ISO timestamp
  createdAt: string;       // ISO timestamp
  data: {
    carousel: CarouselConfig;
    text: TextConfig;
    cta: CtaConfig;
  };
}
```

## REST API

### Authentication

All API endpoints require Bearer token authentication:

```
Authorization: Bearer <API_KEY>
```

The API key is stored server-side only and never exposed to the browser.

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
      "id": "config-123",
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
    "id": "config-123",
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

**Error Response:** `404 Not Found`
```json
{
  "success": false,
  "error": {
    "code": "NOT_FOUND",
    "message": "Configuration with id 'config-123' not found"
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

### Error Codes

| Code | HTTP Status | Description |
|------|-------------|-------------|
| UNAUTHORIZED | 401 | Missing or invalid API key |
| BAD_REQUEST | 400 | Invalid request format |
| VALIDATION_ERROR | 400 | Invalid configuration data |
| NOT_FOUND | 404 | Configuration not found |
| ALREADY_EXISTS | 409 | Configuration ID already exists |
| FORBIDDEN | 403 | Operation not allowed |
| INTERNAL_ERROR | 500 | Server error |

### Validation Rules

- **Hex colors:** Must match `/^#[0-9A-Fa-f]{6}$/`
- **URLs:** Must start with `http://`, `https://`, `/`, or `#`
- **Aspect ratios:** Must be `portrait`, `landscape`, or `square`
- **Slide fields:** `id`, `imageUrl`, `altText`, `aspectRatio` are required

## Server-Side API Access

The application uses React Router loaders and actions to ensure:

1. **Browser never calls API directly** - All requests go through server-side code
2. **API keys stay on server** - Credentials never exposed to client
3. **Page reload restores state** - Configuration loaded via server-side loader

```
Browser <-> React Router (Server) <-> Configuration Service
                                          |
                                    [API Key Auth]
```

## Import/Export

Users can backup and restore configurations via JSON files:

- **Export:** Downloads current configuration as JSON
- **Import:** Uploads JSON file to restore configuration

## Development

### Project Structure

```
app/
├── components/
│   ├── editor/          # Editor components
│   └── preview/         # Preview components
├── context/             # React Context
├── routes/              # React Router routes
│   ├── _index.tsx       # Main editor page
│   ├── api.configs.ts   # List/Create API
│   └── api.configs.$id.ts # Get/Update/Delete API
├── services/            # Server-side services
├── types/               # TypeScript types
└── utils/               # Utilities
data/
└── configs/             # Stored configurations
```
