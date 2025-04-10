import { useQuery, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { ProductDetails, ProductDetailsCreateInput, ProductDetailsUpdateInput } from '@/integrations/supabase/types/portfolio';
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
        // Use the get_product_details RPC function
        const { data, error } = await supabase.rpc('get_product_details', {
          p_product_id: productId
        });
        
        if (error) {
          throw error;
        }
        
        // If no data returned, return null
        if (!data || data.length === 0) {
          return null;
        }
        
        // Return the first item from the results
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
    // Use the insert_product_details RPC function
    const { data, error } = await supabase.rpc('insert_product_details', {
      p_product_id: details.product_id,
      p_problem_statement: details.problem_statement || null,
      p_target_audience: details.target_audience || null,
      p_solution_description: details.solution_description || null,
      p_key_features: details.key_features || null,
      p_technical_details: details.technical_details || null,
      p_future_roadmap: details.future_roadmap || null,
      p_development_challenges: details.development_challenges || null
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
    
    // Fetch the newly created details
    const queryClient = new useQueryClient();
    queryClient.invalidateQueries({ queryKey: ['productDetails', details.product_id] });
    
    toast({
      title: 'Success',
      description: 'Product details created successfully',
    });
    
    // Return placeholder until the query is refreshed
    return {
      id: 0, // Temporary ID
      product_id: details.product_id,
      problem_statement: details.problem_statement || null,
      target_audience: details.target_audience || null,
      solution_description: details.solution_description || null,
      key_features: details.key_features || null,
      technical_details: details.technical_details || null,
      future_roadmap: details.future_roadmap || null,
      development_challenges: details.development_challenges || null,
      created_at: new Date().toISOString(),
      updated_at: null
    };
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

// Update existing product details
export const updateProductDetails = async (productId: number, updates: ProductDetailsUpdateInput): Promise<ProductDetails | null> => {
  try {
    // Use the update_product_details RPC function
    const { data, error } = await supabase.rpc('update_product_details', {
      p_product_id: productId,
      p_problem_statement: updates.problem_statement || null,
      p_target_audience: updates.target_audience || null,
      p_solution_description: updates.solution_description || null,
      p_key_features: updates.key_features || null,
      p_technical_details: updates.technical_details || null,
      p_future_roadmap: updates.future_roadmap || null,
      p_development_challenges: updates.development_challenges || null
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
    
    // Invalidate the query to refetch updated data
    const queryClient = new useQueryClient();
    queryClient.invalidateQueries({ queryKey: ['productDetails', productId] });
    
    toast({
      title: 'Success',
      description: 'Product details updated successfully',
    });
    
    // Fetch the updated details from the database
    const { data: updatedData, error: fetchError } = await supabase.rpc('get_product_details', {
      p_product_id: productId
    });
    
    if (fetchError || !updatedData || updatedData.length === 0) {
      return null;
    }
    
    return updatedData[0] as ProductDetails;
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

// Upsert product details (create or update)
export const upsertProductDetails = async (productId: number, details: ProductDetailsUpdateInput): Promise<ProductDetails | null> => {
  try {
    // First check if product details exist
    const { data, error } = await supabase.rpc('get_product_details', {
      p_product_id: productId
    });
    
    // If product details exist, update them
    if (!error && data && data.length > 0) {
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

// Delete product details
export const deleteProductDetails = async (productId: number): Promise<void> => {
  try {
    // Use the delete_product_details RPC function
    const { error } = await supabase.rpc('delete_product_details', {
      p_product_id: productId
    });
    
    if (error) {
      console.error('Error deleting product details:', error);
      toast({
        title: 'Error',
        description: 'Failed to delete product details',
        variant: 'destructive',
      });
      return;
    }
    
    // Invalidate the query to remove deleted data
    const queryClient = new useQueryClient();
    queryClient.invalidateQueries({ queryKey: ['productDetails', productId] });
    
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
