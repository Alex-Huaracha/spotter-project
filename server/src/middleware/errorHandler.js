import { ZodError } from 'zod';

export const globalErrorHandler = (err, req, res, next) => {
  console.error(`[ERROR]:`, err);

  // Zod Error
  if (err instanceof ZodError) {
    return res.status(400).json({
      status: 'fail',
      message: 'Data validation error',
      errors: (err.errors || err.issues || []).map((issue) => ({
        field: issue.path.join('.') || 'unknown_field',
        message: issue.message,
      })),
    });
  }

  // JSON Syntax Error
  if (err instanceof SyntaxError && err.status === 400 && 'body' in err) {
    return res.status(400).json({
      status: 'fail',
      message: 'Invalid JSON. Check commas, quotes, and braces.',
    });
  }

  // General Error Handler
  const statusCode = err.statusCode || 500;

  res.status(statusCode).json({
    status: 'error',
    message: err.message || 'Internal Server Error',
    ...(process.env.NODE_ENV !== 'production' && { stack: err.stack }),
  });
};
