import { createClient } from '@supabase/supabase-js';
import fs from 'fs';

const envCode = fs.readFileSync('.env.local', 'utf-8');
const envVars = Object.fromEntries(envCode.split('\n').filter(Boolean).map(line => line.split('=')));

const supabase = createClient(envVars['VITE_SUPABASE_URL'], envVars['VITE_SUPABASE_ANON_KEY']);

async function testDelete() {
  // First, fetch a banner to get an ID
  const { data: banners, error: fetchError } = await supabase.from('banners').select('id').limit(1);
  if (fetchError) {
    console.error("Fetch error:", fetchError);
    return;
  }
  
  if (!banners || banners.length === 0) {
    console.log("No banners found to test delete.");
    return;
  }
  
  const idToDelete = banners[0].id;
  console.log(`Attempting to delete banner with ID: ${idToDelete}`);
  
  const { error: deleteError } = await supabase.from('banners').delete().eq('id', idToDelete);
  
  if (deleteError) {
    console.error("Delete error:", JSON.stringify(deleteError, null, 2));
  } else {
    console.log("Delete succeeded without error object. (RLS silent failure is possible)");
    
    // Check if it was actually deleted
    const { data: checkData } = await supabase.from('banners').select('id').eq('id', idToDelete);
    if (checkData && checkData.length > 0) {
      console.log("Banner WAS NOT DELETED (RLS silent failure)!");
    } else {
      console.log("Banner was successfully deleted from the database!");
    }
  }
}

testDelete();
