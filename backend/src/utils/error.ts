/**
 * Error options interface for creating custom errors
 */
export interface ErrorOptions {
  statusCode: number;
  message: string;
}

/**
 * Custom error class with HTTP status code support
 * Extends the standard Error class to include HTTP status codes
 */
export class CustomError extends Error {
  statusCode: number;
  message: string;

  constructor(statusCode: number, message: string);
  constructor(options: ErrorOptions);
  constructor(arg1: any, arg2?: any) {
    const statusCode = typeof arg1 === "object" ? arg1.statusCode : arg1;
    const message = typeof arg1 === "object" ? arg1.message : arg2;

    super(message);
    this.statusCode = statusCode;
    this.message = message;

    Object.setPrototypeOf(this, new.target.prototype);
  }
}

/**
 * Creates a custom error with HTTP status code
 * @param statusCode - HTTP status code (e.g., 400, 404, 500)
 * @param message - Error message
 * @returns CustomError instance
 * 
 * @example
 * ```typescript
 * throw createError(404, "User not found");
 * throw createError({ statusCode: 400, message: "Invalid input" });
 * ```
 */
export function createError(statusCode: number, message: string): CustomError;
export function createError(options: ErrorOptions): CustomError;
export function createError(arg1: any, arg2?: any): CustomError {
  if (typeof arg1 === "object") {
    return new CustomError(arg1);
  } else {
    return new CustomError(arg1, arg2 as string);
  }
}
