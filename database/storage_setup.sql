-- Create a storage bucket for service images
INSERT INTO storage.buckets (id, name, public) 
VALUES ('service-images', 'service-images', true)
ON CONFLICT (id) DO NOTHING;

-- Policy to allow public access to view images
CREATE POLICY "Public Access" 
ON storage.objects FOR SELECT 
USING (bucket_id = 'service-images');

-- Policy to allow authenticated users (admin) to upload images
CREATE POLICY "Authenticated Upload" 
ON storage.objects FOR INSERT 
TO authenticated 
WITH CHECK (bucket_id = 'service-images');

-- Policy to allow authenticated users (admin) to update/delete images
CREATE POLICY "Authenticated Update" 
ON storage.objects FOR UPDATE
TO authenticated 
USING (bucket_id = 'service-images');

CREATE POLICY "Authenticated Delete" 
ON storage.objects FOR DELETE
TO authenticated 
USING (bucket_id = 'service-images');
