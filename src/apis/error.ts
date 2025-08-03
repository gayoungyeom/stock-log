import { AxiosError } from "axios"

// Alpha Vantage API 에러 응답 타입
export interface AlphaVantageErrorResponse {
  Note?: string // API 레이트 리밋 에러
  "Error Message"?: string // 일반적인 API 에러 (잘못된 심볼, API 키 등)
  Information?: string // 추가 정보 (API 키 관련, 레이트 리밋 등)
}

// Alpha Vantage API 성공 응답에도 에러가 포함될 수 있음
export interface AlphaVantageSuccessResponse {
  [key: string]: unknown
  Note?: string
  "Error Message"?: string
  Information?: string
}

// 커스텀 API 에러 타입
export type ApiError = AxiosError<AlphaVantageErrorResponse>

// 에러 유형 판별 함수들
export const isAlphaVantageError = (error: unknown): error is ApiError => {
  if (error && typeof error === "object" && "isAxiosError" in error) {
    return true
  }

  return (
    error instanceof Error &&
    "response" in error &&
    typeof error.response === "object" &&
    error.response !== null
  )
}

export const isRateLimitError = (error: unknown): boolean => {
  if (!isAlphaVantageError(error)) return false
  return !!(
    error.response?.data?.Note?.includes("rate limit") ||
    error.response?.data?.Note?.includes("call frequency") ||
    error.response?.data?.Information?.includes("rate limit") ||
    error.response?.data?.Information?.includes("API rate limit")
  )
}

export const isInvalidApiKeyError = (error: unknown): boolean => {
  if (!isAlphaVantageError(error)) return false
  return !!(
    error.response?.data?.["Error Message"]?.includes("apikey") ||
    error.response?.data?.["Error Message"]?.includes("API key") ||
    error.response?.data?.Information?.includes("API key")
  )
}

export const isInvalidSymbolError = (error: unknown): boolean => {
  if (!isAlphaVantageError(error)) return false
  return !!(
    error.response?.data?.["Error Message"]?.includes("Invalid API call") ||
    error.response?.data?.["Error Message"]?.includes("symbol")
  )
}

// 에러 메시지 추출 함수
export const getErrorMessage = (error: unknown): string => {
  if (!isAlphaVantageError(error)) {
    return "네트워크 오류가 발생했습니다."
  }

  const errorData = error.response?.data

  // Information 필드 체크 (200 OK이지만 에러 메시지가 있는 경우)
  if (errorData?.Information) {
    if (
      errorData.Information.includes("rate limit") ||
      errorData.Information.includes("API rate limit")
    ) {
      return "API 요청 한도를 초과했습니다. 잠시 후 다시 시도해주세요."
    }
    if (errorData.Information.includes("API key")) {
      return "API 키 설정을 확인해주세요. 무료 플랜의 요청 한도를 초과했을 수 있습니다."
    }
    return errorData.Information
  }

  if (errorData?.Note) {
    if (errorData.Note.includes("rate limit") || errorData.Note.includes("call frequency")) {
      return "API 요청 한도를 초과했습니다. 잠시 후 다시 시도해주세요."
    }
    return errorData.Note
  }

  if (errorData?.["Error Message"]) {
    if (errorData["Error Message"].includes("apikey")) {
      return "API 키가 유효하지 않습니다. 설정을 확인해주세요."
    }
    if (errorData["Error Message"].includes("Invalid API call")) {
      return "잘못된 종목 심볼입니다. 올바른 심볼을 입력해주세요."
    }
    return errorData["Error Message"]
  }

  return "데이터를 가져오는 중 오류가 발생했습니다."
}
