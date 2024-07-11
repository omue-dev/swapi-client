// src/utils/getSupplierName.ts
interface Supplier {
  LieferantNr: string;
  Name: string;
}
  
  export const getSupplierName = (params: any, suppliers: Supplier[] = []) => {
    console.log('params:', params);
    console.log('suppliers:', suppliers);
    const supplierNumber = String(params);
    const supplier = suppliers.find(supplier => supplier.LieferantNr === supplierNumber);
    return supplier ? supplier.Name : 'Unknown Supplier';
  };
  