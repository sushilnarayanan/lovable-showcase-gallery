
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';

/**
 * Assigns products to a specific category
 */
export async function assignProductsToCategory(productIds: number[], categorySlug: string) {
  try {
    // First get the category ID
    const { data: categoryData, error: categoryError } = await supabase
      .from('Categories')
      .select('id')
      .eq('slug', categorySlug)
      .maybeSingle();
      
    if (categoryError) {
      console.error('Error fetching category:', categoryError);
      toast({
        title: 'Error',
        description: `Failed to get category ID for ${categorySlug}`,
        variant: 'destructive',
      });
      return false;
    }
    
    if (!categoryData) {
      toast({
        title: 'Error',
        description: `Category ${categorySlug} does not exist`,
        variant: 'destructive',
      });
      return false;
    }
    
    const categoryId = categoryData.id;
    
    // Check which products are already in the category
    const { data: existingRelations, error: checkError } = await supabase
      .from('product_categories')
      .select('product_id')
      .eq('category_id', categoryId)
      .in('product_id', productIds);
      
    if (checkError) {
      console.error('Error checking existing relations:', checkError);
    }
    
    // Filter out products that are already in the category
    const existingProductIds = existingRelations?.map(rel => rel.product_id) || [];
    const productsToAdd = productIds.filter(id => !existingProductIds.includes(id));
    
    // If all products are already assigned, notify and return
    if (productsToAdd.length === 0) {
      toast({
        title: 'Info',
        description: 'All specified products are already in this category'
      });
      return true;
    }
    
    // Add new relations one by one
    let successCount = 0;
    
    for (const productId of productsToAdd) {
      const { error: insertError } = await supabase
        .from('product_categories')
        .insert({
          product_id: productId,
          category_id: categoryId
        });
        
      if (insertError) {
        console.error(`Error adding product ID ${productId} to category:`, insertError);
      } else {
        successCount++;
      }
    }
    
    // Show success message
    toast({
      title: 'Success',
      description: `Added ${successCount} products to ${categorySlug} category`
    });
    
    return true;
  } catch (error) {
    console.error('Error in assignProductsToCategory:', error);
    toast({
      title: 'Error',
      description: 'An unexpected error occurred',
      variant: 'destructive',
    });
    return false;
  }
}
