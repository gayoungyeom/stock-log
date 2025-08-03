import api from "./api"

// 개별 종목 개요 정보 (시가총액, 52주 최고가 등)
export const getStockOverview = async (symbol: string) => {
  const response = await api.get("", {
    params: {
      function: "OVERVIEW",
      symbol,
    },
  })
  return response.data
}

// 개별 종목 현재가 정보
export const getStockQuote = async (symbol: string) => {
  const response = await api.get("", {
    params: {
      function: "GLOBAL_QUOTE",
      symbol,
    },
  })
  return response.data
}

// 나스닥 지수 데이터 (최근 100일)
export const getNasdaqIndex = async () => {
  const response = await api.get("", {
    params: {
      function: "TIME_SERIES_DAILY",
      symbol: "IXIC", // 나스닥 종합지수
      outputsize: "compact", // 최근 100일
    },
  })
  return response.data
}

// 연준 기준금리 데이터
export const getFederalFundsRate = async () => {
  const response = await api.get("", {
    params: {
      function: "FEDERAL_FUNDS_RATE",
    },
  })
  return response.data
}

// 나스닥 시총 상위 종목들
export const TOP_NASDAQ_STOCKS = ["NVDA", "MSFT", "AAPL", "GOOGL", "AMZN"] as const
