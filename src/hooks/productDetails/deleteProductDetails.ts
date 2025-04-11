
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';

/**
 * Function to delete product details
 */
export const deleteProductDetails = async (productId: number): Promise<void> => {
  try {
    // Use RPC function to delete product details
    const { error } = await supabase
      .rpc('delete_product_details', { p_product_id: productId });
    
    if (error) {
      console.error('Error deleting product details:', error);
      toast({
        title: 'Error',
        description: 'Failed to delete product details',
        variant: 'destructive',
      });
      return;
    }
    
    // Success toast
    toast({
      title: 'Success',
      description: 'Product details deleted successfully',
    });
  } catch (error) {
    console.error('Error in deleteProductDetails:', error);
    toast({
      title: 'Error',
      description: 'Failed to delete product details',
      variant: 'destructive',
    });
  }
};
