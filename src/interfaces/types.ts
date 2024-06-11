export interface Manufacturer {
    id: string; 
    name: string;
  }
  export interface Product {
    id: string;
    name: string;
    active: boolean;
    description: string | null;
    customSearchKeywords: string | null;
    ean: string | null;
    metaDescription: string | null;
    metaTitle: string | null;
    keywords: string | null;
    categoryIds: string[];
    productNumber: string;
    shortText: string | null;
    manufacturerId?: string;
    stock: number;
    updatedAt?: string;
    manufacturer?: string;
  }
  
  