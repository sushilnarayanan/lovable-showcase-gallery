
import { supabase } from "@/integrations/supabase/client";
import { useQuery } from "@tanstack/react-query";

export type SocialMediaIcon = {
  id: bigint;
  name: string | null;
  icon_link: string | null;
  URL: string | null;
};

export const useSocialMediaIcons = () => {
  return useQuery({
    queryKey: ['socialMediaIcons'],
    queryFn: async () => {
      console.log('Fetching social media icons...');
      
      const { data, error } = await supabase
        .from('social_media_icons')
        .select('*');
      
      if (error) {
        console.error('Error fetching social media icons:', error);
        throw error;
      }
      
      console.log('Social media icons fetched:', data);
      return data as SocialMediaIcon[];
    }
  });
};
