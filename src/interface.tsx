export interface Post {
  id: number;
  title: string;
  thumbnailUrl: string;
  createdAt: string;
  categories: string[];
  content: string;
}

export interface formData {
  name: string;
  email: string;
  message: string;
}

export interface ErrorMessages {
  name?: string;
  email?: string;
  message?: string;
}