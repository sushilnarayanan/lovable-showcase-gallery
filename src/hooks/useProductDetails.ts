
import { useQuery } from '@tanstack/react-query';
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
      
      // Use 'product_details' as the table name (lowercase with underscore)
      const { data, error } = await supabase
        .from('product_details')
        .select('*')
        .eq('product_id', productId)
        .maybeSingle();
      
      if (error) {
        console.error('Error fetching product details:', error);
        toast({
          title: 'Error',
          description: 'Failed to load product details',
          variant: 'destructive',
        });
        throw error;
      }
      
      return data as ProductDetails | null;
    },
    enabled: !!productId
  });
};

// Create new product details
export const createProductDetails = async (details: ProductDetailsCreateInput): Promise<ProductDetails | null> => {
  try {
    // Use 'product_details' as the table name (lowercase with underscore)
    const { data, error } = await supabase
      .from('product_details')
      .insert(details)
      .select()
      .single();
    
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
    
    return data as ProductDetails;
  } catch (error) {
    console.error('Error in createProductDetails:', error);
    return null;
  }
};

// Update existing product details
export const updateProductDetails = async (productId: number, updates: ProductDetailsUpdateInput): Promise<ProductDetails | null> => {
  try {
    // Use 'product_details' as the table name (lowercase with underscore)
    const { data, error } = await supabase
      .from('product_details')
      .update(updates)
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
      throw error;
    }
    
    toast({
      title: 'Success',
      description: 'Product details updated successfully',
    });
    
    return data as ProductDetails;
  } catch (error) {
    console.error('Error in updateProductDetails:', error);
    return null;
  }
};

// Upsert product details (create if doesn't exist, update if exists)
export const upsertProductDetails = async (productId: number, details: ProductDetailsUpdateInput): Promise<ProductDetails | null> => {
  try {
    // First check if product details exist
    const { data: existingDetails } = await supabase
      .from('product_details')
      .select('id')
      .eq('product_id', productId)
      .maybeSingle();
    
    if (existingDetails) {
      // Update existing details
      return updateProductDetails(productId, details);
    } else {
      // Create new details with product_id
      const createData: ProductDetailsCreateInput = {
        product_id: productId,
        ...details as ProductDetailsUpdateInput
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
    // Use 'product_details' as the table name (lowercase with underscore)
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
