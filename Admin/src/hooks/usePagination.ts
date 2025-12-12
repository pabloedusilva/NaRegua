import { useState } from 'react'

export function usePagination(initialPage: number = 1, initialPageSize: number = 10) {
  const [page, setPage] = useState(initialPage)
  const [pageSize, setPageSize] = useState(initialPageSize)

  const goToPage = (newPage: number) => setPage(newPage)
  const nextPage = () => setPage(prev => prev + 1)
  const prevPage = () => setPage(prev => Math.max(1, prev - 1))

  return {
    page,
    pageSize,
    setPage,
    setPageSize,
    goToPage,
    nextPage,
    prevPage,
  }
}
