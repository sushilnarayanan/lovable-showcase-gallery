
import React, { useEffect, useState } from 'react';
import { useParams, useLocation, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Project } from '@/data/projects';
import { ProductItem } from '@/integrations/supabase/types/portfolio';
import { toast } from '@/hooks/use-toast';
import { 
  ArrowLeft, 
  ExternalLink, 
  Github, 
  Play, 
  Calendar, 
  Tag, 
  Check, 
  Watch,
  AlertCircle,
  Lightbulb,
  PanelTopOpen,
  Wrench,
  ChevronRight,
  Sparkles,
  Star,
  Clock,
  Zap,
  Target,
  Users,
  Layers,
  Code,
  Globe,
  Award,
  Shield
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import Navbar from '@/components/Navbar';

const ProductDetail = () => {
  const { id } = useParams<{ id: string }>();
  const location = useLocation();
  const navigate = useNavigate();
  const [isVideoPlaying, setIsVideoPlaying] = useState(false);
  const [activeTab, setActiveTab] = useState('problem');
  
  // Try to get project from location state first
  const projectFromState = location.state?.project as Project & ProductItem;
  const [project, setProject] = useState<(Project & ProductItem) | null>(projectFromState || null);
  
  // Fetch product data if not available in location state
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
      
      return data as ProductItem;
    },
    enabled: !projectFromState && !!id && id !== 'detail',
  });

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

  // If we have neither state nor a valid ID to fetch, redirect to 404
  useEffect(() => {
    if (!projectFromState && id === 'detail') {
      navigate('/not-found', { replace: true });
    }
  }, [projectFromState, id, navigate]);

  // Animation for sections - Fixed TypeScript error
  useEffect(() => {
    // Trigger section fade-in animations when tab changes
    const timer = setTimeout(() => {
      const sections = document.querySelectorAll('.section-slide-in');
      sections.forEach(section => {
        section.classList.remove('section-slide-in');
        // Fix: Use type assertion to avoid the TypeScript error
        const element = section as HTMLElement;
        void element.offsetWidth; // Trigger reflow
        section.classList.add('section-slide-in');
      });
    }, 50);
    return () => clearTimeout(timer);
  }, [activeTab]);

  if (isLoading) {
    return (
      <div className="min-h-screen animated-gradient-bg text-white flex items-center justify-center">
        <div className="relative animate-pulse-glow p-4 rounded-full">
          <div className="animate-spin h-12 w-12 border-4 border-netflix-red border-t-transparent rounded-full"></div>
          <div className="absolute top-0 left-0 w-full h-full bg-netflix-red/20 rounded-full filter blur-xl animate-ping-slow"></div>
        </div>
      </div>
    );
  }

  if (!project) {
    return (
      <div className="min-h-screen animated-gradient-bg text-white flex flex-col items-center justify-center">
        <div className="text-2xl mb-4 modern-gradient-text font-bold text-glow">Product not found</div>
        <Button onClick={() => navigate('/')} className="bg-netflix-red hover:bg-netflix-red/90 text-white shadow-neon hover:shadow-neon-hover">
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

  return (
    <div className="min-h-screen bg-netflix-black text-netflix-white overflow-x-hidden">
      <Navbar />
      
      {/* Hero Section with Back Button */}
      <div className="relative w-full">
        <Button 
          variant="ghost" 
          className="absolute top-4 left-4 z-50 bg-netflix-black/70 backdrop-blur-md hover:bg-netflix-red/30 hover:scale-105 transition-all duration-300 border border-netflix-red/30 text-white" 
          onClick={handleBackClick}
        >
          <ArrowLeft className="mr-2 text-netflix-red" />
          Back
        </Button>
        
        {/* Hero Image / Video Player */}
        <div className="relative w-full h-[40vh] lg:h-[50vh]">
          {isVideoPlaying && project.videoUrl ? (
            <div className="absolute inset-0 bg-netflix-black z-40">
              <div className="relative w-full h-full">
                <Button 
                  className="absolute top-4 right-4 z-50 bg-netflix-black/70 hover:bg-netflix-black/90 backdrop-blur-md border border-netflix-red/30 text-white" 
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
              <div className="absolute inset-0 bg-gradient-to-r from-netflix-black/90 to-black/70 opacity-90 z-10"></div>
              <img 
                src={project.image || '/placeholder.svg'} 
                alt={project.title}
                className="w-full h-full object-cover brightness-75"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = '/placeholder.svg';
                }}
              />
              <div className="absolute inset-0 bg-gradient-to-b from-transparent to-netflix-black z-20" />
              
              {/* Overlay pattern */}
              <div className="absolute inset-0 z-5 opacity-10 bg-pattern"></div>
              
              {/* Grid overlay */}
              <div className="absolute inset-0 z-15 cyberpunk-grid opacity-10"></div>
            </>
          )}
          
          {/* Hero Content Overlay */}
          <div className="absolute bottom-0 left-0 w-full p-8 z-20">
            <div className="container mx-auto">
              <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
                <div className="max-w-3xl section-slide-in">
                  <div className="flex items-center gap-2 mb-1">
                    <div className="h-2 w-2 rounded-full bg-netflix-red shadow-neon animate-ping-slow"></div>
                    <span className="text-netflix-red text-sm font-medium tracking-wider neon-text">FEATURED PROJECT</span>
                  </div>
                  
                  <h1 className="text-4xl md:text-5xl font-bold mb-2 text-shadow modern-gradient-text">{project.title}</h1>
                  
                  {/* Tagline with updated styling */}
                  <p className="text-xl modern-subtitle-gradient mb-4 max-w-2xl font-medium">{project.description}</p>
                  
                  {/* Quick Stats */}
                  <div className="flex flex-wrap items-center gap-4 text-sm">
                    {project.created_at && (
                      <div className="flex items-center bg-netflix-black/60 backdrop-blur-md px-3 py-1 rounded-full pop-in border border-netflix-red/20 text-white" style={{animationDelay: '0.1s'}}>
                        <Calendar size={14} className="mr-1 text-netflix-red" />
                        {formatDate(project.created_at)}
                      </div>
                    )}
                    {project.tags && project.tags.length > 0 && (
                      <div className="flex items-center bg-netflix-black/60 backdrop-blur-md px-3 py-1 rounded-full pop-in border border-netflix-red/20 text-white" style={{animationDelay: '0.2s'}}>
                        <Tag size={14} className="mr-1 text-netflix-red" />
                        {project.tags.length} Tags
                      </div>
                    )}
                    <div className="flex items-center bg-netflix-black/60 backdrop-blur-md px-3 py-1 rounded-full pop-in border border-netflix-red/20 text-white" style={{animationDelay: '0.3s'}}>
                      <Check size={14} className="mr-1 text-netflix-gray" />
                      Live
                    </div>
                  </div>
                </div>
                
                <div className="flex space-x-3 section-slide-in">
                  {project.videoUrl && (
                    <Button 
                      className="bg-netflix-red hover:bg-netflix-red/80 text-white font-medium px-6 py-2 flex items-center hover:scale-105 transition-all duration-300 shadow-neon hover:shadow-neon-hover border-none rounded-md" 
                      onClick={handlePlayVideo}
                    >
                      <div className="absolute -inset-0.5 rounded-md opacity-20 blur-sm bg-netflix-red group-hover:opacity-100 transition duration-500"></div>
                      <Play className="mr-2 animate-pulse" size={18} />
                      Watch Demo
                    </Button>
                  )}
                  
                  {project.productLink && (
                    <Button
                      variant="outline"
                      className="border-netflix-red/30 hover:border-netflix-red text-white hover:scale-105 transition-all duration-300 backdrop-blur-sm rounded-md bg-netflix-black/60" 
                      onClick={() => window.open(project.productLink, '_blank')}
                    >
                      <ExternalLink className="mr-2 text-netflix-gray" size={18} />
                      Visit Project
                    </Button>
                  )}
                  
                  {project.github_link && (
                    <Button
                      variant="outline"
                      className="border-netflix-red/30 hover:border-netflix-red text-white hover:scale-105 transition-all duration-300 backdrop-blur-sm rounded-md bg-netflix-black/60" 
                      onClick={() => window.open(project.github_link, '_blank')}
                    >
                      <Github className="mr-2 text-netflix-gray" size={18} />
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
        {/* Author info section */}
        <div className="mb-8 bg-netflix-dark/70 backdrop-blur-md border border-netflix-red/20 p-6 rounded-md flex flex-col md:flex-row items-start md:items-center justify-between gap-6 shadow-lg">
          <div className="flex items-center gap-4">
            <Avatar className="h-16 w-16 border-2 border-netflix-red shadow-neon">
              <AvatarImage src="/lovable-uploads/d9597c68-f658-4b3a-9acf-cc0ec8a567c7.png" />
              <AvatarFallback className="bg-netflix-red text-black">PJ</AvatarFallback>
            </Avatar>
            <div>
              <h3 className="text-lg font-bold flex items-center gap-1 text-white">Project Creator <span className="text-netflix-red">★</span></h3>
              <p className="text-netflix-gray">Created this project with passion and expertise</p>
            </div>
          </div>
          <div className="flex flex-wrap gap-2">
            <div className="bg-netflix-black/80 border border-netflix-red/20 px-3 py-1 rounded-full text-sm font-medium text-white flex items-center">
              <Globe size={14} className="mr-1 text-netflix-red" />
              Web App
            </div>
            <div className="bg-netflix-black/80 border border-netflix-red/20 px-3 py-1 rounded-full text-sm font-medium text-white flex items-center">
              <Users size={14} className="mr-1 text-netflix-red" />
              Team Project
            </div>
            <div className="bg-netflix-black/80 border border-netflix-red/20 px-3 py-1 rounded-full text-sm font-medium text-white flex items-center">
              <Award size={14} className="mr-1 text-netflix-red" />
              Featured
            </div>
          </div>
        </div>
        
        {/* Tabs */}
        <Tabs 
          defaultValue="problem" 
          value={activeTab}
          onValueChange={handleTabChange}
          className="w-full"
        >
          <div className="relative">
            <TabsList className="w-full max-w-2xl mx-auto mb-8 grid grid-cols-4 bg-netflix-black/70 backdrop-blur-md border border-netflix-red/20 p-1 rounded-md">
              <TabsTrigger 
                value="problem" 
                className="data-[state=active]:bg-netflix-red data-[state=active]:text-netflix-white rounded-sm relative z-10 transition-all duration-300 data-[state=active]:shadow-neon text-white"
              >
                <AlertCircle className="mr-2 h-4 w-4" />
                <span className="hidden sm:inline">Problem</span>
              </TabsTrigger>
              <TabsTrigger 
                value="solution" 
                className="data-[state=active]:bg-netflix-red data-[state=active]:text-netflix-white rounded-sm relative z-10 transition-all duration-300 data-[state=active]:shadow-neon text-white"
              >
                <Lightbulb className="mr-2 h-4 w-4" />
                <span className="hidden sm:inline">Solution</span>
              </TabsTrigger>
              <TabsTrigger 
                value="features" 
                className="data-[state=active]:bg-netflix-red data-[state=active]:text-netflix-white rounded-sm relative z-10 transition-all duration-300 data-[state=active]:shadow-neon text-white"
              >
                <PanelTopOpen className="mr-2 h-4 w-4" />
                <span className="hidden sm:inline">Features</span>
              </TabsTrigger>
              <TabsTrigger 
                value="tools" 
                className="data-[state=active]:bg-netflix-red data-[state=active]:text-netflix-white rounded-sm relative z-10 transition-all duration-300 data-[state=active]:shadow-neon text-white"
              >
                <Wrench className="mr-2 h-4 w-4" />
                <span className="hidden sm:inline">Tools</span>
              </TabsTrigger>
            </TabsList>
          </div>
          
          {/* Problem Tab */}
          <TabsContent value="problem" className="space-y-6">
            <Card className="bg-netflix-black/70 backdrop-blur-md border border-netflix-red/20 overflow-hidden rounded-md shadow-lg">
              <div className="bg-gradient-to-r from-netflix-red/20 to-transparent p-6">
                <div className="flex items-center">
                  <div className="mr-4 h-10 w-10 rounded-full flex items-center justify-center bg-netflix-red/30 shadow-neon">
                    <AlertCircle className="h-5 w-5 text-white" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold mb-1 text-white">The Problem</h2>
                    <p className="text-netflix-gray">What needed to be solved</p>
                  </div>
                </div>
              </div>
              <CardContent className="pt-6">
                <div className="space-y-6 section-slide-in">
                  <div className="bg-netflix-dark/60 p-6 rounded-md backdrop-blur-sm border border-netflix-red/10 text-white">
                    <h3 className="text-lg font-semibold mb-2 flex items-center text-netflix-red">
                      <span className="h-8 w-8 rounded-full bg-netflix-red/20 flex items-center justify-center mr-2">
                        <Target className="h-4 w-4 text-netflix-red" />
                      </span>
                      Problem Statement
                    </h3>
                    <p className="text-netflix-gray">
                      {project.description || "This project addresses a specific problem in the market."}
                    </p>
                  </div>
                  
                  <div className="bg-netflix-dark/60 p-6 rounded-md backdrop-blur-sm border border-netflix-red/10 text-white">
                    <h3 className="text-lg font-semibold mb-2 flex items-center text-netflix-red">
                      <span className="h-8 w-8 rounded-full bg-netflix-red/20 flex items-center justify-center mr-2">
                        <Users className="h-4 w-4 text-netflix-red" />
                      </span>
                      Target Users
                    </h3>
                    <p className="text-netflix-gray">
                      People who needed a solution to efficiently manage their tasks and improve productivity.
                    </p>
                  </div>
                  
                  <div className="bg-netflix-dark/60 p-6 rounded-md backdrop-blur-sm border border-netflix-red/10 text-white">
                    <h3 className="text-lg font-semibold mb-2 flex items-center text-netflix-red">
                      <span className="h-8 w-8 rounded-full bg-netflix-red/20 flex items-center justify-center mr-2">
                        <Shield className="h-4 w-4 text-netflix-red" />
                      </span>
                      Challenges
                    </h3>
                    <p className="text-netflix-gray">
                      The main challenges included creating an intuitive interface while maintaining powerful features.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          {/* Solution Tab */}
          <TabsContent value="solution" className="space-y-6">
            <Card className="bg-netflix-black/70 backdrop-blur-md border border-netflix-red/20 overflow-hidden rounded-md shadow-lg">
              <div className="bg-gradient-to-r from-netflix-red/20 to-transparent p-6">
                <div className="flex items-center">
                  <div className="mr-4 h-10 w-10 rounded-full flex items-center justify-center bg-netflix-red/30 shadow-neon">
                    <Lightbulb className="h-5 w-5 text-white" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold mb-1 text-white">The Solution</h2>
                    <p className="text-netflix-gray">How we approached it</p>
                  </div>
                </div>
              </div>
              <CardContent className="pt-6">
                <div className="space-y-6 section-slide-in">
                  <div className="bg-netflix-dark/60 p-6 rounded-md backdrop-blur-sm border border-netflix-red/10 text-white">
                    <h3 className="text-lg font-semibold mb-2 flex items-center text-netflix-red">
                      <span className="h-8 w-8 rounded-full bg-netflix-red/20 flex items-center justify-center mr-2">
                        <Sparkles className="h-4 w-4 text-netflix-gray" />
                      </span>
                      Our Approach
                    </h3>
                    <p className="text-netflix-gray">
                      {project.title} provides a comprehensive solution with a user-friendly interface and powerful features.
                    </p>
                  </div>
                  
                  <div className="bg-netflix-dark/60 p-6 rounded-md backdrop-blur-sm border border-netflix-red/10 text-white">
                    <h3 className="text-lg font-semibold mb-2 flex items-center text-netflix-red">
                      <span className="h-8 w-8 rounded-full bg-netflix-red/20 flex items-center justify-center mr-2">
                        <Layers className="h-4 w-4 text-netflix-gray" />
                      </span>
                      Key Components
                    </h3>
                    <ul className="space-y-3">
                      {[
                        "Intuitive user interface", 
                        "Powerful backend processing", 
                        "Cross-platform compatibility", 
                        "Data security and privacy"
                      ].map((item, index) => (
                        <li key={index} className="flex items-start bg-netflix-black/70 p-3 rounded-md border border-netflix-red/10">
                          <ChevronRight className="h-5 w-5 text-netflix-red mt-0.5 mr-2 flex-shrink-0" />
                          <span className="text-netflix-gray">{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                  
                  <div className="bg-netflix-dark/60 p-6 rounded-md backdrop-blur-sm border border-netflix-red/10 text-white">
                    <h3 className="text-lg font-semibold mb-2 flex items-center text-netflix-red">
                      <span className="h-8 w-8 rounded-full bg-netflix-red/20 flex items-center justify-center mr-2">
                        <Check className="h-4 w-4 text-netflix-gray" />
                      </span>
                      Outcome
                    </h3>
                    <p className="text-netflix-gray">
                      The solution successfully addresses the identified problems and provides users with an efficient tool.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            {/* Tags Card */}
            <Card className="bg-netflix-black/70 backdrop-blur-md border border-netflix-red/20 overflow-hidden relative rounded-md shadow-lg">
              <div className="absolute inset-0 bg-gradient-to-br from-netflix-red/5 to-transparent"></div>
              <div className="p-6 relative z-10">
                <h2 className="text-xl font-bold mb-4 flex items-center text-white">
                  <Tag className="mr-2 h-5 w-5 text-netflix-red" />
                  Approach Tags
                </h2>
                <div className="flex flex-wrap gap-2 section-slide-in">
                  {project.tags && project.tags.length > 0 ? (
                    project.tags.map((tag, index) => (
                      <span 
                        key={index} 
                        className="px-3 py-1 bg-netflix-black/80 border border-netflix-red/20 hover:bg-netflix-red/20 cursor-pointer rounded-full text-sm transition-all hover:scale-105 animate-pop text-white" 
                        style={{ animationDelay: `${index * 100}ms` }}
                      >
                        {tag}
                      </span>
                    ))
                  ) : (
                    <span className="text-netflix-gray">No tags available</span>
                  )}
                </div>
              </div>
            </Card>
          </TabsContent>
          
          {/* Features Tab */}
          <TabsContent value="features" className="space-y-6">
            <Card className="bg-netflix-black/70 backdrop-blur-md border border-netflix-red/20 overflow-hidden rounded-md shadow-lg">
              <div className="bg-gradient-to-r from-netflix-red/20 to-transparent p-6">
                <div className="flex items-center">
                  <div className="mr-4 h-10 w-10 rounded-full flex items-center justify-center bg-netflix-red/30 shadow-neon">
                    <PanelTopOpen className="h-5 w-5 text-white" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold mb-1 text-white">Key Features</h2>
                    <p className="text-netflix-gray">What makes it special</p>
                  </div>
                </div>
              </div>
              <CardContent className="pt-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 section-slide-in">
                  <div className="bg-netflix-dark/50 backdrop-blur-md border border-netflix-red/10 p-5 rounded-md hover:bg-netflix-black/90 transition-all duration-300 hover:scale-105 hover:shadow-neon group">
                    <div className="h-12 w-12 bg-gradient-to-br from-netflix-red to-netflix-red/70 rounded-md flex items-center justify-center mb-4 transition-transform group-hover:rotate-12 duration-300">
                      <Zap className="text-black" size={24} />
                    </div>
                    <h3 className="text-lg font-semibold mb-2 text-netflix-red">Feature 1</h3>
                    <p className="text-netflix-gray">Detailed description of the first main feature.</p>
                  </div>
                  
                  <div className="bg-netflix-dark/50 backdrop-blur-md border border-netflix-red/10 p-5 rounded-md hover:bg-netflix-black/90 transition-all duration-300 hover:scale-105 hover:shadow-neon group">
                    <div className="h-12 w-12 bg-gradient-to-br from-netflix-gray to-netflix-red/80 rounded-md flex items-center justify-center mb-4 transition-transform group-hover:rotate-12 duration-300">
                      <Shield className="text-black" size={24} />
                    </div>
                    <h3 className="text-lg font-semibold mb-2 text-netflix-red">Feature 2</h3>
                    <p className="text-netflix-gray">Detailed description of the second main feature.</p>
                  </div>
                  
                  <div className="bg-netflix-dark/50 backdrop-blur-md border border-netflix-red/10 p-5 rounded-md hover:bg-netflix-black/90 transition-all duration-300 hover:scale-105 hover:shadow-neon group">
                    <div className="h-12 w-12 bg-gradient-to-br from-netflix-red to-netflix-gray/60 rounded-md flex items-center justify-center mb-4 transition-transform group-hover:rotate-12 duration-300">
                      <Tag className="text-black" size={24} />
                    </div>
                    <h3 className="text-lg font-semibold mb-2 text-netflix-red">Feature 3</h3>
                    <p className="text-netflix-gray">Detailed description of the third main feature.</p>
                  </div>
                  
                  <div className="bg-netflix-dark/50 backdrop-blur-md border border-netflix-red/10 p-5 rounded-md hover:bg-netflix-black/90 transition-all duration-300 hover:scale-105 hover:shadow-neon group">
                    <div className="h-12 w-12 bg-gradient-to-br from-netflix-red/80 to-netflix-gray rounded-md flex items-center justify-center mb-4 transition-transform group-hover:rotate-12 duration-300">
                      <Calendar className="text-black" size={24} />
                    </div>
                    <h3 className="text-lg font-semibold mb-2 text-netflix-red">Feature 4</h3>
                    <p className="text-netflix-gray">Detailed description of the fourth main feature.</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          {/* Tools Tab */}
          <TabsContent value="tools" className="space-y-6">
            <Card className="bg-netflix-black/70 backdrop-blur-md border border-netflix-red/20 overflow-hidden rounded-md shadow-lg">
              <div className="bg-gradient-to-r from-netflix-red/20 to-transparent p-6">
                <div className="flex items-center">
                  <div className="mr-4 h-10 w-10 rounded-full flex items-center justify-center bg-netflix-red/30 shadow-neon">
                    <Wrench className="h-5 w-5 text-white" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold mb-1 text-white">Tools & Technologies</h2>
                    <p className="text-netflix-gray">What powers this project</p>
                  </div>
                </div>
              </div>
              <CardContent className="pt-6">
                <div className="space-y-6 section-slide-in">
                  <div className="bg-netflix-dark/60 p-6 rounded-md backdrop-blur-sm border border-netflix-red/10">
                    <h3 className="text-lg font-semibold mb-3 text-white">Technologies Used</h3>
                    <div className="flex flex-wrap gap-2 mb-4">
                      {["React", "Tailwind CSS", "Supabase", "TypeScript"].map((tool, index) => (
                        <span 
                          key={index} 
                          className="px-3 py-1 bg-netflix-black/80 border border-netflix-red/20 hover:bg-netflix-red/20 hover:scale-105 transition-all duration-200 rounded-full text-sm text-white" 
                          style={{ animationDelay: `${index * 100}ms` }}
                        >
                          {tool}
                        </span>
                      ))}
                    </div>
                  </div>
                  
                  <Separator className="bg-netflix-red/20" />
                  
                  <div className="bg-netflix-dark/60 p-6 rounded-md backdrop-blur-sm border border-netflix-red/10">
                    <h3 className="text-lg font-semibold mb-3 text-white">Development Stack</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="bg-netflix-black/80 border border-netflix-red/10 p-4 rounded-md hover:scale-105 transition-all duration-200 hover:shadow-neon">
                        <h4 className="font-medium mb-2 flex items-center text-white">
                          <span className="h-6 w-6 rounded-full bg-netflix-red/20 flex items-center justify-center mr-2">
                            <span className="text-xs text-white">FE</span>
                          </span>
                          Frontend
                        </h4>
                        <p className="text-netflix-gray text-sm">React, TypeScript, Tailwind CSS</p>
                      </div>
                      <div className="bg-netflix-black/80 border border-netflix-red/10 p-4 rounded-md hover:scale-105 transition-all duration-200 hover:shadow-neon">
                        <h4 className="font-medium mb-2 flex items-center text-white">
                          <span className="h-6 w-6 rounded-full bg-netflix-gray/20 flex items-center justify-center mr-2">
                            <span className="text-xs text-white">BE</span>
                          </span>
                          Backend
                        </h4>
                        <p className="text-netflix-gray text-sm">Node.js, Supabase, PostgreSQL</p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="bg-netflix-dark/60 p-6 rounded-md backdrop-blur-sm border border-netflix-red/10">
                    <h3 className="text-lg font-semibold mb-3 text-white">Development Tools</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="bg-netflix-black/80 border border-netflix-red/10 p-4 rounded-md hover:scale-105 transition-all duration-200 hover:shadow-neon">
                        <h4 className="font-medium mb-2 flex items-center text-white">
                          <span className="h-6 w-6 rounded-full bg-netflix-red/20 flex items-center justify-center mr-2">
                            <span className="text-xs text-white">🎨</span>
                          </span>
                          Design
                        </h4>
                        <p className="text-netflix-gray text-sm">Figma, Adobe XD</p>
                      </div>
                      <div className="bg-netflix-black/80 border border-netflix-red/10 p-4 rounded-md hover:scale-105 transition-all duration-200 hover:shadow-neon">
                        <h4 className="font-medium mb-2 flex items-center text-white">
                          <span className="h-6 w-6 rounded-full bg-netflix-gray/20 flex items-center justify-center mr-2">
                            <span className="text-xs text-white">🚀</span>
                          </span>
                          Deployment
                        </h4>
                        <p className="text-netflix-gray text-sm">Vercel, GitHub Actions</p>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            {/* Call-to-Action */}
            <Card className="bg-netflix-black/70 backdrop-blur-md border border-netflix-red/20 overflow-hidden relative rounded-md shadow-lg">
              <div className="absolute inset-0 bg-gradient-to-br from-netflix-red/10 via-netflix-gray/5 to-transparent"></div>
              <div className="bg-gradient-to-r from-netflix-red/20 to-netflix-gray/5 p-6 relative z-10">
                <h2 className="text-xl font-bold mb-2 flex items-center text-white">
                  <Sparkles className="mr-2 h-5 w-5 text-netflix-red animate-pulse" />
                  Try It Now
                </h2>
              </div>
              <CardContent className="pt-6 relative z-10">
                <div className="space-y-4 section-slide-in">
                  {project.productLink && (
                    <Button 
                      className="w-full bg-netflix-red hover:bg-netflix-red/90 text-white hover:scale-[1.02] transition-all duration-300 shadow-neon hover:shadow-neon-hover rounded-md border border-netflix-red/50" 
                      onClick={() => window.open(project.productLink, '_blank')}
                    >
                      <ExternalLink className="mr-2" size={18} />
                      Visit Live Project
                    </Button>
                  )}
                  
                  {project.github_link && (
                    <Button 
                      variant="outline" 
                      className="w-full border-netflix-red/30 hover:border-netflix-red text-white hover:scale-[1.02] transition-all duration-300 backdrop-blur-md bg-netflix-black/70 rounded-md" 
                      onClick={() => window.open(project.github_link, '_blank')}
                    >
                      <Github className="mr-2 text-netflix-gray" size={18} />
                      View Source Code
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default ProductDetail;
