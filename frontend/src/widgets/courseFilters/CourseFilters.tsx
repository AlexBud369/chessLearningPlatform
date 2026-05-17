import React, { useState, useEffect } from 'react';
import {
  Paper,
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Button,
  Box,
  SelectChangeEvent,
} from '@mui/material';
import { useTranslation } from 'react-i18next';
import { useCourseFilters } from '../../features/course-filters/model/useCourseFilters';
import { themesApi, Theme } from '../../shared/api/themesApi';
import type { CourseFilters as CourseFiltersType } from '../../shared/api/coursesApi';

export const CourseFilters: React.FC = () => {
  const { t } = useTranslation();
  const { filters, updateFilter, clearFilters } = useCourseFilters();
  const [themes, setThemes] = useState<Theme[]>([]);
  const [searchInput, setSearchInput] = useState(filters.search || '');
  const [debouncedSearch, setDebouncedSearch] = useState(filters.search || '');

  useEffect(() => {
    themesApi.fetchThemes().then(setThemes).catch(console.error);
  }, []);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearch(searchInput);
    }, 300);
    return () => clearTimeout(handler);
  }, [searchInput]);

  useEffect(() => {
    updateFilter('search', debouncedSearch || undefined);
  }, [debouncedSearch, updateFilter]);

  const handleThemeChange = (event: SelectChangeEvent<number | string>) => {
    const value = event.target.value as number | '';
    updateFilter('theme_id', value || undefined);
  };

  const handleSortByChange = (event: SelectChangeEvent<string>) => {
    const value = event.target.value as CourseFiltersType['sortBy'] | '';
    updateFilter('sortBy', value || undefined);
  };

  const handleSortOrderChange = (event: SelectChangeEvent<string>) => {
    const value = event.target.value as 'ASC' | 'DESC' | '';
    updateFilter('sortOrder', value || undefined);
  };

  return (
    <Paper sx={{ p: 2, mb: 3 }}>
      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2, alignItems: 'center' }}>
        <TextField
          label={t('filters.search')}
          variant="outlined"
          size="small"
          value={searchInput}
          onChange={(e) => setSearchInput(e.target.value)}
          sx={{ minWidth: 200 }}
        />
        <FormControl size="small" sx={{ minWidth: 150 }}>
          <InputLabel>{t('filters.theme')}</InputLabel>
          <Select
            value={filters.theme_id ?? ''}
            onChange={handleThemeChange}
            label={t('filters.theme')}
          >
            <MenuItem value="">{t('filters.allThemes')}</MenuItem>
            {themes.map((theme) => (
              <MenuItem key={theme.id} value={theme.id}>
                {theme.name}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
         <FormControl size="small" sx={{ minWidth: 120 }}>
          <InputLabel>{t('filters.sortBy')}</InputLabel>
          <Select
            value={filters.sortBy ?? ''}
            onChange={handleSortByChange}
            label={t('filters.sortBy')}
          >
            <MenuItem value="">{t('filters.noSort')}</MenuItem>
            <MenuItem value="title">{t('filters.byTitle')}</MenuItem>
            <MenuItem value="created_at">{t('filters.byDate')}</MenuItem>
          </Select>
        </FormControl>
        {filters.sortBy && (
          <FormControl size="small" sx={{ minWidth: 100 }}>
            <InputLabel>{t('filters.order')}</InputLabel>
            <Select
              value={filters.sortOrder ?? 'ASC'}
              onChange={handleSortOrderChange}
              label={t('filters.order')}
            >
              <MenuItem value="ASC">{t('filters.ascending')}</MenuItem>
              <MenuItem value="DESC">{t('filters.descending')}</MenuItem>
            </Select>
          </FormControl>
        )}
        <Button variant="outlined" onClick={clearFilters}>
          {t('filters.clearFilters')}
        </Button>
      </Box>
    </Paper>
  );
};