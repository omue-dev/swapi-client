// src/utils/getSupplierName.ts
interface Supplier {
  LieferantNr: string;
  Name: string;
}

export const getSupplierName = (
  supplierNumber: string | number,
  suppliers: Supplier[] = [],
) => {
  //console.log('supplierNumber:', supplierNumber);
  //console.log('suppliers:', suppliers);
  const supplierNumberStr = String(supplierNumber);
  const supplier = suppliers.find(
    (supplierItem) => supplierItem.LieferantNr === supplierNumberStr,
  );
  return supplier
    ? supplier.Name
    : "Unknown Supplier (" + supplierNumberStr + ")";
};
