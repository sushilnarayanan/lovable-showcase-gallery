
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';

// Define the Video type based on our database schema
export type Video = {
  id: number;
  Name: string | null;
  thumbnail_url: string | null;
  video_url: string | null;
  created_at: string;
};

// Helper function to ensure URLs have a protocol
const formatUrl = (url: string | null): string | null => {
  if (!url) return null;
  
  // If URL already has a protocol, return as is
  if (url.startsWith('http://') || url.startsWith('https://')) {
    return url;
  }
  
  // Add https protocol by default
  return `https://${url}`;
};

// Custom hook to fetch videos from the database
export const useVideos = () => {
  return useQuery({
    queryKey: ['videos'],
    queryFn: async () => {
      // Log the start of the query for debugging
      console.log('Fetching videos from Supabase...');

      const { data, error } = await supabase
        .from('Videos')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching videos:', error);
        toast({
          title: 'Error loading videos',
          description: 'Please try refreshing the page',
          variant: 'destructive',
        });
        throw error;
      }

      // Debug log the fetched data
      console.log('Videos data received:', data);
      
      // Process video data - ensure URLs are properly formatted
      const processedData = data?.map(video => ({
        ...video,
        // Format video_url to ensure it has a protocol
        video_url: formatUrl(video.video_url),
        // Format thumbnail_url to ensure it has a protocol
        thumbnail_url: formatUrl(video.thumbnail_url)
      })) || [];
      
      // Log the processed data
      console.log('Videos processed data:', processedData);
      
      return processedData as Video[];
    },
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
};
