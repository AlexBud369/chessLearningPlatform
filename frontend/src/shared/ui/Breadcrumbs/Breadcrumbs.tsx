import { Breadcrumbs as MuiBreadcrumbs, Link, Typography } from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';

export type BreadcrumbItem = {
  label: string;
  path?: string;
};

interface BreadcrumbsProps {
  items: BreadcrumbItem[];
}

export const Breadcrumbs = ({ items }: BreadcrumbsProps) => (
  <MuiBreadcrumbs aria-label="breadcrumb" sx={{ mb: 2 }}>
    {items.map((item, index) => {
      const isLast = index === items.length - 1;

      if (isLast || !item.path) {
        return (
          <Typography key={`${item.label}-${index}`} color="text.primary" variant="body2">
            {item.label}
          </Typography>
        );
      }

      return (
        <Link
          key={`${item.label}-${index}`}
          component={RouterLink}
          to={item.path}
          underline="hover"
          color="inherit"
          variant="body2"
        >
          {item.label}
        </Link>
      );
    })}
  </MuiBreadcrumbs>
);
