import { supabase } from './supabaseClient';

export async function uploadImage(file: File, bucket: string = 'products') {
  const fileExt = file.name.split('.').pop();
  const fileName = `${Math.random()}.${fileExt}`;
  const filePath = `${fileName}`;

  const { error: uploadError } = await supabase.storage
    .from(bucket)
    .upload(filePath, file);

  if (uploadError) {
    throw uploadError;
  }

  const { data } = supabase.storage
    .from(bucket)
    .getPublicUrl(filePath);

  return data.publicUrl;
}

export async function deleteImage(url: string, bucket: string = 'products') {
  const fileName = url.split('/').pop();
  if (fileName) {
    const { error } = await supabase.storage
      .from(bucket)
      .remove([fileName]);
    if (error) {
      console.error('Error deleting image:', error);
    }
  }
}
