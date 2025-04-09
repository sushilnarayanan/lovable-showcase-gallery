
import { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { ProductItem, ProductCreateInput, ProductUpdateInput, CategoryItem } from '@/integrations/supabase/types/portfolio';
import { toast } from '@/hooks/use-toast';
import { Database } from '@/integrations/supabase/types';

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
    },
  });
};

export const useProductsByCategory = (categorySlug: string) => {
  return useQuery({
    queryKey: ['products', 'category', categorySlug],
    queryFn: async (): Promise<ProductItem[]> => {
      // First check if the category exists
      const { data: categoryData, error: categoryError } = await supabase
        .from('Categories')
        .select('id')
        .eq('slug', categorySlug)
        .maybeSingle(); // Use maybeSingle instead of single to prevent errors
      
      if (categoryError && categoryError.code !== 'PGRST116') {
        // Only throw for errors other than "no rows returned"
        console.error('Error fetching category:', categoryError);
        toast({
          title: 'Error',
          description: 'Failed to load category',
          variant: 'destructive',
        });
        throw new Error(categoryError.message);
      }
      
      // If no category found, return empty array
      if (!categoryData) {
        console.log(`Category with slug "${categorySlug}" not found`);
        return [];
      }
      
      const { data, error } = await supabase
        .from('Products')
        .select('*')
        .eq('category_id', categoryData.id)
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
