import { createClient } from "@supabase/supabase-js";

const supabaseUrl = "https://zojwqvmygybsobglixyy.supabase.co";
const supabaseAnonKey = "sb_publishable_8VfmwvQSBhCGvM9ZfMuRjg_fCyoLkwn";

export const supabase = createClient(supabaseUrl, supabaseAnonKey);