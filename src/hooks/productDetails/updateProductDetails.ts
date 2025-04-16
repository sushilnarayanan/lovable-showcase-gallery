
import { supabase } from '@/integrations/supabase/client';
import { ProductDetails, ProductDetailsUpdateInput } from '@/integrations/supabase/types/portfolio';
import { toast } from '@/hooks/use-toast';

/**
 * Function to update existing product details
 */
export const updateProductDetails = async (productId: number, updates: ProductDetailsUpdateInput): Promise<ProductDetails | null> => {
  try {
    // Ensure key_features is an array
    const keyFeatures = Array.isArray(updates.key_features) ? updates.key_features : null;
    
    // Use RPC function to update product details
    const { error } = await supabase
      .rpc('update_product_details', {
        p_product_id: productId,
        p_problem_statement: updates.problem_statement || null,
        p_target_audience: updates.target_audience || null,
        p_development_challenges: updates.development_challenges || null,
        p_solution_description: updates.solution_description || null,
        p_future_roadmap: updates.future_roadmap || null,
        p_key_features: keyFeatures,
        p_technical_details: updates.technical_details || null,
        p_product_images: updates.product_images || null
      });
    
    if (error) {
      console.error('Error updating product details:', error);
      toast({
        title: 'Error',
        description: 'Failed to update product details',
        variant: 'destructive',
      });
      return null;
    }
    
    // Fetch the updated record to return
    const { data: updatedData, error: fetchError } = await supabase
      .rpc('get_product_details', { p_product_id: productId })
      .single();
    
    if (fetchError || !updatedData) {
      console.error('Error fetching updated product details:', fetchError);
      return null;
    }
    
    // Parse key_features if needed
    let parsedKeyFeatures: string[] | null = null;
    if (updatedData.key_features) {
      if (Array.isArray(updatedData.key_features)) {
        parsedKeyFeatures = updatedData.key_features;
      }
    }
    
    // Map the response to the ProductDetails type
    const productDetails: ProductDetails = {
      id: updatedData.id,
      product_id: updatedData.product_id,
      problem_statement: updatedData.problem_statement,
      target_audience: updatedData.target_audience,
      development_challenges: updatedData.development_challenges,
      solution_description: updatedData.solution_description,
      future_roadmap: updatedData.future_roadmap,
      key_features: parsedKeyFeatures,
      technical_details: updatedData.technical_details,
      product_images: updatedData.product_images,
      created_at: updatedData.created_at,
      updated_at: updatedData.updated_at
    };
    
    // Success toast
    toast({
      title: 'Success',
      description: 'Product details updated successfully',
    });
    
    return productDetails;
  } catch (error) {
    console.error('Error in updateProductDetails:', error);
    toast({
      title: 'Error',
      description: 'Failed to update product details',
      variant: 'destructive',
    });
    return null;
  }
};
