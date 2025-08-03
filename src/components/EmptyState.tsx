import React from 'react';
import { Plus, FileText } from 'lucide-react';

interface EmptyStateProps {
  onAddPrompt: () => void;
  isFiltered: boolean;
}

export default function EmptyState({ onAddPrompt, isFiltered }: EmptyStateProps) {
  if (isFiltered) {
    return (
      <div className="text-center py-12">
        <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
        <h3 className="text-lg font-medium text-gray-900 mb-2">No prompts found</h3>
        <p className="text-gray-500">Try adjusting your search or filter criteria.</p>
      </div>
    );
  }

  return (
    <div className="text-center py-12">
      <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
      <h3 className="text-lg font-medium text-gray-900 mb-2">No prompts yet</h3>
      <p className="text-gray-500 mb-6">
        Start building your prompt library by creating your first prompt.
      </p>
      <button
        onClick={onAddPrompt}
        className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg flex items-center space-x-2 mx-auto transition-colors"
      >
        <Plus className="h-5 w-5" />
        <span>Create First Prompt</span>
      </button>
    </div>
  );
}