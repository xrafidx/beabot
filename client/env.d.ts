// env.d.ts (atau global.d.ts atau src/types/env.d.ts)

declare namespace NodeJS {
  interface ProcessEnv {
    readonly NEXT_PUBLIC_API_KEY: string;
    readonly NEXT_PUBLIC_WORKFLOW_ID: string;
    readonly NEXT_PUBLIC_BACKEND_URL: string;
    // Tambahkan variabel lingkungan NEXT_PUBLIC_ lainnya di sini jika ada
  }
}
