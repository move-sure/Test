// components/BiltyList.js
'use client';

import { useState, useEffect } from 'react';
import { getBiltyList, deleteBilty } from './datafetch';

/**
 * Component for displaying a paginated list of bilty records with search and delete functionality
 */
const BiltyList = () => {
  const [bilties, setBilties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [totalCount, setTotalCount] = useState(0);
  const [page, setPage] = useState(1);
  const [pageSize] = useState(10);
  const [sortField, setSortField] = useState('bilty_date');
  const [sortDirection, setSortDirection] = useState(false); // false = descending
  const [searchTerm, setSearchTerm] = useState('');
  const [isDeleting, setIsDeleting] = useState(false);
  const [deleteId, setDeleteId] = useState(null);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  // Fetch bilty data when component mounts or dependencies change
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const { data, count, error } = await getBiltyList(
          page,
          pageSize,
          sortField,
          sortDirection,
          searchTerm
        );

        if (error) throw error;
        
        setBilties(data);
        setTotalCount(count);
      } catch (err) {
        console.error('Error fetching bilty list:', err);
        setError('Failed to load bilty data. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [page, pageSize, sortField, sortDirection, searchTerm, refreshTrigger]);

  // Handle search input
  const handleSearch = (e) => {
    const value = e.target.value;
    setSearchTerm(value);
    setPage(1); // Reset to first page when searching
  };

  // Handle sort column click
  const handleSort = (field) => {
    if (field === sortField) {
      // Toggle direction if same field
      setSortDirection(!sortDirection);
    } else {
      // Set new field and default to descending
      setSortField(field);
      setSortDirection(false);
    }
    setPage(1); // Reset to first page when sorting
  };

  // Handle pagination
  const handlePageChange = (newPage) => {
    setPage(newPage);
  };

  // Open delete confirmation dialog
  const openDeleteConfirm = (id) => {
    setDeleteId(id);
    setConfirmDelete(true);
  };

  // Close delete confirmation dialog
  const closeDeleteConfirm = () => {
    setDeleteId(null);
    setConfirmDelete(false);
  };

  // Handle delete confirmation
  const handleDelete = async () => {
    if (!deleteId) return;
    
    setIsDeleting(true);
    try {
      const { success, error } = await deleteBilty(deleteId);
      
      if (error) throw error;
      
      if (success) {
        // Refresh the list
        setRefreshTrigger(prev => prev + 1);
      }
    } catch (err) {
      console.error('Error deleting bilty:', err);
      setError('Failed to delete bilty. Please try again.');
    } finally {
      setIsDeleting(false);
      closeDeleteConfirm();
    }
  };

  // Format date for display
  const formatDate = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-GB', { day: '2-digit', month: '2-digit', year: 'numeric' });
  };

  // Calculate total number of pages
  const totalPages = Math.ceil(totalCount / pageSize);

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6">
        <h2 className="text-2xl font-bold text-blue-900 mb-4 sm:mb-0">Bilty Records</h2>
        
        <div className="relative w-full sm:w-64">
          <input
            type="text"
            value={searchTerm}
            onChange={handleSearch}
            placeholder="Search bilties..."
            className="w-full px-4 py-2 pr-10 border border-gray-400 rounded-md shadow-sm text-black focus:outline-none focus:ring-indigo-600 focus:border-indigo-600"
          />
          <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
            <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
        </div>
      </div>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          <span>{error}</span>
        </div>
      )}

      <div className="overflow-x-auto">
        <table className="min-w-full bg-white border border-gray-300 shadow-sm rounded-lg overflow-hidden">
          <thead className="bg-blue-50">
            <tr>
              <th 
                onClick={() => handleSort('gr_no')}
                className="px-4 py-3 text-left text-sm font-semibold text-blue-900 cursor-pointer hover:bg-blue-100 transition-colors"
              >
                <div className="flex items-center">
                  GR No
                  {sortField === 'gr_no' && (
                    <svg className={`ml-1 w-4 h-4 ${sortDirection ? '' : 'transform rotate-180'}`} fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                    </svg>
                  )}
                </div>
              </th>
              <th 
                onClick={() => handleSort('bilty_date')}
                className="px-4 py-3 text-left text-sm font-semibold text-blue-900 cursor-pointer hover:bg-blue-100 transition-colors"
              >
                <div className="flex items-center">
                  Date
                  {sortField === 'bilty_date' && (
                    <svg className={`ml-1 w-4 h-4 ${sortDirection ? '' : 'transform rotate-180'}`} fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                    </svg>
                  )}
                </div>
              </th>
              <th 
                onClick={() => handleSort('city')}
                className="px-4 py-3 text-left text-sm font-semibold text-blue-900 cursor-pointer hover:bg-blue-100 transition-colors"
              >
                <div className="flex items-center">
                  City
                  {sortField === 'city' && (
                    <svg className={`ml-1 w-4 h-4 ${sortDirection ? '' : 'transform rotate-180'}`} fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                    </svg>
                  )}
                </div>
              </th>
              <th 
                onClick={() => handleSort('transport_name')}
                className="hidden md:table-cell px-4 py-3 text-left text-sm font-semibold text-blue-900 cursor-pointer hover:bg-blue-100 transition-colors"
              >
                <div className="flex items-center">
                  Transport
                  {sortField === 'transport_name' && (
                    <svg className={`ml-1 w-4 h-4 ${sortDirection ? '' : 'transform rotate-180'}`} fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                    </svg>
                  )}
                </div>
              </th>
              <th 
                onClick={() => handleSort('consignor_name')}
                className="hidden lg:table-cell px-4 py-3 text-left text-sm font-semibold text-blue-900 cursor-pointer hover:bg-blue-100 transition-colors"
              >
                <div className="flex items-center">
                  From
                  {sortField === 'consignor_name' && (
                    <svg className={`ml-1 w-4 h-4 ${sortDirection ? '' : 'transform rotate-180'}`} fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                    </svg>
                  )}
                </div>
              </th>
              <th 
                onClick={() => handleSort('consignee_name')}
                className="hidden lg:table-cell px-4 py-3 text-left text-sm font-semibold text-blue-900 cursor-pointer hover:bg-blue-100 transition-colors"
              >
                <div className="flex items-center">
                  To
                  {sortField === 'consignee_name' && (
                    <svg className={`ml-1 w-4 h-4 ${sortDirection ? '' : 'transform rotate-180'}`} fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                    </svg>
                  )}
                </div>
              </th>
              <th 
                onClick={() => handleSort('content')}
                className="hidden xl:table-cell px-4 py-3 text-left text-sm font-semibold text-blue-900 cursor-pointer hover:bg-blue-100 transition-colors"
              >
                <div className="flex items-center">
                  Content
                  {sortField === 'content' && (
                    <svg className={`ml-1 w-4 h-4 ${sortDirection ? '' : 'transform rotate-180'}`} fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                    </svg>
                  )}
                </div>
              </th>
              <th 
                onClick={() => handleSort('total_amount')}
                className="px-4 py-3 text-left text-sm font-semibold text-blue-900 cursor-pointer hover:bg-blue-100 transition-colors"
              >
                <div className="flex items-center">
                  Amount
                  {sortField === 'total_amount' && (
                    <svg className={`ml-1 w-4 h-4 ${sortDirection ? '' : 'transform rotate-180'}`} fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                    </svg>
                  )}
                </div>
              </th>
              <th className="px-4 py-3 text-left text-sm font-semibold text-blue-900">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {loading ? (
              <tr>
                <td colSpan="9" className="px-4 py-10 text-center text-gray-500">
                  <div className="flex justify-center items-center">
                    <svg className="animate-spin h-6 w-6 text-blue-600 mr-2" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Loading bilty records...
                  </div>
                </td>
              </tr>
            ) : bilties.length === 0 ? (
              <tr>
                <td colSpan="9" className="px-4 py-8 text-center text-gray-500">
                  {searchTerm ? 'No bilties found matching your search.' : 'No bilty records found.'}
                </td>
              </tr>
            ) : (
              bilties.map((bilty) => (
                <tr key={bilty.id} className="hover:bg-blue-50 transition-colors">
                  <td className="px-4 py-3 text-sm text-gray-900">{bilty.gr_no}</td>
                  <td className="px-4 py-3 text-sm text-gray-900">{formatDate(bilty.bilty_date)}</td>
                  <td className="px-4 py-3 text-sm text-gray-900">{bilty.city}</td>
                  <td className="hidden md:table-cell px-4 py-3 text-sm text-gray-900">{bilty.transport_name}</td>
                  <td className="hidden lg:table-cell px-4 py-3 text-sm text-gray-900">{bilty.consignor_name}</td>
                  <td className="hidden lg:table-cell px-4 py-3 text-sm text-gray-900">{bilty.consignee_name}</td>
                  <td className="hidden xl:table-cell px-4 py-3 text-sm text-gray-900 truncate max-w-xs">{bilty.content}</td>
                  <td className="px-4 py-3 text-sm font-medium text-gray-900">₹{parseFloat(bilty.total_amount).toFixed(2)}</td>
                  // BiltyList.js (continued from previous artifact)
                  <td className="px-4 py-3 text-sm whitespace-nowrap">
                    <button
                      onClick={() => openDeleteConfirm(bilty.id)}
                      className="text-red-600 hover:text-red-800 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 rounded-md"
                      title="Delete Bilty"
                    >
                      <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination controls */}
      {totalPages > 0 && (
        <div className="flex justify-between items-center mt-6">
          <div className="text-sm text-gray-700">
            Showing <span className="font-medium">{((page - 1) * pageSize) + 1}</span> to{' '}
            <span className="font-medium">{Math.min(page * pageSize, totalCount)}</span> of{' '}
            <span className="font-medium">{totalCount}</span> records
          </div>

          <div className="flex space-x-2">
            <button
              onClick={() => handlePageChange(Math.max(1, page - 1))}
              disabled={page === 1}
              className={`px-3 py-1 rounded-md ${
                page === 1
                  ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                  : 'bg-blue-50 text-blue-700 hover:bg-blue-100'
              }`}
            >
              Previous
            </button>
            
            {/* Page numbers */}
            <div className="hidden sm:flex space-x-1">
              {[...Array(Math.min(5, totalPages))].map((_, i) => {
                const pageNum = i + 1;
                return (
                  <button
                    key={i}
                    onClick={() => handlePageChange(pageNum)}
                    className={`px-3 py-1 rounded-md ${
                      page === pageNum
                        ? 'bg-blue-600 text-white'
                        : 'bg-blue-50 text-blue-700 hover:bg-blue-100'
                    }`}
                  >
                    {pageNum}
                  </button>
                );
              })}
              
              {totalPages > 5 && (
                <>
                  <span className="px-2 py-1">...</span>
                  <button
                    onClick={() => handlePageChange(totalPages)}
                    className={`px-3 py-1 rounded-md ${
                      page === totalPages
                        ? 'bg-blue-600 text-white'
                        : 'bg-blue-50 text-blue-700 hover:bg-blue-100'
                    }`}
                  >
                    {totalPages}
                  </button>
                </>
              )}
            </div>
            
            <button
              onClick={() => handlePageChange(Math.min(totalPages, page + 1))}
              disabled={page === totalPages}
              className={`px-3 py-1 rounded-md ${
                page === totalPages
                  ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                  : 'bg-blue-50 text-blue-700 hover:bg-blue-100'
              }`}
            >
              Next
            </button>
          </div>
        </div>
      )}

      {/* Delete confirmation modal */}
      {confirmDelete && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white rounded-lg max-w-md w-full p-6 shadow-xl">
            <div className="text-center">
              <svg className="mx-auto h-12 w-12 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
              
              <h3 className="mt-4 text-lg font-medium text-gray-900">Confirm Deletion</h3>
              
              <div className="mt-3">
                <p className="text-sm text-gray-500">
                  Are you sure you want to delete this bilty? This action cannot be undone.
                </p>
              </div>
            </div>
            
            <div className="mt-6 flex justify-center space-x-4">
              <button
                onClick={closeDeleteConfirm}
                className="px-4 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
              >
                Cancel
              </button>
              
              <button
                onClick={handleDelete}
                disabled={isDeleting}
                className={`px-4 py-2 rounded-md text-white ${
                  isDeleting ? 'bg-red-400' : 'bg-red-600 hover:bg-red-700'
                } focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500`}
              >
                {isDeleting ? 'Deleting...' : 'Delete'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default BiltyList;