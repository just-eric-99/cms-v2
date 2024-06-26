import * as React from 'react'
import {
  ColumnDef,
  SortingState,
  ColumnFiltersState,
  flexRender,
  getCoreRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
  getFilteredRowModel,
} from '@tanstack/react-table'

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'

// import { Input } from '@/sortable/ui/input'
import { useNavigate } from 'react-router'
import { DataTablePagination } from '@/components/table/data-table-pagination.tsx'
import { Input } from '@/components/ui/input.tsx'
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-expect-error
import { StringOrTemplateHeader } from '@tanstack/table-core/src/types.ts'

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[]
  data: TData[]
  navigationPath: string
  createComponent?: React.ReactNode
}

export function DataTable<TData, TValue>({
  columns,
  data,
  navigationPath,
  createComponent,
}: DataTableProps<TData, TValue>) {
  const [sorting, setSorting] = React.useState<SortingState>([])
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    []
  )

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getFilteredRowModel: getFilteredRowModel(),
    state: { sorting, columnFilters },
  })
  const navigate = useNavigate()

  return (
    <>
      <div className='flex flex-row items-center justify-between gap-4 pb-4'>
        {/* todo: to parse in to filter field here */}
        {/*<Input*/}
        {/*  placeholder='Filter'*/}
        {/*  value={(table.getColumn('name')?.getFilterValue() as string) ?? ''}*/}
        {/*  onChange={(event) =>*/}
        {/*    table.getColumn('name')?.setFilterValue(event.target.value)*/}
        {/*  }*/}
        {/*  className='max-w-sm'*/}
        {/*/>*/}

        {table.getAllColumns().map((columnFilter) => {
          const getHeader = (header: StringOrTemplateHeader) => {
            if (typeof header === 'function')
              return header(columnFilter.columnDef)
            return header
          }

          const child = getHeader(columnFilter.columnDef.header).props.children
          const placeholder = typeof child === 'string' ? child : child[0]

          return (
            <Input
              key={columnFilter.columnDef.id}
              placeholder={`Filter ${placeholder}`}
              value={columnFilter.getFilterValue() as string}
              onChange={(event) =>
                columnFilter.setFilterValue(event.target.value)
              }
              className='max-w-sm'
            />
          )
        })}
        <div className={"flex-1"}/>
        {createComponent}
      </div>
      <div className='rounded-md border'>
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead key={header.id}>
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                    </TableHead>
                  )
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  className='cursor-pointer hover:bg-primary/10'
                  key={row.id}
                  data-state={row.getIsSelected() && 'selected'}
                  onClick={() => {
                    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                    // @ts-expect-error
                    navigate(navigationPath + '/' + row.original.id)
                  }}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className='h-24 text-center'
                >
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      <div className='flex items-center justify-end space-x-2 py-4'>
        <DataTablePagination table={table} />
      </div>
    </>
  )
}
