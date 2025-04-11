
import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { ProductDetails, ProductDetailsUpdateInput } from '@/integrations/supabase/types/portfolio';
import { upsertProductDetails } from '@/hooks/useProductDetails';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from '@/hooks/use-toast';
import { X } from 'lucide-react';

// Create schema for form validation
const formSchema = z.object({
  problem_statement: z.string().optional().nullable(),
  target_audience: z.string().optional().nullable(),
  development_challenges: z.string().optional().nullable(),
  solution_description: z.string().optional().nullable(),
  future_roadmap: z.string().optional().nullable(),
  technical_details: z.string().optional().nullable(),
  key_features: z.array(z.string()).optional().nullable(),
  product_images: z.array(z.string()).optional().nullable(),
});

type ProductDetailsFormProps = {
  productId: number;
  initialData?: ProductDetails | null;
  onSuccess?: () => void;
};

const ProductDetailsForm = ({ productId, initialData, onSuccess }: ProductDetailsFormProps) => {
  const [features, setFeatures] = useState<string[]>(initialData?.key_features || []);
  const [newFeature, setNewFeature] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [images, setImages] = useState<string[]>(initialData?.product_images || []);
  const [newImage, setNewImage] = useState<string>('');

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      problem_statement: initialData?.problem_statement || '',
      target_audience: initialData?.target_audience || '',
      development_challenges: initialData?.development_challenges || '',
      solution_description: initialData?.solution_description || '',
      future_roadmap: initialData?.future_roadmap || '',
      technical_details: initialData?.technical_details || '',
      key_features: initialData?.key_features || [],
      product_images: initialData?.product_images || [],
    },
  });

  // Update form when initialData changes
  useEffect(() => {
    if (initialData) {
      form.reset({
        problem_statement: initialData.problem_statement || '',
        target_audience: initialData.target_audience || '',
        development_challenges: initialData.development_challenges || '',
        solution_description: initialData.solution_description || '',
        future_roadmap: initialData.future_roadmap || '',
        technical_details: initialData.technical_details || '',
        key_features: initialData.key_features || [],
        product_images: initialData.product_images || [],
      });
      setFeatures(initialData.key_features || []);
      setImages(initialData.product_images || []);
    }
  }, [initialData, form]);

  const addFeature = () => {
    if (newFeature.trim() === '') return;
    setFeatures([...features, newFeature.trim()]);
    setNewFeature('');
  };

  const removeFeature = (index: number) => {
    const updatedFeatures = [...features];
    updatedFeatures.splice(index, 1);
    setFeatures(updatedFeatures);
  };

  const addImage = () => {
    if (newImage.trim() === '') return;
    setImages([...images, newImage.trim()]);
    setNewImage('');
  };

  const removeImage = (index: number) => {
    const updatedImages = [...images];
    updatedImages.splice(index, 1);
    setImages(updatedImages);
  };

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      setIsSubmitting(true);
      
      // Include the features and images from state
      const formData: ProductDetailsUpdateInput = {
        ...values,
        key_features: features,
        product_images: images
      };
      
      await upsertProductDetails(productId, formData);
      
      if (onSuccess) {
        onSuccess();
      }
    } catch (error) {
      console.error('Error saving product details:', error);
      toast({
        title: 'Error',
        description: 'Failed to save product details',
        variant: 'destructive',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Product Details</CardTitle>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <div className="space-y-6">
              <h2 className="text-lg font-semibold">Problem</h2>
              
              <FormField
                control={form.control}
                name="problem_statement"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Problem Statement</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Describe the problem this product aims to solve"
                        className="min-h-24"
                        {...field}
                        value={field.value || ''}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="target_audience"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Target Users</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Describe the target users/audience for this product"
                        className="min-h-24"
                        {...field}
                        value={field.value || ''}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="development_challenges"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Why Built This?</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Why did you build this product? What challenges did you encounter?"
                        className="min-h-24"
                        {...field}
                        value={field.value || ''}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            
            <div className="space-y-6">
              <h2 className="text-lg font-semibold">Solution</h2>
              
              <FormField
                control={form.control}
                name="solution_description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Idea</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="How does this product provide a solution to the problem?"
                        className="min-h-24"
                        {...field}
                        value={field.value || ''}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="future_roadmap"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Future Plans</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Describe planned future developments and improvements"
                        className="min-h-24"
                        {...field}
                        value={field.value || ''}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            
            <div className="space-y-6">
              <h2 className="text-lg font-semibold">Features</h2>
              
              <div>
                <FormLabel>Key Features</FormLabel>
                <div className="flex items-center gap-2 mb-2">
                  <Input 
                    value={newFeature}
                    onChange={(e) => setNewFeature(e.target.value)}
                    placeholder="Add a key feature"
                    className="flex-1"
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        addFeature();
                      }
                    }}
                  />
                  <Button 
                    type="button" 
                    onClick={addFeature}
                    variant="outline"
                  >
                    Add
                  </Button>
                </div>
                <div className="space-y-2 mt-2">
                  {features.map((feature, index) => (
                    <div key={index} className="flex items-center gap-2 p-2 border rounded-md">
                      <span className="flex-1">{feature}</span>
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        onClick={() => removeFeature(index)}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                  {features.length === 0 && (
                    <p className="text-sm text-gray-500 italic">No features added yet.</p>
                  )}
                </div>
              </div>
            </div>
            
            <div className="space-y-6">
              <h2 className="text-lg font-semibold">Tools</h2>
              
              <FormField
                control={form.control}
                name="technical_details"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Technical Details</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Describe the technical stack and implementation details"
                        className="min-h-24"
                        {...field}
                        value={field.value || ''}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            
            <div className="space-y-6">
              <h2 className="text-lg font-semibold">Product Images</h2>
              
              <div>
                <FormLabel>Image URLs</FormLabel>
                <div className="flex items-center gap-2 mb-2">
                  <Input 
                    value={newImage}
                    onChange={(e) => setNewImage(e.target.value)}
                    placeholder="Add an image URL"
                    className="flex-1"
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        addImage();
                      }
                    }}
                  />
                  <Button 
                    type="button" 
                    onClick={addImage}
                    variant="outline"
                  >
                    Add
                  </Button>
                </div>
                <div className="space-y-2 mt-2">
                  {images.map((image, index) => (
                    <div key={index} className="flex items-center gap-2 p-2 border rounded-md">
                      <img 
                        src={image} 
                        alt={`Product image ${index + 1}`} 
                        className="h-10 w-10 object-cover rounded"
                        onError={(e) => {
                          (e.target as HTMLImageElement).src = '/placeholder.svg';
                        }}
                      />
                      <span className="flex-1 truncate">{image}</span>
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        onClick={() => removeImage(index)}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                  {images.length === 0 && (
                    <p className="text-sm text-gray-500 italic">No images added yet.</p>
                  )}
                </div>
              </div>
            </div>
            
            <div className="flex justify-end">
              <Button 
                type="submit" 
                disabled={isSubmitting}
              >
                {isSubmitting ? 'Saving...' : 'Save Details'}
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};

export default ProductDetailsForm;
