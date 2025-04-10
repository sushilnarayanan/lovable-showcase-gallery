

import { Database } from '../types';

export type Category = Database['public']['Tables']['Categories']['Row'];
export type Product = Database['public']['Tables']['Products']['Row'];

// Update this line to use 'product_categories' with lowercase
export type ProductCategory = {
  id: number;
  product_id: number;
  category_id: number;
  created_at: string;
};

export interface CategoryItem {
  id: number;
  name: string;
  slug: string;
  description: string | null;
  created_at: string;
  updated_at: string | null;
}

export interface ProductItem {
  id: number;
  title: string;
  description: string | null;
  thumbnail_url: string | null;
  product_video: string | null;
  product_link: string | null;
  github_link: string | null;
  category_id: number | null;  // Keep for backward compatibility
  categories?: CategoryItem[];  // New field for multiple categories
  tags: string[] | null;
  created_at: string;
  updated_at: string | null;
}

// New type for ProductDetails
export interface ProductDetails {
  id: number;
  product_id: number;
  problem_statement: string | null;
  target_audience: string | null;
  solution_description: string | null;
  key_features: string[] | null;
  technical_details: string | null;
  future_roadmap: string | null;
  development_challenges: string | null;
  created_at: string;
  updated_at: string | null;
}

export type ProductCreateInput = Omit<ProductItem, 'id' | 'created_at' | 'updated_at' | 'categories'> & {
  categoryIds?: number[];  // For assigning multiple categories
};

export type ProductUpdateInput = Partial<Omit<ProductCreateInput, 'categoryIds'>> & {
  categoryIds?: number[];  // For updating multiple categories
};

// New type for creating ProductDetails
export type ProductDetailsCreateInput = Omit<ProductDetails, 'id' | 'created_at' | 'updated_at'>;

// New type for updating ProductDetails
export type ProductDetailsUpdateInput = Partial<Omit<ProductDetails, 'id' | 'created_at' | 'updated_at' | 'product_id'>>;

export type CategoryCreateInput = Omit<CategoryItem, 'id' | 'created_at' | 'updated_at'>;
export type CategoryUpdateInput = Partial<CategoryCreateInput>;

