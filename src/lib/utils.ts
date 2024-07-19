import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/** 지정한 범위의 숫자들을 step만큼 떨어진 배열로 만들어서 반환 */
export const getRange = ({ start, end, step }: { start: number; end: number; step: number }) => {
  const result = []

  for (let i = start; i <= end; i += step) {
    result.push(i)
  }

  return result
}
