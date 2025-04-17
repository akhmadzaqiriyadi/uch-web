'use client';

import { useState } from 'react';
import { useRouter, usePathname, useSearchParams } from 'next/navigation';
import Link from 'next/link';

type FilterOption = {
  label: string;
  value: string;
};

const statusOptions: FilterOption[] = [
  { label: 'Semua', value: 'all' },
  { label: 'Akan Datang', value: 'upcoming' },
  { label: 'Selesai', value: 'done' },
  { label: 'Dibatalkan', value: 'canceled' }
];

export default function EventFilter() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const currentStatus = searchParams.get('status') || 'all';
  
  const handleStatusChange = (status: string) => {
    const params = new URLSearchParams(searchParams);
    
    if (status === 'all') {
      params.delete('status');
    } else {
      params.set('status', status);
    }
    
    router.push(`${pathname}?${params.toString()}`);
  };
  
  return (
    <div className="bg-white rounded-lg shadow-sm p-4 mb-6">
      <h2 className="text-lg font-semibold mb-3">Filter Acara</h2>
      
      <div className="flex flex-wrap gap-2">
        {statusOptions.map(option => (
          <button
            key={option.value}
            onClick={() => handleStatusChange(option.value)}
            className={`px-3 py-1 rounded-md text-sm transition-colors ${
              currentStatus === option.value
                ? 'bg-blue-600 text-white'
                : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
            }`}
          >
            {option.label}
          </button>
        ))}
      </div>
    </div>
  );
}