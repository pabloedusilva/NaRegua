import { ReactNode } from 'react'
import clsx from 'clsx'

interface Column<T> {
  header?: string
  label?: string
  key?: string
  accessor?: keyof T | ((row: T) => ReactNode)
  render?: (row: T) => ReactNode
  className?: string
  headerClassName?: string
}

interface TableProps<T> {
  data: T[]
  columns: Column<T>[]
  keyExtractor?: (row: T) => string
  emptyMessage?: string
  className?: string
  onRowClick?: (row: T) => void
}

function Table<T extends Record<string, any>>({
  data,
  columns,
  keyExtractor,
  emptyMessage = 'Nenhum registro encontrado',
  className,
  onRowClick
}: TableProps<T>) {
  const getColumnHeader = (column: Column<T>) => column.header || column.label || ''
  const getColumnValue = (column: Column<T>, row: T) => {
    if (column.render) return column.render(row)
    if (column.accessor) {
      return typeof column.accessor === 'function'
        ? column.accessor(row)
        : String(row[column.accessor] ?? '')
    }
    if (column.key) {
      return String(row[column.key] ?? '')
    }
    return ''
  }

  return (
    <div className={clsx('table-container', className)}>
      <table className="table">
        <thead>
          <tr>
            {columns.map((column, index) => (
              <th
                key={column.key || column.header || index}
                className={clsx(column.headerClassName)}
              >
                {getColumnHeader(column)}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.length === 0 ? (
            <tr>
              <td
                colSpan={columns.length}
                className="px-4 py-8 text-center text-muted"
              >
                {emptyMessage}
              </td>
            </tr>
          ) : (
            data.map((row, rowIndex) => (
              <tr
                key={keyExtractor ? keyExtractor(row) : rowIndex}
                className={clsx(onRowClick && 'cursor-pointer')}
                onClick={() => onRowClick?.(row)}
              >
                {columns.map((column, index) => (
                  <td
                    key={column.key || column.header || index}
                    className={clsx(column.className)}
                  >
                    {getColumnValue(column, row)}
                  </td>
                ))}
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  )
}

export { Table }
export default Table
 
