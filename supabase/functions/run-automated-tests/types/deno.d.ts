// Type definitions for Deno standard library
// These are minimal type definitions to make TypeScript happy

declare module "https://deno.land/std@0.177.0/http/server.ts" {
  export interface ServerRequest {
    method: string;
    url: string;
    headers: Headers;
    body: ReadableStream<Uint8Array> | null;
    respondWith(response: Response): Promise<void>;
  }

  export interface Server {
    close(): void;
  }

  export function serve(addr: string | { port: number; hostname?: string }): AsyncIterableIterator<ServerRequest>;
  export function serve(handler: (req: Request) => Response | Promise<Response>, options?: { port: number }): Server;
  export function serveTLS(handler: (req: Request) => Response | Promise<Response>, options: { port: number; certFile: string; keyFile: string }): Server;
}

declare namespace Deno {
  export interface Env {
    get(key: string): string | undefined;
    set(key: string, value: string): void;
    delete(key: string): void;
    toObject(): { [key: string]: string };
  }

  export const env: Env;
  export const exit: (code?: number) => never;
}
