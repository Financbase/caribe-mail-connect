# 📚 API Documentation

## Overview

This document provides comprehensive API documentation for the caribe-mail-connect application, including all endpoints, data models, authentication, and usage examples.

## 🔐 Authentication

### Authentication Methods

#### 1. Supabase Authentication
```typescript
// Login with email/password
const { data, error } = await supabase.auth.signInWithPassword({
  email: 'user@example.com',
  password: 'password123'
});

// Login with OAuth (Google, GitHub, etc.)
const { data, error } = await supabase.auth.signInWithOAuth({
  provider: 'google'
});

// Get current session
const { data: { session } } = await supabase.auth.getSession();
```

#### 2. API Key Authentication
```typescript
// Include in headers
headers: {
  'Authorization': `Bearer ${apiKey}`,
  'Content-Type': 'application/json'
}
```

### Authentication Headers
- **Authorization**: `Bearer <token>` - JWT token from Supabase auth
- **X-API-Key**: `<api_key>` - API key for service-to-service calls

## 📊 Data Models

### User Model
```typescript
interface User {
  id: string;
  email: string;
  name?: string;
  avatar_url?: string;
  role: 'admin' | 'user' | 'viewer';
  created_at: string;
  updated_at: string;
  last_login?: string;
  preferences?: UserPreferences;
}

interface UserPreferences {
  theme: 'light' | 'dark' | 'system';
  language: string;
  timezone: string;
  notifications: NotificationSettings;
}
```

### Document Model
```typescript
interface Document {
  id: string;
  title: string;
  content: string;
  type: 'email' | 'template' | 'draft';
  status: 'draft' | 'published' | 'archived';
  author_id: string;
  created_at: string;
  updated_at: string;
  metadata?: DocumentMetadata;
  tags?: string[];
}

interface DocumentMetadata {
  word_count: number;
  reading_time: number;
  last_editor_id: string;
  version: number;
}
```

### Email Campaign Model
```typescript
interface EmailCampaign {
  id: string;
  name: string;
  subject: string;
  content: string;
  template_id?: string;
  status: 'draft' | 'scheduled' | 'sending' | 'sent' | 'paused';
  scheduled_at?: string;
  sent_at?: string;
  created_at: string;
  updated_at: string;
  statistics?: CampaignStatistics;
  recipients: Recipient[];
}

interface CampaignStatistics {
  total_sent: number;
  delivered: number;
  opened: number;
  clicked: number;
  bounced: number;
  unsubscribed: number;
  open_rate: number;
  click_rate: number;
  bounce_rate: number;
}
```

## 🛠️ API Endpoints

### Authentication Endpoints

#### POST /auth/login
Login with email and password.

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "password123"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "user": { /* User object */ },
    "session": { /* Session object */ },
    "access_token": "jwt_token_here"
  }
}
```

#### POST /auth/logout
Logout current user.

**Response:**
```json
{
  "success": true,
  "message": "Logged out successfully"
}
```

#### GET /auth/me
Get current user information.

**Headers:** `Authorization: Bearer <token>`

**Response:**
```json
{
  "success": true,
  "data": {
    "user": { /* User object */ }
  }
}
```

### User Management Endpoints

#### GET /api/users
Get list of users (Admin only).

**Query Parameters:**
- `page` (number): Page number (default: 1)
- `limit` (number): Items per page (default: 20)
- `search` (string): Search term
- `role` (string): Filter by role

**Response:**
```json
{
  "success": true,
  "data": {
    "users": [/* Array of User objects */],
    "pagination": {
      "page": 1,
      "limit": 20,
      "total": 100,
      "pages": 5
    }
  }
}
```

#### GET /api/users/:id
Get user by ID.

**Response:**
```json
{
  "success": true,
  "data": {
    "user": { /* User object */ }
  }
}
```

#### PUT /api/users/:id
Update user information.

**Request Body:**
```json
{
  "name": "Updated Name",
  "role": "admin",
  "preferences": {
    "theme": "dark",
    "language": "en"
  }
}
```

#### DELETE /api/users/:id
Delete user (Admin only).

### Document Management Endpoints

#### GET /api/documents
Get list of documents.

**Query Parameters:**
- `page` (number): Page number
- `limit` (number): Items per page
- `type` (string): Document type filter
- `status` (string): Status filter
- `search` (string): Search term
- `tags` (string[]): Filter by tags

**Response:**
```json
{
  "success": true,
  "data": {
    "documents": [/* Array of Document objects */],
    "pagination": { /* Pagination object */ }
  }
}
```

#### POST /api/documents
Create new document.

**Request Body:**
```json
{
  "title": "Document Title",
  "content": "Document content...",
  "type": "email",
  "tags": ["newsletter", "marketing"]
}
```

#### GET /api/documents/:id
Get document by ID.

#### PUT /api/documents/:id
Update document.

#### DELETE /api/documents/:id
Delete document.

### Email Campaign Endpoints

#### GET /api/campaigns
Get list of email campaigns.

#### POST /api/campaigns
Create new email campaign.

**Request Body:**
```json
{
  "name": "Campaign Name",
  "subject": "Email Subject",
  "content": "Email content...",
  "template_id": "template_123",
  "scheduled_at": "2024-01-15T10:00:00Z",
  "recipients": [
    {
      "email": "recipient@example.com",
      "name": "Recipient Name"
    }
  ]
}
```

#### GET /api/campaigns/:id
Get campaign by ID.

#### PUT /api/campaigns/:id
Update campaign.

#### POST /api/campaigns/:id/send
Send campaign immediately.

#### POST /api/campaigns/:id/schedule
Schedule campaign for later.

#### GET /api/campaigns/:id/statistics
Get campaign statistics.

### Analytics Endpoints

#### GET /api/analytics/overview
Get analytics overview.

**Query Parameters:**
- `period` (string): Time period ('7d', '30d', '90d', '1y')
- `start_date` (string): Start date (ISO format)
- `end_date` (string): End date (ISO format)

**Response:**
```json
{
  "success": true,
  "data": {
    "total_campaigns": 25,
    "total_emails_sent": 10000,
    "average_open_rate": 0.25,
    "average_click_rate": 0.05,
    "growth_metrics": {
      "campaigns": 0.15,
      "emails_sent": 0.30,
      "open_rate": 0.05
    }
  }
}
```

#### GET /api/analytics/campaigns
Get campaign analytics.

#### GET /api/analytics/engagement
Get engagement analytics.

## 🔧 Utility Endpoints

### Health Check
#### GET /api/health
Check API health status.

**Response:**
```json
{
  "success": true,
  "data": {
    "status": "healthy",
    "timestamp": "2024-01-15T10:00:00Z",
    "version": "1.0.0",
    "uptime": 86400,
    "services": {
      "database": "healthy",
      "email_service": "healthy",
      "storage": "healthy"
    }
  }
}
```

### File Upload
#### POST /api/upload
Upload files (images, documents).

**Request:** Multipart form data
- `file`: File to upload
- `type`: File type ('image', 'document', 'template')

**Response:**
```json
{
  "success": true,
  "data": {
    "url": "https://storage.example.com/file.jpg",
    "filename": "file.jpg",
    "size": 1024000,
    "type": "image/jpeg"
  }
}
```

## 📝 Error Handling

### Error Response Format
```json
{
  "success": false,
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Invalid input data",
    "details": {
      "field": "email",
      "reason": "Invalid email format"
    },
    "timestamp": "2024-01-15T10:00:00Z",
    "request_id": "req_123456"
  }
}
```

### Common Error Codes
- `AUTHENTICATION_REQUIRED` (401): Authentication required
- `INSUFFICIENT_PERMISSIONS` (403): Insufficient permissions
- `RESOURCE_NOT_FOUND` (404): Resource not found
- `VALIDATION_ERROR` (400): Input validation failed
- `RATE_LIMIT_EXCEEDED` (429): Rate limit exceeded
- `INTERNAL_SERVER_ERROR` (500): Internal server error

## 🚀 Rate Limiting

### Rate Limits
- **Authentication endpoints**: 5 requests per minute
- **API endpoints**: 100 requests per minute
- **File uploads**: 10 requests per minute
- **Bulk operations**: 5 requests per minute

### Rate Limit Headers
```
X-RateLimit-Limit: 100
X-RateLimit-Remaining: 95
X-RateLimit-Reset: 1642248000
```

## 📊 Pagination

### Standard Pagination
```json
{
  "data": [/* Array of items */],
  "pagination": {
    "page": 1,
    "limit": 20,
    "total": 100,
    "pages": 5,
    "has_next": true,
    "has_prev": false
  }
}
```

### Cursor-based Pagination
```json
{
  "data": [/* Array of items */],
  "pagination": {
    "cursor": "eyJpZCI6MTIzfQ==",
    "has_next": true,
    "limit": 20
  }
}
```

## 🔍 Filtering and Searching

### Query Parameters
- `search`: Full-text search
- `filter[field]`: Filter by field value
- `sort`: Sort field (prefix with `-` for descending)
- `include`: Include related resources

### Example
```
GET /api/documents?search=newsletter&filter[status]=published&sort=-created_at&include=author
```

## 📚 SDK Examples

### JavaScript/TypeScript
```typescript
import { CaribeMailClient } from '@caribe-mail/sdk';

const client = new CaribeMailClient({
  apiKey: 'your_api_key',
  baseUrl: 'https://api.caribe-mail.com'
});

// Get documents
const documents = await client.documents.list({
  page: 1,
  limit: 20,
  type: 'email'
});

// Create campaign
const campaign = await client.campaigns.create({
  name: 'Newsletter',
  subject: 'Monthly Update',
  content: 'Newsletter content...'
});
```

### Python
```python
from caribe_mail import CaribeMailClient

client = CaribeMailClient(
    api_key='your_api_key',
    base_url='https://api.caribe-mail.com'
)

# Get documents
documents = client.documents.list(
    page=1,
    limit=20,
    type='email'
)

# Create campaign
campaign = client.campaigns.create({
    'name': 'Newsletter',
    'subject': 'Monthly Update',
    'content': 'Newsletter content...'
})
```

## 🧪 Testing

### API Testing
Use the provided test utilities for API testing:

```typescript
import { apiTestUtils } from '@/lib/testing/api-utils';

describe('Documents API', () => {
  it('should create document', async () => {
    const response = await apiTestUtils.post('/api/documents', {
      title: 'Test Document',
      content: 'Test content'
    });

    expect(response.success).toBe(true);
    expect(response.data.document.title).toBe('Test Document');
  });
});
```

### Postman Collection
Import the Postman collection from `/docs/postman/caribe-mail-api.json` for interactive API testing.

---

**Last Updated**: January 2025
**API Version**: v1.0.0
**Documentation Version**: 1.0.0
