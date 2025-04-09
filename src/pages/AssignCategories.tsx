
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { assignProductsToCategory } from '@/utils/categoryAssigner';
import { useProductsByCategoryId } from '@/hooks/usePortfolio';
import { Loader2, CheckCircle, ExternalLink } from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import { Link } from 'react-router-dom';

const AssignCategories = () => {
  const [loading, setLoading] = useState(false);
  const [assigned, setAssigned] = useState(false);
  const { data: microSaasItems, refetch, isLoading: itemsLoading } = useProductsByCategoryId(3);
  
  const handleAssignToMicroSaaS = async () => {
    setLoading(true);
    try {
      // These are the product IDs to assign to MicroSaaS category
      const productIds = [1, 9, 13, 14, 16];
      const result = await assignProductsToCategory(productIds, 'microsaas');
      
      if (result) {
        setAssigned(true);
        // Refetch the products after assignment
        await refetch();
        toast({
          title: "Success",
          description: "Products have been assigned to MicroSaaS category",
        });
      }
    } catch (error) {
      console.error('Error assigning products:', error);
      toast({
        title: "Error",
        description: "Failed to assign products. Please try again.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-2xl font-bold mb-6">Category Assignment</h1>
      
      <div className="grid md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Assign Products to MicroSaaS</CardTitle>
            <CardDescription>
              Click the button below to assign products with IDs 1, 9, 13, 14, and 16 to the MicroSaaS category.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="mb-4 text-muted-foreground">
              This will add the products to the MicroSaaS category while preserving their existing category assignments.
            </p>
          </CardContent>
          <CardFooter>
            <Button 
              onClick={handleAssignToMicroSaaS}
              disabled={loading || assigned}
              className="mr-2"
            >
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Assigning...
                </>
              ) : assigned ? (
                <>
                  <CheckCircle className="mr-2 h-4 w-4" />
                  Assigned
                </>
              ) : (
                'Assign Products to MicroSaaS'
              )}
            </Button>
            
            <Button variant="outline" asChild>
              <Link to="/">
                <ExternalLink className="mr-2 h-4 w-4" /> 
                View on Homepage
              </Link>
            </Button>
          </CardFooter>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Current MicroSaaS Products</CardTitle>
            <CardDescription>
              Products currently assigned to the MicroSaaS category
            </CardDescription>
          </CardHeader>
          <CardContent>
            {itemsLoading ? (
              <div className="flex items-center justify-center py-4">
                <Loader2 className="h-6 w-6 animate-spin" />
              </div>
            ) : microSaasItems && microSaasItems.length > 0 ? (
              <ul className="list-disc pl-5 space-y-1">
                {microSaasItems.map(item => (
                  <li key={item.id}>{item.title}</li>
                ))}
              </ul>
            ) : (
              <p className="text-muted-foreground">No products assigned to MicroSaaS yet.</p>
            )}
          </CardContent>
          <CardFooter>
            <Button variant="outline" onClick={() => refetch()}>
              Refresh List
            </Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
};

export default AssignCategories;
