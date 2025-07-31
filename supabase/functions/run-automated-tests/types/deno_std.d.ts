// Minimal type definitions for Deno standard library
// These are just placeholders to make TypeScript happy

declare module 'https://deno.land/std@0.177.0/http/server.ts' {
  export function serve(
    handler: (req: Request) => Response | Promise<Response>,
    options?: { port: number }
  );
}

declare module 'https://deno.land/std@0.177.0/http/http_status.ts' {
  export const Status: {
    OK: number;
    BadRequest: number;
    InternalServerError: number;
    [key: string]: number;
  };
}

declare module 'https://deno.land/std@0.177.0/async/delay.ts' {
  export function delay(ms: number): Promise<void>;
}
