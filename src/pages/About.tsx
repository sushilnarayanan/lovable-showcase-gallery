
import React from 'react';
import Navbar from '@/components/Navbar';
import { Play } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Footer from '@/components/Footer';

const About = () => {
  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      
      {/* Hero Section with Video */}
      <section className="pt-16 lg:pt-20 pb-8 lg:pb-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 mb-4 sm:mb-6">
            About <span className="text-netflix-red">SINGULARITEA</span>
          </h1>
          
          <div className="aspect-video w-full bg-gray-100 rounded-lg overflow-hidden shadow-xl mb-8 sm:mb-10">
            {/* Replace with your video URL */}
            <video
              className="w-full h-full object-cover"
              controls
              poster="https://images.unsplash.com/photo-1488590528505-98d2b5aba04b?auto=format&fit=crop&q=80"
            >
              <source src="/path-to-your-video.mp4" type="video/mp4" />
              Your browser does not support the video tag.
            </video>
          </div>
        </div>
      </section>

      {/* Content Sections */}
      <section className="py-8 sm:py-12 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8 md:gap-12 items-center">
            <div>
              <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-4 sm:mb-6">Our Mission</h2>
              <p className="text-base sm:text-lg text-gray-700 mb-4 sm:mb-6">
                At SINGULARITEA, we're on a mission to revolutionize the way people interact with technology. 
                Our platform combines cutting-edge AI with intuitive design to create seamless user experiences.
              </p>
              <Button variant="netflix" className="inline-flex items-center text-sm sm:text-base">
                <Play className="mr-2 h-3 w-3 sm:h-4 sm:w-4" />
                Watch Our Story
              </Button>
            </div>
            <div className="relative h-[250px] sm:h-[300px] md:h-[350px] lg:h-[400px] rounded-lg overflow-hidden shadow-xl">
              <img 
                src="https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&q=80" 
                alt="Our Mission"
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        </div>
      </section>

      <section className="py-8 sm:py-12 px-4 sm:px-6 lg:px-8 bg-gray-50">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-6 sm:mb-8 lg:mb-12 text-center">Our Values</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6 md:gap-8">
            <div className="bg-white p-4 sm:p-6 rounded-lg shadow-md">
              <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-2 sm:mb-4">Innovation</h3>
              <p className="text-gray-700 text-sm sm:text-base">
                We push the boundaries of what's possible with AI and technology.
              </p>
            </div>
            <div className="bg-white p-4 sm:p-6 rounded-lg shadow-md">
              <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-2 sm:mb-4">Quality</h3>
              <p className="text-gray-700 text-sm sm:text-base">
                We maintain the highest standards in everything we create.
              </p>
            </div>
            <div className="bg-white p-4 sm:p-6 rounded-lg shadow-md">
              <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-2 sm:mb-4">Community</h3>
              <p className="text-gray-700 text-sm sm:text-base">
                We build and nurture a strong community of developers and users.
              </p>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default About;
