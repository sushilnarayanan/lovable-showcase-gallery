
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { assignProductsToCategory } from '@/utils/categoryAssigner';
import { Loader2 } from 'lucide-react';

const AssignCategories = () => {
  const [loading, setLoading] = useState(false);
  
  const handleAssignToMicroSaaS = async () => {
    setLoading(true);
    try {
      // These are the product IDs to assign to MicroSaaS category
      const productIds = [1, 9, 13, 14, 16];
      await assignProductsToCategory(productIds, 'microsaas');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-2xl font-bold mb-6">Category Assignment</h1>
      
      <div className="bg-card p-6 rounded-lg shadow-md">
        <h2 className="text-xl font-medium mb-4">Assign Products to MicroSaaS</h2>
        <p className="mb-4 text-muted-foreground">
          Click the button below to assign products with IDs 1, 9, 13, 14, and 16 to the MicroSaaS category.
        </p>
        
        <Button 
          onClick={handleAssignToMicroSaaS}
          disabled={loading}
        >
          {loading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Assigning...
            </>
          ) : (
            'Assign Products to MicroSaaS'
          )}
        </Button>
      </div>
    </div>
  );
};

export default AssignCategories;
