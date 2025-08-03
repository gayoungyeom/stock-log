/* eslint-disable @typescript-eslint/no-explicit-any */
//TODO: 타입 정의
import { useQuery } from "@tanstack/react-query"
import { getStockOverview, getStockQuote, getNasdaqIndex, getFederalFundsRate } from "@apis/stock"
import { ApiError, isRateLimitError, isInvalidApiKeyError, isInvalidSymbolError } from "@apis/error"

// 쿼리 키 팩토리
export const stockQueryKeys = {
  all: ["stock"] as const,
  overview: (symbol: string) => [...stockQueryKeys.all, "overview", symbol] as const,
  quote: (symbol: string) => [...stockQueryKeys.all, "quote", symbol] as const,
  nasdaq: () => [...stockQueryKeys.all, "nasdaq"] as const,
  fedRate: () => [...stockQueryKeys.all, "fed-rate"] as const,
}

// 종목 개요 정보 훅 (시가총액, 52주 최고가 등)
export function useStockOverview(symbol: string) {
  return useQuery<any, ApiError>({
    queryKey: stockQueryKeys.overview(symbol),
    queryFn: () => getStockOverview(symbol),
    enabled: !!symbol && symbol.length >= 2, // 2글자 이상일 때만 호출
    staleTime: 10 * 60 * 1000, // 10분간 캐시 (기본 정보는 자주 변하지 않음)
    retry: (failureCount, error) => {
      // API 키 에러나 레이트 리밋은 재시도 안함
      if (isRateLimitError(error) || isInvalidApiKeyError(error) || isInvalidSymbolError(error)) {
        return false
      }
      return failureCount < 1
    },
  })
}

// 종목 현재가 정보 훅
export function useStockQuote(symbol: string) {
  return useQuery<any, ApiError>({
    queryKey: stockQueryKeys.quote(symbol),
    queryFn: () => getStockQuote(symbol),
    enabled: !!symbol && symbol.length >= 2,
    staleTime: 2 * 60 * 1000, // 2분간 캐시 (가격은 자주 변함)
    retry: (failureCount, error) => {
      if (isRateLimitError(error) || isInvalidApiKeyError(error) || isInvalidSymbolError(error)) {
        return false
      }
      return failureCount < 1
    },
  })
}

// 종목 전체 정보를 한번에 가져오는 훅
export function useStockData(symbol: string) {
  const overviewQuery = useStockOverview(symbol)
  const quoteQuery = useStockQuote(symbol)

  return {
    isLoading: overviewQuery.isLoading || quoteQuery.isLoading,
    isFetching: overviewQuery.isFetching || quoteQuery.isFetching,

    isError: overviewQuery.isError || quoteQuery.isError,
    error: overviewQuery.error || quoteQuery.error,

    // 데이터
    overview: overviewQuery.data,
    quote: quoteQuery.data,

    // 파싱된 데이터
    data:
      overviewQuery.data && quoteQuery.data
        ? {
            symbol: overviewQuery.data.Symbol,
            name: overviewQuery.data.Name,
            week52High: parseFloat(overviewQuery.data["52WeekHigh"]) || 0,
            week52Low: parseFloat(overviewQuery.data["52WeekLow"]) || 0,
            marketCap: overviewQuery.data.MarketCapitalization,
            currentPrice: parseFloat(quoteQuery.data["Global Quote"]?.["05. price"]) || 0,
            changePercent:
              parseFloat(
                quoteQuery.data["Global Quote"]?.["10. change percent"]?.replace("%", ""),
              ) || 0,
          }
        : null,

    refetch: () => {
      overviewQuery.refetch()
      quoteQuery.refetch()
    },
  }
}

// 나스닥 지수 훅
export function useNasdaqIndex() {
  return useQuery({
    queryKey: stockQueryKeys.nasdaq(),
    queryFn: getNasdaqIndex,
    staleTime: 5 * 60 * 1000, // 5분간 캐시
  })
}

// 연준 금리 훅
export function useFederalFundsRate() {
  return useQuery({
    queryKey: stockQueryKeys.fedRate(),
    queryFn: getFederalFundsRate,
    staleTime: 60 * 60 * 1000, // 1시간간 캐시 (금리는 자주 변하지 않음)
  })
}
