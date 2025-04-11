
import { supabase } from '@/integrations/supabase/client';
import { ProductDetails, ProductDetailsCreateInput } from '@/integrations/supabase/types/portfolio';
import { toast } from '@/hooks/use-toast';

/**
 * Function to create new product details
 */
export const createProductDetails = async (details: ProductDetailsCreateInput): Promise<ProductDetails | null> => {
  try {
    // Use RPC function to insert product details
    const { error } = await supabase
      .rpc('insert_product_details', {
        p_product_id: details.product_id,
        p_problem_statement: details.problem_statement || null,
        p_target_audience: details.target_audience || null,
        p_development_challenges: details.development_challenges || null,
        p_solution_description: details.solution_description || null,
        p_future_roadmap: details.future_roadmap || null,
        p_key_features: details.key_features || null,
        p_technical_details: details.technical_details || null,
        p_product_images: details.product_images || null
      });
    
    if (error) {
      console.error('Error creating product details:', error);
      toast({
        title: 'Error',
        description: 'Failed to create product details',
        variant: 'destructive',
      });
      return null;
    }
    
    // Fetch the newly created record to return
    const { data: newData, error: fetchError } = await supabase
      .rpc('get_product_details', { p_product_id: details.product_id })
      .single();
    
    if (fetchError || !newData) {
      console.error('Error fetching created product details:', fetchError);
      return null;
    }
    
    // Map the response to the ProductDetails type
    const productDetails: ProductDetails = {
      id: newData.id,
      product_id: newData.product_id,
      problem_statement: newData.problem_statement,
      target_audience: newData.target_audience,
      development_challenges: newData.development_challenges,
      solution_description: newData.solution_description,
      future_roadmap: newData.future_roadmap,
      key_features: newData.key_features,
      technical_details: newData.technical_details,
      product_images: newData.product_images,
      created_at: newData.created_at,
      updated_at: newData.updated_at
    };
    
    // Success toast
    toast({
      title: 'Success',
      description: 'Product details created successfully',
    });
    
    return productDetails;
  } catch (error) {
    console.error('Error in createProductDetails:', error);
    toast({
      title: 'Error',
      description: 'Failed to create product details',
      variant: 'destructive',
    });
    return null;
  }
};
