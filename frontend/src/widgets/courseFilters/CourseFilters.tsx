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
import { useCourseFilters } from '../../features/course-filters/model/useCourseFilters';
import { themesApi, Theme } from '../../shared/api/themesApi';
import type { CourseFilters as CourseFiltersType } from '../../shared/api/coursesApi';

export const CourseFilters: React.FC = () => {
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
          label="Поиск"
          variant="outlined"
          size="small"
          value={searchInput}
          onChange={(e) => setSearchInput(e.target.value)}
          sx={{ minWidth: 200 }}
        />
        <FormControl size="small" sx={{ minWidth: 150 }}>
          <InputLabel>Тема</InputLabel>
          <Select
            value={filters.theme_id ?? ''}
            onChange={handleThemeChange}
            label="Тема"
          >
            <MenuItem value="">Все темы</MenuItem>
            {themes.map((theme) => (
              <MenuItem key={theme.id} value={theme.id}>
                {theme.name}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
        <FormControl size="small" sx={{ minWidth: 120 }}>
          <InputLabel>Сортировать</InputLabel>
          <Select
            value={filters.sortBy ?? ''}
            onChange={handleSortByChange}
            label="Сортировать"
          >
            <MenuItem value="">Без сортировки</MenuItem>
            <MenuItem value="title">По названию</MenuItem>
            <MenuItem value="created_at">По дате</MenuItem>
          </Select>
        </FormControl>
        {filters.sortBy && (
          <FormControl size="small" sx={{ minWidth: 100 }}>
            <InputLabel>Порядок</InputLabel>
            <Select
              value={filters.sortOrder ?? 'ASC'}
              onChange={handleSortOrderChange}
              label="Порядок"
            >
              <MenuItem value="ASC">Возрастание</MenuItem>
              <MenuItem value="DESC">Убывание</MenuItem>
            </Select>
          </FormControl>
        )}
        <Button variant="outlined" onClick={clearFilters}>
          Сбросить фильтры
        </Button>
      </Box>
    </Paper>
  );
};