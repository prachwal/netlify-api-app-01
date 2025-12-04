// Shared API types between frontend and backend

/**
 * Metadata for API responses
 */
export interface ApiMetadata {
  /** Timestamp of the response */
  timestamp: string;
  
  /** Request ID for tracking */
  requestId: string;
  
  /** Version of the API */
  version: string;
  
  /** Execution time in milliseconds */
  executionTime: number;
}

/**
 * Success response structure
 */
export interface ResponseSuccess<T> {
  status: true;
  payload: T;
  metadata: ApiMetadata;
}

/**
 * Error response structure  
 */
export interface ResponseError<T = string> {
  status: false;
  error: T;
  metadata: ApiMetadata;
}

/**
 * Union type for all API responses
 */
export type ApiResponse<T, E = string> = ResponseSuccess<T> | ResponseError<E>;

/**
 * API Error types
 */
export type ApiError = 
  | { code: string; message: string; details?: Record<string, unknown> }
  | string;

/**
 * API Request metadata
 */
export interface ApiRequestMetadata {
  /** Request ID for correlation */
  requestId: string;
  
  /** User agent */
  userAgent?: string;
  
  /** Client IP */
  clientIp?: string;
  
  /** Endpoint path */
  path: string;
  
  /** HTTP method */
  method: string;
}

/**
 * Standard API success response for frontend compatibility
 */
export interface StandardApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  metadata?: ApiMetadata;
}