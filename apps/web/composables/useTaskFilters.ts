import type { ITasksQueryParams } from './useTasks';

export interface TaskFilters {
  statuses: string[];
  search: string;
}

export const useTaskFilters = (defaultSortBy = 'dueDate') => {
  const route = useRoute();
  const router = useRouter();

  // Инициализация фильтров из URL query параметров
  const getFiltersFromQuery = (): TaskFilters => {
    const query = route.query;
    const statusParam = query.status as string | undefined;
    return {
      statuses: statusParam 
        ? statusParam.split(',').map(s => s.trim()).filter(Boolean)
        : [],
      search: (query.title as string) || '',
    };
  };

  const getSortByFromQuery = (): string => {
    return (route.query.sortBy as string) || defaultSortBy;
  };

  const activeFilters = ref<TaskFilters>(getFiltersFromQuery());
  const sortBy = ref<string>(getSortByFromQuery());

  // Создаем computed для параметров запроса
  const queryParams = computed<ITasksQueryParams>(() => ({
    title: activeFilters.value.search || undefined,
    status: activeFilters.value.statuses && activeFilters.value.statuses.length > 0
      ? activeFilters.value.statuses
      : undefined,
    sortBy: sortBy.value,
  }));

  // Обновление URL при изменении фильтров
  const updateQueryParams = () => {
    const query: Record<string, any> = {};
    
    if (activeFilters.value.search) {
      query.title = activeFilters.value.search;
    }
    
    if (activeFilters.value.statuses && activeFilters.value.statuses.length > 0) {
      query.status = activeFilters.value.statuses.join(',');
    }
    
    if (sortBy.value && sortBy.value !== defaultSortBy) {
      query.sortBy = sortBy.value;
    }

    router.replace({ query });
  };

  const handleFiltersChange = (filters: Record<string, any>): void => {
    activeFilters.value = { ...filters } as TaskFilters;
    updateQueryParams();
  };

  const handleSortChange = (sortByValue: string): void => {
    sortBy.value = sortByValue;
    updateQueryParams();
  };

  // Синхронизация с URL при изменении route (например, при навигации назад/вперед)
  watch(() => route.query, () => {
    activeFilters.value = getFiltersFromQuery();
    sortBy.value = getSortByFromQuery();
  }, { deep: true });

  return {
    activeFilters,
    sortBy,
    queryParams,
    handleFiltersChange,
    handleSortChange,
  };
};

