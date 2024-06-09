export interface Manufacturer {
    id: string; 
    name: string;
  }
export interface Product {
    id: string;
    productNumber: string;
    name: string;
    stock: number;
    updatedAt: string;
    manufacturerNumber: string;
    manufacturer: string;
    manufacturerId: string;
  }