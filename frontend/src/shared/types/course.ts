export interface Theme {
  id: number;
  name: string;
  description: string | null;
}

export interface Lesson {
  id: number;
  course_id: number;
  title: string;
  content_type: 'video' | 'text';
  content: string;
  order_index: number;
}

export interface CourseAuthor {
  id: number;
  first_name: string;
  last_name: string;
}

export interface Course {
  id: number;
  title: string;
  description: string | null;
  theme_id: number;
  author_id: number;
  difficulty?: number;
  cover_image?: string;
  isFavorite?: boolean;
  created_at: string;
  updated_at: string;
  theme?: Theme;
  author?: CourseAuthor;
  lessons?: Lesson[];
}

export interface CourseFilters {
  theme_id?: number;
  search?: string;
  sortBy?: 'title' | 'created_at' | 'difficulty';
  difficulty?: number;
  sortOrder?: 'ASC' | 'DESC';
  page?: number;
  limit?: number;
}

export interface CourseProgress {
  courseId: number;
  completedLessons: number;
  totalLessons: number;
  percent: number;
}

export interface PaginatedCoursesResponse {
  courses: Course[];
  total: number;
  page: number;
  totalPages: number;
}