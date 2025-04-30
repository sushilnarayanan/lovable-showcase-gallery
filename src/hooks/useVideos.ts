
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';

// Define the Video type based on the video_page table schema
export type Video = {
  id: number;
  name: string | null;
  thumbnail_url: string | null;
  video_url: string | null;
  created_at: string;
  date: string | null;
};

// Helper function to ensure URLs have a protocol and handle Supabase storage URLs
const formatUrl = (url: string | null): string | null => {
  if (!url) return null;
  
  // If it's a Supabase storage URL that might be signed
  if (url.includes('supabase.co/storage/v1/object/sign')) {
    return url;
  }
  
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
      console.log('Fetching videos from Supabase video_page table...');

      const { data, error } = await supabase
        .from('video_page')
        .select('id, name, thumbnail_url, video_url, created_at, date')
        .order('created_at', { ascending: false }); // Explicitly set to descending order to show newest first

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
      console.log('Videos data received from video_page table:', data);
      
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
    staleTime: 1000 * 60, // Reduced stale time to 1 minute to refresh more frequently
    refetchOnMount: true, // Force refetch when component mounts
  });
};
