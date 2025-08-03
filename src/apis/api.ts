import axios from "axios"

const apiKey = process.env.ALPHA_VANTAGE_API_KEY

const api = axios.create({
  baseURL: "https://www.alphavantage.co/query",
  timeout: 5000,
})

api.interceptors.request.use((config) => {
  if (!config.params) {
    config.params = {}
  }

  config.params["apikey"] = apiKey

  return config
})

api.interceptors.response.use(
  (response) => {
    // 200 OK이지만 Information, Note, Error Message가 있으면 에러로 처리
    if (response.data?.Information || response.data?.Note || response.data?.["Error Message"]) {
      const error = new Error(
        response.data.Information ||
          response.data.Note ||
          response.data["Error Message"] ||
          "API 응답에 오류가 있습니다.",
      )

      const axiosError = {
        ...error,
        response: {
          ...response,
          data: response.data,
        },
        isAxiosError: true,
        config: response.config,
      }
      return Promise.reject(axiosError)
    }
    return response
  },
  (error) => {
    return Promise.reject(error)
  },
)

export default api
