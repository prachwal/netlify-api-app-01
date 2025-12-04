import express from "express";
import serverless from "serverless-http";
import { router } from "../../routers/api";
import { errorHandler, notFoundHandler } from "../shared/middleware/errorHandler";
import { middlewareStack } from "../shared/middleware/logger";

const api = express();

// Apply middleware stack
middlewareStack.forEach(middleware => {
  api.use(middleware);
});

// Parse JSON bodies with error handling
api.use(express.json({ 
  limit: '1mb',
  verify: (req, res, buf) => {
    // Store raw body for debugging
    (req as any).rawBody = buf.toString();
  }
}));

// Handle JSON parsing errors
api.use((error: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  // Check if this is a JSON parsing error from express.json middleware
  if (error instanceof SyntaxError && 
      (error as any).type === 'entity.parse.failed' || 
      (error as any).status === 400 ||
      error.message.includes('JSON')) {
    
    const timestamp = new Date().toISOString();
    const requestId = (req as any).requestId || 'unknown';
    
    res.status(400).json({
      status: false,
      error: {
        code: 'INVALID_JSON',
        message: 'Request body contains invalid JSON',
        details: {
          originalError: error.message,
          position: (error as any).position
        }
      },
      metadata: {
        timestamp,
        requestId,
        version: "1.0.0",
        executionTime: 0
      }
    });
    return;
  }
  next(error);
});

// Add routes
api.use("/api/", router);

// Error handling
api.use(notFoundHandler);
api.use(errorHandler);

export const handler = serverless(api);