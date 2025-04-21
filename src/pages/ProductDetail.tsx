import React, { useEffect, useState, useRef } from 'react';
import { useParams, useLocation, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Project } from '@/data/projects';
import { ProductItem, CategoryItem } from '@/integrations/supabase/types/portfolio';
import { toast } from '@/hooks/use-toast';
import { useProductDetailsById } from '@/hooks/useProductDetails';
import { useIsMobile } from '@/hooks/use-mobile';
import { ArrowLeft, Image } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import Navbar from '@/components/Navbar';
import ProductHero from '@/components/product/ProductHero';
import ProductTabs from '@/components/product/ProductTabs';
import ProductAccordion from '@/components/product/ProductAccordion';
import ImageZoomDialog from '@/components/ImageZoomDialog';

type ProductWithCategories = ProductItem & {
  categories?: CategoryItem[];
};

const ProductDetail = () => {
  const { id } = useParams<{ id: string }>();
  const location = useLocation();
  const navigate = useNavigate();
  const [isVideoPlaying, setIsVideoPlaying] = useState(false);
  const [activeTab, setActiveTab] = useState('problem');
  const [expandedSection, setExpandedSection] = useState<string | null>(null);
  const topRef = useRef<HTMLDivElement>(null);
  const isMobile = useIsMobile();
  
  const projectFromState = location.state?.project as Project & ProductWithCategories;
  const [project, setProject] = useState<(Project & ProductWithCategories) | null>(projectFromState || null);
  const [zoomedImage, setZoomedImage] = useState<string | null>(null);
  
  const { data: fetchedProduct, isLoading, error } = useQuery({
    queryKey: ['product', id],
    queryFn: async () => {
      if (id === 'detail' || isNaN(Number(id))) {
        throw new Error('Invalid product ID');
      }
      
      const { data, error } = await supabase
        .from('Products')
        .select('*')
        .eq('id', Number(id))
        .single();
      
      if (error) {
        throw error;
      }
      
      const productWithCategories = data as ProductWithCategories;
      
      const { data: categoryRelations, error: relError } = await supabase
        .from('product_categories')
        .select('category_id')
        .eq('product_id', data.id);
        
      if (!relError && categoryRelations && categoryRelations.length > 0) {
        const categoryIds = categoryRelations.map(rel => rel.category_id);
        
        const { data: categories, error: catError } = await supabase
          .from('Categories')
          .select('*')
          .in('id', categoryIds);
          
        if (!catError && categories) {
          productWithCategories.categories = categories;
        }
      }
      
      return productWithCategories;
    },
    enabled: !projectFromState && !!id && id !== 'detail',
  });

  const productId = project?.id || (id && !isNaN(Number(id)) ? Number(id) : undefined);
  const { data: productDetails } = useProductDetailsById(productId as number);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [id]);

  useEffect(() => {
    if (fetchedProduct && !project) {
      setProject({
        ...fetchedProduct,
        title: fetchedProduct.title,
        description: fetchedProduct.description || '',
        image: fetchedProduct.thumbnail_url || '',
        videoUrl: fetchedProduct.product_video || '',
        productLink: fetchedProduct.product_link || '',
        github_link: fetchedProduct.github_link || '',
        tags: fetchedProduct.tags || [],
        categories: fetchedProduct.categories || [],
      });
    }
  }, [fetchedProduct, project]);

  useEffect(() => {
    if (error) {
      toast({
        title: 'Error',
        description: 'Failed to load product details',
        variant: 'destructive',
      });
    }
  }, [error]);

  useEffect(() => {
    if (!projectFromState && id === 'detail') {
      navigate('/not-found', { replace: true });
    }
  }, [projectFromState, id, navigate]);

  useEffect(() => {
    const timer = setTimeout(() => {
      const sections = document.querySelectorAll('.section-slide-in');
      sections.forEach(section => {
        section.classList.remove('section-slide-in');
        const element = section as HTMLElement;
        void element.offsetWidth; // Trigger reflow
        section.classList.add('section-slide-in');
      });
    }, 50);
    return () => clearTimeout(timer);
  }, [activeTab]);

  const toggleSection = (section: string) => {
    if (expandedSection === section) {
      setExpandedSection(null);
    } else {
      setExpandedSection(section);
    }
  };

  const productImages: string[] | undefined | null = productDetails?.product_images;

  if (isLoading) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <div className="relative p-4 rounded-full">
          <div className="animate-spin h-12 w-12 border-4 border-netflix-red border-t-transparent rounded-full"></div>
        </div>
      </div>
    );
  }

  if (!project) {
    return (
      <div className="min-h-screen bg-black text-white flex flex-col items-center justify-center">
        <div className="text-2xl mb-4 font-bold">Product not found</div>
        <Button 
          variant="netflix" 
          onClick={() => navigate('/')}
        >
          Return Home
        </Button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white" ref={topRef}>
      <Navbar />
      
      <div className="relative w-full pt-16">
        <Button 
          variant="netflixOutline" 
          className="absolute top-20 left-4 z-50" 
          onClick={() => navigate(-1)}
        >
          <ArrowLeft className="text-netflix-red" />
          Back
        </Button>
        
        <ProductHero 
          videoUrl={project.videoUrl}
          image={project.image}
          isVideoPlaying={isVideoPlaying}
          setIsVideoPlaying={setIsVideoPlaying}
          title={project.title}
          description={project.description}
          productLink={project.productLink}
          github_link={project.github_link}
          tags={project.tags}
        />

        <Separator className="bg-netflix-red/20 my-6" />
        
        <div className="max-w-3xl mx-auto mb-8">
          <div className="flex items-center mb-4">
            <div className="mr-4 h-10 w-10 rounded-full flex items-center justify-center bg-netflix-red/30">
              <Image className="h-5 w-5 text-white" />
            </div>
            <h2 className="text-2xl font-bold text-white">Product Images</h2>
          </div>
          
          {productImages && productImages.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {productImages.map((img, index) => (
                <div
                  key={index}
                  className="relative overflow-hidden rounded-md border border-netflix-red/20 aspect-video group cursor-pointer"
                  onClick={() => setZoomedImage(img)}
                  tabIndex={0}
                  aria-label={`Zoom image ${index + 1}`}
                  role="button"
                  onKeyPress={e => { if (e.key === 'Enter') setZoomedImage(img); }}
                >
                  <img 
                    src={img} 
                    alt={`${project.title} image ${index + 1}`}
                    className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = '/placeholder.svg';
                    }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-4">
                    <p className="text-white text-sm">Product Screenshot {index + 1}</p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="flex items-center justify-center w-full h-[140px] bg-black/60 text-gray-400 rounded-lg border border-netflix-red/10 text-lg font-semibold">
              No images
            </div>
          )}

          {/* Image Zoom Dialog */}
          <ImageZoomDialog
            open={!!zoomedImage}
            onOpenChange={(open) => {
              if (!open) setZoomedImage(null);
            }}
            imageUrl={zoomedImage || ""}
            alt={zoomedImage ? `${project.title} - zoomed` : ""}
          />
        </div>

        {isMobile ? (
          <ProductAccordion
            productDetails={productDetails}
            expandedSection={expandedSection}
            toggleSection={toggleSection}
            tags={project.tags}
          />
        ) : (
          <div className="max-w-3xl mx-auto">
            <ProductTabs
              productDetails={productDetails}
              activeTab={activeTab}
              handleTabChange={setActiveTab}
              projectTitle={project.title}
              tags={project.tags}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductDetail;
