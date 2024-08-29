import { GenericData } from "../types";

// src/utils/dataSerializer.ts
export const validateAndSerializeData = (data: any[]): GenericData[] => {
  if (data.length === 0) return [];
  
  const fields = Object.keys(data[0]);
  
  return data.map(item => {
    const validatedItem: GenericData = {};
    
    fields.forEach(field => {
      if (item.hasOwnProperty(field)) {
        validatedItem[field] = item[field];
      } else {
        throw new Error(`Field ${String(field)} is missing in data item.`);
      }
    });
    
    return validatedItem;
  });
};
