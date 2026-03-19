export interface Category {
  id: number;
  name: string;
  description: string | null;
  created_at: Date;
}

export interface Product {
  id: number;
  name: string;
  description: string | null;
  quantity: number;
  price: number;
  category_id: number;
  deleted_at: Date | null;
  created_at: Date;
}

export interface ProductWithCategory extends Product {
  category_name: string;
}