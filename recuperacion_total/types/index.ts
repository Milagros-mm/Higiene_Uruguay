export type Category = {
  id: string;
  slug: string;
  name: string;
  icon: string;
  itemCount: number;
  featured: boolean;
};

export type Product = {
  id: string;
  slug: string;
  name: string;
  description: string;
  price: number;
  originalPrice?: number;
  categoryId: string;
  images: string[];
  inStock: boolean;
  badges: string[];
};

export type Benefit = {
  id: string;
  title: string;
  description: string;
  icon: string;
};

export type StoreInfo = {
  name: string;
  description: string;
  imageUrl: string;
  address: string;
  businessHours: string;
  phone: string;
};
