-- Add weight column
ALTER TABLE products ADD COLUMN weight NUMERIC DEFAULT 0;

-- Enhance image support 
ALTER TABLE products ADD COLUMN image_urls TEXT[] DEFAULT '{}';

-- Make image_url mandatory
UPDATE products SET image_url = 'https://placeholder.com/150' WHERE image_url IS NULL OR image_url = '';
ALTER TABLE products ALTER COLUMN image_url SET NOT NULL;
