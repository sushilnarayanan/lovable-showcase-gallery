
import { Database } from '../types';

export type Category = Database['public']['Tables']['Categories']['Row'];
export type Product = Database['public']['Tables']['Products']['Row'];

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
  category_id: number | null;
  tags: string[] | null;
  created_at: string;
  updated_at: string | null;
}

export type ProductCreateInput = Omit<ProductItem, 'id' | 'created_at' | 'updated_at'>;
export type ProductUpdateInput = Partial<ProductCreateInput>;

export type CategoryCreateInput = Omit<CategoryItem, 'id' | 'created_at' | 'updated_at'>;
export type CategoryUpdateInput = Partial<CategoryCreateInput>;
