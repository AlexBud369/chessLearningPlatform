import { useCallback, useEffect, useState } from 'react';
import type { CompletionStatus } from '../../../shared/api/coursesApi';

const STORAGE_KEY = 'taskFilters';

type TaskFiltersState = {
  search: string;
  difficulty: string;
  status: CompletionStatus | '';
  page: number;
  limit: number;
};

const defaultFilters: TaskFiltersState = {
  search: '',
  difficulty: '',
  status: '',
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
      status: parsed.status === 'completed' || parsed.status === 'not_completed' ? parsed.status : '',
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

  const setStatus = useCallback((status: CompletionStatus | '') => {
    setFilters((prev) => ({
      ...prev,
      status,
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
    localStorage.removeItem(STORAGE_KEY);
  }, []);

  return {
    search: filters.search,
    difficulty: filters.difficulty,
    status: filters.status,
    page: filters.page,
    limit: filters.limit,
    setSearch,
    setDifficulty,
    setStatus,
    setPage,
    setLimit,
    resetFilters,
  };
};