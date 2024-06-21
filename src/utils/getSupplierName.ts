export const getSupplierName = (supplierId: string, suppliers: { [key: string]: string }): string => {
    return suppliers[supplierId] || supplierId;
};
