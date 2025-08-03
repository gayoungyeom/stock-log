"use client"

import PercentageSetting from "@components/stock-log/PercentageSetting"
import { Input, Table } from "@components/ui"
import {
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@components/ui/table"
import { getRange } from "@lib/utils"
import dayjs from "dayjs"
import { useState, useEffect } from "react"
import { PERCENTAGES_BY_STEP } from "@lib/static"
import { useStockData } from "@hooks/useStock"
import { TOP_NASDAQ_STOCKS } from "@apis/stock"
import { getErrorMessage } from "@apis/error"

// TODO: 날짜 선택하면 해당 날짜 정보로 변경
export default function Home() {
  const today = dayjs().format("YYYY-MM-DD")

  const [week52High, setWeek52High] = useState<number | undefined>() //52주 최고가
  const [percentages, setPercentages] = useState(getRange({ ...PERCENTAGES_BY_STEP["2.5"] }))

  const { data: stockData, isFetching, error, isError } = useStockData(TOP_NASDAQ_STOCKS[0]) //TODO: 시총 1위 찾아서 넣기

  useEffect(() => {
    if (stockData?.week52High) {
      setWeek52High(stockData?.week52High)
    }
  }, [stockData])

  const getMinusPercentage = (value: number, percentgae: number) => {
    return value * ((100 - percentgae) / 100)
  }

  return (
    <main className="container pt-6">
      <div className="w-full flex flex-col space-y-4">
        {(isFetching || isError) && (
          <div
            className={`text-sm p-2 rounded ${
              isError ? "text-red-600 bg-red-50" : "text-blue-600 bg-blue-50"
            }`}
          >
            {isError ? `❌ ${getErrorMessage(error)}` : "📊 데이터 로딩 중..."}
          </div>
        )}

        <div className="bg-white border border-slate-200 rounded-lg overflow-hidden shadow-sm">
          <div className="bg-slate-50 px-4 py-3 border-b border-slate-200">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-semibold text-slate-800">
                  {stockData?.symbol ?? TOP_NASDAQ_STOCKS[0]}
                </h3>
                <p className="text-xs text-slate-600 mt-0.5">{stockData?.name}</p>
              </div>
              <div className="text-right">
                <div className="text-xs text-slate-500">기준일</div>
                <div className="text-sm font-medium text-slate-700 flex items-center gap-1">
                  📅 {today}
                </div>
              </div>
            </div>
          </div>

          <div className="p-4">
            <div className="grid grid-cols-3 gap-4 mb-3">
              <div>
                <div className="text-xs text-slate-500 mb-1">52주 최고가</div>
                <div className="text-lg font-semibold text-slate-800">
                  ${stockData?.week52High.toFixed(2)}
                </div>
              </div>
              <div>
                <div className="text-xs text-slate-500 mb-1">52주 최저가</div>
                <div className="text-lg font-semibold text-slate-800">
                  ${stockData?.week52Low.toFixed(2)}
                </div>
              </div>
              <div className="text-right">
                <div className="text-xs text-slate-500 mb-1">종가</div>
                <div className="text-lg font-semibold text-slate-800">
                  ${stockData?.currentPrice.toFixed(2)}
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-xs text-slate-600">시가총액</span>
                <span className="text-sm font-medium">{stockData?.marketCap ?? "-"}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-xs text-slate-600">전날 대비</span>
                <span
                  className={`text-sm font-medium ${
                    Number(stockData?.changePercent) >= 0 ? "text-green-600" : "text-red-600"
                  }`}
                >
                  {stockData?.changePercent
                    ? `${stockData?.changePercent >= 0 ? "+" : ""}${stockData?.changePercent}%`
                    : "-"}
                </span>
              </div>
            </div>
          </div>
        </div>

        <div className="flex items-center space-x-2">
          <span>$</span>
          <Input
            type="number"
            step="0.01"
            placeholder="price"
            value={week52High || ""}
            onChange={(e) => setWeek52High(Number(e.target.value))}
          />
        </div>
      </div>

      <div className="mt-6">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[200px]">
                <div className="flex items-center gap-2">
                  Percentage
                  <PercentageSetting
                    saveHandler={(settingValue) => setPercentages(getRange({ ...settingValue }))}
                  />
                </div>
              </TableHead>
              <TableHead className="text-center">Price</TableHead>
              <TableHead className="text-center border-l w-1">현금 비중</TableHead>
              <TableHead className="text-center border-l w-1">주식 비중</TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {percentages.map((percentage, index) => (
              <TableRow key={percentage}>
                <TableCell>-{percentage.toFixed(1)}%</TableCell>
                <TableCell className="font-medium text-center">
                  {week52High ? `$${getMinusPercentage(week52High, percentage).toFixed(2)}` : "-"}
                </TableCell>
                <TableCell className="font-medium text-center border-l w-1">
                  {10 * (index + 1)}%
                </TableCell>
                <TableCell className="font-medium text-center border-l w-1">
                  {10 * (10 - index - 1)}%
                </TableCell>
              </TableRow>
            ))}
          </TableBody>

          <TableCaption>A list of values calculated by percentage.</TableCaption>
        </Table>
      </div>
    </main>
  )
}
