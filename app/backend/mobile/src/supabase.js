import { createClient } from '@supabase/supabase-js';
import Constants from 'expo-constants';

const env = (Constants.manifest && Constants.manifest.extra) || process.env || {};
const SUPABASE_URL = env.SUPABASE_URL || process.env.SUPABASE_URL || 'https://your-project.supabase.co';
const SUPABASE_ANON_KEY = env.SUPABASE_ANON_KEY || process.env.SUPABASE_ANON_KEY || 'public-anon-key';

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

export default supabase;
