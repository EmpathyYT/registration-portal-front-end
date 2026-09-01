import { createClient } from '@supabase/supabase-js';

const supabaseUrl: string = import.meta.env.VITE_SUPABASE_URL ?? '';
const supabaseKey: string = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY ?? '';

const isMisconfigured = !supabaseUrl || !supabaseKey;

if (isMisconfigured) {
    console.warn(
        '[supabaseClient] Missing VITE_SUPABASE_URL or VITE_SUPABASE_PUBLISHABLE_KEY.\n' +
        'Create a .env file in the project root with these values to enable backend connectivity.\n' +
        'The app will load but all API calls will fail until the environment is configured.'
    );
}

// Safe to call createClient with placeholder strings — it only validates on the first actual request.
export const supabase = isMisconfigured
    ? createClient('https://placeholder.supabase.co', 'placeholder-key')
    : createClient(supabaseUrl, supabaseKey);