// Ambient declarations for Edge Functions (Deno) used in this repo
// Keeps IDE happy when editing files under supabase/functions/**

declare namespace Deno {
  interface EnvNamespace {
    get(key: string): string | undefined
  }
  const env: EnvNamespace
  function serve(handler: (req: Request) => Response | Promise<Response>): void
}

// Map the runtime URL import to local npm types so TS can resolve symbols
declare module 'https://esm.sh/@supabase/supabase-js@2' {
  import type { SupabaseClient } from '@supabase/supabase-js'
  export function createClient(
    url: string,
    key: string
  ): SupabaseClient
}
