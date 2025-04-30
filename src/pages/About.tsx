
import React from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { AspectRatio } from '@/components/ui/aspect-ratio';
import { Card, CardContent } from '@/components/ui/card';
import { useAboutPage, formatAboutText } from '@/hooks/useAboutPage';
import { Skeleton } from '@/components/ui/skeleton';

const About = () => {
  const { data: aboutData, isLoading, error } = useAboutPage();
  
  console.log('About page data:', aboutData);
  
  // Fallback text content properly formatted with paragraphs
  const fallbackContent = `
    <p>
      Welcome to my newsletter. I write about technology, design, and the intersection of both. 
      My goal is to share insights that help you navigate the ever-changing landscape of digital innovation.
    </p>
    
    <p>
      I believe in simplicity and clarity. My writing focuses on distilling complex concepts into 
      accessible insights that you can apply to your work and life. Whether you're a designer, 
      developer, or simply curious about technology, I aim to provide value with every post.
    </p>
    
    <p>
      Through my newsletter, I explore topics ranging from emerging technologies and their implications 
      to practical advice on creating better digital experiences. I draw from my experience in the field 
      and conversations with industry leaders to bring you perspectives that matter.
    </p>
    
    <p>
      Thank you for joining me on this journey. I look forward to sharing ideas, starting conversations, 
      and learning together. Feel free to reach out if you have any questions or topics you'd like me to cover.
    </p>
  `;
  
  return (
    <div className="bg-white min-h-screen">
      <Navbar />
      
      <div className="max-w-6xl mx-auto px-4 sm:px-6 pt-24 pb-16">
        {/* Simple Author Header */}
        <header className="mb-10 text-center">
          <h1 className="text-3xl font-serif font-medium text-gray-900">
            Sushil Narayanan
          </h1>
        </header>
        
        {/* Content with video on left, text on right */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
          {/* Video Section - Left */}
          <div className="w-full">
            {isLoading ? (
              <Skeleton className="w-full aspect-[4/5]" />
            ) : error ? (
              <div className="bg-red-50 p-4 rounded text-center text-red-500 aspect-[4/5] flex items-center justify-center">
                Error loading video content
              </div>
            ) : (
              <Card className="overflow-hidden border-0 shadow-sm">
                <CardContent className="p-0">
                  <AspectRatio ratio={4/5}>
                    {aboutData?.about_video ? (
                      <video
                        className="w-full h-full object-cover"
                        controls
                        autoPlay
                        playsInline
                      >
                        <source src={aboutData.about_video} type="video/mp4" />
                        Your browser does not support the video tag.
                      </video>
                    ) : (
                      <div className="bg-gray-100 w-full h-full flex items-center justify-center text-gray-400">
                        No video available
                      </div>
                    )}
                  </AspectRatio>
                </CardContent>
              </Card>
            )}
          </div>
          
          {/* Text Content - Right */}
          <div>
            {isLoading ? (
              <div className="space-y-4">
                <Skeleton className="h-6 w-3/4" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-5/6" />
                <Skeleton className="h-4 w-full" />
              </div>
            ) : error ? (
              <div className="bg-red-50 p-4 rounded text-red-500">
                Error loading about text content
              </div>
            ) : (
              <article className="prose prose-lg max-w-none">
                {aboutData?.about_text ? (
                  <div 
                    className="text-gray-700 space-y-4"
                    dangerouslySetInnerHTML={{ 
                      __html: formatAboutText(aboutData.about_text) 
                    }}
                  />
                ) : (
                  <div 
                    className="text-gray-700 space-y-4"
                    dangerouslySetInnerHTML={{ __html: fallbackContent }}
                  />
                )}
              </article>
            )}
          </div>
        </div>
      </div>
      
      <Footer />
    </div>
  );
};

export default About;
