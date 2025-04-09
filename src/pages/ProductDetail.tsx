
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
  Clock
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
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

  // Animation for sections
  useEffect(() => {
    // Trigger section fade-in animations when tab changes
    const timer = setTimeout(() => {
      const sections = document.querySelectorAll('.section-fade-in');
      sections.forEach(section => {
        section.classList.remove('section-fade-in');
        void section.offsetWidth; // Trigger reflow
        section.classList.add('section-fade-in');
      });
    }, 50);
    return () => clearTimeout(timer);
  }, [activeTab]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-spotify-dark text-white flex items-center justify-center">
        <div className="animate-pulse-glow p-4 rounded-full">
          <div className="animate-spin h-12 w-12 border-4 border-spotify-green border-t-transparent rounded-full"></div>
        </div>
      </div>
    );
  }

  if (!project) {
    return (
      <div className="min-h-screen bg-spotify-dark text-white flex flex-col items-center justify-center">
        <div className="text-2xl mb-4">Product not found</div>
        <Button onClick={() => navigate('/')} className="glassmorphism bg-spotify-green hover:bg-spotify-green/90 text-white hover-glow">
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
    <div className="min-h-screen bg-spotify-dark text-white overflow-x-hidden">
      <Navbar />
      
      {/* Hero Section with Back Button */}
      <div className="relative w-full">
        <Button 
          variant="ghost" 
          className="absolute top-4 left-4 z-50 hover:bg-white/10 hover:scale-105 transition-transform" 
          onClick={handleBackClick}
        >
          <ArrowLeft className="mr-2" />
          Back
        </Button>
        
        {/* Hero Image / Video Player */}
        <div className="relative w-full h-[40vh] lg:h-[50vh]">
          {isVideoPlaying && project.videoUrl ? (
            <div className="absolute inset-0 bg-black z-40">
              <div className="relative w-full h-full">
                <Button 
                  className="absolute top-4 right-4 z-50 bg-white/10 hover:bg-white/20" 
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
              <div className="absolute inset-0 bg-gradient-to-r from-spotify-dark to-black/30 opacity-60 z-10"></div>
              <img 
                src={project.image || '/placeholder.svg'} 
                alt={project.title}
                className="w-full h-full object-cover"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = '/placeholder.svg';
                }}
              />
              <div className="absolute inset-0 product-hero z-20" />
            </>
          )}
          
          {/* Hero Content Overlay */}
          <div className="absolute bottom-0 left-0 w-full p-8 z-20">
            <div className="container mx-auto">
              <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
                <div className="max-w-3xl section-fade-in">
                  <div className="flex items-center gap-2 mb-1">
                    <div className="h-2 w-2 rounded-full bg-spotify-green animate-ping-slow"></div>
                    <span className="text-spotify-green text-sm font-medium">FEATURED PROJECT</span>
                  </div>
                  
                  <h1 className="text-4xl md:text-5xl font-bold mb-2 text-shadow gradient-text">{project.title}</h1>
                  
                  {/* Tagline */}
                  <p className="text-xl text-white/70 mb-4 max-w-2xl">{project.description}</p>
                  
                  {/* Quick Stats */}
                  <div className="flex flex-wrap items-center gap-4 text-sm text-white/70">
                    {project.created_at && (
                      <div className="flex items-center glassmorphism px-3 py-1 rounded-full">
                        <Calendar size={14} className="mr-1 text-spotify-accent" />
                        {formatDate(project.created_at)}
                      </div>
                    )}
                    {project.tags && project.tags.length > 0 && (
                      <div className="flex items-center glassmorphism px-3 py-1 rounded-full">
                        <Tag size={14} className="mr-1 text-spotify-accent" />
                        {project.tags.length} Tags
                      </div>
                    )}
                    <div className="flex items-center glassmorphism px-3 py-1 rounded-full">
                      <Check size={14} className="mr-1 text-spotify-green" />
                      Live
                    </div>
                  </div>
                </div>
                
                <div className="flex space-x-3 section-fade-in">
                  {project.videoUrl && (
                    <Button 
                      className="bg-spotify-green hover:bg-spotify-green/80 text-white font-medium px-6 py-2 flex items-center hover:scale-105 transition-transform neo-glow" 
                      onClick={handlePlayVideo}
                    >
                      <div className="absolute -inset-1 rounded-lg opacity-30 blur-sm bg-spotify-green group-hover:opacity-100 transition duration-500"></div>
                      <Play className="mr-2 animate-pulse" size={18} />
                      Watch Demo
                    </Button>
                  )}
                  
                  {project.productLink && (
                    <Button
                      variant="outline"
                      className="border-white/20 hover:border-spotify-green text-white hover:scale-105 transition-transform backdrop-blur-sm" 
                      onClick={() => window.open(project.productLink, '_blank')}
                    >
                      <ExternalLink className="mr-2" size={18} />
                      Visit Project
                    </Button>
                  )}
                  
                  {project.github_link && (
                    <Button
                      variant="outline"
                      className="border-white/20 hover:border-spotify-green text-white hover:scale-105 transition-transform backdrop-blur-sm" 
                      onClick={() => window.open(project.github_link, '_blank')}
                    >
                      <Github className="mr-2" size={18} />
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
        <Tabs 
          defaultValue="problem" 
          value={activeTab}
          onValueChange={handleTabChange}
          className="w-full"
        >
          <div className="relative">
            <TabsList className="w-full max-w-2xl mx-auto mb-8 grid grid-cols-4 glassmorphism p-1 rounded-xl">
              <TabsTrigger 
                value="problem" 
                className="data-[state=active]:bg-gradient-to-br data-[state=active]:from-spotify-accent data-[state=active]:to-spotify-accent/70 data-[state=active]:text-white relative z-10 transition-all duration-300"
              >
                <AlertCircle className="mr-2 h-4 w-4" />
                <span className="hidden sm:inline">Problem</span>
              </TabsTrigger>
              <TabsTrigger 
                value="solution" 
                className="data-[state=active]:bg-gradient-to-br data-[state=active]:from-spotify-accent data-[state=active]:to-spotify-accent/70 data-[state=active]:text-white relative z-10 transition-all duration-300"
              >
                <Lightbulb className="mr-2 h-4 w-4" />
                <span className="hidden sm:inline">Solution</span>
              </TabsTrigger>
              <TabsTrigger 
                value="features" 
                className="data-[state=active]:bg-gradient-to-br data-[state=active]:from-spotify-accent data-[state=active]:to-spotify-accent/70 data-[state=active]:text-white relative z-10 transition-all duration-300"
              >
                <PanelTopOpen className="mr-2 h-4 w-4" />
                <span className="hidden sm:inline">Features</span>
              </TabsTrigger>
              <TabsTrigger 
                value="tools" 
                className="data-[state=active]:bg-gradient-to-br data-[state=active]:from-spotify-accent data-[state=active]:to-spotify-accent/70 data-[state=active]:text-white relative z-10 transition-all duration-300"
              >
                <Wrench className="mr-2 h-4 w-4" />
                <span className="hidden sm:inline">Tools</span>
              </TabsTrigger>
            </TabsList>
          </div>
          
          {/* Problem Tab */}
          <TabsContent value="problem" className="space-y-6">
            <div className="gradient-border">
              <Card className="spotify-card overflow-hidden bg-spotify-card border-0">
                <div className="bg-gradient-to-r from-spotify-accent/20 to-transparent p-6">
                  <div className="flex items-center">
                    <div className="mr-4 h-10 w-10 rounded-full flex items-center justify-center bg-spotify-accent/30 animate-pulse-glow">
                      <AlertCircle className="h-5 w-5 text-white" />
                    </div>
                    <div>
                      <h2 className="text-2xl font-bold mb-1">The Problem</h2>
                      <p className="text-white/70">What needed to be solved</p>
                    </div>
                  </div>
                </div>
                <CardContent className="pt-6">
                  <div className="space-y-6 section-fade-in">
                    <div className="bg-spotify-dark/50 p-6 rounded-lg backdrop-blur-sm">
                      <h3 className="text-lg font-semibold mb-2 flex items-center">
                        <span className="h-8 w-8 rounded-full bg-spotify-accent/20 flex items-center justify-center mr-2">
                          <AlertCircle className="h-4 w-4" />
                        </span>
                        Problem Statement
                      </h3>
                      <p className="text-white/70">
                        {project.description || "This project addresses a specific problem in the market."}
                      </p>
                    </div>
                    
                    <div className="bg-spotify-dark/50 p-6 rounded-lg backdrop-blur-sm">
                      <h3 className="text-lg font-semibold mb-2 flex items-center">
                        <span className="h-8 w-8 rounded-full bg-spotify-accent/20 flex items-center justify-center mr-2">
                          <Star className="h-4 w-4" />
                        </span>
                        Target Users
                      </h3>
                      <p className="text-white/70">
                        People who needed a solution to efficiently manage their tasks and improve productivity.
                      </p>
                    </div>
                    
                    <div className="bg-spotify-dark/50 p-6 rounded-lg backdrop-blur-sm">
                      <h3 className="text-lg font-semibold mb-2 flex items-center">
                        <span className="h-8 w-8 rounded-full bg-spotify-accent/20 flex items-center justify-center mr-2">
                          <Clock className="h-4 w-4" />
                        </span>
                        Challenges
                      </h3>
                      <p className="text-white/70">
                        The main challenges included creating an intuitive interface while maintaining powerful features.
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
          
          {/* Solution Tab */}
          <TabsContent value="solution" className="space-y-6">
            <div className="gradient-border">
              <Card className="spotify-card bg-spotify-card border-0">
                <div className="bg-gradient-to-r from-spotify-accent/20 to-transparent p-6">
                  <div className="flex items-center">
                    <div className="mr-4 h-10 w-10 rounded-full flex items-center justify-center bg-spotify-accent/30 animate-pulse-glow">
                      <Lightbulb className="h-5 w-5 text-white" />
                    </div>
                    <div>
                      <h2 className="text-2xl font-bold mb-1">The Solution</h2>
                      <p className="text-white/70">How we approached it</p>
                    </div>
                  </div>
                </div>
                <CardContent className="pt-6">
                  <div className="space-y-6 section-fade-in">
                    <div className="bg-spotify-dark/50 p-6 rounded-lg backdrop-blur-sm">
                      <h3 className="text-lg font-semibold mb-2 flex items-center">
                        <span className="h-8 w-8 rounded-full bg-spotify-accent/20 flex items-center justify-center mr-2">
                          <Sparkles className="h-4 w-4" />
                        </span>
                        Our Approach
                      </h3>
                      <p className="text-white/70">
                        {project.title} provides a comprehensive solution with a user-friendly interface and powerful features.
                      </p>
                    </div>
                    
                    <div className="bg-spotify-dark/50 p-6 rounded-lg backdrop-blur-sm">
                      <h3 className="text-lg font-semibold mb-2 flex items-center">
                        <span className="h-8 w-8 rounded-full bg-spotify-accent/20 flex items-center justify-center mr-2">
                          <Tag className="h-4 w-4" />
                        </span>
                        Key Components
                      </h3>
                      <ul className="space-y-2 text-white/70">
                        {["Intuitive user interface", "Powerful backend processing", "Cross-platform compatibility", "Data security and privacy"].map((item, index) => (
                          <li key={index} className="flex items-start">
                            <ChevronRight className="h-5 w-5 text-spotify-green mt-0.5 mr-2 flex-shrink-0" />
                            <span>{item}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                    
                    <div className="bg-spotify-dark/50 p-6 rounded-lg backdrop-blur-sm">
                      <h3 className="text-lg font-semibold mb-2 flex items-center">
                        <span className="h-8 w-8 rounded-full bg-spotify-accent/20 flex items-center justify-center mr-2">
                          <Check className="h-4 w-4" />
                        </span>
                        Outcome
                      </h3>
                      <p className="text-white/70">
                        The solution successfully addresses the identified problems and provides users with an efficient tool.
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
            
            {/* Tags Card */}
            <Card className="spotify-card overflow-hidden relative">
              <div className="absolute inset-0 bg-gradient-to-br from-spotify-accent/5 to-transparent"></div>
              <div className="p-6 relative z-10">
                <h2 className="text-xl font-bold mb-4 flex items-center">
                  <Tag className="mr-2 h-5 w-5 text-spotify-accent" />
                  Approach Tags
                </h2>
                <div className="flex flex-wrap gap-2 section-fade-in">
                  {project.tags && project.tags.length > 0 ? (
                    project.tags.map((tag, index) => (
                      <span 
                        key={index} 
                        className="px-3 py-1 glassmorphism hover:bg-white/10 cursor-pointer rounded-full text-sm transition-all hover:scale-105 animate-fade-in-up" 
                        style={{ animationDelay: `${index * 100}ms` }}
                      >
                        {tag}
                      </span>
                    ))
                  ) : (
                    <span className="text-white/70">No tags available</span>
                  )}
                </div>
              </div>
            </Card>
          </TabsContent>
          
          {/* Features Tab */}
          <TabsContent value="features" className="space-y-6">
            <div className="gradient-border">
              <Card className="spotify-card bg-spotify-card border-0">
                <div className="bg-gradient-to-r from-spotify-accent/20 to-transparent p-6">
                  <div className="flex items-center">
                    <div className="mr-4 h-10 w-10 rounded-full flex items-center justify-center bg-spotify-accent/30 animate-pulse-glow">
                      <PanelTopOpen className="h-5 w-5 text-white" />
                    </div>
                    <div>
                      <h2 className="text-2xl font-bold mb-1">Key Features</h2>
                      <p className="text-white/70">What makes it special</p>
                    </div>
                  </div>
                </div>
                <CardContent className="pt-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 section-fade-in">
                    <div className="glassmorphism p-5 rounded-lg hover:bg-spotify-hover transition-all duration-300 hover:scale-105 hover-glow group">
                      <div className="h-12 w-12 bg-gradient-to-br from-spotify-green to-spotify-green/70 rounded-xl flex items-center justify-center mb-4 transition-transform group-hover:rotate-12 duration-300">
                        <Check className="text-black" size={24} />
                      </div>
                      <h3 className="text-lg font-semibold mb-2">Feature 1</h3>
                      <p className="text-white/70">Detailed description of the first main feature.</p>
                    </div>
                    
                    <div className="glassmorphism p-5 rounded-lg hover:bg-spotify-hover transition-all duration-300 hover:scale-105 hover-glow group">
                      <div className="h-12 w-12 bg-gradient-to-br from-spotify-green/80 to-spotify-accent rounded-xl flex items-center justify-center mb-4 transition-transform group-hover:rotate-12 duration-300">
                        <Watch className="text-black" size={24} />
                      </div>
                      <h3 className="text-lg font-semibold mb-2">Feature 2</h3>
                      <p className="text-white/70">Detailed description of the second main feature.</p>
                    </div>
                    
                    <div className="glassmorphism p-5 rounded-lg hover:bg-spotify-hover transition-all duration-300 hover:scale-105 hover-glow group">
                      <div className="h-12 w-12 bg-gradient-to-br from-spotify-accent to-spotify-accent/60 rounded-xl flex items-center justify-center mb-4 transition-transform group-hover:rotate-12 duration-300">
                        <Tag className="text-white" size={24} />
                      </div>
                      <h3 className="text-lg font-semibold mb-2">Feature 3</h3>
                      <p className="text-white/70">Detailed description of the third main feature.</p>
                    </div>
                    
                    <div className="glassmorphism p-5 rounded-lg hover:bg-spotify-hover transition-all duration-300 hover:scale-105 hover-glow group">
                      <div className="h-12 w-12 bg-gradient-to-br from-spotify-accent/80 to-spotify-green rounded-xl flex items-center justify-center mb-4 transition-transform group-hover:rotate-12 duration-300">
                        <Calendar className="text-white" size={24} />
                      </div>
                      <h3 className="text-lg font-semibold mb-2">Feature 4</h3>
                      <p className="text-white/70">Detailed description of the fourth main feature.</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
          
          {/* Tools Tab */}
          <TabsContent value="tools" className="space-y-6">
            <div className="gradient-border">
              <Card className="spotify-card bg-spotify-card border-0">
                <div className="bg-gradient-to-r from-spotify-accent/20 to-transparent p-6">
                  <div className="flex items-center">
                    <div className="mr-4 h-10 w-10 rounded-full flex items-center justify-center bg-spotify-accent/30 animate-pulse-glow">
                      <Wrench className="h-5 w-5 text-white" />
                    </div>
                    <div>
                      <h2 className="text-xl font-bold mb-1">Tools & Technologies</h2>
                      <p className="text-white/70">What powers this project</p>
                    </div>
                  </div>
                </div>
                <CardContent className="pt-6">
                  <div className="space-y-6 section-fade-in">
                    <div className="bg-spotify-dark/50 p-6 rounded-lg backdrop-blur-sm">
                      <h3 className="text-lg font-semibold mb-3">Technologies Used</h3>
                      <div className="flex flex-wrap gap-2 mb-4">
                        {["React", "Tailwind CSS", "Supabase", "TypeScript"].map((tool, index) => (
                          <span 
                            key={index} 
                            className="px-3 py-1 glassmorphism hover:bg-white/10 hover:scale-105 transition-all duration-200 rounded-full text-sm" 
                            style={{ animationDelay: `${index * 100}ms` }}
                          >
                            {tool}
                          </span>
                        ))}
                      </div>
                    </div>
                    
                    <Separator className="bg-spotify-border" />
                    
                    <div className="bg-spotify-dark/50 p-6 rounded-lg backdrop-blur-sm">
                      <h3 className="text-lg font-semibold mb-3">Development Stack</h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="glassmorphism p-4 rounded-lg hover:scale-105 transition-all duration-200">
                          <h4 className="font-medium mb-2 flex items-center">
                            <span className="h-6 w-6 rounded-full bg-spotify-accent/20 flex items-center justify-center mr-2">
                              <span className="text-xs text-white">FE</span>
                            </span>
                            Frontend
                          </h4>
                          <p className="text-white/70 text-sm">React, TypeScript, Tailwind CSS</p>
                        </div>
                        <div className="glassmorphism p-4 rounded-lg hover:scale-105 transition-all duration-200">
                          <h4 className="font-medium mb-2 flex items-center">
                            <span className="h-6 w-6 rounded-full bg-spotify-accent/20 flex items-center justify-center mr-2">
                              <span className="text-xs text-white">BE</span>
                            </span>
                            Backend
                          </h4>
                          <p className="text-white/70 text-sm">Node.js, Supabase, PostgreSQL</p>
                        </div>
                      </div>
                    </div>
                    
                    <div className="bg-spotify-dark/50 p-6 rounded-lg backdrop-blur-sm">
                      <h3 className="text-lg font-semibold mb-3">Development Tools</h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="glassmorphism p-4 rounded-lg hover:scale-105 transition-all duration-200">
                          <h4 className="font-medium mb-2 flex items-center">
                            <span className="h-6 w-6 rounded-full bg-spotify-accent/20 flex items-center justify-center mr-2">
                              <span className="text-xs text-white">🎨</span>
                            </span>
                            Design
                          </h4>
                          <p className="text-white/70 text-sm">Figma, Adobe XD</p>
                        </div>
                        <div className="glassmorphism p-4 rounded-lg hover:scale-105 transition-all duration-200">
                          <h4 className="font-medium mb-2 flex items-center">
                            <span className="h-6 w-6 rounded-full bg-spotify-accent/20 flex items-center justify-center mr-2">
                              <span className="text-xs text-white">🚀</span>
                            </span>
                            Deployment
                          </h4>
                          <p className="text-white/70 text-sm">Vercel, GitHub Actions</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
            
            {/* Call-to-Action */}
            <Card className="spotify-card overflow-hidden relative">
              <div className="absolute inset-0 bg-gradient-to-br from-spotify-green/10 via-spotify-accent/10 to-transparent"></div>
              <div className="bg-gradient-to-r from-spotify-green/20 to-spotify-accent/10 p-6 relative z-10">
                <h2 className="text-xl font-bold mb-2 flex items-center">
                  <Sparkles className="mr-2 h-5 w-5 text-spotify-green animate-pulse" />
                  Try It Now
                </h2>
              </div>
              <CardContent className="pt-6 relative z-10">
                <div className="space-y-4 section-fade-in">
                  {project.productLink && (
                    <Button 
                      className="w-full bg-gradient-to-r from-spotify-green to-spotify-green/80 hover:from-spotify-green/90 hover:to-spotify-green/70 text-white hover:scale-[1.02] transition-all duration-300 shadow-lg shadow-spotify-green/20" 
                      onClick={() => window.open(project.productLink, '_blank')}
                    >
                      <ExternalLink className="mr-2" size={18} />
                      Visit Live Project
                    </Button>
                  )}
                  
                  {project.github_link && (
                    <Button 
                      variant="outline" 
                      className="w-full border-white/20 hover:border-spotify-green text-white hover:scale-[1.02] transition-all duration-300 glassmorphism" 
                      onClick={() => window.open(project.github_link, '_blank')}
                    >
                      <Github className="mr-2" size={18} />
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
