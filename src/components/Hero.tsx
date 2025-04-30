
import React, { useEffect, useState } from 'react';
import { Play, Info } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';

const Hero = () => {
  const navigate = useNavigate();
  const [backgroundImage, setBackgroundImage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchHomeBackground = async () => {
      try {
        setIsLoading(true);
        const { data, error } = await supabase
          .from('home_page')
          .select('home_bg')
          .single();

        if (error) {
          console.error('Error fetching home background:', error);
          // Fallback to default image
        } else if (data && data.home_bg) {
          setBackgroundImage(data.home_bg);
        }
      } catch (error) {
        console.error('Error in fetching home background:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchHomeBackground();
  }, []);

  const handleStartWatching = () => {
    // Find the products section by ID
    const productsSection = document.getElementById('products');
    if (productsSection) {
      productsSection.scrollIntoView({
        behavior: 'smooth'
      });
    } else {
      // If products section is not found, try scrolling to the first ContentRow
      const contentRow = document.querySelector('.content-row');
      if (contentRow) {
        contentRow.scrollIntoView({
          behavior: 'smooth'
        });
        console.log('Scrolling to first content row instead');
      } else {
        console.log('Neither products section nor content row found');
      }
    }
  };

  const handleMoreInfo = () => {
    navigate('/about');
  };

  // Default background if none found in database
  const defaultBackground = "https://images.unsplash.com/photo-1488590528505-98d2b5aba04b?auto=format&fit=crop&q=80";

  return <div className="relative h-[100vh] w-full overflow-hidden"> 
      {/* Hero Background Image */}
      <div className="absolute inset-0 z-0" style={{
        backgroundImage: `url('${backgroundImage || defaultBackground}')`,
        backgroundSize: 'cover',
        backgroundPosition: 'center center',
        backgroundRepeat: 'no-repeat',
        width: '100%',
        height: '100%'
      }} />
      
      {/* Loading overlay */}
      {isLoading && (
        <div className="absolute inset-0 z-5 flex items-center justify-center bg-black/50">
          <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-netflix-red"></div>
        </div>
      )}
      
      {/* Gradient Overlay - Adjusted for better blending with header */}
      <div className="absolute inset-0 bg-gradient-to-r from-black via-black/70 to-transparent z-10" />
      <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-black/50 z-10" />
      
      {/* Hero Content */}
      <div className="relative z-20 h-full flex flex-col justify-center px-4 sm:px-8 md:px-[4%] lg:px-[4%] w-full">
        <div className="max-w-xl mt-0 pt-0"> 
          <div className="mb-3">
            <span className="bg-netflix-red text-white px-2 py-0.5 text-xs font-bold mr-2">Rated U/A</span>
            <span className="text-sm text-gray-300">Cult classic • Action</span>
          </div>
          
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-4 text-white leading-tight">The Product Show
        </h1>
          
          <p className="text-sm text-white/80 mb-3 font-medium">Built by Sushil Narayanan</p>
          
          <p className="text-base md:text-lg mb-6 text-white/90 max-w-lg">
            Check out my latest products built with modern technologies. This portfolio showcases web applications created with Nocode and AI tools - Bolt, Lovable, Softr, Replit, and more.
          </p>
          
          <div className="flex flex-wrap gap-4 mt-4">
            <Button variant="netflix" className="px-6 py-2 flex items-center text-base font-medium w-full sm:w-auto" onClick={handleStartWatching}>
              <Play size={20} className="mr-2" />
              Start Watching
            </Button>
            <Button variant="netflixOutline" className="px-6 py-2 flex items-center text-base font-medium w-full sm:w-auto" onClick={handleMoreInfo}>
              <Info size={20} className="mr-2" />
              More Info
            </Button>
          </div>
        </div>
      </div>
    </div>;
};

export default Hero;
