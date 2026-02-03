// types.ts

import { Request } from "./handler/Request";
import { Response } from "./handler/Response";

/**
 * Request handler function type
 * @param res - Response object for sending HTTP responses
 * @param req - Request object containing HTTP request data
 * @param next - Optional callback function to pass control to the next middleware
 */
export type IRequestHandler = (
  res: Response,
  req: Request,
  next?: VoidFunction
) => void;

/**
 * Route definition interface
 */
export interface IRoute {
  /** Regular expression pattern for matching routes */
  regExp: RegExp;
  /** Path pattern string */
  path: string;
  /** Array of request handlers for this route */
  handler: IRequestHandler[];
  /** HTTP method for this route */
  method: HttpMethod;
  /** Route parameter keys extracted from the path */
  keys: string[];
}

/**
 * Supported HTTP methods
 */
export type HttpMethod =
  | "get"
  | "post"
  | "put"
  | "patch"
  | "delete"
  | "options"
  | "head"
  | "connect"
  | "trace"
  | "all";

/**
 * Extended error interface with HTTP-specific properties
 */
export interface IError extends Error {
  /** HTTP status code */
  statusCode?: number;
  /** Alias for statusCode */
  status?: number;
  /** Error code identifier */
  code?: string;
  /** Additional error details */
  details?: unknown;
}

/**
 * Error handler function type
 * @param err - Error object to handle
 * @param res - Response object for sending error responses
 * @param req - Request object containing HTTP request data
 */
export type IErrorHandler = (err: IError, res: Response, req: Request) => void;

/**
 * HTTP Content-Type header values
 */
export type HttpContentType =
  | "application/x-www-form-urlencoded"
  | "application/json"
  | string;
