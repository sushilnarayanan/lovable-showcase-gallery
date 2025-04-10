
-- Create the product_details table (lowercase for consistency)
CREATE TABLE IF NOT EXISTS "public"."product_details" (
  "id" SERIAL PRIMARY KEY,
  "product_id" INTEGER NOT NULL REFERENCES "public"."Products"("id") ON DELETE CASCADE,
  "problem_statement" TEXT,
  "target_audience" TEXT,
  "solution_description" TEXT,
  "key_features" TEXT[] DEFAULT '{}',
  "technical_details" TEXT,
  "future_roadmap" TEXT,
  "development_challenges" TEXT,
  "created_at" TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  "updated_at" TIMESTAMPTZ,
  UNIQUE ("product_id")
);

-- Add comments for better organization in the Supabase UI
COMMENT ON TABLE "public"."product_details" IS 'Detailed information about products';
COMMENT ON COLUMN "public"."product_details"."problem_statement" IS 'Description of the problem the product aims to solve';
COMMENT ON COLUMN "public"."product_details"."target_audience" IS 'Description of the target users/audience for the product';
COMMENT ON COLUMN "public"."product_details"."solution_description" IS 'How the product provides a solution to the problem';
COMMENT ON COLUMN "public"."product_details"."key_features" IS 'Array of key features of the product';
COMMENT ON COLUMN "public"."product_details"."technical_details" IS 'Technical stack and implementation details';
COMMENT ON COLUMN "public"."product_details"."future_roadmap" IS 'Planned future developments and improvements';
COMMENT ON COLUMN "public"."product_details"."development_challenges" IS 'Challenges encountered during development';

-- Create a trigger to update updated_at
CREATE OR REPLACE FUNCTION update_modified_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_product_details_updated_at
BEFORE UPDATE ON "public"."product_details"
FOR EACH ROW
EXECUTE FUNCTION update_modified_column();

-- Create RLS policies to protect the data
ALTER TABLE "public"."product_details" ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Allow public read access to product_details" 
ON "public"."product_details" 
FOR SELECT USING (true);

CREATE POLICY "Allow authenticated users to create product_details" 
ON "public"."product_details" 
FOR INSERT 
TO authenticated 
WITH CHECK (true);

CREATE POLICY "Allow authenticated users to update product_details" 
ON "public"."product_details" 
FOR UPDATE 
TO authenticated 
USING (true) 
WITH CHECK (true);

CREATE POLICY "Allow authenticated users to delete product_details" 
ON "public"."product_details" 
FOR DELETE 
TO authenticated 
USING (true);
