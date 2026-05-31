import { useCallback, useEffect, useState } from 'react';

const STORAGE_KEY = 'taskFilters';

type TaskFiltersState = {
  search: string;
  difficulty: string;
  page: number;
  limit: number;
};

const defaultFilters: TaskFiltersState = {
  search: '',
  difficulty: '',
  page: 1,
  limit: 12,
};

const loadFilters = (): TaskFiltersState => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return defaultFilters;

    const parsed = JSON.parse(raw);

    return {
      search: typeof parsed.search === 'string' ? parsed.search : '',
      difficulty: typeof parsed.difficulty === 'string' ? parsed.difficulty : '',
      page: typeof parsed.page === 'number' && parsed.page > 0 ? parsed.page : 1,
      limit: typeof parsed.limit === 'number' && parsed.limit > 0 ? parsed.limit : 12,
    };
  } catch {
    return defaultFilters;
  }
};

export const useTaskFilters = () => {
  const [filters, setFilters] = useState<TaskFiltersState>(loadFilters);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(filters));
  }, [filters]);

  const setSearch = useCallback((search: string) => {
    setFilters((prev) => ({
      ...prev,
      search,
      page: 1,
    }));
  }, []);

  const setDifficulty = useCallback((difficulty: string) => {
    setFilters((prev) => ({
      ...prev,
      difficulty,
      page: 1,
    }));
  }, []);

  const setPage = useCallback((page: number) => {
    setFilters((prev) => ({
      ...prev,
      page,
    }));
  }, []);

  const setLimit = useCallback((limit: number) => {
    setFilters((prev) => ({
      ...prev,
      limit,
      page: 1,
    }));
  }, []);

  const resetFilters = useCallback(() => {
    setFilters(defaultFilters);
  }, []);

  return {
    search: filters.search,
    difficulty: filters.difficulty,
    page: filters.page,
    limit: filters.limit,
    setSearch,
    setDifficulty,
    setPage,
    setLimit,
    resetFilters,
  };
};