import type { Request, Response, NextFunction } from "express";
import type { ApiError } from "../types/api";

/**
 * Error logging interface
 */
interface ErrorLog {
  timestamp: string;
  requestId: string;
  method: string;
  url: string;
  userAgent?: string;
  clientIp?: string;
  error: {
    message: string;
    stack?: string;
    code?: string;
  };
}

/**
 * Request logging interface
 */
interface RequestLog {
  timestamp: string;
  requestId: string;
  method: string;
  url: string;
  userAgent?: string;
  clientIp?: string;
  statusCode?: number;
  responseTime?: number;
}

/**
 * Error handler middleware
 */
export function errorHandler(
  error: Error | ApiError,
  req: Request,
  res: Response,
  next: NextFunction
): void {
  const requestId = req.headers['x-request-id'] as string || 'unknown';
  const timestamp = new Date().toISOString();
  
  // Log error
  const errorLog: ErrorLog = {
    timestamp,
    requestId,
    method: req.method,
    url: req.url,
    userAgent: req.headers['user-agent'],
    clientIp: req.ip || req.connection.remoteAddress,
    error: {
      message: error instanceof Error ? error.message : (typeof error === 'string' ? error : error.message),
      stack: error instanceof Error ? error.stack : undefined,
      code: typeof error === 'object' && error !== null && 'code' in error ? (error as any).code : undefined
    }
  };
  
  console.error('API Error:', JSON.stringify(errorLog, null, 2));
  
  // Determine appropriate status code
  let statusCode = 500;
  let errorMessage = 'Internal Server Error';
  
  if (typeof error === 'object' && error !== null && 'code' in error) {
    const apiError = error as any;
    switch (apiError.code) {
      case 'VALIDATION_ERROR':
        statusCode = 400;
        errorMessage = 'Invalid request data';
        break;
      case 'NOT_FOUND':
        statusCode = 404;
        errorMessage = 'Resource not found';
        break;
      case 'UNAUTHORIZED':
        statusCode = 401;
        errorMessage = 'Unauthorized access';
        break;
      case 'FORBIDDEN':
        statusCode = 403;
        errorMessage = 'Forbidden access';
        break;
      case 'CONFLICT':
        statusCode = 409;
        errorMessage = 'Resource conflict';
        break;
      default:
        statusCode = 500;
        errorMessage = apiError.message || 'Internal Server Error';
    }
  } else if (error instanceof Error) {
    errorMessage = error.message;
  }
  
  // Send standardized error response
  res.status(statusCode).json({
    status: false,
    error: {
      code: typeof error === 'object' && error !== null && 'code' in error ? (error as any).code : 'INTERNAL_ERROR',
      message: errorMessage,
      details: error instanceof Error ? { stack: error.stack } : undefined
    },
    metadata: {
      timestamp,
      requestId,
      version: "1.0.0",
      executionTime: 0
    }
  });
}

/**
 * 404 Not Found handler
 */
export function notFoundHandler(req: Request, res: Response, next: NextFunction): void {
  const requestId = req.headers['x-request-id'] as string || 'unknown';
  const timestamp = new Date().toISOString();
  
  res.status(404).json({
    status: false,
    error: {
      code: 'NOT_FOUND',
      message: `Endpoint ${req.method} ${req.url} not found`,
      details: {
        availableEndpoints: [
          'GET /api/hello',
          'GET /api/health', 
          'GET /api',
          'POST /api/echo'
        ]
      }
    },
    metadata: {
      timestamp,
      requestId,
      version: "1.0.0",
      executionTime: 0
    }
  });
}