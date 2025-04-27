
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
      console.log('Fetching social media icons...');
      
      // First, let's clean up any existing icons
      await supabase
        .from('social_media_icons')
        .delete()
        .neq('id', 0); // Delete all existing records
      
      // Insert the three required icons with correct URLs
      const { data: insertedData, error: insertError } = await supabase
        .from('social_media_icons')
        .insert([
          {
            name: 'Email',
            icon_link: '/mail.svg',
            URL: `mailto:sushilnarayanan@gmail.com`
          },
          {
            name: 'LinkedIn',
            icon_link: '/linkedin.svg',
            URL: 'https://www.linkedin.com/in/sushil-kumar08/'
          },
          {
            name: 'WhatsApp',
            icon_link: '/whatsapp.svg',
            URL: `https://wa.me/919789027993`
          }
        ])
        .select();
      
      if (insertError) {
        console.error('Error inserting social media icons:', insertError);
        throw insertError;
      }
      
      console.log('Social media icons updated:', insertedData);
      return insertedData as SocialMediaIcon[];
    }
  });
};
