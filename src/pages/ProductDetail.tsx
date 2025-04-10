
import React, { useEffect, useState, useRef } from 'react';
import { useParams, useLocation, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Project } from '@/data/projects';
import { ProductItem, CategoryItem } from '@/integrations/supabase/types/portfolio';
import { toast } from '@/hooks/use-toast';
import { 
  ArrowLeft, 
  ExternalLink, 
  Github, 
  Play, 
  Calendar, 
  Tag, 
  Check, 
  AlertCircle,
  Lightbulb,
  PanelTopOpen,
  Wrench,
  Target,
  Users,
  Shield,
  Image,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import Navbar from '@/components/Navbar';

// Define an extended type that includes categories
type ProductWithCategories = ProductItem & {
  categories?: CategoryItem[];
};

const ProductDetail = () => {
  const { id } = useParams<{ id: string }>();
  const location = useLocation();
  const navigate = useNavigate();
  const [isVideoPlaying, setIsVideoPlaying] = useState(false);
  const [activeTab, setActiveTab] = useState('problem');
  const topRef = useRef<HTMLDivElement>(null);
  
  // Try to get project from location state first
  const projectFromState = location.state?.project as Project & ProductWithCategories;
  const [project, setProject] = useState<(Project & ProductWithCategories) | null>(projectFromState || null);
  
  // Fetch product data if not available in location state
  const { data: fetchedProduct, isLoading, error } = useQuery({
    queryKey: ['product', id],
    queryFn: async () => {
      if (id === 'detail' || isNaN(Number(id))) {
        throw new Error('Invalid product ID');
      }
      
      // Enhanced query to also fetch the categories
      const { data, error } = await supabase
        .from('Products')
        .select('*')
        .eq('id', Number(id))
        .single();
      
      if (error) {
        throw error;
      }
      
      // Explicitly define the return type to include categories
      const productWithCategories = data as ProductWithCategories;
      
      // Fetch categories for this product
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

  // Scroll to top when component mounts
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

  const formatDate = (dateString: string) => {
    if (!dateString) return "N/A";
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
  };

  const handleTabChange = (value: string) => {
    setActiveTab(value);
  };

  // Sample images for Product Images section - use thumbnail and potentially future gallery images
  const productImages = [
    project.image || 'https://images.unsplash.com/photo-1488590528505-98d2b5aba04b?auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1531297484001-80022131f5a1?auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&q=80',
  ];

  // Display categories if available
  const categoryTags = project.categories ? project.categories.map(cat => cat.name).join(', ') : '';

  return (
    <div className="min-h-screen bg-black text-white" ref={topRef}>
      <Navbar />
      
      {/* Hero Section with Back Button */}
      <div className="relative w-full pt-16">
        <Button 
          variant="netflixOutline" 
          className="absolute top-20 left-4 z-50" 
          onClick={handleBackClick}
        >
          <ArrowLeft className="text-netflix-red" />
          Back
        </Button>
        
        {/* Hero Image / Video Player */}
        <div className="relative w-full h-[50vh] lg:h-[60vh]">
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
          
          {/* Hero Content Overlay */}
          <div className="absolute bottom-0 left-0 w-full p-8 z-20">
            <div className="container mx-auto">
              <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
                <div className="max-w-3xl">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-netflix-red text-sm font-medium tracking-wider">FEATURED PROJECT</span>
                  </div>
                  
                  <h1 className="text-4xl md:text-5xl font-bold mb-2 text-white">{project.title}</h1>
                  <p className="text-xl text-gray-300 mb-4 max-w-2xl font-medium">{project.description}</p>
                  
                  {/* Quick Stats */}
                  <div className="flex flex-wrap items-center gap-4 text-sm">
                    {project.created_at && (
                      <div className="flex items-center bg-black/60 px-3 py-1 rounded-full border border-netflix-red/20 text-white">
                        <Calendar size={14} className="mr-1 text-netflix-red" />
                        {formatDate(project.created_at)}
                      </div>
                    )}
                    {project.categories && project.categories.length > 0 && (
                      <div className="flex items-center bg-black/60 px-3 py-1 rounded-full border border-netflix-red/20 text-white">
                        <Tag size={14} className="mr-1 text-netflix-red" />
                        {project.categories.length} {project.categories.length === 1 ? 'Category' : 'Categories'}
                      </div>
                    )}
                    {project.tags && project.tags.length > 0 && (
                      <div className="flex items-center bg-black/60 px-3 py-1 rounded-full border border-netflix-red/20 text-white">
                        <Tag size={14} className="mr-1 text-netflix-red" />
                        {project.tags.length} {project.tags.length === 1 ? 'Tag' : 'Tags'}
                      </div>
                    )}
                    <div className="flex items-center bg-black/60 px-3 py-1 rounded-full border border-netflix-red/20 text-white">
                      <Check size={14} className="mr-1 text-gray-400" />
                      Live
                    </div>
                  </div>
                </div>
                
                <div className="flex space-x-3">
                  {project.videoUrl && (
                    <Button 
                      variant="netflix"
                      className="font-medium" 
                      onClick={handlePlayVideo}
                    >
                      <Play size={18} />
                      Watch Demo
                    </Button>
                  )}
                  
                  {project.productLink && (
                    <Button
                      variant="netflixOutline"
                      className="border-netflix-red" 
                      onClick={() => window.open(project.productLink, '_blank')}
                    >
                      <ExternalLink size={18} />
                      Visit Project
                    </Button>
                  )}
                  
                  {project.github_link && (
                    <Button
                      variant="netflixOutline"
                      className="border-netflix-red" 
                      onClick={() => window.open(project.github_link, '_blank')}
                    >
                      <Github size={18} />
                      View Code
                    </Button>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Main Content with Tabs */}
      <div className="container mx-auto py-6 px-4">
        {/* Product Images Section */}
        <div className="mb-8">
          <div className="flex items-center mb-4">
            <div className="mr-4 h-10 w-10 rounded-full flex items-center justify-center bg-netflix-red/30">
              <Image className="h-5 w-5 text-white" />
            </div>
            <h2 className="text-2xl font-bold text-white">Product Images</h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
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
        
        {/* Categories section - Show if categories exist */}
        {project.categories && project.categories.length > 0 && (
          <div className="mb-8">
            <div className="flex items-center mb-4">
              <div className="mr-4 h-10 w-10 rounded-full flex items-center justify-center bg-netflix-red/30">
                <Tag className="h-5 w-5 text-white" />
              </div>
              <h2 className="text-2xl font-bold text-white">Categories</h2>
            </div>
            
            <div className="flex flex-wrap gap-2">
              {project.categories.map((category) => (
                <span 
                  key={category.id} 
                  className="px-3 py-1 bg-netflix-red/10 text-white border border-netflix-red/30 rounded-full"
                >
                  {category.name}
                </span>
              ))}
            </div>
          </div>
        )}
        
        {/* Tabs */}
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
                <span className="hidden sm:inline">Problem</span>
              </TabsTrigger>
              <TabsTrigger 
                value="solution" 
                className="data-[state=active]:bg-netflix-red data-[state=active]:text-white rounded-sm relative z-10 text-white"
              >
                <Lightbulb className="mr-2 h-4 w-4" />
                <span className="hidden sm:inline">Solution</span>
              </TabsTrigger>
              <TabsTrigger 
                value="features" 
                className="data-[state=active]:bg-netflix-red data-[state=active]:text-white rounded-sm relative z-10 text-white"
              >
                <PanelTopOpen className="mr-2 h-4 w-4" />
                <span className="hidden sm:inline">Features</span>
              </TabsTrigger>
              <TabsTrigger 
                value="tools" 
                className="data-[state=active]:bg-netflix-red data-[state=active]:text-white rounded-sm relative z-10 text-white"
              >
                <Wrench className="mr-2 h-4 w-4" />
                <span className="hidden sm:inline">Tools</span>
              </TabsTrigger>
            </TabsList>
          </div>
          
          {/* Problem Tab - Modified Content */}
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
                        <Target className="h-4 w-4 text-netflix-red" />
                      </span>
                      Problem Statement
                    </h3>
                    <p className="text-gray-300">
                      {project.description || "This project addresses a specific problem in the market."}
                    </p>
                  </div>
                  
                  <div className="bg-black/70 p-6 rounded-md border border-netflix-red/10 text-white">
                    <h3 className="text-lg font-semibold mb-2 flex items-center text-netflix-red">
                      <span className="h-8 w-8 rounded-full bg-netflix-red/20 flex items-center justify-center mr-2">
                        <Users className="h-4 w-4 text-netflix-red" />
                      </span>
                      Target Users
                    </h3>
                    <p className="text-gray-300">
                      People who needed a solution to efficiently manage their tasks and improve productivity.
                    </p>
                  </div>
                  
                  <div className="bg-black/70 p-6 rounded-md border border-netflix-red/10 text-white">
                    <h3 className="text-lg font-semibold mb-2 flex items-center text-netflix-red">
                      <span className="h-8 w-8 rounded-full bg-netflix-red/20 flex items-center justify-center mr-2">
                        <Shield className="h-4 w-4 text-netflix-red" />
                      </span>
                      Why Built This?
                    </h3>
                    <p className="text-gray-300">
                      The main reason for building this project was to create an intuitive interface while maintaining powerful features.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          {/* Solution Tab - Simplified Content */}
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
                    <p className="text-gray-300">
                      {project.title} provides a comprehensive solution with a user-friendly interface and powerful features.
                    </p>
                  </div>
                  
                  <div className="bg-black/70 p-6 rounded-md border border-netflix-red/10 text-white">
                    <h3 className="text-lg font-semibold mb-2 flex items-center text-netflix-red">
                      Solution
                    </h3>
                    <p className="text-gray-300">
                      The solution successfully addresses the identified problems and provides users with an efficient tool.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          {/* Features Tab */}
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
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="bg-black/70 border border-netflix-red/10 p-5 rounded-md hover:bg-black/90 transition-all duration-300 netflix-shadow">
                    <div className="h-12 w-12 bg-netflix-red rounded-md flex items-center justify-center mb-4">
                      <Check className="text-black" size={24} />
                    </div>
                    <h3 className="text-lg font-semibold mb-2 text-netflix-red netflix-text">Feature 1</h3>
                    <p className="text-gray-300">Detailed description of the first main feature.</p>
                  </div>
                  
                  <div className="bg-black/70 border border-netflix-red/10 p-5 rounded-md hover:bg-black/90 transition-all duration-300 netflix-shadow">
                    <div className="h-12 w-12 bg-netflix-red rounded-md flex items-center justify-center mb-4">
                      <Check className="text-black" size={24} />
                    </div>
                    <h3 className="text-lg font-semibold mb-2 text-netflix-red netflix-text">Feature 2</h3>
                    <p className="text-gray-300">Detailed description of the second main feature.</p>
                  </div>
                  
                  <div className="bg-black/70 border border-netflix-red/10 p-5 rounded-md hover:bg-black/90 transition-all duration-300 netflix-shadow">
                    <div className="h-12 w-12 bg-netflix-red rounded-md flex items-center justify-center mb-4">
                      <Check className="text-black" size={24} />
                    </div>
                    <h3 className="text-lg font-semibold mb-2 text-netflix-red netflix-text">Feature 3</h3>
                    <p className="text-gray-300">Detailed description of the third main feature.</p>
                  </div>
                  
                  <div className="bg-black/70 border border-netflix-red/10 p-5 rounded-md hover:bg-black/90 transition-all duration-300 netflix-shadow">
                    <div className="h-12 w-12 bg-netflix-red rounded-md flex items-center justify-center mb-4">
                      <Check className="text-black" size={24} />
                    </div>
                    <h3 className="text-lg font-semibold mb-2 text-netflix-red netflix-text">Feature 4</h3>
                    <p className="text-gray-300">Detailed description of the fourth main feature.</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          {/* Tools Tab - Show tags information from the database */}
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
                {project.tags && project.tags.length > 0 ? (
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
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
    </div>
  );
};

export default ProductDetail;
