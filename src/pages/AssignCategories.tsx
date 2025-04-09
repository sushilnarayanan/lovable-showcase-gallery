
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { assignProductsToCategory } from '@/utils/categoryAssigner';
import { useProductsByCategoryId, useProductData } from '@/hooks/usePortfolio';
import { Loader2, CheckCircle, ExternalLink, Home } from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import { Link } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';

const AssignCategories = () => {
  const [loading, setLoading] = useState(false);
  const [assigned, setAssigned] = useState(false);
  const [categoryId, setCategoryId] = useState<number | null>(null);
  const { data: microSaasItems, refetch, isLoading: itemsLoading } = useProductsByCategoryId(categoryId || 3);
  const { data: allProducts } = useProductData();
  
  // Check if products are already assigned
  useEffect(() => {
    const checkAssignment = async () => {
      try {
        // Get MicroSaaS category ID
        const { data: categoryData } = await supabase
          .from('Categories')
          .select('id')
          .eq('slug', 'microsaas')
          .single();
          
        if (categoryData) {
          setCategoryId(categoryData.id);
          
          // Check if all target products are assigned
          const productIdsToCheck = [1, 9, 13, 14, 16];
          let allAssigned = true;
          
          for (const productId of productIdsToCheck) {
            const { data: relationData, error } = await supabase
              .from('product_categories')
              .select('id')
              .eq('category_id', categoryData.id)
              .eq('product_id', productId)
              .maybeSingle();
              
            if (!relationData || error) {
              allAssigned = false;
              break;
            }
          }
          
          setAssigned(allAssigned);
        }
      } catch (error) {
        console.error('Error checking assignment status:', error);
      }
    };
    
    checkAssignment();
  }, []);
  
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
            <div className="mt-4 p-4 bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800 rounded-md">
              <p className="text-amber-800 dark:text-amber-300 text-sm">
                <strong>Note:</strong> After assigning products, you'll need to visit the homepage to see them in the MicroSaaS category section.
              </p>
            </div>
          </CardContent>
          <CardFooter className="flex flex-wrap gap-2">
            <Button 
              onClick={handleAssignToMicroSaaS}
              disabled={loading || assigned}
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
                <Home className="mr-2 h-4 w-4" /> 
                Back to Homepage
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
      
      <div className="mt-8">
        <Card>
          <CardHeader>
            <CardTitle>All Available Products</CardTitle>
            <CardDescription>
              Reference list of all products in the database
            </CardDescription>
          </CardHeader>
          <CardContent>
            {allProducts ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {allProducts.map(product => (
                  <div key={product.id} className="p-3 border rounded-md">
                    <p className="font-medium">ID: {product.id} - {product.title}</p>
                    {product.categories && product.categories.length > 0 && (
                      <div className="mt-1 flex flex-wrap gap-1">
                        {product.categories.map(cat => (
                          <span key={cat.id} className="text-xs bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded">
                            {cat.name}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <div className="flex items-center justify-center py-4">
                <Loader2 className="h-6 w-6 animate-spin" />
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AssignCategories;
