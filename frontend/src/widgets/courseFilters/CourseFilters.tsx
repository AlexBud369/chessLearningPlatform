import React, { useEffect, useState } from 'react';
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
import { setFilters } from '../../entities/course/model/store';
import { themesApi, Theme } from '../../shared/api/themesApi';
import type { CourseFilters as CourseFiltersType, CompletionStatus } from '../../shared/api/coursesApi';
import { DIFFICULTY_LEVELS } from '../../shared/lib/difficulty';
import { useAppDispatch, useAppSelector } from '../../shared/lib/hooks';

export const CourseFilters: React.FC = () => {
  const { t } = useTranslation();
  const dispatch = useAppDispatch();
  const user = useAppSelector((state) => state.user.user);
  const { filters, updateFilter, clearFilters } = useCourseFilters();
  const [themes, setThemes] = useState<Theme[]>([]);
  const [searchInput, setSearchInput] = useState(filters.search || '');
  const [debouncedSearch, setDebouncedSearch] = useState(filters.search || '');

  useEffect(() => {
    if (!user && filters.status) {
      updateFilter('status', undefined);
    }
  }, [user, filters.status, updateFilter]);

  useEffect(() => {
    themesApi.fetchThemes().then(setThemes).catch(console.error);
  }, []);

  useEffect(() => {
    setSearchInput(filters.search || '');
    setDebouncedSearch(filters.search || '');
  }, [filters.search]);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearch(searchInput);
    }, 300);

    return () => clearTimeout(handler);
  }, [searchInput]);

  useEffect(() => {
    const normalizedSearch = debouncedSearch.trim() || undefined;
    const currentSearch = filters.search || undefined;

    if (normalizedSearch !== currentSearch) {
      updateFilter('search', normalizedSearch);
    }
  }, [debouncedSearch, filters.search, updateFilter]);

  const handleThemeChange = (event: SelectChangeEvent<number | string>) => {
    const value = event.target.value as number | '';
    const normalizedValue = value === '' ? undefined : Number(value);

    if (filters.theme_id !== normalizedValue) {
      updateFilter('theme_id', normalizedValue);
    }
  };

  const handleSortByChange = (event: SelectChangeEvent<string>) => {
    const value = event.target.value as CourseFiltersType['sortBy'] | '';
    const normalizedValue = value || undefined;

    if (filters.sortBy !== normalizedValue) {
      updateFilter('sortBy', normalizedValue);
    }
  };

  const handleSortOrderChange = (event: SelectChangeEvent<string>) => {
    const value = event.target.value as 'ASC' | 'DESC' | '';
    const normalizedValue = value || undefined;

    if (filters.sortOrder !== normalizedValue) {
      updateFilter('sortOrder', normalizedValue);
    }
  };

  const handleStatusChange = (event: SelectChangeEvent<string>) => {
    const value = event.target.value as CompletionStatus | '';
    const normalizedValue = value || undefined;

    if (filters.status !== normalizedValue) {
      dispatch(setFilters({ status: normalizedValue, page: 1 }));
    }
  };

  const handleDifficultyChange = (event: SelectChangeEvent<number | string>) => {
    const value = event.target.value;
    const normalizedValue = value === '' ? undefined : Number(value);

    if (filters.difficulty !== normalizedValue) {
      updateFilter('difficulty', normalizedValue);
    }
  };

  const handleClearFilters = () => {
    setSearchInput('');
    setDebouncedSearch('');
    clearFilters();
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

        {user && (
          <FormControl size="small" sx={{ minWidth: 170 }}>
            <InputLabel>{t('filters.status')}</InputLabel>
            <Select
              value={filters.status ?? ''}
              onChange={handleStatusChange}
              label={t('filters.status')}
            >
              <MenuItem value="">{t('filters.allStatuses')}</MenuItem>
              <MenuItem value="completed">{t('filters.completed')}</MenuItem>
              <MenuItem value="not_completed">{t('filters.notCompleted')}</MenuItem>
            </Select>
          </FormControl>
        )}

        <FormControl size="small" sx={{ minWidth: 130 }}>
          <InputLabel>{t('filters.difficulty')}</InputLabel>
          <Select
            value={filters.difficulty ?? ''}
            onChange={handleDifficultyChange}
            label={t('filters.difficulty')}
          >
            <MenuItem value="">{t('filters.allDifficulties')}</MenuItem>
            {DIFFICULTY_LEVELS.map((level) => (
              <MenuItem key={level} value={level}>
                {t(`difficulty.level${level}`)}
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
            <MenuItem value="difficulty">{t('filters.byDifficulty')}</MenuItem>
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

        <Button variant="outlined" onClick={handleClearFilters}>
          {t('filters.clearFilters')}
        </Button>
      </Box>
    </Paper>
  );
};