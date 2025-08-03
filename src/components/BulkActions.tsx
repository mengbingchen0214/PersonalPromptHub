import React from 'react';
import { Trash2, X } from 'lucide-react';

interface BulkActionsProps {
  selectedCount: number;
  onDeleteSelected: () => void;
  onClearSelection: () => void;
}

export default function BulkActions({ selectedCount, onDeleteSelected, onClearSelection }: BulkActionsProps) {
  if (selectedCount === 0) return null;

  return (
    <div className="bg-blue-50 border-b border-blue-200 py-3">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <span className="text-sm font-medium text-blue-900">
              {selectedCount} prompt{selectedCount > 1 ? 's' : ''} selected
            </span>
            <button
              onClick={onDeleteSelected}
              className="flex items-center space-x-1 text-sm text-red-600 hover:text-red-800 bg-white px-3 py-1 rounded-lg border border-red-200 hover:border-red-300 transition-colors"
            >
              <Trash2 className="h-4 w-4" />
              <span>Delete Selected</span>
            </button>
          </div>
          <button
            onClick={onClearSelection}
            className="text-blue-600 hover:text-blue-800 p-1"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );
}