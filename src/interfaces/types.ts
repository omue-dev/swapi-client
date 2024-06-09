export interface Manufacturer {
    id: string; 
    name: string;
  }
 export interface Product {
    id: string;
    name: string;
    active: boolean;
    description: string;
    customSearchKeywords: string;
    ean: string;
    metaDescription: string;
    metaTitle: string;
    keywords: string;
    categoryIds: string[];
    productNumber: string;
    shortText: string;
  }
  