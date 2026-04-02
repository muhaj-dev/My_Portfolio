import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export const getImageUrl = (path) => {
  if (!path) return '';
  const { data } = supabase.storage
    .from('portfolio-images')
    .getPublicUrl(path);
  return data.publicUrl;
};
