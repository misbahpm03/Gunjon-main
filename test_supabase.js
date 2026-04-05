import { createClient } from '@supabase/supabase-js';
import fs from 'fs';

const envCode = fs.readFileSync('.env.local', 'utf-8');
const envVars = Object.fromEntries(envCode.split('\n').filter(Boolean).map(line => line.split('=')));

const supabase = createClient(envVars['VITE_SUPABASE_URL'], envVars['VITE_SUPABASE_ANON_KEY']);

async function test() {
  const { data, error } = await supabase.from('users').insert([{
    name: 'Test',
    email: 'test@example.com',
    role: 'cashier',
    status: 'Active'
  }]).select().single();
  
  console.log("Error:", JSON.stringify(error, null, 2));
  console.log("Data:", data);
}
test();
