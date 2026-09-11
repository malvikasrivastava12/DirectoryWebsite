export interface DirectoryListing {
  id: string;
  name: string;
  category: string;
  location: string;
  phone: string;
  description: string;
  email?: string;
  website?: string;
  rating?: number;
  featured?: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface AdminUser {
  id: string;
  email: string;
}

export type Category = 
  | "All"
  | "Technology"
  | "Healthcare"
  | "Dining & Food"
  | "Real Estate"
  | "Finance & Legal"
  | "Retail & Shopping"
  | "Automotive"
  | "Education"
  | "Services";
