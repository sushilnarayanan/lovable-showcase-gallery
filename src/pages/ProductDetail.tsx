
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
      <div className="min-h-screen bg-modern-dark text-white flex items-center justify-center">
        <div className="relative animate-glow-pulse p-4 rounded-full">
          <div className="animate-spin h-12 w-12 border-4 border-modern-accent border-t-transparent rounded-full"></div>
          <div className="absolute top-0 left-0 w-full h-full bg-modern-accent/20 rounded-full filter blur-xl animate-ping-slow"></div>
        </div>
      </div>
    );
  }

  if (!project) {
    return (
      <div className="min-h-screen bg-modern-dark text-white flex flex-col items-center justify-center">
        <div className="text-2xl mb-4 modern-gradient-text font-bold">Product not found</div>
        <Button onClick={() => navigate('/')} className="modern-glassmorphism bg-modern-accent hover:bg-modern-accent/90 text-white shadow-neon hover:shadow-neon-hover">
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
    <div className="min-h-screen bg-modern-dark text-modern-text overflow-x-hidden">
      <Navbar />
      
      {/* Hero Section with Back Button */}
      <div className="relative w-full">
        <Button 
          variant="ghost" 
          className="absolute top-4 left-4 z-50 bg-modern-card/20 backdrop-blur-md hover:bg-modern-accent/30 hover:scale-105 transition-all duration-300 border border-modern-border" 
          onClick={handleBackClick}
        >
          <ArrowLeft className="mr-2 text-modern-accent" />
          Back
        </Button>
        
        {/* Hero Image / Video Player */}
        <div className="relative w-full h-[40vh] lg:h-[50vh]">
          {isVideoPlaying && project.videoUrl ? (
            <div className="absolute inset-0 bg-black z-40">
              <div className="relative w-full h-full">
                <Button 
                  className="absolute top-4 right-4 z-50 bg-modern-card/40 hover:bg-modern-card/80 backdrop-blur-md border border-modern-border" 
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
              <div className="absolute inset-0 bg-gradient-to-r from-modern-dark/80 to-black/30 opacity-70 z-10"></div>
              <img 
                src={project.image || '/placeholder.svg'} 
                alt={project.title}
                className="w-full h-full object-cover"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = '/placeholder.svg';
                }}
              />
              <div className="absolute inset-0 bg-gradient-to-b from-transparent to-modern-dark z-20" />
              
              {/* Overlay pattern - inspired by the image */}
              <div className="absolute inset-0 z-5 opacity-20" 
                   style={{backgroundImage: "url('data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%239C92AC' fill-opacity='0.2'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")}}>
              </div>
            </>
          )}
          
          {/* Hero Content Overlay */}
          <div className="absolute bottom-0 left-0 w-full p-8 z-20">
            <div className="container mx-auto">
              <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
                <div className="max-w-3xl section-slide-in">
                  <div className="flex items-center gap-2 mb-1">
                    <div className="h-2 w-2 rounded-full bg-modern-accent shadow-neon animate-ping-slow"></div>
                    <span className="text-modern-accent text-sm font-medium tracking-wider">FEATURED PROJECT</span>
                  </div>
                  
                  <h1 className="text-4xl md:text-5xl font-bold mb-2 text-shadow modern-gradient-text">{project.title}</h1>
                  
                  {/* Tagline with updated styling */}
                  <p className="text-xl text-modern-subtext mb-4 max-w-2xl">{project.description}</p>
                  
                  {/* Quick Stats */}
                  <div className="flex flex-wrap items-center gap-4 text-sm">
                    {project.created_at && (
                      <div className="flex items-center modern-glassmorphism px-3 py-1 rounded-full pop-in" style={{animationDelay: '0.1s'}}>
                        <Calendar size={14} className="mr-1 text-modern-accent" />
                        {formatDate(project.created_at)}
                      </div>
                    )}
                    {project.tags && project.tags.length > 0 && (
                      <div className="flex items-center modern-glassmorphism px-3 py-1 rounded-full pop-in" style={{animationDelay: '0.2s'}}>
                        <Tag size={14} className="mr-1 text-modern-accent" />
                        {project.tags.length} Tags
                      </div>
                    )}
                    <div className="flex items-center modern-glassmorphism px-3 py-1 rounded-full pop-in" style={{animationDelay: '0.3s'}}>
                      <Check size={14} className="mr-1 text-modern-secondary" />
                      Live
                    </div>
                  </div>
                </div>
                
                <div className="flex space-x-3 section-slide-in">
                  {project.videoUrl && (
                    <Button 
                      className="bg-modern-accent hover:bg-modern-accent/90 text-white font-medium px-6 py-2 flex items-center hover:scale-105 transition-all duration-300 shadow-neon hover:shadow-neon-hover border border-modern-accent/50 rounded-xl" 
                      onClick={handlePlayVideo}
                    >
                      <div className="absolute -inset-0.5 rounded-xl opacity-20 blur-sm bg-modern-accent group-hover:opacity-100 transition duration-500"></div>
                      <Play className="mr-2 animate-pulse" size={18} />
                      Watch Demo
                    </Button>
                  )}
                  
                  {project.productLink && (
                    <Button
                      variant="outline"
                      className="border-modern-border hover:border-modern-accent text-white hover:scale-105 transition-all duration-300 backdrop-blur-sm rounded-xl bg-modern-card/30" 
                      onClick={() => window.open(project.productLink, '_blank')}
                    >
                      <ExternalLink className="mr-2 text-modern-secondary" size={18} />
                      Visit Project
                    </Button>
                  )}
                  
                  {project.github_link && (
                    <Button
                      variant="outline"
                      className="border-modern-border hover:border-modern-accent text-white hover:scale-105 transition-all duration-300 backdrop-blur-sm rounded-xl bg-modern-card/30" 
                      onClick={() => window.open(project.github_link, '_blank')}
                    >
                      <Github className="mr-2 text-modern-secondary" size={18} />
                      View Code
                    </Button>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Main Content with Tabs - Modern style inspired by the image */}
      <div className="container mx-auto py-6 px-4">
        {/* Author info section - inspired by the image */}
        <div className="mb-8 modern-card p-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <Avatar className="h-16 w-16 border-2 border-modern-accent shadow-neon">
              <AvatarImage src="/lovable-uploads/d9597c68-f658-4b3a-9acf-cc0ec8a567c7.png" />
              <AvatarFallback className="bg-modern-accent text-white">PJ</AvatarFallback>
            </Avatar>
            <div>
              <h3 className="text-lg font-bold flex items-center gap-1">Project Creator <span className="text-modern-secondary">★</span></h3>
              <p className="text-modern-subtext">Created this project with passion and expertise</p>
            </div>
          </div>
          <div className="flex flex-wrap gap-2">
            <div className="modern-tag flex items-center">
              <Globe size={14} className="mr-1 text-modern-secondary" />
              Web App
            </div>
            <div className="modern-tag flex items-center">
              <Users size={14} className="mr-1 text-modern-highlight" />
              Team Project
            </div>
            <div className="modern-tag flex items-center">
              <Award size={14} className="mr-1 text-modern-secondary" />
              Featured
            </div>
          </div>
        </div>
        
        <Tabs 
          defaultValue="problem" 
          value={activeTab}
          onValueChange={handleTabChange}
          className="w-full"
        >
          <div className="relative">
            <TabsList className="w-full max-w-2xl mx-auto mb-8 grid grid-cols-4 modern-glassmorphism p-1 rounded-2xl">
              <TabsTrigger 
                value="problem" 
                className="data-[state=active]:bg-modern-accent data-[state=active]:text-white rounded-xl relative z-10 transition-all duration-300 data-[state=active]:shadow-neon"
              >
                <AlertCircle className="mr-2 h-4 w-4" />
                <span className="hidden sm:inline">Problem</span>
              </TabsTrigger>
              <TabsTrigger 
                value="solution" 
                className="data-[state=active]:bg-modern-accent data-[state=active]:text-white rounded-xl relative z-10 transition-all duration-300 data-[state=active]:shadow-neon"
              >
                <Lightbulb className="mr-2 h-4 w-4" />
                <span className="hidden sm:inline">Solution</span>
              </TabsTrigger>
              <TabsTrigger 
                value="features" 
                className="data-[state=active]:bg-modern-accent data-[state=active]:text-white rounded-xl relative z-10 transition-all duration-300 data-[state=active]:shadow-neon"
              >
                <PanelTopOpen className="mr-2 h-4 w-4" />
                <span className="hidden sm:inline">Features</span>
              </TabsTrigger>
              <TabsTrigger 
                value="tools" 
                className="data-[state=active]:bg-modern-accent data-[state=active]:text-white rounded-xl relative z-10 transition-all duration-300 data-[state=active]:shadow-neon"
              >
                <Wrench className="mr-2 h-4 w-4" />
                <span className="hidden sm:inline">Tools</span>
              </TabsTrigger>
            </TabsList>
          </div>
          
          {/* Problem Tab */}
          <TabsContent value="problem" className="space-y-6">
            <Card className="modern-card border-modern-border overflow-hidden">
              <div className="bg-gradient-to-r from-modern-accent/20 to-transparent p-6">
                <div className="flex items-center">
                  <div className="mr-4 h-10 w-10 rounded-full flex items-center justify-center bg-modern-accent/30 shadow-neon">
                    <AlertCircle className="h-5 w-5 text-white" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold mb-1">The Problem</h2>
                    <p className="text-modern-subtext">What needed to be solved</p>
                  </div>
                </div>
              </div>
              <CardContent className="pt-6">
                <div className="space-y-6 section-slide-in">
                  <div className="bg-modern-card/50 p-6 rounded-xl backdrop-blur-sm border border-modern-border">
                    <h3 className="text-lg font-semibold mb-2 flex items-center">
                      <span className="h-8 w-8 rounded-full bg-modern-accent/20 flex items-center justify-center mr-2">
                        <Target className="h-4 w-4 text-modern-accent" />
                      </span>
                      Problem Statement
                    </h3>
                    <p className="text-modern-subtext">
                      {project.description || "This project addresses a specific problem in the market."}
                    </p>
                  </div>
                  
                  <div className="bg-modern-card/50 p-6 rounded-xl backdrop-blur-sm border border-modern-border">
                    <h3 className="text-lg font-semibold mb-2 flex items-center">
                      <span className="h-8 w-8 rounded-full bg-modern-accent/20 flex items-center justify-center mr-2">
                        <Users className="h-4 w-4 text-modern-accent" />
                      </span>
                      Target Users
                    </h3>
                    <p className="text-modern-subtext">
                      People who needed a solution to efficiently manage their tasks and improve productivity.
                    </p>
                  </div>
                  
                  <div className="bg-modern-card/50 p-6 rounded-xl backdrop-blur-sm border border-modern-border">
                    <h3 className="text-lg font-semibold mb-2 flex items-center">
                      <span className="h-8 w-8 rounded-full bg-modern-accent/20 flex items-center justify-center mr-2">
                        <Shield className="h-4 w-4 text-modern-accent" />
                      </span>
                      Challenges
                    </h3>
                    <p className="text-modern-subtext">
                      The main challenges included creating an intuitive interface while maintaining powerful features.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          {/* Solution Tab */}
          <TabsContent value="solution" className="space-y-6">
            <Card className="modern-card border-modern-border overflow-hidden">
              <div className="bg-gradient-to-r from-modern-accent/20 to-transparent p-6">
                <div className="flex items-center">
                  <div className="mr-4 h-10 w-10 rounded-full flex items-center justify-center bg-modern-accent/30 shadow-neon">
                    <Lightbulb className="h-5 w-5 text-white" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold mb-1">The Solution</h2>
                    <p className="text-modern-subtext">How we approached it</p>
                  </div>
                </div>
              </div>
              <CardContent className="pt-6">
                <div className="space-y-6 section-slide-in">
                  <div className="bg-modern-card/50 p-6 rounded-xl backdrop-blur-sm border border-modern-border">
                    <h3 className="text-lg font-semibold mb-2 flex items-center">
                      <span className="h-8 w-8 rounded-full bg-modern-accent/20 flex items-center justify-center mr-2">
                        <Sparkles className="h-4 w-4 text-modern-secondary" />
                      </span>
                      Our Approach
                    </h3>
                    <p className="text-modern-subtext">
                      {project.title} provides a comprehensive solution with a user-friendly interface and powerful features.
                    </p>
                  </div>
                  
                  <div className="bg-modern-card/50 p-6 rounded-xl backdrop-blur-sm border border-modern-border">
                    <h3 className="text-lg font-semibold mb-2 flex items-center">
                      <span className="h-8 w-8 rounded-full bg-modern-accent/20 flex items-center justify-center mr-2">
                        <Layers className="h-4 w-4 text-modern-secondary" />
                      </span>
                      Key Components
                    </h3>
                    <ul className="space-y-3 text-modern-subtext">
                      {["Intuitive user interface", "Powerful backend processing", "Cross-platform compatibility", "Data security and privacy"].map((item, index) => (
                        <li key={index} className="flex items-start bg-modern-tag/30 p-3 rounded-lg">
                          <ChevronRight className="h-5 w-5 text-modern-secondary mt-0.5 mr-2 flex-shrink-0" />
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                  
                  <div className="bg-modern-card/50 p-6 rounded-xl backdrop-blur-sm border border-modern-border">
                    <h3 className="text-lg font-semibold mb-2 flex items-center">
                      <span className="h-8 w-8 rounded-full bg-modern-accent/20 flex items-center justify-center mr-2">
                        <Check className="h-4 w-4 text-modern-secondary" />
                      </span>
                      Outcome
                    </h3>
                    <p className="text-modern-subtext">
                      The solution successfully addresses the identified problems and provides users with an efficient tool.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            {/* Tags Card */}
            <Card className="modern-card border-modern-border overflow-hidden relative">
              <div className="absolute inset-0 bg-gradient-to-br from-modern-accent/5 to-transparent"></div>
              <div className="p-6 relative z-10">
                <h2 className="text-xl font-bold mb-4 flex items-center">
                  <Tag className="mr-2 h-5 w-5 text-modern-highlight" />
                  Approach Tags
                </h2>
                <div className="flex flex-wrap gap-2 section-slide-in">
                  {project.tags && project.tags.length > 0 ? (
                    project.tags.map((tag, index) => (
                      <span 
                        key={index} 
                        className="px-3 py-1 modern-glassmorphism hover:bg-modern-accent/30 cursor-pointer rounded-full text-sm transition-all hover:scale-105 animate-pop" 
                        style={{ animationDelay: `${index * 100}ms` }}
                      >
                        {tag}
                      </span>
                    ))
                  ) : (
                    <span className="text-modern-subtext">No tags available</span>
                  )}
                </div>
              </div>
            </Card>
          </TabsContent>
          
          {/* Features Tab */}
          <TabsContent value="features" className="space-y-6">
            <Card className="modern-card border-modern-border overflow-hidden">
              <div className="bg-gradient-to-r from-modern-accent/20 to-transparent p-6">
                <div className="flex items-center">
                  <div className="mr-4 h-10 w-10 rounded-full flex items-center justify-center bg-modern-accent/30 shadow-neon">
                    <PanelTopOpen className="h-5 w-5 text-white" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold mb-1">Key Features</h2>
                    <p className="text-modern-subtext">What makes it special</p>
                  </div>
                </div>
              </div>
              <CardContent className="pt-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 section-slide-in">
                  <div className="modern-glassmorphism p-5 rounded-xl hover:bg-modern-card transition-all duration-300 hover:scale-105 hover:shadow-neon group">
                    <div className="h-12 w-12 bg-gradient-to-br from-modern-accent to-modern-highlight/70 rounded-xl flex items-center justify-center mb-4 transition-transform group-hover:rotate-12 duration-300">
                      <Zap className="text-white" size={24} />
                    </div>
                    <h3 className="text-lg font-semibold mb-2 text-modern-accent">Feature 1</h3>
                    <p className="text-modern-subtext">Detailed description of the first main feature.</p>
                  </div>
                  
                  <div className="modern-glassmorphism p-5 rounded-xl hover:bg-modern-card transition-all duration-300 hover:scale-105 hover:shadow-neon group">
                    <div className="h-12 w-12 bg-gradient-to-br from-modern-secondary to-modern-accent/80 rounded-xl flex items-center justify-center mb-4 transition-transform group-hover:rotate-12 duration-300">
                      <Shield className="text-white" size={24} />
                    </div>
                    <h3 className="text-lg font-semibold mb-2 text-modern-secondary">Feature 2</h3>
                    <p className="text-modern-subtext">Detailed description of the second main feature.</p>
                  </div>
                  
                  <div className="modern-glassmorphism p-5 rounded-xl hover:bg-modern-card transition-all duration-300 hover:scale-105 hover:shadow-neon group">
                    <div className="h-12 w-12 bg-gradient-to-br from-modern-highlight to-modern-accent/60 rounded-xl flex items-center justify-center mb-4 transition-transform group-hover:rotate-12 duration-300">
                      <Tag className="text-white" size={24} />
                    </div>
                    <h3 className="text-lg font-semibold mb-2 text-modern-highlight">Feature 3</h3>
                    <p className="text-modern-subtext">Detailed description of the third main feature.</p>
                  </div>
                  
                  <div className="modern-glassmorphism p-5 rounded-xl hover:bg-modern-card transition-all duration-300 hover:scale-105 hover:shadow-neon group">
                    <div className="h-12 w-12 bg-gradient-to-br from-modern-accent/80 to-modern-secondary rounded-xl flex items-center justify-center mb-4 transition-transform group-hover:rotate-12 duration-300">
                      <Calendar className="text-white" size={24} />
                    </div>
                    <h3 className="text-lg font-semibold mb-2 text-modern-accent">Feature 4</h3>
                    <p className="text-modern-subtext">Detailed description of the fourth main feature.</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          {/* Tools Tab */}
          <TabsContent value="tools" className="space-y-6">
            <Card className="modern-card border-modern-border overflow-hidden">
              <div className="bg-gradient-to-r from-modern-accent/20 to-transparent p-6">
                <div className="flex items-center">
                  <div className="mr-4 h-10 w-10 rounded-full flex items-center justify-center bg-modern-accent/30 shadow-neon">
                    <Wrench className="h-5 w-5 text-white" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold mb-1">Tools & Technologies</h2>
                    <p className="text-modern-subtext">What powers this project</p>
                  </div>
                </div>
              </div>
              <CardContent className="pt-6">
                <div className="space-y-6 section-slide-in">
                  <div className="bg-modern-card/50 p-6 rounded-xl backdrop-blur-sm border border-modern-border">
                    <h3 className="text-lg font-semibold mb-3">Technologies Used</h3>
                    <div className="flex flex-wrap gap-2 mb-4">
                      {["React", "Tailwind CSS", "Supabase", "TypeScript"].map((tool, index) => (
                        <span 
                          key={index} 
                          className="px-3 py-1 modern-glassmorphism hover:bg-modern-accent/30 hover:scale-105 transition-all duration-200 rounded-full text-sm" 
                          style={{ animationDelay: `${index * 100}ms` }}
                        >
                          {tool}
                        </span>
                      ))}
                    </div>
                  </div>
                  
                  <Separator className="bg-modern-border" />
                  
                  <div className="bg-modern-card/50 p-6 rounded-xl backdrop-blur-sm border border-modern-border">
                    <h3 className="text-lg font-semibold mb-3">Development Stack</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="modern-glassmorphism p-4 rounded-xl hover:scale-105 transition-all duration-200 hover:shadow-neon-pink">
                        <h4 className="font-medium mb-2 flex items-center">
                          <span className="h-6 w-6 rounded-full bg-modern-highlight/20 flex items-center justify-center mr-2">
                            <span className="text-xs text-white">FE</span>
                          </span>
                          Frontend
                        </h4>
                        <p className="text-modern-subtext text-sm">React, TypeScript, Tailwind CSS</p>
                      </div>
                      <div className="modern-glassmorphism p-4 rounded-xl hover:scale-105 transition-all duration-200 hover:shadow-neon-green">
                        <h4 className="font-medium mb-2 flex items-center">
                          <span className="h-6 w-6 rounded-full bg-modern-secondary/20 flex items-center justify-center mr-2">
                            <span className="text-xs text-white">BE</span>
                          </span>
                          Backend
                        </h4>
                        <p className="text-modern-subtext text-sm">Node.js, Supabase, PostgreSQL</p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="bg-modern-card/50 p-6 rounded-xl backdrop-blur-sm border border-modern-border">
                    <h3 className="text-lg font-semibold mb-3">Development Tools</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="modern-glassmorphism p-4 rounded-xl hover:scale-105 transition-all duration-200 hover:shadow-neon-pink">
                        <h4 className="font-medium mb-2 flex items-center">
                          <span className="h-6 w-6 rounded-full bg-modern-highlight/20 flex items-center justify-center mr-2">
                            <span className="text-xs text-white">🎨</span>
                          </span>
                          Design
                        </h4>
                        <p className="text-modern-subtext text-sm">Figma, Adobe XD</p>
                      </div>
                      <div className="modern-glassmorphism p-4 rounded-xl hover:scale-105 transition-all duration-200 hover:shadow-neon-green">
                        <h4 className="font-medium mb-2 flex items-center">
                          <span className="h-6 w-6 rounded-full bg-modern-secondary/20 flex items-center justify-center mr-2">
                            <span className="text-xs text-white">🚀</span>
                          </span>
                          Deployment
                        </h4>
                        <p className="text-modern-subtext text-sm">Vercel, GitHub Actions</p>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            {/* Call-to-Action */}
            <Card className="modern-card border-modern-border overflow-hidden relative">
              <div className="absolute inset-0 bg-gradient-to-br from-modern-accent/10 via-modern-highlight/5 to-transparent"></div>
              <div className="bg-gradient-to-r from-modern-accent/20 to-modern-highlight/10 p-6 relative z-10">
                <h2 className="text-xl font-bold mb-2 flex items-center">
                  <Sparkles className="mr-2 h-5 w-5 text-modern-accent animate-pulse" />
                  Try It Now
                </h2>
              </div>
              <CardContent className="pt-6 relative z-10">
                <div className="space-y-4 section-slide-in">
                  {project.productLink && (
                    <Button 
                      className="w-full bg-gradient-to-r from-modern-accent to-modern-highlight hover:from-modern-accent/90 hover:to-modern-highlight/90 text-white hover:scale-[1.02] transition-all duration-300 shadow-neon hover:shadow-neon-hover rounded-xl border border-modern-accent/50" 
                      onClick={() => window.open(project.productLink, '_blank')}
                    >
                      <ExternalLink className="mr-2" size={18} />
                      Visit Live Project
                    </Button>
                  )}
                  
                  {project.github_link && (
                    <Button 
                      variant="outline" 
                      className="w-full border-modern-border hover:border-modern-accent text-white hover:scale-[1.02] transition-all duration-300 modern-glassmorphism rounded-xl" 
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
