
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { ProductDetails, ProductDetailsCreateInput, ProductDetailsUpdateInput, RpcProductDetails } from '@/integrations/supabase/types/portfolio';
import { toast } from '@/hooks/use-toast';

// Query function to get product details by product ID
export const useProductDetailsById = (productId: number) => {
  return useQuery({
    queryKey: ['productDetails', productId],
    queryFn: async (): Promise<ProductDetails | null> => {
      if (!productId) {
        return null;
      }
      
      try {
        // Use explicit typing for the RPC call
        const { data, error } = await supabase
          .rpc('get_product_details', { p_product_id: productId }) as unknown as {
            data: RpcProductDetails[] | null;
            error: Error | null;
          };
        
        if (error) {
          console.error('Error fetching product details:', error);
          toast({
            title: 'Error',
            description: 'Failed to load product details',
            variant: 'destructive',
          });
          throw error;
        }
        
        // Safely handle potentially null data
        if (!data || data.length === 0) {
          return null;
        }
        
        return data[0] as ProductDetails;
      } catch (error) {
        console.error('Error in useProductDetailsById:', error);
        throw error;
      }
    },
    enabled: !!productId
  });
};

// Create new product details
export const createProductDetails = async (details: ProductDetailsCreateInput): Promise<ProductDetails | null> => {
  try {
    // Use explicit typing for the RPC call
    const { error } = await supabase
      .rpc('insert_product_details', { 
        p_product_id: details.product_id,
        p_problem_statement: details.problem_statement,
        p_target_audience: details.target_audience,
        p_solution_description: details.solution_description,
        p_key_features: details.key_features,
        p_technical_details: details.technical_details,
        p_future_roadmap: details.future_roadmap,
        p_development_challenges: details.development_challenges
      }) as unknown as {
        data: boolean | null;
        error: Error | null;
      };
    
    if (error) {
      console.error('Error creating product details:', error);
      toast({
        title: 'Error',
        description: 'Failed to create product details',
        variant: 'destructive',
      });
      throw error;
    }
    
    toast({
      title: 'Success',
      description: 'Product details created successfully',
    });
    
    // Get the newly created details with explicit typing
    const { data: newData, error: fetchError } = await supabase
      .rpc('get_product_details', { p_product_id: details.product_id }) as unknown as {
        data: RpcProductDetails[] | null;
        error: Error | null;
      };
      
    if (fetchError) {
      console.error('Error fetching created product details:', fetchError);
      return null;
    }
    
    if (!newData || newData.length === 0) {
      return null;
    }
    
    return newData[0] as ProductDetails;
  } catch (error) {
    console.error('Error in createProductDetails:', error);
    return null;
  }
};

// Update existing product details
export const updateProductDetails = async (productId: number, updates: ProductDetailsUpdateInput): Promise<ProductDetails | null> => {
  try {
    // Use explicit typing for the RPC call
    const { error } = await supabase
      .rpc('update_product_details', {
        p_product_id: productId,
        p_problem_statement: updates.problem_statement,
        p_target_audience: updates.target_audience,
        p_solution_description: updates.solution_description,
        p_key_features: updates.key_features,
        p_technical_details: updates.technical_details,
        p_future_roadmap: updates.future_roadmap,
        p_development_challenges: updates.development_challenges
      }) as unknown as {
        data: boolean | null;
        error: Error | null;
      };
    
    if (error) {
      console.error('Error updating product details:', error);
      toast({
        title: 'Error',
        description: 'Failed to update product details',
        variant: 'destructive',
      });
      throw error;
    }
    
    toast({
      title: 'Success',
      description: 'Product details updated successfully',
    });
    
    // Get the updated details with explicit typing
    const { data: updatedData, error: fetchError } = await supabase
      .rpc('get_product_details', { p_product_id: productId }) as unknown as {
        data: RpcProductDetails[] | null;
        error: Error | null;
      };
      
    if (fetchError) {
      console.error('Error fetching updated product details:', fetchError);
      return null;
    }
    
    if (!updatedData || updatedData.length === 0) {
      return null;
    }
    
    return updatedData[0] as ProductDetails;
  } catch (error) {
    console.error('Error in updateProductDetails:', error);
    return null;
  }
};

// Upsert product details (create if doesn't exist, update if exists)
export const upsertProductDetails = async (productId: number, details: ProductDetailsUpdateInput): Promise<ProductDetails | null> => {
  try {
    // Check if product details exist using RPC with explicit typing
    const { data: existingDetails, error: checkError } = await supabase
      .rpc('get_product_details', { p_product_id: productId }) as unknown as {
        data: RpcProductDetails[] | null;
        error: Error | null;
      };
    
    if (checkError) {
      console.error('Error checking for existing product details:', checkError);
      throw checkError;
    }
    
    if (existingDetails && existingDetails.length > 0) {
      // Update existing details
      return updateProductDetails(productId, details);
    } else {
      // Create new details with product_id
      const createData: ProductDetailsCreateInput = {
        product_id: productId,
        ...details as any
      };
      return createProductDetails(createData);
    }
  } catch (error) {
    console.error('Error in upsertProductDetails:', error);
    return null;
  }
};

// Delete product details
export const deleteProductDetails = async (productId: number): Promise<void> => {
  try {
    // Use explicit typing for the RPC call
    const { error } = await supabase
      .rpc('delete_product_details', { p_product_id: productId }) as unknown as {
        data: boolean | null;
        error: Error | null;
      };
    
    if (error) {
      console.error('Error deleting product details:', error);
      toast({
        title: 'Error',
        description: 'Failed to delete product details',
        variant: 'destructive',
      });
      throw error;
    }
    
    toast({
      title: 'Success',
      description: 'Product details deleted successfully',
    });
  } catch (error) {
    console.error('Error in deleteProductDetails:', error);
  }
};
