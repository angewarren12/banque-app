import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://ohnzpspnubvoxcuspiuf.supabase.co'
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9obnpwc3BudWJ2b3hjdXNwaXVmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTM5MDM4MTQsImV4cCI6MjA2OTQ3OTgxNH0.jIme6bXbhhLVV9nj617D9NxtQR_MVLXT4sXL-JOSyks'
 
export const supabase = createClient(supabaseUrl, supabaseAnonKey) 