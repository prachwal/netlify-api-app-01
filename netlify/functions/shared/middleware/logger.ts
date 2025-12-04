import type { Request, Response, NextFunction } from "express";

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
  headers?: Record<string, string>;
}

/**
 * Response logging interface
 */
interface ResponseLog {
  timestamp: string;
  requestId: string;
  method: string;
  url: string;
  statusCode: number;
  responseTime: number;
  contentLength?: number;
}

/**
 * Generate unique request ID
 */
function generateRequestId(): string {
  return `req_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
}

/**
 * Request ID middleware - adds request ID to request object and response headers
 */
export function requestIdMiddleware(req: Request, res: Response, next: NextFunction): void {
  const requestId = req.headers['x-request-id'] as string || generateRequestId();
  
  // Add request ID to request object for use in route handlers
  (req as any).requestId = requestId;
  
  // Add request ID to response headers
  res.setHeader('X-Request-ID', requestId);
  
  next();
}

/**
 * Request logging middleware
 */
export function requestLogger(req: Request, res: Response, next: NextFunction): void {
  const requestId = (req as any).requestId as string || 'unknown';
  const timestamp = new Date().toISOString();
  
  const requestLog: RequestLog = {
    timestamp,
    requestId,
    method: req.method,
    url: req.url,
    userAgent: req.headers['user-agent'],
    clientIp: req.ip || req.connection.remoteAddress,
    headers: {
      'content-type': req.headers['content-type'] || 'none',
      'accept': req.headers['accept'] || 'none'
    }
  };
  
  console.log('Incoming Request:', JSON.stringify(requestLog, null, 2));
  
  // Log response after it's finished
  const startTime = Date.now();
  res.on('finish', () => {
    logResponse(req, res, startTime);
  });
  
  next();
}

/**
 * Log response details
 */
function logResponse(req: Request, res: Response, startTime: number): void {
  const requestId = (req as any).requestId as string || 'unknown';
  const timestamp = new Date().toISOString();
  const responseTime = Date.now() - startTime;
  
  const responseLog: ResponseLog = {
    timestamp,
    requestId,
    method: req.method,
    url: req.url,
    statusCode: res.statusCode,
    responseTime
  };
  
  // Determine log level based on status code
  if (res.statusCode >= 500) {
    console.error('Server Error:', JSON.stringify(responseLog, null, 2));
  } else if (res.statusCode >= 400) {
    console.warn('Client Error:', JSON.stringify(responseLog, null, 2));
  } else {
    console.log('Response:', JSON.stringify(responseLog, null, 2));
  }
}

/**
 * Performance monitoring middleware
 */
export function performanceMonitor(req: Request, res: Response, next: NextFunction): void {
  const startTime = Date.now();
  
  res.on('finish', () => {
    const duration = Date.now() - startTime;
    
    // Log slow requests (over 1000ms)
    if (duration > 1000) {
      console.warn('Slow Request:', {
        requestId: (req as any).requestId,
        method: req.method,
        url: req.url,
        duration: `${duration}ms`,
        timestamp: new Date().toISOString()
      });
    }
  });
  
  next();
}

/**
 * Security headers middleware
 */
export function securityHeaders(req: Request, res: Response, next: NextFunction): void {
  // Only set security headers if they haven't been set yet
  if (!res.getHeader('X-Content-Type-Options')) {
    res.setHeader('X-Content-Type-Options', 'nosniff');
  }
  if (!res.getHeader('X-Frame-Options')) {
    res.setHeader('X-Frame-Options', 'DENY');
  }
  if (!res.getHeader('X-XSS-Protection')) {
    res.setHeader('X-XSS-Protection', '1; mode=block');
  }
  
  next();
}

/**
 * Combined middleware stack
 */
export const middlewareStack = [
  requestIdMiddleware,
  requestLogger,
  performanceMonitor
];