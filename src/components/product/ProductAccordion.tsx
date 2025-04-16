
import React from 'react';
import { ProductDetails } from '@/integrations/supabase/types/portfolio';
import { 
  AlertCircle,
  Lightbulb,
  PanelTopOpen,
  Wrench,
  Users,
  Shield,
  ChevronDown,
  ChevronUp
} from 'lucide-react';

interface ProductAccordionProps {
  productDetails: ProductDetails | null;
  expandedSection: string | null;
  toggleSection: (section: string) => void;
  tags?: string[] | null;
}

interface AccordionSectionProps {
  title: string;
  icon: React.ReactNode;
  id: string;
  isExpanded: boolean;
  onToggle: () => void;
  children: React.ReactNode;
}

const AccordionSection = ({ 
  title, 
  icon, 
  id, 
  isExpanded,
  onToggle,
  children 
}: AccordionSectionProps) => {
  return (
    <div className="mb-4 border border-netflix-red/20 rounded-md overflow-hidden">
      <button
        onClick={onToggle}
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

const ProductAccordion = ({
  productDetails,
  expandedSection,
  toggleSection,
  tags
}: ProductAccordionProps) => {
  return (
    <div className="max-w-3xl mx-auto">
      <AccordionSection 
        title="The Problem" 
        icon={<AlertCircle className="h-5 w-5 text-white" />} 
        id="problem"
        isExpanded={expandedSection === 'problem'}
        onToggle={() => toggleSection('problem')}
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
              {productDetails?.problem_statement || "No problem statement available."}
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
              {productDetails?.target_audience || "No target audience specified."}
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
              {productDetails?.development_challenges || "No development challenges specified."}
            </p>
          </div>
        </div>
      </AccordionSection>
      
      <AccordionSection 
        title="The Solution" 
        icon={<Lightbulb className="h-5 w-5 text-white" />} 
        id="solution"
        isExpanded={expandedSection === 'solution'}
        onToggle={() => toggleSection('solution')}
      >
        <div className="space-y-4">
          <div className="bg-black/70 p-4 rounded-md border border-netflix-red/10 text-white">
            <h3 className="text-lg font-semibold mb-2 flex items-center text-netflix-red">
              Idea
            </h3>
            <p className="text-gray-300 break-words">
              {productDetails?.solution_description || "No solution description available."}
            </p>
          </div>
          
          <div className="bg-black/70 p-4 rounded-md border border-netflix-red/10 text-white">
            <h3 className="text-lg font-semibold mb-2 flex items-center text-netflix-red">
              Future Plans
            </h3>
            <p className="text-gray-300 break-words">
              {productDetails?.future_roadmap || "No future roadmap specified."}
            </p>
          </div>
        </div>
      </AccordionSection>
      
      <AccordionSection 
        title="Key Features" 
        icon={<PanelTopOpen className="h-5 w-5 text-white" />} 
        id="features"
        isExpanded={expandedSection === 'features'}
        onToggle={() => toggleSection('features')}
      >
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
          <div className="bg-black/70 p-4 rounded-md border border-netflix-red/10 text-white">
            <p className="text-gray-300">No key features have been added for this product yet.</p>
          </div>
        )}
      </AccordionSection>
      
      <AccordionSection 
        title="Tools & Technologies" 
        icon={<Wrench className="h-5 w-5 text-white" />} 
        id="tools"
        isExpanded={expandedSection === 'tools'}
        onToggle={() => toggleSection('tools')}
      >
        {productDetails?.technical_details && (
          <div className="mb-4">
            <h3 className="text-lg font-semibold mb-2 text-netflix-red">Technical Overview</h3>
            <p className="text-gray-300 mb-4 break-words">{productDetails.technical_details}</p>
          </div>
        )}
        
        {tags && tags.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {tags.map((tag, index) => (
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
  );
};

export default ProductAccordion;
