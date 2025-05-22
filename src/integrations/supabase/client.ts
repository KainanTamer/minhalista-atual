
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://yyqqoychqsxnqceahpsr.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inl5cXFveWNocXN4bnFjZWFocHNyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDcyMTM3MjYsImV4cCI6MjA2Mjc4OTcyNn0.8f0-YMgehWgNTWmroypqq3DA504w1ekbqboLsBvMJfc';

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    storage: localStorage,
    persistSession: true,
    autoRefreshToken: true,
  }
});
