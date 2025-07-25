# API Documentation

## Base URL
- **Development**: `http://localhost:5000/api`
- **Production**: `https://excel-analytics-qjvs.onrender.com/api`

## Authentication

All protected endpoints require a JWT token in the Authorization header:
```
Authorization: Bearer <your-jwt-token>
```

## Response Format

### Success Response
```json
{
  "success": true,
  "data": {
    // Response data
  },
  "message": "Success message"
}
```

### Error Response
```json
{
  "success": false,
  "error": "Error message",
  "details": "Detailed error information"
}
```

## Authentication Endpoints

### POST /auth/register
Register a new user account.

**Request Body:**
```json
{
  "username": "string (required, 3-30 chars)",
  "email": "string (required, valid email)",
  "password": "string (required, min 6 chars)"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "token": "jwt-token-string",
    "user": {
      "id": "user-id",
      "username": "username",
      "email": "user@example.com",
      "role": "user",
      "createdAt": "2025-01-01T00:00:00.000Z"
    }
  },
  "message": "User registered successfully"
}
```

### POST /auth/login
Authenticate user and get access token.

**Request Body:**
```json
{
  "email": "string (required)",
  "password": "string (required)"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "token": "jwt-token-string",
    "user": {
      "id": "user-id",
      "username": "username",
      "email": "user@example.com",
      "role": "user"
    }
  },
  "message": "Login successful"
}
```

### GET /auth/me
Get current user information (Protected).

**Headers:**
```
Authorization: Bearer <token>
```

**Response:**
```json
{
  "success": true,
  "data": {
    "user": {
      "id": "user-id",
      "username": "username",
      "email": "user@example.com",
      "role": "user",
      "createdAt": "2025-01-01T00:00:00.000Z"
    }
  }
}
```

### POST /auth/forgot-password
Send password reset code to user's email.

**Request Body:**
```json
{
  "email": "user@example.com"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Password reset code has been sent to your email"
}
```

**Error Responses:**
- `400` - Invalid email format
- `500` - Server error or email service failure

**Notes:**
- For security, the response is the same whether the email exists or not
- Reset codes expire after 15 minutes
- Only active accounts can request password resets

### POST /auth/reset-password
Reset password using the emailed reset code.

**Request Body:**
```json
{
  "email": "user@example.com",
  "resetCode": "123456",
  "newPassword": "newpassword123",
  "confirmPassword": "newpassword123"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Password has been reset successfully"
}
```

**Error Responses:**
- `400` - Invalid or expired reset code, passwords don't match, or validation failed
- `500` - Server error

**Notes:**
- Reset codes are 6-digit numbers
- Codes expire 15 minutes after generation
- Each code can only be used once
- Successful reset clears all reset tokens for the user

### PUT /auth/change-password
Change user's password (Protected).

**Headers:**
```
Authorization: Bearer <token>
```

**Request Body:**
```json
{
  "currentPassword": "oldpassword123",
  "newPassword": "newpassword123",
  "confirmPassword": "newpassword123"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Password changed successfully"
}
```

**Error Responses:**
- `400` - Current password incorrect or validation failed
- `401` - Unauthorized (invalid token)
- `404` - User not found
- `500` - Server error

## File Management Endpoints

### POST /files/upload
Upload an Excel file for analysis (Protected).

**Headers:**
```
Authorization: Bearer <token>
Content-Type: multipart/form-data
```

**Request Body (Form Data):**
```
file: Excel file (.xlsx, .xls)
```

**Response:**
```json
{
  "success": true,
  "data": {
    "file": {
      "id": "file-id",
      "filename": "data.xlsx",
      "originalName": "my-data.xlsx",
      "size": 12345,
      "sheets": ["Sheet1", "Sheet2"],
      "uploadedAt": "2025-01-01T00:00:00.000Z"
    }
  },
  "message": "File uploaded successfully"
}
```

### GET /files
Get list of uploaded files for current user (Protected).

**Headers:**
```
Authorization: Bearer <token>
```

**Query Parameters:**
- `page` (optional): Page number (default: 1)
- `limit` (optional): Items per page (default: 10)
- `sort` (optional): Sort by field (default: createdAt)
- `order` (optional): Sort order (asc/desc, default: desc)

**Response:**
```json
{
  "success": true,
  "data": {
    "files": [
      {
        "id": "file-id",
        "filename": "data.xlsx",
        "originalName": "my-data.xlsx",
        "size": 12345,
        "sheets": ["Sheet1"],
        "uploadedAt": "2025-01-01T00:00:00.000Z"
      }
    ],
    "pagination": {
      "page": 1,
      "limit": 10,
      "total": 25,
      "pages": 3
    }
  }
}
```

### GET /files/:id
Get specific file details and data (Protected).

**Headers:**
```
Authorization: Bearer <token>
```

**Parameters:**
- `id`: File ID

**Query Parameters:**
- `sheet` (optional): Sheet name to get data from

**Response:**
```json
{
  "success": true,
  "data": {
    "file": {
      "id": "file-id",
      "filename": "data.xlsx",
      "originalName": "my-data.xlsx",
      "size": 12345,
      "sheets": ["Sheet1"],
      "uploadedAt": "2025-01-01T00:00:00.000Z"
    },
    "data": {
      "columns": ["Name", "Age", "Salary"],
      "rows": [
        ["John", 25, 50000],
        ["Jane", 30, 60000]
      ]
    }
  }
}
```

### DELETE /files/:id
Delete a file (Protected).

**Headers:**
```
Authorization: Bearer <token>
```

**Parameters:**
- `id`: File ID

**Response:**
```json
{
  "success": true,
  "message": "File deleted successfully"
}
```

## Chart Generation Endpoints

### POST /charts/generate
Generate a chart from uploaded data (Protected).

**Headers:**
```
Authorization: Bearer <token>
Content-Type: application/json
```

**Request Body:**
```json
{
  "fileId": "file-id (required)",
  "sheet": "Sheet1 (optional)",
  "chartType": "bar|line|pie|scatter|bar3d|scatter3d|surface3d (required)",
  "xAxis": "column-name (required)",
  "yAxis": "column-name (required)",
  "title": "Chart Title (optional)",
  "options": {
    "colors": ["#FF6B6B", "#4ECDC4"],
    "showLegend": true,
    "responsive": true
  }
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "chartData": {
      "labels": ["Jan", "Feb", "Mar"],
      "datasets": [{
        "label": "Sales",
        "data": [100, 200, 150],
        "backgroundColor": ["#FF6B6B", "#4ECDC4", "#45B7D1"]
      }]
    },
    "chartConfig": {
      "chartType": "bar",
      "title": "Monthly Sales",
      "xAxis": "Month",
      "yAxis": "Sales"
    }
  },
  "message": "Chart generated successfully"
}
```

### POST /charts/save
Save a chart configuration (Protected).

**Headers:**
```
Authorization: Bearer <token>
Content-Type: application/json
```

**Request Body:**
```json
{
  "fileId": "file-id (required)",
  "chartData": "chart-data-object (required)",
  "chartConfig": "chart-config-object (required)",
  "title": "Chart Title (optional)"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "chart": {
      "id": "chart-id",
      "title": "My Chart",
      "chartType": "bar",
      "fileId": "file-id",
      "savedAt": "2025-01-01T00:00:00.000Z"
    }
  },
  "message": "Chart saved successfully"
}
```

### GET /charts
Get saved charts for current user (Protected).

**Headers:**
```
Authorization: Bearer <token>
```

**Query Parameters:**
- `page` (optional): Page number (default: 1)
- `limit` (optional): Items per page (default: 10)
- `chartType` (optional): Filter by chart type

**Response:**
```json
{
  "success": true,
  "data": {
    "charts": [
      {
        "id": "chart-id",
        "title": "My Chart",
        "chartType": "bar",
        "fileId": "file-id",
        "filename": "data.xlsx",
        "savedAt": "2025-01-01T00:00:00.000Z"
      }
    ],
    "pagination": {
      "page": 1,
      "limit": 10,
      "total": 5,
      "pages": 1
    }
  }
}
```

### GET /charts/:id
Get specific saved chart (Protected).

**Headers:**
```
Authorization: Bearer <token>
```

**Parameters:**
- `id`: Chart ID

**Response:**
```json
{
  "success": true,
  "data": {
    "chart": {
      "id": "chart-id",
      "title": "My Chart",
      "chartType": "bar",
      "chartData": { /* chart data object */ },
      "chartConfig": { /* chart config object */ },
      "fileId": "file-id",
      "savedAt": "2025-01-01T00:00:00.000Z"
    }
  }
}
```

### DELETE /charts/:id
Delete a saved chart (Protected).

**Headers:**
```
Authorization: Bearer <token>
```

**Parameters:**
- `id`: Chart ID

**Response:**
```json
{
  "success": true,
  "message": "Chart deleted successfully"
}
```

## Analytics Endpoints

### POST /analytics
Create an analytics record (Protected).

**Headers:**
```
Authorization: Bearer <token>
Content-Type: application/json
```

**Request Body:**
```json
{
  "fileId": "file-id (required)",
  "chartType": "bar|line|pie|scatter|bar3d|scatter3d|surface3d (required)",
  "xAxis": "column-name (required)",
  "yAxis": "column-name (required)",
  "metadata": {
    "duration": 1500,
    "interactions": 5
  }
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "analytics": {
      "id": "analytics-id",
      "fileId": "file-id",
      "chartType": "bar",
      "createdAt": "2025-01-01T00:00:00.000Z"
    }
  },
  "message": "Analytics record created"
}
```

### GET /analytics
Get analytics data for current user (Protected).

**Headers:**
```
Authorization: Bearer <token>
```

**Query Parameters:**
- `startDate` (optional): Start date (YYYY-MM-DD)
- `endDate` (optional): End date (YYYY-MM-DD)
- `chartType` (optional): Filter by chart type

**Response:**
```json
{
  "success": true,
  "data": {
    "analytics": [
      {
        "id": "analytics-id",
        "chartType": "bar",
        "fileId": "file-id",
        "filename": "data.xlsx",
        "createdAt": "2025-01-01T00:00:00.000Z"
      }
    ],
    "summary": {
      "totalCharts": 25,
      "chartTypes": {
        "bar": 10,
        "line": 8,
        "pie": 4,
        "scatter": 3
      }
    }
  }
}
```

## Admin Endpoints (Admin Role Required)

### GET /admin/users
Get all users (Admin only).

**Headers:**
```
Authorization: Bearer <admin-token>
```

**Response:**
```json
{
  "success": true,
  "data": {
    "users": [
      {
        "id": "user-id",
        "username": "username",
        "email": "user@example.com",
        "role": "user",
        "createdAt": "2025-01-01T00:00:00.000Z",
        "lastLogin": "2025-01-01T12:00:00.000Z"
      }
    ]
  }
}
```

### GET /admin/stats
Get platform statistics (Admin only).

**Headers:**
```
Authorization: Bearer <admin-token>
```

**Response:**
```json
{
  "success": true,
  "data": {
    "stats": {
      "totalUsers": 150,
      "totalFiles": 1200,
      "totalCharts": 3500,
      "activeUsers": 45,
      "storageUsed": "2.5GB"
    }
  }
}
```

## Error Codes

| Code | Description |
|------|-------------|
| 400 | Bad Request - Invalid input data |
| 401 | Unauthorized - Missing or invalid token |
| 403 | Forbidden - Insufficient permissions |
| 404 | Not Found - Resource not found |
| 409 | Conflict - Resource already exists |
| 413 | Payload Too Large - File size exceeds limit |
| 422 | Unprocessable Entity - Validation error |
| 429 | Too Many Requests - Rate limit exceeded |
| 500 | Internal Server Error - Server error |

## Rate Limiting

API endpoints are rate limited:
- **Authentication**: 5 requests per minute
- **File Upload**: 10 requests per hour
- **General API**: 100 requests per minute

## File Upload Limits

- **Max file size**: 10MB
- **Supported formats**: .xlsx, .xls
- **Max sheets per file**: 50
- **Max rows per sheet**: 100,000

## Support

For API support, please contact:
- **Email**: api-support@excelanalytics.com
- **Documentation**: https://docs.excelanalytics.com
- **GitHub Issues**: https://github.com/Anisha1121/Excel-Analytics/issues
