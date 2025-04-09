
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
  Wrench, // Replacing Tool with Wrench which is available in lucide-react
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

  if (isLoading) {
    return (
      <div className="min-h-screen bg-spotify-bright-background text-spotify-bright-text flex items-center justify-center">
        <div className="animate-pulse text-2xl">Loading...</div>
      </div>
    );
  }

  if (!project) {
    return (
      <div className="min-h-screen bg-spotify-bright-background text-spotify-bright-text flex flex-col items-center justify-center">
        <div className="text-2xl mb-4">Product not found</div>
        <Button onClick={() => navigate('/')} className="bg-spotify-green hover:bg-spotify-green/90 text-white">
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

  return (
    <div className="min-h-screen bg-spotify-bright-background text-spotify-bright-text">
      <Navbar />
      
      {/* Hero Section with Back Button */}
      <div className="relative w-full">
        <Button 
          variant="ghost" 
          className="absolute top-4 left-4 z-50 hover:bg-black/10 text-spotify-bright-text" 
          onClick={handleBackClick}
        >
          <ArrowLeft className="mr-2" />
          Back
        </Button>
        
        {/* Hero Image / Video Player */}
        <div className="relative w-full h-[40vh] lg:h-[50vh]">
          {isVideoPlaying && project.videoUrl ? (
            <div className="absolute inset-0 bg-spotify-bright-background z-40">
              <div className="relative w-full h-full">
                <Button 
                  className="absolute top-4 right-4 z-50 bg-black/50 hover:bg-black/80 text-white" 
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
              <img 
                src={project.image || '/placeholder.svg'} 
                alt={project.title}
                className="w-full h-full object-cover"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = '/placeholder.svg';
                }}
              />
              <div className="absolute inset-0 product-hero-bright" />
            </>
          )}
          
          {/* Hero Content Overlay */}
          <div className="absolute bottom-0 left-0 w-full p-8 z-10">
            <div className="container mx-auto">
              <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
                <div className="max-w-3xl">
                  <h1 className="text-4xl md:text-5xl font-bold mb-2 text-spotify-bright-text">{project.title}</h1>
                  
                  {/* Tagline */}
                  <p className="text-xl text-spotify-bright-subtext mb-4 max-w-2xl">{project.description}</p>
                  
                  {/* Quick Stats */}
                  <div className="flex flex-wrap items-center gap-4 text-sm text-spotify-bright-subtext">
                    {project.created_at && (
                      <div className="flex items-center bg-spotify-green/10 px-3 py-1 rounded-full">
                        <Calendar size={14} className="mr-1" />
                        {formatDate(project.created_at)}
                      </div>
                    )}
                    {project.tags && project.tags.length > 0 && (
                      <div className="flex items-center bg-spotify-green/10 px-3 py-1 rounded-full">
                        <Tag size={14} className="mr-1" />
                        {project.tags.length} Tags
                      </div>
                    )}
                    <div className="flex items-center bg-spotify-green/20 px-3 py-1 rounded-full">
                      <Check size={14} className="mr-1" />
                      Live
                    </div>
                  </div>
                </div>
                
                <div className="flex space-x-3">
                  {project.videoUrl && (
                    <Button 
                      className="bg-spotify-green hover:bg-spotify-green/80 text-white font-medium px-6 py-2 flex items-center" 
                      onClick={handlePlayVideo}
                    >
                      <Play className="mr-2" size={18} />
                      Watch Demo
                    </Button>
                  )}
                  
                  {project.productLink && (
                    <Button
                      variant="outline"
                      className="border-spotify-bright-border hover:border-spotify-green text-spotify-bright-text" 
                      onClick={() => window.open(project.productLink, '_blank')}
                    >
                      <ExternalLink className="mr-2" size={18} />
                      Visit Project
                    </Button>
                  )}
                  
                  {project.github_link && (
                    <Button
                      variant="outline"
                      className="border-spotify-bright-border hover:border-spotify-green text-spotify-bright-text" 
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
        <Tabs defaultValue="problem" className="w-full">
          <TabsList className="w-full max-w-2xl mx-auto mb-8 grid grid-cols-4 bg-spotify-bright-hover">
            <TabsTrigger value="problem" className="data-[state=active]:bg-spotify-green data-[state=active]:text-white">
              <AlertCircle className="mr-2 h-4 w-4" />
              <span className="hidden sm:inline">Problem</span>
            </TabsTrigger>
            <TabsTrigger value="solution" className="data-[state=active]:bg-spotify-green data-[state=active]:text-white">
              <Lightbulb className="mr-2 h-4 w-4" />
              <span className="hidden sm:inline">Solution</span>
            </TabsTrigger>
            <TabsTrigger value="features" className="data-[state=active]:bg-spotify-green data-[state=active]:text-white">
              <PanelTopOpen className="mr-2 h-4 w-4" />
              <span className="hidden sm:inline">Features</span>
            </TabsTrigger>
            <TabsTrigger value="tools" className="data-[state=active]:bg-spotify-green data-[state=active]:text-white">
              <Wrench className="mr-2 h-4 w-4" />
              <span className="hidden sm:inline">Tools</span>
            </TabsTrigger>
          </TabsList>
          
          {/* Problem Tab */}
          <TabsContent value="problem" className="space-y-6">
            <Card className="spotify-bright-card overflow-hidden">
              <div className="bg-gradient-to-r from-spotify-green/10 to-transparent p-6">
                <h2 className="text-2xl font-bold mb-2 text-spotify-bright-text">The Problem</h2>
                <p className="text-spotify-bright-subtext">What needed to be solved</p>
              </div>
              <CardContent className="pt-6">
                <div className="space-y-6">
                  <div>
                    <h3 className="text-lg font-semibold mb-2">🔍 Problem Statement</h3>
                    <p className="text-spotify-bright-subtext">
                      {project.description || "This project addresses a specific problem in the market."}
                    </p>
                  </div>
                  
                  <div>
                    <h3 className="text-lg font-semibold mb-2">👥 Target Users</h3>
                    <p className="text-spotify-bright-subtext">
                      People who needed a solution to efficiently manage their tasks and improve productivity.
                    </p>
                  </div>
                  
                  <div>
                    <h3 className="text-lg font-semibold mb-2">🚩 Challenges</h3>
                    <p className="text-spotify-bright-subtext">
                      The main challenges included creating an intuitive interface while maintaining powerful features.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          {/* Solution Tab */}
          <TabsContent value="solution" className="space-y-6">
            <Card className="spotify-bright-card">
              <div className="bg-gradient-to-r from-spotify-green/10 to-transparent p-6">
                <h2 className="text-2xl font-bold mb-2">The Solution</h2>
                <p className="text-spotify-bright-subtext">How we approached it</p>
              </div>
              <CardContent className="pt-6">
                <div className="space-y-6">
                  <div>
                    <h3 className="text-lg font-semibold mb-2">💡 Our Approach</h3>
                    <p className="text-spotify-bright-subtext">
                      {project.title} provides a comprehensive solution with a user-friendly interface and powerful features.
                    </p>
                  </div>
                  
                  <div>
                    <h3 className="text-lg font-semibold mb-2">🧩 Key Components</h3>
                    <ul className="list-disc pl-5 space-y-2 text-spotify-bright-subtext">
                      <li>Intuitive user interface</li>
                      <li>Powerful backend processing</li>
                      <li>Cross-platform compatibility</li>
                      <li>Data security and privacy</li>
                    </ul>
                  </div>
                  
                  <div>
                    <h3 className="text-lg font-semibold mb-2">🎯 Outcome</h3>
                    <p className="text-spotify-bright-subtext">
                      The solution successfully addresses the identified problems and provides users with an efficient tool.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            {/* Tags Card */}
            <Card className="spotify-bright-card">
              <div className="p-6">
                <h2 className="text-xl font-bold mb-4">Approach Tags</h2>
                <div className="flex flex-wrap gap-2">
                  {project.tags && project.tags.length > 0 ? (
                    project.tags.map((tag, index) => (
                      <span key={index} className="px-3 py-1 bg-spotify-green/10 hover:bg-spotify-green/20 cursor-pointer rounded-full text-sm transition-colors">
                        {tag}
                      </span>
                    ))
                  ) : (
                    <span className="text-spotify-bright-subtext">No tags available</span>
                  )}
                </div>
              </div>
            </Card>
          </TabsContent>
          
          {/* Features Tab */}
          <TabsContent value="features" className="space-y-6">
            <Card className="spotify-bright-card">
              <div className="bg-gradient-to-r from-spotify-green/10 to-transparent p-6">
                <h2 className="text-2xl font-bold mb-2">Key Features</h2>
                <p className="text-spotify-bright-subtext">What makes it special</p>
              </div>
              <CardContent className="pt-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="bg-white p-5 rounded-lg hover:bg-spotify-bright-hover transition-colors shadow-sm">
                    <div className="h-12 w-12 bg-gradient-to-br from-spotify-green to-spotify-green/70 rounded-xl flex items-center justify-center mb-4">
                      <Check className="text-white" size={24} />
                    </div>
                    <h3 className="text-lg font-semibold mb-2">Feature 1</h3>
                    <p className="text-spotify-bright-subtext">Detailed description of the first main feature.</p>
                  </div>
                  
                  <div className="bg-white p-5 rounded-lg hover:bg-spotify-bright-hover transition-colors shadow-sm">
                    <div className="h-12 w-12 bg-gradient-to-br from-spotify-green/80 to-blue-500/80 rounded-xl flex items-center justify-center mb-4">
                      <Watch className="text-white" size={24} />
                    </div>
                    <h3 className="text-lg font-semibold mb-2">Feature 2</h3>
                    <p className="text-spotify-bright-subtext">Detailed description of the second main feature.</p>
                  </div>
                  
                  <div className="bg-white p-5 rounded-lg hover:bg-spotify-bright-hover transition-colors shadow-sm">
                    <div className="h-12 w-12 bg-gradient-to-br from-blue-500/80 to-purple-500/80 rounded-xl flex items-center justify-center mb-4">
                      <Tag className="text-white" size={24} />
                    </div>
                    <h3 className="text-lg font-semibold mb-2">Feature 3</h3>
                    <p className="text-spotify-bright-subtext">Detailed description of the third main feature.</p>
                  </div>
                  
                  <div className="bg-white p-5 rounded-lg hover:bg-spotify-bright-hover transition-colors shadow-sm">
                    <div className="h-12 w-12 bg-gradient-to-br from-purple-500/80 to-spotify-green rounded-xl flex items-center justify-center mb-4">
                      <Calendar className="text-white" size={24} />
                    </div>
                    <h3 className="text-lg font-semibold mb-2">Feature 4</h3>
                    <p className="text-spotify-bright-subtext">Detailed description of the fourth main feature.</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          {/* Tools Tab */}
          <TabsContent value="tools" className="space-y-6">
            <Card className="spotify-bright-card">
              <div className="bg-gradient-to-r from-spotify-green/10 to-transparent p-6">
                <h2 className="text-xl font-bold mb-2">Tools & Technologies</h2>
                <p className="text-spotify-bright-subtext">What powers this project</p>
              </div>
              <CardContent className="pt-6">
                <div className="space-y-6">
                  <div>
                    <h3 className="text-lg font-semibold mb-3">🛠️ Technologies Used</h3>
                    <div className="flex flex-wrap gap-2 mb-4">
                      {["React", "Tailwind CSS", "Supabase", "TypeScript"].map((tool, index) => (
                        <span key={index} className="px-3 py-1 bg-spotify-green/10 rounded-full text-sm">
                          {tool}
                        </span>
                      ))}
                    </div>
                  </div>
                  
                  <Separator className="bg-spotify-bright-border" />
                  
                  <div>
                    <h3 className="text-lg font-semibold mb-3">💻 Development Stack</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="bg-white p-4 rounded-lg shadow-sm">
                        <h4 className="font-medium mb-2">Frontend</h4>
                        <p className="text-spotify-bright-subtext text-sm">React, TypeScript, Tailwind CSS</p>
                      </div>
                      <div className="bg-white p-4 rounded-lg shadow-sm">
                        <h4 className="font-medium mb-2">Backend</h4>
                        <p className="text-spotify-bright-subtext text-sm">Node.js, Supabase, PostgreSQL</p>
                      </div>
                    </div>
                  </div>
                  
                  <div>
                    <h3 className="text-lg font-semibold mb-3">🔧 Development Tools</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="bg-white p-4 rounded-lg shadow-sm">
                        <h4 className="font-medium mb-2">Design</h4>
                        <p className="text-spotify-bright-subtext text-sm">Figma, Adobe XD</p>
                      </div>
                      <div className="bg-white p-4 rounded-lg shadow-sm">
                        <h4 className="font-medium mb-2">Deployment</h4>
                        <p className="text-spotify-bright-subtext text-sm">Vercel, GitHub Actions</p>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            {/* Call-to-Action */}
            <Card className="spotify-bright-card overflow-hidden">
              <div className="bg-gradient-to-r from-spotify-green/20 to-blue-500/10 p-6">
                <h2 className="text-xl font-bold mb-2">Try It Now</h2>
              </div>
              <CardContent className="pt-6">
                <div className="space-y-4">
                  {project.productLink && (
                    <Button 
                      className="w-full bg-spotify-green hover:bg-spotify-green/80 text-white" 
                      onClick={() => window.open(project.productLink, '_blank')}
                    >
                      <ExternalLink className="mr-2" size={18} />
                      Visit Live Project
                    </Button>
                  )}
                  
                  {project.github_link && (
                    <Button 
                      variant="outline" 
                      className="w-full border-spotify-bright-border hover:border-spotify-green text-spotify-bright-text" 
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
