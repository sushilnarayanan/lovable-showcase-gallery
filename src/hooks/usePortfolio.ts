
import { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { ProductItem, ProductCreateInput, ProductUpdateInput, CategoryItem } from '@/integrations/supabase/types/portfolio';
import { toast } from '@/hooks/use-toast';
import { Database } from '@/integrations/supabase/types';

// Helper function to ensure category exists
const ensureCategoryExists = async (slug: string, name: string) => {
  try {
    // First check if the category exists
    const { data: existingCategory, error: categoryError } = await supabase
      .from('Categories')
      .select('id')
      .eq('slug', slug)
      .maybeSingle();
      
    if (categoryError) {
      console.error('Error checking category:', categoryError);
      return null;
    }
    
    // If category doesn't exist, create it
    if (!existingCategory) {
      console.log(`Creating missing category: ${name} (${slug})`);
      const { data: newCategory, error: createError } = await supabase
        .from('Categories')
        .insert([
          { name: name, slug: slug, description: `${name} products` }
        ])
        .select()
        .single();
        
      if (createError) {
        console.error('Error creating category:', createError);
        return null;
      }
      
      return newCategory.id;
    }
    
    return existingCategory.id;
  } catch (error) {
    console.error('Unexpected error in ensureCategoryExists:', error);
    return null;
  }
};

// Helper to fetch categories for a product
const fetchCategoriesForProduct = async (productId: number): Promise<CategoryItem[]> => {
  try {
    const { data, error } = await supabase
      .from('product_categories')
      .select('category_id')
      .eq('product_id', productId);
      
    if (error) {
      console.error('Error fetching product categories:', error);
      return [];
    }

    if (!data || data.length === 0) {
      return [];
    }

    const categoryIds = data.map(item => item.category_id);
    
    const { data: categories, error: catError } = await supabase
      .from('Categories')
      .select('*')
      .in('id', categoryIds);
      
    if (catError) {
      console.error('Error fetching categories by IDs:', catError);
      return [];
    }
    
    return categories || [];
  } catch (error) {
    console.error('Error in fetchCategoriesForProduct:', error);
    return [];
  }
};

// Helper to enrich products with their categories
const enrichProductsWithCategories = async (products: ProductItem[]): Promise<ProductItem[]> => {
  try {
    if (!products || products.length === 0) return [];
    
    const productIds = products.map(p => p.id);
    
    // Fetch all product-category relationships for these products
    const { data: relationships, error } = await supabase
      .from('product_categories')
      .select('product_id, category_id')
      .in('product_id', productIds);
      
    if (error) {
      console.error('Error fetching product-category relationships:', error);
      return products;
    }
    
    // Get unique category IDs
    const categoryIds = [...new Set(relationships?.map(r => r.category_id) || [])];
    
    if (categoryIds.length === 0) return products;
    
    // Fetch all needed categories in one query
    const { data: categories, error: catError } = await supabase
      .from('Categories')
      .select('*')
      .in('id', categoryIds);
      
    if (catError) {
      console.error('Error fetching categories:', catError);
      return products;
    }
    
    // Create a map for quick category lookup
    const categoryMap = new Map();
    categories?.forEach(category => {
      categoryMap.set(category.id, category);
    });
    
    // Create a map of product_id -> array of categories
    const productCategoriesMap = new Map();
    relationships?.forEach(rel => {
      const category = categoryMap.get(rel.category_id);
      if (category) {
        if (!productCategoriesMap.has(rel.product_id)) {
          productCategoriesMap.set(rel.product_id, []);
        }
        productCategoriesMap.get(rel.product_id).push(category);
      }
    });
    
    // Enrich products with their categories
    return products.map(product => ({
      ...product,
      categories: productCategoriesMap.get(product.id) || []
    }));
  } catch (error) {
    console.error('Error enriching products with categories:', error);
    return products;
  }
};

export const useProductData = () => {
  return useQuery({
    queryKey: ['products'],
    queryFn: async (): Promise<ProductItem[]> => {
      const { data, error } = await supabase
        .from('Products')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) {
        console.error('Error fetching product data:', error);
        toast({
          title: 'Error',
          description: 'Failed to load product data',
          variant: 'destructive',
        });
        throw new Error(error.message);
      }
      
      return enrichProductsWithCategories(data || []);
    },
  });
};

export const useCategoryData = () => {
  return useQuery({
    queryKey: ['categories'],
    queryFn: async (): Promise<CategoryItem[]> => {
      try {
        // Check for required categories
        await ensureCategoryExists('microsaas', 'MicroSaaS');
        await ensureCategoryExists('nocode', 'NoCode');
        await ensureCategoryExists('featured-products', 'Featured Products');
        await ensureCategoryExists('vibe-coded', 'Vibe Coded');
        
        const { data, error } = await supabase
          .from('Categories')
          .select('*')
          .order('name', { ascending: true });
        
        if (error) {
          console.error('Error fetching category data:', error);
          toast({
            title: 'Error',
            description: 'Failed to load category data',
            variant: 'destructive',
          });
          throw new Error(error.message);
        }
        
        return data || [];
      } catch (error) {
        console.error('Error in useCategoryData:', error);
        return [];
      }
    },
  });
};

// Function to fetch products by direct category ID
export const useProductsByCategoryId = (categoryId: number) => {
  return useQuery({
    queryKey: ['products', 'categoryId', categoryId],
    queryFn: async (): Promise<ProductItem[]> => {
      try {
        if (!categoryId) {
          return [];
        }
        
        // Get product IDs from the junction table
        const { data: productCategories, error: relError } = await supabase
          .from('product_categories')
          .select('product_id')
          .eq('category_id', categoryId);
          
        if (relError) {
          console.error(`Error fetching product relations for category ID ${categoryId}:`, relError);
          return [];
        }
        
        if (!productCategories || productCategories.length === 0) {
          // Fall back to direct category_id for backward compatibility
          const { data: legacyProducts, error: legacyError } = await supabase
            .from('Products')
            .select('*')
            .eq('category_id', categoryId)
            .order('created_at', { ascending: false });
            
          if (legacyError) {
            console.error(`Error fetching legacy products for category ID ${categoryId}:`, legacyError);
            return [];
          }
          
          return enrichProductsWithCategories(legacyProducts || []);
        }
        
        const productIds = productCategories.map(pc => pc.product_id);
        
        // Get the actual products
        const { data: products, error } = await supabase
          .from('Products')
          .select('*')
          .in('id', productIds)
          .order('created_at', { ascending: false });
        
        if (error) {
          console.error(`Error fetching products by IDs for category ${categoryId}:`, error);
          toast({
            title: 'Error',
            description: `Failed to load products for category ID ${categoryId}`,
            variant: 'destructive',
          });
          throw new Error(error.message);
        }
        
        return enrichProductsWithCategories(products || []);
      } catch (error) {
        console.error(`Error in useProductsByCategoryId for ID ${categoryId}:`, error);
        return [];
      }
    },
    enabled: !!categoryId,
  });
};

export const useProductsByCategory = (categorySlug: string) => {
  return useQuery({
    queryKey: ['products', 'category', categorySlug],
    queryFn: async (): Promise<ProductItem[]> => {
      try {
        // Create category if it doesn't exist based on slug
        let categoryId;
        
        if (categorySlug === 'microsaas') {
          categoryId = await ensureCategoryExists('microsaas', 'MicroSaaS');
        } else if (categorySlug === 'nocode') {
          categoryId = await ensureCategoryExists('nocode', 'NoCode');
        } else if (categorySlug === 'featured-products') {
          categoryId = await ensureCategoryExists('featured-products', 'Featured Products');
        } else if (categorySlug === 'vibe-coded') {
          categoryId = await ensureCategoryExists('vibe-coded', 'Vibe Coded');
        } else {
          // For other categories, check if they exist
          const { data: categoryData, error: categoryError } = await supabase
            .from('Categories')
            .select('id')
            .eq('slug', categorySlug)
            .maybeSingle();
          
          if (categoryError) {
            console.error('Error fetching category:', categoryError);
            toast({
              title: 'Error',
              description: 'Failed to load category',
              variant: 'destructive',
            });
            throw new Error(categoryError.message);
          }
          
          categoryId = categoryData?.id;
        }
        
        // If no category found, return empty array
        if (!categoryId) {
          console.log(`Category with slug "${categorySlug}" not found`);
          return [];
        }
        
        // Get product IDs from the junction table
        const { data: productCategories, error: relError } = await supabase
          .from('product_categories')
          .select('product_id')
          .eq('category_id', categoryId);
          
        if (relError) {
          console.error(`Error fetching product relations for category slug ${categorySlug}:`, relError);
          return [];
        }
        
        if (!productCategories || productCategories.length === 0) {
          // Fall back to direct category_id for backward compatibility
          const { data: legacyProducts, error: legacyError } = await supabase
            .from('Products')
            .select('*')
            .eq('category_id', categoryId)
            .order('created_at', { ascending: false });
            
          if (legacyError) {
            console.error(`Error fetching legacy products for category slug ${categorySlug}:`, legacyError);
            return [];
          }
          
          return enrichProductsWithCategories(legacyProducts || []);
        }
        
        const productIds = productCategories.map(pc => pc.product_id);
        
        // Get the actual products
        const { data: products, error } = await supabase
          .from('Products')
          .select('*')
          .in('id', productIds)
          .order('created_at', { ascending: false });
        
        if (error) {
          console.error('Error fetching products by category:', error);
          toast({
            title: 'Error',
            description: 'Failed to load products',
            variant: 'destructive',
          });
          throw new Error(error.message);
        }
        
        return enrichProductsWithCategories(products || []);
      } catch (error) {
        console.error('Error in useProductsByCategory:', error);
        return [];
      }
    },
    enabled: !!categorySlug,
  });
};

export const addProduct = async (item: ProductCreateInput) => {
  try {
    // First, add the product
    const { data, error } = await supabase
      .from('Products')
      .insert({
        title: item.title,
        description: item.description,
        thumbnail_url: item.thumbnail_url,
        product_video: item.product_video,
        product_link: item.product_link,
        github_link: item.github_link,
        category_id: item.category_id, // Keep for backward compatibility
        tags: item.tags
      })
      .select()
      .single();
    
    if (error) {
      console.error('Error adding product item:', error);
      toast({
        title: 'Error',
        description: 'Failed to add product item',
        variant: 'destructive',
      });
      throw new Error(error.message);
    }
    
    // Now add category relationships if provided
    if (item.categoryIds && item.categoryIds.length > 0 && data.id) {
      const categoryRelations = item.categoryIds.map(categoryId => ({
        product_id: data.id,
        category_id: categoryId
      }));
      
      const { error: relError } = await supabase
        .from('product_categories')
        .insert(categoryRelations);
        
      if (relError) {
        console.error('Error adding product-category relationships:', relError);
        // Don't throw here, since the product was created successfully
      }
    }
    
    toast({
      title: 'Success',
      description: 'Product item added successfully',
    });
    
    return data;
  } catch (error) {
    console.error('Error in addProduct:', error);
    throw error;
  }
};

export const updateProduct = async (id: number, updates: ProductUpdateInput) => {
  try {
    // Extract categoryIds from updates
    const { categoryIds, ...productUpdates } = updates;
    
    // Update the product
    const { data, error } = await supabase
      .from('Products')
      .update(productUpdates)
      .eq('id', id)
      .select()
      .single();
    
    if (error) {
      console.error('Error updating product item:', error);
      toast({
        title: 'Error',
        description: 'Failed to update product item',
        variant: 'destructive',
      });
      throw new Error(error.message);
    }
    
    // Update category relationships if provided
    if (categoryIds !== undefined) {
      // First delete existing relationships
      const { error: deleteError } = await supabase
        .from('product_categories')
        .delete()
        .eq('product_id', id);
        
      if (deleteError) {
        console.error('Error deleting existing product-category relationships:', deleteError);
        // Don't throw here, still proceed
      }
      
      // Then add new ones if there are any
      if (categoryIds.length > 0) {
        const categoryRelations = categoryIds.map(categoryId => ({
          product_id: id,
          category_id: categoryId
        }));
        
        const { error: insertError } = await supabase
          .from('product_categories')
          .insert(categoryRelations);
          
        if (insertError) {
          console.error('Error adding new product-category relationships:', insertError);
          // Don't throw here, since the product was updated successfully
        }
      }
    }
    
    toast({
      title: 'Success',
      description: 'Product item updated successfully',
    });
    
    return data;
  } catch (error) {
    console.error('Error in updateProduct:', error);
    throw error;
  }
};

export const deleteProduct = async (id: number) => {
  // No need to delete from product_categories due to CASCADE constraints
  const { error } = await supabase
    .from('Products')
    .delete()
    .eq('id', id);
  
  if (error) {
    console.error('Error deleting product item:', error);
    toast({
      title: 'Error',
      description: 'Failed to delete product item',
      variant: 'destructive',
    });
    throw new Error(error.message);
  }
  
  toast({
    title: 'Success',
    description: 'Product item deleted successfully',
  });
};

export const usePortfolioData = useProductData;
export const addPortfolioItem = addProduct;
export const updatePortfolioItem = updateProduct;
export const deletePortfolioItem = deleteProduct;
