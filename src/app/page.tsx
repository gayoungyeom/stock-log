"use client"

import { Input, Table } from "@components/ui"
import {
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@components/ui/table"
import dayjs from "dayjs"
import { useState } from "react"

/** 지정한 범위의 숫자들을 step만큼 떨어진 배열로 만들어서 반환 */
const getRange = (start: number, end: number, step: number) => {
  const result = []

  for (let i = start; i <= end; i += step) {
    result.push(i)
  }

  return result
}

export default function Home() {
  const today = dayjs().format("YYYY-MM-DD")

  const [date, setDate] = useState(today)
  const [name, setName] = useState<string>("AAPL")
  const [curPrice, setCurPrice] = useState<number | undefined>()

  const PERCENTAGES = getRange(2.5, 25, 2.5)

  const getMinusPercentage = (value: number, percentgae: number) => {
    return value * ((100 - percentgae) / 100)
  }

  return (
    <main className="container pt-6">
      <div className="w-full flex flex-col space-y-4">
        <div className="space-y-2">
          <div className="text-xs text-right text-slate-500">
            *You can change the date and name.
          </div>
          <div className="flex items-center justify-end space-x-2">
            <Input
              className="w-1/3 min-w-32 h-9 rounded-3xl bg-slate-900 text-white text-center focus-visible:rounded-3xl focus-visible:ring-0 focus-visible:ring-offset-0"
              type="text"
              placeholder="Date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
            />
            <Input
              className="w-1/3 min-w-32 h-9 rounded-3xl bg-slate-900 text-white text-center focus-visible:rounded-3xl focus-visible:ring-0 focus-visible:ring-offset-0"
              type="text"
              placeholder="Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>
        </div>

        <div className="flex items-center space-x-2">
          <span>$</span>
          <Input
            type="number"
            step="0.01"
            placeholder="price"
            onChange={(e) => setCurPrice(Number(e.target.value))}
          />
        </div>
      </div>

      <div className="mt-6">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[200px]">Percentage</TableHead>
              <TableHead className="text-right">Value</TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {PERCENTAGES.map((percentage) => (
              <TableRow key={percentage}>
                <TableCell>-{percentage.toFixed(1)}%</TableCell>
                <TableCell className="font-medium text-right">
                  {curPrice ? `$${getMinusPercentage(curPrice, percentage).toFixed(2)}` : "-"}
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
