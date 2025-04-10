
import { useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { ProductDetails, ProductDetailsCreateInput } from '@/integrations/supabase/types/portfolio';
import { toast } from '@/hooks/use-toast';

/**
 * Function to create new product details
 */
export const createProductDetails = async (details: ProductDetailsCreateInput): Promise<ProductDetails | null> => {
  try {
    const { data, error } = await supabase
      .from('product_details')
      .insert({
        product_id: details.product_id,
        problem_statement: details.problem_statement || null,
        target_audience: details.target_audience || null,
        solution_description: details.solution_description || null,
        key_features: details.key_features || null,
        technical_details: details.technical_details || null,
        future_roadmap: details.future_roadmap || null,
        development_challenges: details.development_challenges || null
      })
      .select()
      .single();
    
    if (error) {
      console.error('Error creating product details:', error);
      toast({
        title: 'Error',
        description: 'Failed to create product details',
        variant: 'destructive',
      });
      return null;
    }
    
    // Success toast
    toast({
      title: 'Success',
      description: 'Product details created successfully',
    });
    
    return data as ProductDetails;
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
