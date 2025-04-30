
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';

type AboutPageData = {
  id: number;
  about_video: string | null;
  about_text: string | null;
  created_at: string;
};

export const useAboutPage = () => {
  return useQuery({
    queryKey: ['aboutPage'],
    queryFn: async () => {
      console.log('Fetching about page data from Supabase...');
      
      const { data, error } = await supabase
        .from('about_page')
        .select('id, about_video, about_text, created_at')
        .order('id', { ascending: false })
        .limit(1);
      
      if (error) {
        console.error('Error fetching about page data:', error);
        toast({
          title: 'Error loading about page content',
          description: 'Please try refreshing the page',
          variant: 'destructive',
        });
        throw error;
      }
      
      console.log('About page data received:', data);
      return data && data.length > 0 ? data[0] as AboutPageData : null;
    },
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
};
