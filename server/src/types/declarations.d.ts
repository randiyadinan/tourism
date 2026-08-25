declare module 'express' {
  export interface Request {
    body: any;
    params: Record<string, string>;
    query: Record<string, string | string[] | undefined>;
    headers: Record<string, string | string[] | undefined>;
  }

  export interface Response {
    status(code: number): this;
    json(body?: any): this;
    send(body?: any): this;
    setHeader(name: string, value: string | number | readonly string[]): this;
  }

  export interface NextFunction {
    (err?: any): void;
  }

  export interface Router {
    use(...handlers: any[]): this;
    get(path: string, ...handlers: any[]): this;
    post(path: string, ...handlers: any[]): this;
    put(path: string, ...handlers: any[]): this;
    delete(path: string, ...handlers: any[]): this;
  }

  export interface Express {
    use(...handlers: any[]): this;
    get(path: string, ...handlers: any[]): this;
    post(path: string, ...handlers: any[]): this;
    listen(port: number | string, callback?: () => void): any;
  }

  export function json(options?: any): any;
  export function urlencoded(options?: any): any;
  export function Router(): Router;

  const express: {
    (): Express;
    json(options?: any): any;
    urlencoded(options?: any): any;
    Router(): Router;
  };

  export default express;
}

declare module 'cors' {
  export default function cors(options?: any): any;
}
