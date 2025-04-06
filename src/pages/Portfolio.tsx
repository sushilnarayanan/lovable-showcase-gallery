
import React, { useState } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { usePortfolioData, addPortfolioItem, updatePortfolioItem, deletePortfolioItem } from '@/hooks/usePortfolio';
import { PortfolioItem, PortfolioCreateInput } from '@/integrations/supabase/types/portfolio';
import { useForm } from 'react-hook-form';
import { toast } from '@/hooks/use-toast';
import { Pencil, Trash2 } from 'lucide-react';

const Portfolio = () => {
  const { data: portfolioItems, isLoading, error } = usePortfolioData();
  const [editingItem, setEditingItem] = useState<PortfolioItem | null>(null);
  const queryClient = useQueryClient();
  
  const form = useForm<PortfolioCreateInput>({
    defaultValues: {
      title: '',
      description: '',
      thumbnail_url: '',
      Product_video: '',
    }
  });

  React.useEffect(() => {
    if (editingItem) {
      form.reset({
        title: editingItem.title,
        description: editingItem.description || '',
        thumbnail_url: editingItem.thumbnail_url || '',
        Product_video: editingItem.Product_video || '',
      });
    }
  }, [editingItem, form]);

  const onSubmit = async (data: PortfolioCreateInput) => {
    try {
      if (editingItem) {
        await updatePortfolioItem(editingItem.id, data);
      } else {
        await addPortfolioItem(data);
      }
      queryClient.invalidateQueries({ queryKey: ['portfolio'] });
      setEditingItem(null);
      form.reset({
        title: '',
        description: '',
        thumbnail_url: '',
        Product_video: '',
      });
    } catch (error) {
      console.error('Error saving portfolio item:', error);
    }
  };
  
  const handleDelete = async (id: number) => {
    if (confirm('Are you sure you want to delete this item?')) {
      try {
        await deletePortfolioItem(id);
        queryClient.invalidateQueries({ queryKey: ['portfolio'] });
      } catch (error) {
        console.error('Error deleting portfolio item:', error);
      }
    }
  };
  
  const handleEdit = (item: PortfolioItem) => {
    setEditingItem(item);
  };
  
  const cancelEdit = () => {
    setEditingItem(null);
    form.reset({
      title: '',
      description: '',
      thumbnail_url: '',
      Product_video: '',
    });
  };

  return (
    <div className="min-h-screen bg-netflix-background">
      <Navbar />
      
      <div className="container mx-auto max-w-4xl pt-8 pb-16 px-4">
        <h1 className="text-2xl font-bold mb-6">Portfolio Management</h1>
        
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>{editingItem ? 'Edit Portfolio Item' : 'Add New Portfolio Item'}</CardTitle>
            <CardDescription>
              {editingItem 
                ? 'Update your portfolio item details below' 
                : 'Fill in the details to add a new item to your portfolio'
              }
            </CardDescription>
          </CardHeader>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)}>
              <CardContent className="space-y-4">
                <FormField
                  control={form.control}
                  name="title"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Title</FormLabel>
                      <FormControl>
                        <Input placeholder="Project Title" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Description</FormLabel>
                      <FormControl>
                        <Textarea placeholder="Project Description" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="thumbnail_url"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Thumbnail URL</FormLabel>
                      <FormControl>
                        <Input placeholder="https://example.com/image.jpg" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="Product_video"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Video URL (Optional)</FormLabel>
                      <FormControl>
                        <Input placeholder="https://example.com/video.mp4" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </CardContent>
              
              <CardFooter className="flex justify-between">
                {editingItem && (
                  <Button variant="outline" onClick={cancelEdit}>
                    Cancel
                  </Button>
                )}
                <Button type="submit">
                  {editingItem ? 'Update Item' : 'Add Item'}
                </Button>
              </CardFooter>
            </form>
          </Form>
        </Card>
        
        <h2 className="text-xl font-bold mb-4">Your Portfolio Items</h2>
        
        {isLoading && <p>Loading portfolio items...</p>}
        
        {error && <p className="text-red-500">Error loading portfolio items</p>}
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {portfolioItems && portfolioItems.map((item) => (
            <Card key={item.id} className="overflow-hidden">
              {item.thumbnail_url && (
                <div className="h-40 overflow-hidden">
                  <img 
                    src={item.thumbnail_url} 
                    alt={item.title}
                    className="w-full h-full object-cover"
                  />
                </div>
              )}
              
              <CardHeader>
                <CardTitle>{item.title}</CardTitle>
                {item.description && (
                  <CardDescription>{item.description}</CardDescription>
                )}
              </CardHeader>
              
              <CardFooter className="flex justify-end gap-2">
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={() => handleEdit(item)}
                >
                  <Pencil className="h-4 w-4 mr-1" /> Edit
                </Button>
                <Button 
                  variant="destructive" 
                  size="sm"
                  onClick={() => handleDelete(item.id)}
                >
                  <Trash2 className="h-4 w-4 mr-1" /> Delete
                </Button>
              </CardFooter>
            </Card>
          ))}
          
          {portfolioItems && portfolioItems.length === 0 && (
            <p className="col-span-2 text-center py-8">
              No portfolio items found. Add your first item using the form above.
            </p>
          )}
        </div>
      </div>
      
      <Footer />
    </div>
  );
};

export default Portfolio;
