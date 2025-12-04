import { Router, type Request, type Response } from "express";
import type { ApiResponse, ApiError, ApiMetadata } from "../functions/shared/types/api";

/**
 * Interface for POST echo request body
 */
interface EchoRequestBody {
  message: string;
  data?: Record<string, unknown>;
}

/**
 * Interface for POST echo response data
 */
interface EchoResponseData {
  originalMessage: string;
  receivedData?: Record<string, unknown>;
  timestamp: string;
  requestId: string;
  method: string;
}

/**
 * Initialize router
 */
const router = Router();

/**
 * Generate unique request ID
 */
function generateRequestId(): string {
  return `req_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
}

/**
 * Create API metadata
 */
function createMetadata(requestId: string): ApiMetadata {
  return {
    timestamp: new Date().toISOString(),
    requestId,
    version: "1.0.0",
    executionTime: 0 // Will be updated with actual time
  };
}

/**
 * Create success response with standardized format
 */
function createSuccessResponse<T>(
  payload: T, 
  metadata: ApiMetadata
): ApiResponse<T, never> {
  return {
    status: true,
    payload,
    metadata
  };
}

/**
 * Create error response with standardized format  
 */
function createErrorResponse<T = string>(
  error: T,
  metadata: ApiMetadata
): ApiResponse<never, T> {
  return {
    status: false,
    error,
    metadata
  };
}

/**
 * Handle API endpoint execution with error handling
 */
async function handleEndpoint<T>(
  fn: () => Promise<T> | T,
  requestId: string
): Promise<ApiResponse<T, ApiError>> {
  const startTime = Date.now();
  const metadata = createMetadata(requestId);
  
  try {
    const result = await fn();
    metadata.executionTime = Date.now() - startTime;
    
    return createSuccessResponse(result, metadata);
  } catch (error) {
    metadata.executionTime = Date.now() - startTime;
    
    let apiError: ApiError;
    
    if (error instanceof Error) {
      // Check if it's a custom API error with a code property
      if ('code' in error) {
        apiError = { 
          code: (error as any).code || "INTERNAL_ERROR", 
          message: error.message 
        };
      } else {
        apiError = { code: "INTERNAL_ERROR", message: error.message };
      }
    } else {
      apiError = "Unknown error occurred";
    }
    
    return createErrorResponse(apiError, metadata);
  }
}

/**
 * Hello World endpoint
 */
router.get("/hello", async (req: Request, res: Response) => {
  const requestId = (req as any).requestId as string || generateRequestId();
  
  const response = await handleEndpoint(() => {
    return "Hello World!";
  }, requestId);
  
  if (response.status) {
    res.status(200).json(response);
  } else {
    res.status(500).json(response);
  }
});

/**
 * POST /api/echo - Echo back the received JSON data
 */
router.post("/echo", async (req: Request, res: Response) => {
  const requestId = (req as any).requestId as string || generateRequestId();
  
  const response = await handleEndpoint(async () => {
    // Validate request body exists
    if (!req.body || typeof req.body !== 'object') {
      const validationError = new Error('Request body must be a valid JSON object') as any;
      validationError.code = 'VALIDATION_ERROR';
      throw validationError;
    }
    
    const body = req.body as EchoRequestBody;
    
    // Validate message field
    if (!body.message || typeof body.message !== 'string') {
      const validationError = new Error('Message field is required and must be a string') as any;
      validationError.code = 'VALIDATION_ERROR';
      throw validationError;
    }
    
    // Validate data field if present
    if (body.data && typeof body.data !== 'object') {
      const validationError = new Error('Data field must be an object if provided') as any;
      validationError.code = 'VALIDATION_ERROR';
      throw validationError;
    }
    
    // Create echo response data
    const echoData: EchoResponseData = {
      originalMessage: body.message,
      receivedData: body.data,
      timestamp: new Date().toISOString(),
      requestId,
      method: req.method
    };
    
    return echoData;
  }, requestId);
  
  if (response.status) {
    res.status(200).json(response);
  } else {
    const statusCode = (response.error as any)?.code === 'VALIDATION_ERROR' ? 400 : 500;
    res.status(statusCode).json(response);
  }
});

/**
 * Health check endpoint
 */
router.get("/health", async (req: Request, res: Response) => {
  const requestId = (req as any).requestId as string || generateRequestId();
  
  const response = await handleEndpoint(() => {
    return {
      status: "healthy",
      uptime: process.uptime(),
      timestamp: new Date().toISOString(),
      memory: process.memoryUsage(),
      version: "1.0.0"
    };
  }, requestId);
  
  if (response.status) {
    res.status(200).json(response);
  } else {
    res.status(500).json(response);
  }
});

/**
 * API info endpoint
 */
router.get("/", async (req: Request, res: Response) => {
  const requestId = (req as any).requestId as string || generateRequestId();
  
  const response = await handleEndpoint(() => {
    return {
      name: "Netlify API",
      version: "1.0.0",
      description: "RESTful API with standardized response format",
      endpoints: {
        "/hello": "Returns greeting message",
        "/health": "Health check endpoint",
        "/": "API information",
        "/echo": "POST endpoint that echoes back JSON data"
      },
      features: [
        "Standardized response format",
        "Request tracking with IDs",
        "Execution time monitoring",
        "Error handling with structured errors",
        "Request/response logging",
        "Performance monitoring"
      ]
    };
  }, requestId);
  
  if (response.status) {
    res.status(200).json(response);
  } else {
    res.status(500).json(response);
  }
});

export { router };