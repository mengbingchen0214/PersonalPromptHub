import React, { useState, useMemo } from 'react';
import { Prompt, PromptFormData, SortOption, ViewMode } from './types';
import { usePrompts } from './hooks/useLocalStorage';
import { exportPrompts, importPrompts } from './utils/export';
import Header from './components/Header';
import Filters from './components/Filters';
import BulkActions from './components/BulkActions';
import PromptCard from './components/PromptCard';
import PromptModal from './components/PromptModal';
import EmptyState from './components/EmptyState';

function App() {
  const { prompts, addPrompt, updatePrompt, deletePrompt, deletePrompts, setPrompts } = usePrompts();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingPrompt, setEditingPrompt] = useState<Prompt | undefined>();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [sortBy, setSortBy] = useState<SortOption>('newest');
  const [viewMode, setViewMode] = useState<ViewMode>('grid');
  const [selectedPrompts, setSelectedPrompts] = useState<Set<string>>(new Set());

  const categories = useMemo(() => {
    const cats = Array.from(new Set(prompts.map(p => p.category)));
    return cats.sort();
  }, [prompts]);

  const filteredAndSortedPrompts = useMemo(() => {
    let filtered = prompts.filter(prompt => {
      const matchesSearch = searchQuery === '' || 
        prompt.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        prompt.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
        prompt.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
      
      const matchesCategory = selectedCategory === '' || prompt.category === selectedCategory;
      
      return matchesSearch && matchesCategory;
    });

    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'newest':
          return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
        case 'oldest':
          return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
        case 'title':
          return a.title.localeCompare(b.title);
        case 'category':
          return a.category.localeCompare(b.category);
        default:
          return 0;
      }
    });

    return filtered;
  }, [prompts, searchQuery, selectedCategory, sortBy]);

  const handleAddPrompt = () => {
    setEditingPrompt(undefined);
    setIsModalOpen(true);
  };

  const handleEditPrompt = (prompt: Prompt) => {
    setEditingPrompt(prompt);
    setIsModalOpen(true);
  };

  const handleSavePrompt = (data: PromptFormData) => {
    if (editingPrompt) {
      updatePrompt(editingPrompt.id, data);
    } else {
      addPrompt(data);
    }
  };

  const handleExport = () => {
    exportPrompts(prompts);
  };

  const handleImport = async (file: File) => {
    try {
      const importedPrompts = await importPrompts(file);
      setPrompts(prev => [...importedPrompts, ...prev]);
    } catch (error) {
      alert('Failed to import prompts. Please check the file format.');
    }
  };

  const handleSelectionChange = (id: string, selected: boolean) => {
    setSelectedPrompts(prev => {
      const newSet = new Set(prev);
      if (selected) {
        newSet.add(id);
      } else {
        newSet.delete(id);
      }
      return newSet;
    });
  };

  const handleDeleteSelected = () => {
    if (selectedPrompts.size > 0 && confirm(`Delete ${selectedPrompts.size} selected prompts?`)) {
      deletePrompts(Array.from(selectedPrompts));
      setSelectedPrompts(new Set());
    }
  };

  const handleClearSelection = () => {
    setSelectedPrompts(new Set());
  };

  const isFiltered = searchQuery !== '' || selectedCategory !== '';

  return (
    <div className="min-h-screen bg-gray-50">
      <Header
        onAddPrompt={handleAddPrompt}
        onExport={handleExport}
        onImport={handleImport}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        viewMode={viewMode}
        onViewModeChange={setViewMode}
        totalPrompts={prompts.length}
      />
      
      <Filters
        selectedCategory={selectedCategory}
        onCategoryChange={setSelectedCategory}
        sortBy={sortBy}
        onSortChange={setSortBy}
        categories={categories}
      />
      
      <BulkActions
        selectedCount={selectedPrompts.size}
        onDeleteSelected={handleDeleteSelected}
        onClearSelection={handleClearSelection}
      />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {filteredAndSortedPrompts.length === 0 ? (
          <EmptyState onAddPrompt={handleAddPrompt} isFiltered={isFiltered} />
        ) : (
          <div className={
            viewMode === 'grid' 
              ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
              : "space-y-4"
          }>
            {filteredAndSortedPrompts.map(prompt => (
              <PromptCard
                key={prompt.id}
                prompt={prompt}
                onEdit={handleEditPrompt}
                onDelete={deletePrompt}
                isSelected={selectedPrompts.has(prompt.id)}
                onSelectionChange={handleSelectionChange}
                viewMode={viewMode}
              />
            ))}
          </div>
        )}
      </main>
      
      <PromptModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSavePrompt}
        prompt={editingPrompt}
      />
    </div>
  );
}

export default App;