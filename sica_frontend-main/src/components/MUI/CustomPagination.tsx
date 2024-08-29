import React from 'react';
import { Pagination } from '@mui/material';
import { useGridApiContext, useGridSelector, gridPageSelector, gridPageCountSelector } from '@mui/x-data-grid';

const CustomPagination: React.FC = () => {
  const apiRef = useGridApiContext();
  const page = useGridSelector(apiRef, gridPageSelector);
  const pageCount = useGridSelector(apiRef, gridPageCountSelector);

  const handlePageChange = (_event: React.ChangeEvent<unknown>, value: number) => {
    apiRef.current.setPage(value - 1);
  };

  return (
    <Pagination
      color="primary"
      count={pageCount}
      page={page + 1}
      onChange={handlePageChange}
      sx={{display:'flex', justifyContent:'center', alignItems:'center'}}
    />
  );
};

export default CustomPagination;
