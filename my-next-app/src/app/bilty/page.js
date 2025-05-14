// app/bilty/list/page.js
'use client';

import BiltyList from '../../components/bilty-list';

/**
 * Bilty List Page Component
 * Displays the list of all bilty records with sorting, filtering and deletion functionality
 */
export default function BiltyListPage() {
  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl bg-white/95 backdrop-blur-sm rounded-lg shadow-2xl my-8">
      <header className="mb-8 border-b border-blue-200 pb-4">
        <h1 className="text-3xl font-bold text-blue-900">Bilty Records</h1>
        <p className="text-blue-700 mt-2">
          View, search, and manage all your transport bilty records. Click on column headers to sort.
        </p>
      </header>

      <BiltyList />
    </div>
  );
}