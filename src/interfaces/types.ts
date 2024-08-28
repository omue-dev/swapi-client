import { GridPaginationModel, GridSortModel } from "@mui/x-data-grid";

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
    status: string;
    hasContent: boolean;
  }
  
  export interface ProductTableProps {
    products: Product[];
    totalProducts: number;
    paginationModel: GridPaginationModel;
    setPaginationModel: (model: GridPaginationModel) => void;
    sortModel: GridSortModel;
    setSortModel: (model: GridSortModel) => void;
    renderStatusIcon: (status: string) => JSX.Element;
    renderProcessedIcon: (processed: boolean) => JSX.Element;
    onManufacturerClick: (manufacturerId: string) => void;
  }
  
  export interface Category {
    id: string;
    name: string;
  }

  export interface FeaureSet {
    id: string;
    name: string; 
  }
  
  export interface Order {
    id: string;
    BestellNr: string;
    FilialeNr: string;
    Transfer: string;
    Datum: string | null; 
    Art: string;
    Lieferant: string;
    Artikel: string;
    ReferenzNr: string;
    ModellCode: string;
    FarbeCode: string;
    Modell: string;
    Farbe: string;
    Größe: string;
    Liefertermin: string | null;
    Bestellt: string | null;
    Bestellen: string;
    Stornieren: string;
    Geliefert: string;
    Bestellmenge: string;
    Abrufmenge: string;
    Liefermenge: string;
    Etikettenmenge: string;
    Preis: string;
    Netto: string;
    Rabatt1: string;
    Rabatt2: string;
    ReservierteMenge: string;
    Kunde: string;
    ZugesagtBis: string;
    Versand: string;
    Versandadresse: string;
    Bemerkung: string;
    Anmahnen: string;
    AngemahntAm: string;
    Verkäufer: string;
    BestellprotokollNr: string;
    Gedruckt: string;
    Code: string;
    S_Key: string;
    S_Status: string;
}
