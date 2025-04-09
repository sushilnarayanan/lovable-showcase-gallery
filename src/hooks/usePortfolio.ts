
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
      
      return data || [];
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

// New function to fetch products by direct category ID
export const useProductsByCategoryId = (categoryId: number) => {
  return useQuery({
    queryKey: ['products', 'categoryId', categoryId],
    queryFn: async (): Promise<ProductItem[]> => {
      try {
        if (!categoryId) {
          return [];
        }
        
        const { data, error } = await supabase
          .from('Products')
          .select('*')
          .eq('category_id', categoryId)
          .order('created_at', { ascending: false });
        
        if (error) {
          console.error(`Error fetching products by category ID ${categoryId}:`, error);
          toast({
            title: 'Error',
            description: `Failed to load products for category ID ${categoryId}`,
            variant: 'destructive',
          });
          throw new Error(error.message);
        }
        
        return data || [];
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
        
        const { data, error } = await supabase
          .from('Products')
          .select('*')
          .eq('category_id', categoryId)
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
        
        return data || [];
      } catch (error) {
        console.error('Error in useProductsByCategory:', error);
        return [];
      }
    },
    enabled: !!categorySlug,
  });
};

export const addProduct = async (item: ProductCreateInput) => {
  const { data, error } = await supabase
    .from('Products')
    .insert(item)
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
  
  toast({
    title: 'Success',
    description: 'Product item added successfully',
  });
  
  return data;
};

export const updateProduct = async (id: number, updates: ProductUpdateInput) => {
  const { data, error } = await supabase
    .from('Products')
    .update(updates)
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
  
  toast({
    title: 'Success',
    description: 'Product item updated successfully',
  });
  
  return data;
};

export const deleteProduct = async (id: number) => {
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
