
export interface PortfolioItem {
  id: number;
  created_at: string;
  title: string;
  description: string | null;
  thumbnail_url: string | null;
  Product_video: string | null;
}

export type PortfolioCreateInput = Omit<PortfolioItem, 'id' | 'created_at'>;
export type PortfolioUpdateInput = Partial<PortfolioCreateInput>;
