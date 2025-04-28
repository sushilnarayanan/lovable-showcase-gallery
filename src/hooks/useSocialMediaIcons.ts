
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export type SocialMediaIcon = {
  id: number;
  name: string | null;
  icon_link: string | null;
  URL: string | null;
};

export const useSocialMediaIcons = () => {
  return useQuery({
    queryKey: ['socialMediaIcons'],
    queryFn: async () => {
      console.log('Fetching social media icons from Supabase...');
      
      const { data, error } = await supabase
        .from('social_media_icons')
        .select('*');
      
      if (error) {
        console.error('Error fetching social media icons:', error);
        throw new Error('Failed to fetch social media icons');
      }
      
      console.log('Social media icons fetched successfully:', data);
      return data as SocialMediaIcon[];
    }
  });
};
