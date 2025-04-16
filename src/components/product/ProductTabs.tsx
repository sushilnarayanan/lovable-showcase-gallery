
import React from 'react';
import { 
  AlertCircle, 
  Lightbulb, 
  PanelTopOpen, 
  Wrench,
  Users,
  Shield
} from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ProductDetails } from '@/integrations/supabase/types/portfolio';

interface ProductTabsProps {
  productDetails: ProductDetails | null;
  activeTab: string;
  handleTabChange: (value: string) => void;
  projectTitle: string;
  tags?: string[] | null;
}

const ProductTabs = ({
  productDetails,
  activeTab,
  handleTabChange,
  projectTitle,
  tags
}: ProductTabsProps) => {
  return (
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
                  {productDetails?.problem_statement || "No problem statement available."}
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
                  {productDetails?.target_audience || "No target audience specified."}
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
                  {productDetails?.development_challenges || "No development challenges specified."}
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
                  {productDetails?.solution_description || "No solution description available."}
                </p>
              </div>
              
              <div className="bg-black/70 p-6 rounded-md border border-netflix-red/10 text-white">
                <h3 className="text-lg font-semibold mb-2 flex items-center text-netflix-red">
                  Future Plans
                </h3>
                <p className="text-gray-300 break-words">
                  {productDetails?.future_roadmap || "No future roadmap specified."}
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
            {productDetails?.key_features && productDetails.key_features.length > 0 ? (
              <div className="space-y-4">
                {productDetails.key_features.map((feature, index) => (
                  <div 
                    key={index}
                    className="bg-black/70 p-4 rounded-md border border-netflix-red/10 text-white flex items-start gap-3"
                  >
                    <div className="h-6 w-6 rounded-full bg-netflix-red/20 flex items-center justify-center flex-shrink-0 mt-1">
                      <span className="text-netflix-red text-sm">{index + 1}</span>
                    </div>
                    <p className="text-gray-300">{feature}</p>
                  </div>
                ))}
              </div>
            ) : (
              <div className="bg-black/70 p-6 rounded-md border border-netflix-red/10 text-white">
                <p className="text-gray-300">No key features have been added for this product yet.</p>
              </div>
            )}
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
            
            {tags && tags.length > 0 ? (
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                {tags.map((tag, index) => (
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
  );
};

export default ProductTabs;
