
import React from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { AspectRatio } from '@/components/ui/aspect-ratio';
import { Card, CardContent } from '@/components/ui/card';

const About = () => {
  return (
    <div className="bg-white min-h-screen">
      <Navbar />
      
      <div className="max-w-3xl mx-auto px-4 sm:px-6 pt-24 pb-16">
        {/* Simple Author Header */}
        <header className="mb-10 text-center">
          <h1 className="text-3xl font-serif font-medium text-gray-900">
            Sushil Narayanan
          </h1>
        </header>
        
        {/* Featured Video */}
        <div className="mb-10">
          <Card className="overflow-hidden border-0 shadow-sm">
            <CardContent className="p-0">
              <AspectRatio ratio={16 / 9}>
                <video
                  className="w-full h-full object-cover"
                  controls
                  poster="https://images.unsplash.com/photo-1488590528505-98d2b5aba04b?auto=format&fit=crop&q=80"
                >
                  <source src="/path-to-your-video.mp4" type="video/mp4" />
                  Your browser does not support the video tag.
                </video>
              </AspectRatio>
            </CardContent>
          </Card>
        </div>
        
        {/* Content Area */}
        <article className="prose prose-lg max-w-none">
          <p className="text-gray-700 mb-6">
            Welcome to my newsletter. I write about technology, design, and the intersection of both. 
            My goal is to share insights that help you navigate the ever-changing landscape of digital innovation.
          </p>
          
          <p className="text-gray-700 mb-6">
            I believe in simplicity and clarity. My writing focuses on distilling complex concepts into 
            accessible insights that you can apply to your work and life. Whether you're a designer, 
            developer, or simply curious about technology, I aim to provide value with every post.
          </p>
          
          <p className="text-gray-700 mb-6">
            Through my newsletter, I explore topics ranging from emerging technologies and their implications 
            to practical advice on creating better digital experiences. I draw from my experience in the field 
            and conversations with industry leaders to bring you perspectives that matter.
          </p>
          
          <p className="text-gray-700">
            Thank you for joining me on this journey. I look forward to sharing ideas, starting conversations, 
            and learning together. Feel free to reach out if you have any questions or topics you'd like me to cover.
          </p>
        </article>
      </div>
      
      <Footer />
    </div>
  );
};

export default About;
