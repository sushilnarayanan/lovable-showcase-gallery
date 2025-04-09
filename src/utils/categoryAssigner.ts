
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';

/**
 * Assigns products to a specific category
 * @returns Promise<boolean> - true if successful, false if failed
 */
export async function assignProductsToCategory(productIds: number[], categorySlug: string): Promise<boolean> {
  try {
    // Maximum retry attempts
    const maxRetries = 3;
    let retryCount = 0;
    let categoryData = null;
    let categoryError = null;
    
    console.log(`Assigning products ${productIds.join(', ')} to category ${categorySlug}`);
    
    // Retry fetching category with exponential backoff
    while (retryCount < maxRetries && !categoryData) {
      try {
        // First get the category ID
        const response = await supabase
          .from('Categories')
          .select('id, name')
          .eq('slug', categorySlug)
          .maybeSingle();
          
        categoryData = response.data;
        categoryError = response.error;
        
        if (categoryData) {
          console.log(`Found category: ${JSON.stringify(categoryData)}`);
          break;
        }
        
        if (categoryError) {
          console.error(`Retry ${retryCount + 1}: Error fetching category:`, categoryError);
        } else if (!categoryData) {
          console.log(`Category ${categorySlug} not found, creating it...`);
          
          // Try to create the category
          let categoryName = categorySlug.charAt(0).toUpperCase() + categorySlug.slice(1);
          if (categorySlug === 'microsaas') categoryName = 'MicroSaaS';
          
          const { data: newCategory, error: createError } = await supabase
            .from('Categories')
            .insert({
              name: categoryName,
              slug: categorySlug,
              description: `${categoryName} products`
            })
            .select()
            .single();
            
          if (createError) {
            console.error(`Error creating category ${categorySlug}:`, createError);
          } else {
            categoryData = newCategory;
            console.log(`Created category: ${JSON.stringify(categoryData)}`);
            break;
          }
        }
      } catch (error) {
        console.error(`Retry ${retryCount + 1}: Network error:`, error);
      }
      
      // Exponential backoff
      const delay = Math.pow(2, retryCount) * 300;
      await new Promise(resolve => setTimeout(resolve, delay));
      retryCount++;
    }
      
    if (!categoryData) {
      console.error('Failed to get category after multiple attempts');
      toast({
        title: 'Error',
        description: `Failed to get category ID for ${categorySlug} after ${maxRetries} attempts`,
        variant: 'destructive',
      });
      return false;
    }
    
    const categoryId = categoryData.id;
    console.log(`Found category ID ${categoryId} for slug ${categorySlug}`);
    
    // Check which products are already in the category
    const { data: existingRelations, error: checkError } = await supabase
      .from('product_categories')
      .select('product_id')
      .eq('category_id', categoryId)
      .in('product_id', productIds);
      
    if (checkError) {
      console.error('Error checking existing relations:', checkError);
      // Continue anyway to try adding products
    }
    
    // Filter out products that are already in the category
    const existingProductIds = existingRelations?.map(rel => rel.product_id) || [];
    const productsToAdd = productIds.filter(id => !existingProductIds.includes(id));
    
    console.log('Products already in category:', existingProductIds);
    console.log('Products to add:', productsToAdd);
    
    // If all products are already assigned, notify and return
    if (productsToAdd.length === 0) {
      toast({
        title: 'Info',
        description: 'All specified products are already in this category'
      });
      return true;
    }
    
    // Add new relations one by one with retry mechanism
    let successCount = 0;
    
    for (const productId of productsToAdd) {
      let productAdded = false;
      retryCount = 0;
      
      while (!productAdded && retryCount < maxRetries) {
        try {
          const { error: insertError } = await supabase
            .from('product_categories')
            .insert({
              product_id: productId,
              category_id: categoryId
            });
            
          if (insertError) {
            console.error(`Retry ${retryCount + 1}: Error adding product ID ${productId} to category:`, insertError);
          } else {
            productAdded = true;
            successCount++;
            console.log(`Successfully added product ID ${productId} to category ${categorySlug}`);
            break;
          }
        } catch (error) {
          console.error(`Retry ${retryCount + 1}: Network error for product ID ${productId}:`, error);
        }
        
        // Exponential backoff
        const delay = Math.pow(2, retryCount) * 300;
        await new Promise(resolve => setTimeout(resolve, delay));
        retryCount++;
      }
    }
    
    // Show success message
    if (successCount > 0) {
      toast({
        title: 'Success',
        description: `Added ${successCount} products to ${categorySlug} category`
      });
      return true;
    } else {
      toast({
        title: 'Warning',
        description: `Failed to add any products to ${categorySlug} category`,
        variant: 'destructive',
      });
      return false;
    }
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
