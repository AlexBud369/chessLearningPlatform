import React from 'react';
import { Pagination as MuiPagination, PaginationProps } from '@mui/material';

interface CustomPaginationProps extends PaginationProps {
  count: number;
  page: number;
  onChange: (event: React.ChangeEvent<unknown>, page: number) => void;
}

export const Pagination: React.FC<CustomPaginationProps> = ({ count, page, onChange, ...rest }) => {
  return (
    <MuiPagination
      count={count}
      page={page}
      onChange={onChange}
      color="primary"
      shape="rounded"
      {...rest}
    />
  );
};