
import { useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

interface CategoryInitOptions {
  refreshCategories: () => void;
}

export const useCategoryInitialization = ({ refreshCategories }: CategoryInitOptions) => {
  useEffect(() => {
    const ensureCategories = async () => {
      try {
        // Check if microsaas category exists
        const { data: microsaasCategory } = await supabase
          .from('Categories')
          .select('id')
          .eq('slug', 'microsaas')
          .maybeSingle();
          
        if (!microsaasCategory) {
          await supabase
            .from('Categories')
            .insert({
              name: 'MicroSaaS',
              slug: 'microsaas',
              description: 'MicroSaaS products'
            });
          console.log('Created MicroSaaS category');
        }
        
        // Check if nocode category exists
        const { data: nocodeCategory } = await supabase
          .from('Categories')
          .select('id')
          .eq('slug', 'nocode')
          .maybeSingle();
          
        if (!nocodeCategory) {
          await supabase
            .from('Categories')
            .insert({
              name: 'NoCode',
              slug: 'nocode',
              description: 'NoCode products'
            });
          console.log('Created NoCode category');
        }
        
        // Refresh data if we created categories
        if (!microsaasCategory || !nocodeCategory) {
          refreshCategories();
        }
      } catch (error) {
        console.error('Error ensuring categories exist:', error);
      }
    };
    
    ensureCategories();
  }, [refreshCategories]);
};
