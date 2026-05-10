import { usePortfolio } from '@/src/context/PortfolioContext';

export function usePortfolioData() {
  return usePortfolio();
}
