// store/api/apiSlice.ts - RTK Query API service

import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import type { ApiResponse } from '../../../netlify/libs/types/api';

// Constants for request ID generation
const REQUEST_ID_PREFIX = 'client_';
const RADIX_BASE = 36;
const SUBSTRING_START = 2;
const SUBSTRING_LENGTH = 9;

/**
 * Generate unique request ID for client requests
 */
function generateRequestId(): string {
  const timestamp = Date.now().toString();
  const random = Math.random().toString(RADIX_BASE).substr(SUBSTRING_START, SUBSTRING_LENGTH);
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
      transformResponse: (response: ApiResponse<string>) => {
        if (response.status !== true || response.payload == null) {
          throw new Error('Invalid response format');
        }
        return response.payload;
      },
    }),
    
    /** Echo message endpoint */
    echoMessage: builder.mutation<{ originalMessage: string; receivedData?: Record<string, unknown> }, { message: string; data?: Record<string, unknown> }>({
      query: (body) => ({
        url: 'echo',
        method: 'POST',
        body,
      }),
      transformResponse: (response: ApiResponse<{ originalMessage: string; receivedData?: Record<string, unknown> }>) => {
        if (response.status !== true || response.payload == null) {
          throw new Error('Echo request failed');
        }
        return response.payload;
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
      transformResponse: (response: ApiResponse<{
        status: string;
        uptime: number;
        timestamp: string;
        memory: Record<string, number>;
        version: string;
      }>) => {
        if (response.status !== true || response.payload == null) {
          throw new Error('Health check failed');
        }
        return response.payload;
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
      transformResponse: (response: ApiResponse<{
        name: string;
        version: string;
        description: string;
        endpoints: Record<string, string>;
        features: string[];
      }>) => {
        if (response.status !== true || response.payload == null) {
          throw new Error('Failed to get API info');
        }
        return response.payload;
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