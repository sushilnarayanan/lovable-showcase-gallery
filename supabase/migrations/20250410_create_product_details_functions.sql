
-- Create function to get product details
CREATE OR REPLACE FUNCTION get_product_details(p_product_id INT)
RETURNS SETOF "public"."product_details" AS $$
BEGIN
  RETURN QUERY SELECT * FROM "public"."product_details" WHERE product_id = p_product_id;
END;
$$ LANGUAGE plpgsql;

-- Create function to insert product details
CREATE OR REPLACE FUNCTION insert_product_details(
  p_product_id INT,
  p_problem_statement TEXT DEFAULT NULL,
  p_target_audience TEXT DEFAULT NULL,
  p_solution_description TEXT DEFAULT NULL,
  p_key_features TEXT[] DEFAULT NULL,
  p_technical_details TEXT DEFAULT NULL,
  p_future_roadmap TEXT DEFAULT NULL,
  p_development_challenges TEXT DEFAULT NULL
) 
RETURNS BOOLEAN AS $$
BEGIN
  INSERT INTO "public"."product_details" (
    product_id, 
    problem_statement, 
    target_audience, 
    solution_description,
    key_features,
    technical_details,
    future_roadmap,
    development_challenges
  ) VALUES (
    p_product_id,
    p_problem_statement,
    p_target_audience,
    p_solution_description,
    p_key_features,
    p_technical_details,
    p_future_roadmap,
    p_development_challenges
  );
  RETURN TRUE;
END;
$$ LANGUAGE plpgsql;

-- Create function to update product details
CREATE OR REPLACE FUNCTION update_product_details(
  p_product_id INT,
  p_problem_statement TEXT DEFAULT NULL,
  p_target_audience TEXT DEFAULT NULL,
  p_solution_description TEXT DEFAULT NULL,
  p_key_features TEXT[] DEFAULT NULL,
  p_technical_details TEXT DEFAULT NULL,
  p_future_roadmap TEXT DEFAULT NULL,
  p_development_challenges TEXT DEFAULT NULL
) 
RETURNS BOOLEAN AS $$
BEGIN
  UPDATE "public"."product_details" SET
    problem_statement = COALESCE(p_problem_statement, problem_statement),
    target_audience = COALESCE(p_target_audience, target_audience),
    solution_description = COALESCE(p_solution_description, solution_description),
    key_features = COALESCE(p_key_features, key_features),
    technical_details = COALESCE(p_technical_details, technical_details),
    future_roadmap = COALESCE(p_future_roadmap, future_roadmap),
    development_challenges = COALESCE(p_development_challenges, development_challenges),
    updated_at = NOW()
  WHERE product_id = p_product_id;
  RETURN TRUE;
END;
$$ LANGUAGE plpgsql;

-- Create function to delete product details
CREATE OR REPLACE FUNCTION delete_product_details(p_product_id INT) 
RETURNS BOOLEAN AS $$
BEGIN
  DELETE FROM "public"."product_details" WHERE product_id = p_product_id;
  RETURN TRUE;
END;
$$ LANGUAGE plpgsql;
