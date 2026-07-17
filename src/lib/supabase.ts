import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://ixddtuuttwjdkqmvhiyi.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Iml4ZGR0dXV0dHdqZGtxbXZoaXlpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODM3OTY1NDQsImV4cCI6MjA5OTM3MjU0NH0.kV9LxS-h3Hsmbg41kHW9kGghv99aKtbdcP3PXbT50ts';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);