import { createClient } from '@supabase/supabase-js';

// ─── Fill these in from your Supabase project → Settings → API ───
const SUPABASE_URL = '';
const SUPABASE_ANON_KEY = '';
// ─────────────────────────────────────────────────────────────────

export const supabase = createClient(
    SUPABASE_URL  || 'https://placeholder.supabase.co',
    SUPABASE_ANON_KEY || 'placeholder-anon-key'
);

export const isConfigured = Boolean(SUPABASE_URL && SUPABASE_ANON_KEY);
