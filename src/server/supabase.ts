import { createClient, SupabaseClient } from '@supabase/supabase-js';
import fs from 'fs';
import path from 'path';

let cachedUrl: string | null = null;
let cachedKey: string | null = null;
let supabaseInstance: SupabaseClient | null = null;

function loadEnvFileFallback(): void {
  if (cachedUrl && cachedKey) return;

  const envPath = path.join(process.cwd(), '.env.local');
  if (fs.existsSync(envPath)) {
    try {
      const content = fs.readFileSync(envPath, 'utf-8');
      const lines = content.split('\n');
      for (const line of lines) {
        const trimmed = line.trim();
        if (trimmed.startsWith('#') || !trimmed.includes('=')) continue;
        const [k, ...v] = trimmed.split('=');
        const key = k.trim();
        const val = v.join('=').trim();
        if (key === 'NEXT_PUBLIC_SUPABASE_URL' || key === 'SUPABASE_URL') {
          if (!process.env[key]) process.env[key] = val;
          cachedUrl = val;
        }
        if (key === 'NEXT_PUBLIC_SUPABASE_ANON_KEY' || key === 'SUPABASE_ANON_KEY' || key === 'SUPABASE_SERVICE_ROLE_KEY') {
          if (!process.env[key]) process.env[key] = val;
          if (val) cachedKey = val;
        }
      }
    } catch (e) {
      console.warn('Error reading .env.local fallback:', e);
    }
  }
}

export function getSupabaseCredentials(): { url: string; key: string } {
  loadEnvFileFallback();
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL || cachedUrl || '';
  const key = 
    process.env.SUPABASE_SERVICE_ROLE_KEY || 
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 
    process.env.SUPABASE_ANON_KEY || 
    cachedKey || 
    '';
  return { url: url.trim(), key: key.trim() };
}

export function isSupabaseConfigured(): boolean {
  const { url, key } = getSupabaseCredentials();
  return (
    url.length > 0 &&
    url.startsWith('https://') &&
    key.length > 0 &&
    !url.includes('your-project-ref')
  );
}

export function getSupabaseClient(): SupabaseClient | null {
  if (!isSupabaseConfigured()) {
    return null;
  }

  const { url, key } = getSupabaseCredentials();

  if (!supabaseInstance) {
    supabaseInstance = createClient(url, key, {
      auth: {
        persistSession: false,
        autoRefreshToken: false,
      },
    });
  }

  return supabaseInstance;
}
