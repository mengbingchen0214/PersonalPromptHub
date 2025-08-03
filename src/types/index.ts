export interface Prompt {
  id: string;
  title: string;
  content: string;
  category: string;
  createdAt: Date;
  updatedAt: Date;
  tags: string[];
}

export interface PromptFormData {
  title: string;
  content: string;
  category: string;
  tags: string[];
}

export type SortOption = 'newest' | 'oldest' | 'title' | 'category';
export type ViewMode = 'grid' | 'list';