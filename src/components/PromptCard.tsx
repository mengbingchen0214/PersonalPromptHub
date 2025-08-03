import React, { useState } from 'react';
import { Copy, Edit2, Trash2, Check, Tag } from 'lucide-react';
import { Prompt } from '../types';
import { copyToClipboard } from '../utils/export';

interface PromptCardProps {
  prompt: Prompt;
  onEdit: (prompt: Prompt) => void;
  onDelete: (id: string) => void;
  isSelected: boolean;
  onSelectionChange: (id: string, selected: boolean) => void;
  viewMode: 'grid' | 'list';
}

const categoryColors: Record<string, string> = {
  'General': 'bg-blue-100 text-blue-800',
  'Writing': 'bg-green-100 text-green-800',
  'Coding': 'bg-purple-100 text-purple-800',
  'Creative': 'bg-pink-100 text-pink-800',
  'Business': 'bg-yellow-100 text-yellow-800',
  'Education': 'bg-indigo-100 text-indigo-800',
  'Research': 'bg-red-100 text-red-800',
};

export default function PromptCard({ 
  prompt, 
  onEdit, 
  onDelete, 
  isSelected, 
  onSelectionChange,
  viewMode 
}: PromptCardProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    const success = await copyToClipboard(prompt.content);
    if (success) {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const getCategoryColor = (category: string) => {
    return categoryColors[category] || 'bg-gray-100 text-gray-800';
  };

  if (viewMode === 'list') {
    return (
      <div className={`bg-white rounded-lg border ${isSelected ? 'ring-2 ring-blue-500' : 'border-gray-200'} hover:shadow-md transition-all duration-200`}>
        <div className="p-6">
          <div className="flex items-start justify-between">
            <div className="flex items-start space-x-4 flex-1">
              <input
                type="checkbox"
                checked={isSelected}
                onChange={(e) => onSelectionChange(prompt.id, e.target.checked)}
                className="mt-1 h-4 w-4 text-blue-600 rounded"
              />
              <div className="flex-1 min-w-0">
                <div className="flex items-center space-x-2 mb-2">
                  <h3 className="text-lg font-semibold text-gray-900 truncate">{prompt.title}</h3>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${getCategoryColor(prompt.category)}`}>
                    {prompt.category}
                  </span>
                </div>
                <p className="text-gray-600 text-sm line-clamp-2 mb-3">{prompt.content}</p>
                {prompt.tags.length > 0 && (
                  <div className="flex items-center space-x-1 mb-2">
                    <Tag className="h-3 w-3 text-gray-400" />
                    <div className="flex flex-wrap gap-1">
                      {prompt.tags.map(tag => (
                        <span key={tag} className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded">
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
                <p className="text-xs text-gray-400">
                  Created: {prompt.createdAt.toLocaleDateString()}
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-2 ml-4">
              <button
                onClick={handleCopy}
                className="p-2 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                title="Copy to clipboard"
              >
                {copied ? <Check className="h-4 w-4 text-green-600" /> : <Copy className="h-4 w-4" />}
              </button>
              <button
                onClick={() => onEdit(prompt)}
                className="p-2 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                title="Edit prompt"
              >
                <Edit2 className="h-4 w-4" />
              </button>
              <button
                onClick={() => onDelete(prompt.id)}
                className="p-2 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                title="Delete prompt"
              >
                <Trash2 className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`bg-white rounded-lg border ${isSelected ? 'ring-2 ring-blue-500' : 'border-gray-200'} hover:shadow-lg transition-all duration-200 group`}>
      <div className="p-6">
        <div className="flex items-center justify-between mb-3">
          <input
            type="checkbox"
            checked={isSelected}
            onChange={(e) => onSelectionChange(prompt.id, e.target.checked)}
            className="h-4 w-4 text-blue-600 rounded"
          />
          <div className="flex items-center space-x-2 opacity-0 group-hover:opacity-100 transition-opacity">
            <button
              onClick={handleCopy}
              className="p-1.5 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
              title="Copy to clipboard"
            >
              {copied ? <Check className="h-4 w-4 text-green-600" /> : <Copy className="h-4 w-4" />}
            </button>
            <button
              onClick={() => onEdit(prompt)}
              className="p-1.5 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
              title="Edit prompt"
            >
              <Edit2 className="h-4 w-4" />
            </button>
            <button
              onClick={() => onDelete(prompt.id)}
              className="p-1.5 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
              title="Delete prompt"
            >
              <Trash2 className="h-4 w-4" />
            </button>
          </div>
        </div>
        
        <div className="mb-3">
          <span className={`px-2 py-1 rounded-full text-xs font-medium ${getCategoryColor(prompt.category)}`}>
            {prompt.category}
          </span>
        </div>
        
        <h3 className="text-lg font-semibold text-gray-900 mb-2 line-clamp-1">{prompt.title}</h3>
        <p className="text-gray-600 text-sm line-clamp-3 mb-4">{prompt.content}</p>
        
        {prompt.tags.length > 0 && (
          <div className="flex items-center space-x-1 mb-3">
            <Tag className="h-3 w-3 text-gray-400" />
            <div className="flex flex-wrap gap-1">
              {prompt.tags.slice(0, 3).map(tag => (
                <span key={tag} className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded">
                  {tag}
                </span>
              ))}
              {prompt.tags.length > 3 && (
                <span className="text-xs text-gray-400">+{prompt.tags.length - 3}</span>
              )}
            </div>
          </div>
        )}
        
        <p className="text-xs text-gray-400">
          {prompt.createdAt.toLocaleDateString()}
        </p>
      </div>
    </div>
  );
}