
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { ProductDetails } from '@/integrations/supabase/types/portfolio';

/**
 * Hook to fetch product details by product ID
 */
export const useProductDetailsById = (productId: number) => {
  return useQuery({
    queryKey: ['productDetails', productId],
    queryFn: async (): Promise<ProductDetails | null> => {
      if (!productId) {
        return null;
      }
      
      try {
        const { data, error } = await supabase
          .from('product_details')
          .select('*')
          .eq('product_id', productId)
          .maybeSingle();
        
        if (error) {
          throw error;
        }
        
        return data as ProductDetails | null;
      } catch (error) {
        console.error('Error in useProductDetailsById:', error);
        throw error;
      }
    },
    enabled: !!productId
  });
};
