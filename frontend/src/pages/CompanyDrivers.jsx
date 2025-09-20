import React, { useState } from "react";
import {
  useReactTable,
  getCoreRowModel,
  getPaginationRowModel,
  flexRender,
} from "@tanstack/react-table";
import DriverForm from "../components/companyDashboard/DriverForm";
import { useDrivers } from "../hooks/company/useDrivers";

const CompanyDrivers = () => {
  const { drivers, loading, error, createDriver } = useDrivers();
  const [showForm, setShowForm] = useState(false);

  const columns = [
    {
      header: "Name",
      accessorFn: (row) => `${row.first_name} ${row.last_name}`,
      id: "name",
    },
    {
      header: "Email",
      accessorFn: (row) => row.user?.email || "",
    },
    {
      header: "Phone",
      accessorKey: "phone",
    },
    {
      header: "City",
      accessorKey: "city",
    },
    {
      header: "Country",
      accessorKey: "country",
    },
    {
      header: "Actions",
      cell: () => (
        <div className="flex space-x-3">
          <button className="text-blue-600 hover:text-blue-800 transition-colors duration-200 p-1 rounded-lg hover:bg-blue-50">
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
              />
            </svg>
          </button>
          <button className="text-red-600 hover:text-red-800 transition-colors duration-200 p-1 rounded-lg hover:bg-red-50">
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
              />
            </svg>
          </button>
        </div>
      ),
    },
  ];

  const table = useReactTable({
    data: drivers,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
  });

  const handleAddDriver = async (driverData) => {
    const result = await createDriver(driverData);
    if (!result.error) setShowForm(false);
  };

  if (loading) return <p>Loading drivers...</p>;
  if (error) return <p className="text-red-500">Error: {error}</p>;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 p-6">
      <div className="w-[100%] mx-auto">
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-100">
          <div className="px-8 py-6 border-b border-gray-200">
            <div className="flex justify-between items-center">
              <div>
                <h1 className="text-3xl font-bold text-gray-800">
                  Driver Management
                </h1>
                <p className="text-gray-600 mt-2">
                  Manage your drivers and their information
                </p>
              </div>
              <button
                onClick={() => setShowForm(true)}
                className="px-5 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl hover:from-blue-700 hover:to-purple-700 transition-all duration-200 shadow-md hover:shadow-lg flex items-center font-medium"
              >
                <svg
                  className="w-5 h-5 mr-2"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                  />
                </svg>
                Add New Driver
              </button>
            </div>
          </div>

          <div className="p-8">
            <div className="rounded-xl border border-gray-200 overflow-hidden shadow-sm">
              <table className="w-full">
                <thead>
                  {table.getHeaderGroups().map((headerGroup) => (
                    <tr
                      key={headerGroup.id}
                      className="bg-gradient-to-r from-gray-50 to-gray-100"
                    >
                      {headerGroup.headers.map((header) => (
                        <th
                          key={header.id}
                          className="p-4 text-left text-sm font-semibold text-gray-700 uppercase tracking-wider"
                        >
                          {flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                        </th>
                      ))}
                    </tr>
                  ))}
                </thead>
                <tbody>
                  {table.getRowModel().rows.map((row, index) => (
                    <tr
                      key={row.id}
                      className={`${
                        index % 2 === 0 ? "bg-white" : "bg-gray-50"
                      } hover:bg-blue-50 transition-colors duration-150`}
                    >
                      {row.getVisibleCells().map((cell) => (
                        <td
                          key={cell.id}
                          className="p-4 text-sm text-gray-700 border-t border-gray-200"
                        >
                          {flexRender(
                            cell.column.columnDef.cell,
                            cell.getContext()
                          )}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            <div className="flex items-center justify-between mt-6">
              <div className="text-sm text-gray-700">
                Showing {table.getState().pagination.pageIndex + 1} of{" "}
                {table.getPageCount()} pages
              </div>

              <div className="flex space-x-2">
                <button
                  onClick={() => table.previousPage()}
                  disabled={!table.getCanPreviousPage()}
                  className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-xl hover:bg-gray-50 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Previous
                </button>
                <button
                  onClick={() => table.nextPage()}
                  disabled={!table.getCanNextPage()}
                  className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-xl hover:bg-gray-50 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Next
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {showForm && (
        <DriverForm
          onSubmit={handleAddDriver}
          onCancel={() => setShowForm(false)}
        />
      )}

      <style>
        {`
    @keyframes fadeIn {
      from {
        opacity: 0;
      }
      to {
        opacity: 1;
      }
    }
    .animate-fadeIn {
      animation: fadeIn 0.3s ease-out;
    }
  `}
      </style>
    </div>
  );
};

export default CompanyDrivers;
