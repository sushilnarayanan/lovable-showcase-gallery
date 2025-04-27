
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
      
      // Instead of trying to modify the database, just return the icons directly
      const icons: SocialMediaIcon[] = [
        {
          id: 1,
          name: 'Email',
          icon_link: '/mail.svg',
          URL: `mailto:sushilnarayanan@gmail.com`
        },
        {
          id: 2,
          name: 'LinkedIn',
          icon_link: '/linkedin.svg',
          URL: 'https://www.linkedin.com/in/sushil-kumar08/'
        },
        {
          id: 3,
          name: 'WhatsApp',
          icon_link: '/whatsapp.svg',
          URL: `https://wa.me/919789027993`
        }
      ];
      
      console.log('Social media icons:', icons);
      return icons;
    }
  });
};
