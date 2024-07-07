// src/utils/getSupplierName.ts
interface Supplier {
    id: number;
    name: string;
  }
  
  export const getSupplierName = (params: any, suppliers: Supplier[] = []) => {
    const supplier = suppliers.find((supplier) => supplier.id.toString() === params.value);
    return supplier ? supplier.name : 'Unknown Supplier';
  };
  