
import { supabase } from "@/integrations/supabase/client";
import { useQuery } from "@tanstack/react-query";

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
      const { data, error } = await supabase
        .from('social media icons')
        .select('*');
      
      if (error) {
        console.error('Error fetching social media icons:', error);
        throw error;
      }
      
      return data as SocialMediaIcon[];
    }
  });
};
