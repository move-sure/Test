import { createClient } from '@supabase/supabase-js';

// Supabase credentials from your project settings
const supabaseUrl = 'https://yqzrlvjhdzzxfthldzuj.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InlxenJsdmpoZHp6eGZ0aGxkenVqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDcyNDMxODIsImV4cCI6MjA2MjgxOTE4Mn0.33OhH5RAz-AszE87eKFFjSBGjrPIjE6qoRlQyvXEFxM';

// Create a single supabase client for interacting with your database
const supabase = createClient(supabaseUrl, supabaseAnonKey);

export default supabase;