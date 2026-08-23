"use client"; // Add this directive for client-side hooks

import * as React from "react";
import {
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel, // Corrected import
  useReactTable,
  ColumnDef,
  FilterFn, // Import FilterFn type
} from "@tanstack/react-table";
import { DataTable as DataTableType } from "@/types/types";
import Cell from "./Cell";
import { Input } from "../ui/input";
import { useProfileData } from "@/lib/atom";

type DataTableProps = {
  data: any[];
};

// Define a default input renderer for EditableCell
const defaultInputRenderer = ({ value, onChange, onBlur, onKeyDown, ref }: any) => (
  <Input
    value={value as string}
    onChange={onChange}
    onBlur={onBlur}
    onKeyDown={onKeyDown}
    ref={ref}
    className="text-xs w-full h-full p-0 border-none rounded-none" // Basic styling
  />
);

export default function DataTable({ data }: DataTableProps) {
  const columnHelper = createColumnHelper<DataTableType>();
  const [rowSelection, setRowSelection] = React.useState({}); // Corrected initial state for row selection
  const [globalFilter, setGlobalFilter] = React.useState(''); // State for the global filter value
  const [profileData, setProfileData] = useProfileData(); // Use the atom for profile data

  React.useEffect(() => {
    console.log(profileData)
  }, [profileData])


  // Define columns using EditableCell
  const columns = React.useMemo<ColumnDef<DataTableType, any>[]>(
    () => [
      columnHelper.accessor("name", {
        header: "Name",
        cell: (info) => (
          <Cell {...info} renderInput={defaultInputRenderer} />
        ),
        filterFn: 'includesString', // Basic filter if not using fuzzy
      }),
      columnHelper.accessor("ethnicity", {
        header: "Ethnicity",
        cell: (info) => (
          <Cell {...info} renderInput={defaultInputRenderer} />
        ),
        enableGlobalFilter: false, // Disable global filtering for this column
      }),
      columnHelper.accessor("ageGroup", {
        header: "Age Group",
        cell: (info) => (
          <Cell {...info} renderInput={defaultInputRenderer} />
        ),
        enableGlobalFilter: false, // Disable global filtering for this column
      }),
      columnHelper.accessor("benefits", {
        header: "Benefits",
        cell: (info) => (
          <Cell {...info} renderInput={defaultInputRenderer} />
        ),
        enableGlobalFilter: false, // Disable global filtering for this column
      }),
    ],
    [columnHelper]
  );

  const table = useReactTable({
    data,
    columns,
    state: { // Pass state to the table
      globalFilter,
      rowSelection,
    },
    onGlobalFilterChange: setGlobalFilter, // Update state when filter changes
    globalFilterFn: 'includesString',
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(), // Corrected function name
    onRowSelectionChange: setRowSelection, // Handle row selection changes
    enableGlobalFilter: true, // Explicitly enable global filter
    // meta: { ... } // Keep your meta if needed for updates
  });

  React.useEffect(() => {
    const selectedRow = table.getSelectedRowModel().flatRows[0];
    if (selectedRow) {
      const selectedData = data.find(item => item.uuid === selectedRow.original.uuid);
      setProfileData(selectedData || null); // Update profile data atom
    } else {
      setProfileData(null);
    }
  }, [table.getSelectedRowModel().flatRows, data, setProfileData]); // Update effect dependencies

  return (
    <div className="py-4"> {/* Add some padding around the component */}
      <div className="mb-4"> {/* Margin below the search input */}
        <Input
          placeholder="Search names..."
          value={globalFilter ?? ''}
          onChange={e => setGlobalFilter(e.target.value)}
          className="max-w-sm" // Limit width of search input
        />
      </div>
      <div className="overflow-x-auto border rounded-md"> {/* Add border and rounding */}
        <table className="min-w-full divide-y divide-gray-200"> {/* Removed redundant border */}
          <thead className="bg-gray-50">
            {table.getHeaderGroups().map((headerGroup) => (
              <tr key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <th
                    key={header.id}
                    scope="col"
                    className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-b border-r border-gray-300 last:border-r-0" // Adjusted padding/border
                    style={{ width: header.getSize() !== 150 ? header.getSize() : undefined }} // Apply width unless default
                  >
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                        header.column.columnDef.header,
                        header.getContext()
                      )}
                  </th>
                ))}
              </tr>
            ))}
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {table.getRowModel().rows.map((row) => (
              <tr
                key={row.id}
                className="hover:bg-gray-50"
                data-state={row.getIsSelected() && 'selected'}
                onClick={() => {
                  setProfileData(row.original)
                }
                } // Add this onClick handler
              >
                {row.getVisibleCells().map((cell) => (
                  <td
                    key={cell.id}
                    className="p-0 border-r border-gray-200 last:border-r-0" // Adjusted border
                    style={{ width: cell.column.getSize() !== 150 ? cell.column.getSize() : undefined }} // Apply width unless default
                  >
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}