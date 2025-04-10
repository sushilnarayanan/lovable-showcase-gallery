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
        // Directly query the product_details table instead of using RPC
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

// Create new product details
export const createProductDetails = async (details: ProductDetailsCreateInput): Promise<ProductDetails | null> => {
  try {
    // Insert directly into product_details table
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
    
    // Invalidate the query to refetch
    const queryClient = useQueryClient();
    queryClient.invalidateQueries({ queryKey: ['productDetails', details.product_id] });
    
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

// Update existing product details
export const updateProductDetails = async (productId: number, updates: ProductDetailsUpdateInput): Promise<ProductDetails | null> => {
  try {
    // Update product_details table directly
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
    
    // Invalidate the query to refetch updated data
    const queryClient = useQueryClient();
    queryClient.invalidateQueries({ queryKey: ['productDetails', productId] });
    
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

// Upsert product details (create or update)
export const upsertProductDetails = async (productId: number, details: ProductDetailsUpdateInput): Promise<ProductDetails | null> => {
  try {
    // Check if product details exist
    const { data, error } = await supabase
      .from('product_details')
      .select('*')
      .eq('product_id', productId)
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

// Delete product details
export const deleteProductDetails = async (productId: number): Promise<void> => {
  try {
    // Delete directly from product_details table
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
    
    // Invalidate the query to remove deleted data
    const queryClient = useQueryClient();
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
