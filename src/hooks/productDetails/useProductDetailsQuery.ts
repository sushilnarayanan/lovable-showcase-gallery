
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
        // Use RPC function to get product details
        const { data, error } = await supabase
          .rpc('get_product_details', { p_product_id: productId })
          .maybeSingle();
        
        if (error) {
          throw error;
        }
        
        // If no data returned, return null
        if (!data) {
          return null;
        }
        
        // Map the response to the ProductDetails type
        const productDetails: ProductDetails = {
          id: data.id,
          product_id: data.product_id,
          problem_statement: data.problem_statement,
          target_audience: data.target_audience,
          development_challenges: data.development_challenges,
          solution_description: data.solution_description,
          future_roadmap: data.future_roadmap,
          key_features: data.key_features,
          technical_details: data.technical_details,
          product_images: data.product_images,
          created_at: data.created_at,
          updated_at: data.updated_at
        };
        
        return productDetails;
      } catch (error) {
        console.error('Error in useProductDetailsById:', error);
        throw error;
      }
    },
    enabled: !!productId
  });
};
