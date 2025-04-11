import { supabase } from '@/integrations/supabase/client';
import { ProductDetails, ProductDetailsUpdateInput, ProductDetailsCreateInput } from '@/integrations/supabase/types/portfolio';
import { toast } from '@/hooks/use-toast';
import { createProductDetails } from './createProductDetails';
import { updateProductDetails } from './updateProductDetails';

/**
 * Function to upsert (create or update) product details
 */
export const upsertProductDetails = async (productId: number, details: ProductDetailsUpdateInput): Promise<ProductDetails | null> => {
  try {
    // Check if product details exist
    const { data, error } = await supabase
      .rpc('get_product_details', { p_product_id: productId })
      .maybeSingle();
    
    // If product details exist, update them
    if (!error && data) {
      return updateProductDetails(productId, details);
    } 
    // Otherwise, create new product details
    else {
      const createInput: ProductDetailsCreateInput = {
        product_id: productId,
        ...details
      };
      return createProductDetails(createInput);
    }
  } catch (error) {
    console.error('Error in upsertProductDetails:', error);
    toast({
      title: 'Error',
      description: 'Failed to save product details',
      variant: 'destructive',
    });
    return null;
  }
};
