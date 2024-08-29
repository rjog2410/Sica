// src/types/react-table-config.d.ts
import {
    UsePaginationInstanceProps,
    UsePaginationState,
    UseSortByInstanceProps,
    UseSortByState,
    ColumnDef,
  } from '@tanstack/react-table';
  
  declare module '@tanstack/react-table' {
    interface TableOptions<D extends Record<string, unknown>> 
      extends UsePaginationInstanceProps<D>, UseSortByInstanceProps<D> {}
  
    interface TableState<D extends Record<string, unknown>> 
      extends UsePaginationState<D>, UseSortByState<D> {}
  
    interface TableInstance<D extends Record<string, unknown>> 
      extends UsePaginationInstanceProps<D>, UseSortByInstanceProps<D> {}
  
    interface ColumnDefBase<D extends Record<string, unknown>, V> {
      accessorFn?: ((row: D) => V) | undefined;
    }
  }
  