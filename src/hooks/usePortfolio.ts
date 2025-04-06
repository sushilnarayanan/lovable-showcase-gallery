
import { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { PortfolioItem, PortfolioCreateInput, PortfolioUpdateInput } from '@/integrations/supabase/types/portfolio';
import { toast } from '@/hooks/use-toast';
import { Database } from '@/integrations/supabase/types';

export const usePortfolioData = () => {
  return useQuery({
    queryKey: ['portfolio'],
    queryFn: async (): Promise<PortfolioItem[]> => {
      const { data, error } = await supabase
        .from('Portfolio')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) {
        console.error('Error fetching portfolio data:', error);
        toast({
          title: 'Error',
          description: 'Failed to load portfolio data',
          variant: 'destructive',
        });
        throw new Error(error.message);
      }
      
      return data || [];
    },
  });
};

export const addPortfolioItem = async (item: PortfolioCreateInput) => {
  const { data, error } = await supabase
    .from('Portfolio')
    .insert(item)
    .select()
    .single();
  
  if (error) {
    console.error('Error adding portfolio item:', error);
    toast({
      title: 'Error',
      description: 'Failed to add portfolio item',
      variant: 'destructive',
    });
    throw new Error(error.message);
  }
  
  toast({
    title: 'Success',
    description: 'Portfolio item added successfully',
  });
  
  return data;
};

export const updatePortfolioItem = async (id: number, updates: PortfolioUpdateInput) => {
  const { data, error } = await supabase
    .from('Portfolio')
    .update(updates)
    .eq('id', id)
    .select()
    .single();
  
  if (error) {
    console.error('Error updating portfolio item:', error);
    toast({
      title: 'Error',
      description: 'Failed to update portfolio item',
      variant: 'destructive',
    });
    throw new Error(error.message);
  }
  
  toast({
    title: 'Success',
    description: 'Portfolio item updated successfully',
  });
  
  return data;
};

export const deletePortfolioItem = async (id: number) => {
  const { error } = await supabase
    .from('Portfolio')
    .delete()
    .eq('id', id);
  
  if (error) {
    console.error('Error deleting portfolio item:', error);
    toast({
      title: 'Error',
      description: 'Failed to delete portfolio item',
      variant: 'destructive',
    });
    throw new Error(error.message);
  }
  
  toast({
    title: 'Success',
    description: 'Portfolio item deleted successfully',
  });
};
