import { QueryClient } from '@tanstack/react-query';

const TWO_MINUTES = 2 * 60 * 1000;
const TEN_MINUTES = 10 * 60 * 1000;

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: TWO_MINUTES,
      gcTime: TEN_MINUTES,
      refetchOnWindowFocus: false,
      retry: 1,
    },
  },
});
