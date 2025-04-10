
import { useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { ProductDetails, ProductDetailsUpdateInput } from '@/integrations/supabase/types/portfolio';
import { toast } from '@/hooks/use-toast';

/**
 * Function to update existing product details
 */
export const updateProductDetails = async (productId: number, updates: ProductDetailsUpdateInput): Promise<ProductDetails | null> => {
  try {
    const { data, error } = await supabase
      .from('product_details')
      .update({
        problem_statement: updates.problem_statement,
        target_audience: updates.target_audience,
        solution_description: updates.solution_description,
        key_features: updates.key_features,
        technical_details: updates.technical_details,
        future_roadmap: updates.future_roadmap,
        development_challenges: updates.development_challenges,
        updated_at: new Date().toISOString()
      })
      .eq('product_id', productId)
      .select()
      .single();
    
    if (error) {
      console.error('Error updating product details:', error);
      toast({
        title: 'Error',
        description: 'Failed to update product details',
        variant: 'destructive',
      });
      return null;
    }
    
    // Success toast
    toast({
      title: 'Success',
      description: 'Product details updated successfully',
    });
    
    return data as ProductDetails;
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
