import React, { useEffect, useState, useRef } from 'react';
import { useParams, useLocation, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Project } from '@/data/projects';
import { ProductItem, CategoryItem, ProductDetails } from '@/integrations/supabase/types/portfolio';
import { toast } from '@/hooks/use-toast';
import { useProductDetailsById } from '@/hooks/useProductDetails';
import { useIsMobile } from '@/hooks/use-mobile';
import { 
  ArrowLeft, 
  ExternalLink, 
  Github, 
  Play, 
  Lightbulb,
  PanelTopOpen,
  Wrench,
  Users,
  Shield,
  Image,
  AlertCircle,
  ChevronDown,
  ChevronUp,
  Tag,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from '@/components/ui/separator';
import Navbar from '@/components/Navbar';
import { Badge } from '@/components/ui/badge';

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

  const handleBackClick = () => {
    navigate(-1);
  };

  const handlePlayVideo = () => {
    if (project.videoUrl) {
      setIsVideoPlaying(true);
    } else {
      toast({
        title: "No Video Available",
        description: "This project doesn't have a video preview.",
      });
    }
  };

  const handleTabChange = (value: string) => {
    setActiveTab(value);
  };

  const productImages = [
    project.image || 'https://images.unsplash.com/photo-1488590528505-98d2b5aba04b?auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1531297484001-80022131f5a1?auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&q=80',
  ];

  const AccordionSection = ({ 
    title, 
    icon, 
    id, 
    children 
  }: { 
    title: string; 
    icon: React.ReactNode; 
    id: string; 
    children: React.ReactNode 
  }) => {
    const isExpanded = expandedSection === id;
    
    return (
      <div className="mb-4 border border-netflix-red/20 rounded-md overflow-hidden">
        <button
          onClick={() => toggleSection(id)}
          className="w-full flex items-center justify-between p-4 bg-black/70"
        >
          <div className="flex items-center">
            <div className="mr-3 h-10 w-10 rounded-full flex items-center justify-center bg-netflix-red/30">
              {icon}
            </div>
            <span className="font-bold text-lg">{title}</span>
          </div>
          {isExpanded ? 
            <ChevronUp className="h-5 w-5 text-netflix-red" /> : 
            <ChevronDown className="h-5 w-5 text-netflix-red" />
          }
        </button>
        
        {isExpanded && (
          <div className="p-4 bg-black/50 border-t border-netflix-red/20 section-slide-in">
            {children}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-black text-white" ref={topRef}>
      <Navbar />
      
      <div className="relative w-full pt-16">
        <Button 
          variant="netflixOutline" 
          className="absolute top-20 left-4 z-50" 
          onClick={handleBackClick}
        >
          <ArrowLeft className="text-netflix-red" />
          Back
        </Button>
        
        <div className="relative w-full h-[40vh] lg:h-[50vh]">
          {isVideoPlaying && project.videoUrl ? (
            <div className="absolute inset-0 bg-black z-40">
              <div className="relative w-full h-full">
                <Button 
                  className="absolute top-4 right-4 z-50 bg-black/70 hover:bg-black/90 border border-netflix-red/30 text-white" 
                  onClick={() => setIsVideoPlaying(false)}
                >
                  Close
                </Button>
                <video 
                  src={project.videoUrl} 
                  className="w-full h-full object-contain"
                  controls
                  autoPlay
                />
              </div>
            </div>
          ) : (
            <>
              <div className="absolute inset-0 bg-gradient-to-r from-black/90 via-black/70 to-transparent z-10"></div>
              <img 
                src={project.image || '/placeholder.svg'} 
                alt={project.title}
                className="w-full h-full object-cover brightness-100" 
                onError={(e) => {
                  (e.target as HTMLImageElement).src = '/placeholder.svg';
                }}
              />
              <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black z-20" />
            </>
          )}
        </div>

        <div className="w-full px-4 py-6 -mt-16 relative z-30">
          <div className="max-w-3xl mx-auto">
            <span className="text-netflix-red text-sm font-medium tracking-wider">FEATURED PROJECT</span>
            
            <h1 className="text-3xl md:text-4xl font-bold mt-2 mb-3 text-white break-words">{project.title}</h1>
            
            <p className="text-lg text-gray-300 mb-6 max-w-2xl font-medium break-words">
              {project.description}
            </p>
            
            <div className="flex flex-wrap gap-3 mb-8">
              {project.videoUrl && (
                <Button 
                  variant="netflix"
                  className="font-medium flex-grow sm:flex-grow-0" 
                  onClick={handlePlayVideo}
                >
                  <Play size={18} className="mr-2" />
                  Watch Demo
                </Button>
              )}
              
              {project.productLink && (
                <Button
                  variant="netflixOutline"
                  className="border-netflix-red flex-grow sm:flex-grow-0" 
                  onClick={() => window.open(project.productLink, '_blank')}
                >
                  <ExternalLink size={18} className="mr-2" />
                  Visit Project
                </Button>
              )}
              
              {project.github_link && (
                <Button
                  variant="netflixOutline"
                  className="border-netflix-red flex-grow sm:flex-grow-0" 
                  onClick={() => window.open(project.github_link, '_blank')}
                >
                  <Github size={18} className="mr-2" />
                  View Code
                </Button>
              )}
            </div>
          </div>

          {project.tags && project.tags.length > 0 && (
            <div className="max-w-3xl mx-auto mb-6">
              <div className="flex flex-wrap gap-2">
                {project.tags.map((tag, index) => (
                  <span 
                    key={index}
                    className="px-3 py-1 bg-netflix-red/20 text-white border border-netflix-red/30 rounded-md text-sm font-medium"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          )}

          <Separator className="bg-netflix-red/20 my-6" />
          
          <div className="max-w-3xl mx-auto mb-8">
            <div className="flex items-center mb-4">
              <div className="mr-4 h-10 w-10 rounded-full flex items-center justify-center bg-netflix-red/30">
                <Image className="h-5 w-5 text-white" />
              </div>
              <h2 className="text-2xl font-bold text-white">Product Images</h2>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {productImages.map((img, index) => (
                <div key={index} className="relative overflow-hidden rounded-md border border-netflix-red/20 aspect-video group">
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
          </div>

          {isMobile ? (
            <div className="max-w-3xl mx-auto">
              <AccordionSection 
                title="The Problem" 
                icon={<AlertCircle className="h-5 w-5 text-white" />} 
                id="problem"
              >
                <div className="space-y-4">
                  <div className="bg-black/70 p-4 rounded-md border border-netflix-red/10 text-white">
                    <h3 className="text-lg font-semibold mb-2 flex items-center text-netflix-red">
                      <span className="h-8 w-8 rounded-full bg-netflix-red/20 flex items-center justify-center mr-2">
                        <Users className="h-4 w-4 text-netflix-red" />
                      </span>
                      Problem Statement
                    </h3>
                    <p className="text-gray-300 break-words">
                      {productDetails?.problem_statement || project.description || "This project addresses a specific problem in the market."}
                    </p>
                  </div>
                  
                  <div className="bg-black/70 p-4 rounded-md border border-netflix-red/10 text-white">
                    <h3 className="text-lg font-semibold mb-2 flex items-center text-netflix-red">
                      <span className="h-8 w-8 rounded-full bg-netflix-red/20 flex items-center justify-center mr-2">
                        <Users className="h-4 w-4 text-netflix-red" />
                      </span>
                      Target Users
                    </h3>
                    <p className="text-gray-300 break-words">
                      {productDetails?.target_audience || "People who needed a solution to efficiently manage their tasks and improve productivity."}
                    </p>
                  </div>
                  
                  <div className="bg-black/70 p-4 rounded-md border border-netflix-red/10 text-white">
                    <h3 className="text-lg font-semibold mb-2 flex items-center text-netflix-red">
                      <span className="h-8 w-8 rounded-full bg-netflix-red/20 flex items-center justify-center mr-2">
                        <Shield className="h-4 w-4 text-netflix-red" />
                      </span>
                      Why Built This?
                    </h3>
                    <p className="text-gray-300 break-words">
                      {productDetails?.development_challenges || "The main reason for building this project was to create an intuitive interface while maintaining powerful features."}
                    </p>
                  </div>
                </div>
              </AccordionSection>
              
              <AccordionSection 
                title="The Solution" 
                icon={<Lightbulb className="h-5 w-5 text-white" />} 
                id="solution"
              >
                <div className="space-y-4">
                  <div className="bg-black/70 p-4 rounded-md border border-netflix-red/10 text-white">
                    <h3 className="text-lg font-semibold mb-2 flex items-center text-netflix-red">
                      Idea
                    </h3>
                    <p className="text-gray-300 break-words">
                      {productDetails?.solution_description || `${project.title} provides a comprehensive solution with a user-friendly interface and powerful features.`}
                    </p>
                  </div>
                  
                  <div className="bg-black/70 p-4 rounded-md border border-netflix-red/10 text-white">
                    <h3 className="text-lg font-semibold mb-2 flex items-center text-netflix-red">
                      Future Plans
                    </h3>
                    <p className="text-gray-300 break-words">
                      {productDetails?.future_roadmap || "The solution is continuously evolving with new features planned for future releases."}
                    </p>
                  </div>
                </div>
              </AccordionSection>
              
              <AccordionSection 
                title="Key Features" 
                icon={<PanelTopOpen className="h-5 w-5 text-white" />} 
                id="features"
              >
                <div className="bg-black/70 p-4 rounded-md border border-netflix-red/10 text-white">
                  <p className="text-gray-300 break-words">
                    {productDetails?.key_features?.join('. ') || "This project is designed to provide a comprehensive and intuitive solution to its target users. The key features are carefully crafted to address the specific needs and challenges identified in the problem statement."}
                  </p>
                </div>
              </AccordionSection>
              
              <AccordionSection 
                title="Tools & Technologies" 
                icon={<Wrench className="h-5 w-5 text-white" />} 
                id="tools"
              >
                {productDetails?.technical_details && (
                  <div className="mb-4">
                    <h3 className="text-lg font-semibold mb-2 text-netflix-red">Technical Overview</h3>
                    <p className="text-gray-300 mb-4 break-words">{productDetails.technical_details}</p>
                  </div>
                )}
                
                {project.tags && project.tags.length > 0 ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {project.tags.map((tag, index) => (
                      <div 
                        key={index}
                        className="bg-black/70 border border-netflix-red/10 p-3 rounded-md flex items-center gap-3"
                      >
                        <div className="h-8 w-8 rounded-full bg-netflix-red/20 flex items-center justify-center">
                          <Wrench className="h-4 w-4 text-netflix-red" />
                        </div>
                        <span className="text-gray-200">{tag}</span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-400 italic">No technology tags available for this project.</p>
                )}
              </AccordionSection>
            </div>
          ) : (
            <div className="max-w-3xl mx-auto">
              <Tabs 
                defaultValue="problem" 
                value={activeTab}
                onValueChange={handleTabChange}
                className="w-full"
              >
                <div className="relative">
                  <TabsList className="w-full max-w-2xl mx-auto mb-8 grid grid-cols-4 bg-black border border-netflix-red/20 p-1 rounded-md">
                    <TabsTrigger 
                      value="problem" 
                      className="data-[state=active]:bg-netflix-red data-[state=active]:text-white rounded-sm relative z-10 text-white"
                    >
                      <AlertCircle className="mr-2 h-4 w-4" />
                      Problem
                    </TabsTrigger>
                    <TabsTrigger 
                      value="solution" 
                      className="data-[state=active]:bg-netflix-red data-[state=active]:text-white rounded-sm relative z-10 text-white"
                    >
                      <Lightbulb className="mr-2 h-4 w-4" />
                      Solution
                    </TabsTrigger>
                    <TabsTrigger 
                      value="features" 
                      className="data-[state=active]:bg-netflix-red data-[state=active]:text-white rounded-sm relative z-10 text-white"
                    >
                      <PanelTopOpen className="mr-2 h-4 w-4" />
                      Features
                    </TabsTrigger>
                    <TabsTrigger 
                      value="tools" 
                      className="data-[state=active]:bg-netflix-red data-[state=active]:text-white rounded-sm relative z-10 text-white"
                    >
                      <Wrench className="mr-2 h-4 w-4" />
                      Tools
                    </TabsTrigger>
                  </TabsList>
                </div>
                
                <TabsContent value="problem" className="space-y-6">
                  <Card className="bg-black border border-netflix-red/20 overflow-hidden rounded-md">
                    <div className="bg-gradient-to-r from-netflix-red/10 to-transparent p-6">
                      <div className="flex items-center">
                        <div className="mr-4 h-10 w-10 rounded-full flex items-center justify-center bg-netflix-red/30">
                          <AlertCircle className="h-5 w-5 text-white" />
                        </div>
                        <div>
                          <h2 className="text-2xl font-bold mb-1 text-white">The Problem</h2>
                          <p className="text-gray-400">What needed to be solved</p>
                        </div>
                      </div>
                    </div>
                    <CardContent className="pt-6">
                      <div className="space-y-6">
                        <div className="bg-black/70 p-6 rounded-md border border-netflix-red/10 text-white">
                          <h3 className="text-lg font-semibold mb-2 flex items-center text-netflix-red">
                            <span className="h-8 w-8 rounded-full bg-netflix-red/20 flex items-center justify-center mr-2">
                              <Users className="h-4 w-4 text-netflix-red" />
                            </span>
                            Problem Statement
                          </h3>
                          <p className="text-gray-300 break-words">
                            {productDetails?.problem_statement || project.description || "This project addresses a specific problem in the market."}
                          </p>
                        </div>
                        
                        <div className="bg-black/70 p-6 rounded-md border border-netflix-red/10 text-white">
                          <h3 className="text-lg font-semibold mb-2 flex items-center text-netflix-red">
                            <span className="h-8 w-8 rounded-full bg-netflix-red/20 flex items-center justify-center mr-2">
                              <Users className="h-4 w-4 text-netflix-red" />
                            </span>
                            Target Users
                          </h3>
                          <p className="text-gray-300 break-words">
                            {productDetails?.target_audience || "People who needed a solution to efficiently manage their tasks and improve productivity."}
                          </p>
                        </div>
                        
                        <div className="bg-black/70 p-6 rounded-md border border-netflix-red/10 text-white">
                          <h3 className="text-lg font-semibold mb-2 flex items-center text-netflix-red">
                            <span className="h-8 w-8 rounded-full bg-netflix-red/20 flex items-center justify-center mr-2">
                              <Shield className="h-4 w-4 text-netflix-red" />
                            </span>
                            Why Built This?
                          </h3>
                          <p className="text-gray-300 break-words">
                            {productDetails?.development_challenges || "The main reason for building this project was to create an intuitive interface while maintaining powerful features."}
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>
                
                <TabsContent value="solution" className="space-y-6">
                  <Card className="bg-black border border-netflix-red/20 overflow-hidden rounded-md">
                    <div className="bg-gradient-to-r from-netflix-red/10 to-transparent p-6">
                      <div className="flex items-center">
                        <div className="mr-4 h-10 w-10 rounded-full flex items-center justify-center bg-netflix-red/30">
                          <Lightbulb className="h-5 w-5 text-white" />
                        </div>
                        <div>
                          <h2 className="text-2xl font-bold mb-1 text-white">The Solution</h2>
                          <p className="text-gray-400">How we approached it</p>
                        </div>
                      </div>
                    </div>
                    <CardContent className="pt-6">
                      <div className="space-y-6">
                        <div className="bg-black/70 p-6 rounded-md border border-netflix-red/10 text-white">
                          <h3 className="text-lg font-semibold mb-2 flex items-center text-netflix-red">
                            Idea
                          </h3>
                          <p className="text-gray-300 break-words">
                            {productDetails?.solution_description || `${project.title} provides a comprehensive solution with a user-friendly interface and powerful features.`}
                          </p>
                        </div>
                        
                        <div className="bg-black/70 p-6 rounded-md border border-netflix-red/10 text-white">
                          <h3 className="text-lg font-semibold mb-2 flex items-center text-netflix-red">
                            Future Plans
                          </h3>
                          <p className="text-gray-300 break-words">
                            {productDetails?.future_roadmap || "The solution is continuously evolving with new features planned for future releases."}
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>
                
                <TabsContent value="features" className="space-y-6">
                  <Card className="bg-black border border-netflix-red/20 overflow-hidden rounded-md">
                    <div className="bg-gradient-to-r from-netflix-red/10 to-transparent p-6">
                      <div className="flex items-center">
                        <div className="mr-4 h-10 w-10 rounded-full flex items-center justify-center bg-netflix-red/30">
                          <PanelTopOpen className="h-5 w-5 text-white" />
                        </div>
                        <div>
                          <h2 className="text-2xl font-bold mb-1 text-white">Key Features</h2>
                          <p className="text-gray-400">What makes it special</p>
                        </div>
                      </div>
                    </div>
                    <CardContent className="pt-6">
                      <div className="bg-black/70 p-6 rounded-md border border-netflix-red/10 text-white">
                        <p className="text-gray-300 break-words">
                          {productDetails?.key_features?.join('. ') || "This project is designed to provide a comprehensive and intuitive solution to its target users. The key features are carefully crafted to address the specific needs and challenges identified in the problem statement."}
                        </p>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>
                
                <TabsContent value="tools" className="space-y-6">
                  <Card className="bg-black border border-netflix-red/20 overflow-hidden rounded-md">
                    <div className="bg-gradient-to-r from-netflix-red/10 to-transparent p-6">
                      <div className="flex items-center">
                        <div className="mr-4 h-10 w-10 rounded-full flex items-center justify-center bg-netflix-red/30">
                          <Wrench className="h-5 w-5 text-white" />
                        </div>
                        <div>
                          <h2 className="text-2xl font-bold mb-1 text-white">Tools & Technologies</h2>
                          <p className="text-gray-400">What powers this project</p>
                        </div>
                      </div>
                    </div>
                    <CardContent className="pt-6">
                      {productDetails?.technical_details && (
                        <div className="mb-6">
                          <h3 className="text-lg font-semibold mb-2 text-netflix-red">Technical Overview</h3>
                          <p className="text-gray-300 mb-4 break-words">{productDetails.technical_details}</p>
                        </div>
                      )}
                      
                      {project.tags && project.tags.length > 0 ? (
                        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                          {project.tags.map((tag, index) => (
                            <div 
                              key={index}
                              className="bg-black/70 border border-netflix-red/10 p-4 rounded-md flex items-center gap-3"
                            >
                              <div className="h-8 w-8 rounded-full bg-netflix-red/20 flex items-center justify-center">
                                <Wrench className="h-4 w-4 text-netflix-red" />
                              </div>
                              <span className="text-gray-200">{tag}</span>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <p className="text-gray-400 italic">No technology tags available for this project.</p>
                      )}
                    </CardContent>
                  </Card>
                </TabsContent>
              </Tabs>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;
