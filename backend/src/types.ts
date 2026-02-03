// types.ts

import { Request } from "./handler/Request";
import { Response } from "./handler/Response";

export type IRequestHandler = (
  res: Response,
  req: Request,
  next?: VoidFunction
) => void;

export interface IRoute {
  regExp: RegExp;
  path: string;
  handler: IRequestHandler[];
  method: HttpMethod;
  keys: string[];
}

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

export interface IError extends Error {
  statusCode?: number;
  status?: number;
  code?: string;
  details?: unknown;
}

export type IErrorHandler = (err: IError, res: Response, req: Request) => void;

export type HttpContentType =
  | "application/x-www-form-urlencoded"
  | "application/json"
  | string;
