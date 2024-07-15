"use client"

import { Button, Input, Table } from "@components/ui"
import {
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@components/ui/table"
import { MagnifyingGlassIcon } from "@radix-ui/react-icons"
import { KeyboardEvent, useState } from "react"

/** 지정한 범위의 숫자들을 step만큼 떨어진 배열로 만들어서 반환 */
const getRange = (start: number, end: number, step: number) => {
  const result = []

  for (let i = start; i <= end; i += step) {
    result.push(i)
  }

  return result
}

/** 엔터 클릭 시 이벤트 핸들러 실행 */
const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>, eventHandler: () => void) => {
  if (e.nativeEvent.isComposing) return
  if (e.key === "Enter") eventHandler()
}

export default function Home() {
  const [inputPrice, setInputPrice] = useState<number | undefined>()
  const [curPrice, setCurPrice] = useState<number | undefined>()

  const PERCENTAGES = getRange(2.5, 25, 2.5)

  const getMinusPercentage = (value: number, percentgae: number) => {
    return value * ((100 - percentgae) / 100)
  }

  const handleSearchClick = () => {
    setCurPrice(inputPrice)
  }

  return (
    <main className="container pt-6">
      <div className="flex w-full max-w-sm items-center space-x-2">
        <span>$</span>
        <Input
          type="number"
          step="0.01"
          placeholder="Enter current price"
          onChange={(e) => setInputPrice(Number(e.target.value))}
          onKeyDown={(e) => handleKeyDown(e, handleSearchClick)}
        />
        <Button onClick={handleSearchClick}>
          <MagnifyingGlassIcon />
        </Button>
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
