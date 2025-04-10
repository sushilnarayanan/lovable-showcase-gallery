
import { useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';

/**
 * Function to delete product details
 */
export const deleteProductDetails = async (productId: number): Promise<void> => {
  try {
    const { error } = await supabase
      .from('product_details')
      .delete()
      .eq('product_id', productId);
    
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
