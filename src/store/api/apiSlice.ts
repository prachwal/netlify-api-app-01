// store/api/apiSlice.ts - RTK Query API service

import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import type { ApiResponse } from '../../../netlify/libs/types/api';

/**
 * Error message constants for better maintainability
 */
const API_ERRORS = {
  INVALID_HELLO_FORMAT: 'Invalid hello response format',
  HELLO_REQUEST_FAILED: 'Hello request failed',
  INVALID_ECHO_FORMAT: 'Invalid echo response format',
  ECHO_REQUEST_FAILED: 'Echo request failed',
  INVALID_HEALTH_FORMAT: 'Invalid health response format',
  HEALTH_REQUEST_FAILED: 'Health check failed',
  INVALID_API_INFO_FORMAT: 'Invalid API info response format',
  API_INFO_REQUEST_FAILED: 'Failed to get API info',
} as const;

/**
 * Type guard for echo response
 */
const isEchoResponse = (payload: unknown): payload is { originalMessage: string; receivedData?: Record<string, unknown> } => {
  return (
    typeof payload === 'object' &&
    payload !== null &&
    'originalMessage' in payload &&
    typeof (payload as any).originalMessage === 'string'
  );
};

/**
 * Type guard for health response
 */
const isHealthResponse = (payload: unknown): payload is {
  status: string;
  uptime: number;
  timestamp: string;
  memory: Record<string, number>;
  version: string;
} => {
  if (typeof payload !== 'object' || payload === null) return false;
  const p = payload as any;
  return (
    typeof p.status === 'string' &&
    typeof p.uptime === 'number' &&
    typeof p.timestamp === 'string' &&
    typeof p.memory === 'object' &&
    typeof p.version === 'string'
  );
};

/**
 * Type guard for API info response
 */
const isApiInfoResponse = (payload: unknown): payload is {
  name: string;
  version: string;
  description: string;
  endpoints: Record<string, string>;
  features: string[];
} => {
  if (typeof payload !== 'object' || payload === null) return false;
  const p = payload as any;
  return (
    typeof p.name === 'string' &&
    typeof p.version === 'string' &&
    typeof p.description === 'string' &&
    typeof p.endpoints === 'object' &&
    typeof p.features === 'object' &&
    Array.isArray(p.features) &&
    p.features.every((f: unknown) => typeof f === 'string')
  );
};

// Constants for request ID generation
const REQUEST_ID_PREFIX = 'client_';
const RADIX_BASE = 36;
const SUBSTRING_START = 2;
const SUBSTRING_LENGTH = 9;

/**
 * Validate API response structure
 */
function validateApiResponse<T>(response: unknown, validator?: (payload: unknown) => payload is T): response is ApiResponse<T> {
  if (response == null || typeof response !== 'object') {
    return false;
  }

  const apiResponse = response as Record<string, unknown>;

  // Check required fields
  if (typeof apiResponse.status !== 'boolean') {
    return false;
  }

  // If validator provided, use it to validate payload
  if (validator && apiResponse.payload !== undefined) {
    return validator(apiResponse.payload);
  }

  return true;
}

/**
 * Generate unique request ID for client requests
 */
function generateRequestId(): string {
  const timestamp = Date.now().toString();
  const random = Math.random().toString(RADIX_BASE).substring(SUBSTRING_START, SUBSTRING_START + SUBSTRING_LENGTH);
  return `${REQUEST_ID_PREFIX}${timestamp}_${random}`;
}

/**
 * API service configuration using RTK Query
 * 
 * @remarks
 * This service provides cached data fetching capabilities
 * for the Netlify API endpoints with automatic caching,
 * retry logic, and error handling.
 */
export const apiSlice = createApi({
  /** The reducer path for this API service */
  reducerPath: 'api',
  
  /** Base query configuration */
  baseQuery: fetchBaseQuery({
    baseUrl: '/api/',
    prepareHeaders: (headers) => {
      // Add request ID header for tracing
      const requestId = generateRequestId();
      headers.set('X-Request-ID', requestId);
      
      // Add content type header
      headers.set('Content-Type', 'application/json');
      
      return headers;
    },
  }),
  
  /** API endpoints */
  endpoints: (builder) => ({
    /** Get hello message */
    getHello: builder.query<string, void>({
      query: () => 'hello',
      transformResponse: (response: unknown) => {
        if (!validateApiResponse<string>(response, (payload): payload is string => typeof payload === 'string')) {
          throw new Error(API_ERRORS.INVALID_HELLO_FORMAT);
        }
        const apiResponse = response as ApiResponse<string>;
        if (!apiResponse.status || apiResponse.payload == null) {
          throw new Error(API_ERRORS.HELLO_REQUEST_FAILED);
        }
        return apiResponse.payload;
      },
    }),
    
    /** Echo message endpoint */
    echoMessage: builder.mutation<{ originalMessage: string; receivedData?: Record<string, unknown> }, { message: string; data?: Record<string, unknown> }>({
      query: (body) => ({
        url: 'echo',
        method: 'POST',
        body,
      }),
      transformResponse: (response: unknown) => {
        if (!validateApiResponse(response, isEchoResponse)) {
          throw new Error(API_ERRORS.INVALID_ECHO_FORMAT);
        }
        const apiResponse = response as ApiResponse<{ originalMessage: string; receivedData?: Record<string, unknown> }>;
        if (!apiResponse.status || apiResponse.payload == null) {
          throw new Error(API_ERRORS.ECHO_REQUEST_FAILED);
        }
        return apiResponse.payload;
      },
    }),
    
    /** Get API health status */
    getHealth: builder.query<{
      status: string;
      uptime: number;
      timestamp: string;
      memory: Record<string, number>;
      version: string;
    }, void>({
      query: () => 'health',
      transformResponse: (response: unknown) => {
        if (!validateApiResponse(response, isHealthResponse)) {
          throw new Error(API_ERRORS.INVALID_HEALTH_FORMAT);
        }
        const apiResponse = response as ApiResponse<{
          status: string;
          uptime: number;
          timestamp: string;
          memory: Record<string, number>;
          version: string;
        }>;
        if (!apiResponse.status || apiResponse.payload == null) {
          throw new Error(API_ERRORS.HEALTH_REQUEST_FAILED);
        }
        return apiResponse.payload;
      },
    }),
    
    /** Get API information */
    getApiInfo: builder.query<{
      name: string;
      version: string;
      description: string;
      endpoints: Record<string, string>;
      features: string[];
    }, void>({
      query: () => '',
      transformResponse: (response: unknown) => {
        if (!validateApiResponse(response, isApiInfoResponse)) {
          throw new Error(API_ERRORS.INVALID_API_INFO_FORMAT);
        }
        const apiResponse = response as ApiResponse<{
          name: string;
          version: string;
          description: string;
          endpoints: Record<string, string>;
          features: string[];
        }>;
        if (!apiResponse.status || apiResponse.payload == null) {
          throw new Error(API_ERRORS.API_INFO_REQUEST_FAILED);
        }
        return apiResponse.payload;
      },
    }),
  }),
});

/**
 * Export hooks for using the API service
 */
export const {
  useGetHelloQuery,
  useEchoMessageMutation,
  useGetHealthQuery,
  useGetApiInfoQuery,
} = apiSlice;
