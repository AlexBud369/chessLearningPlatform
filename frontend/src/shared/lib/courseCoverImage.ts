import { API_BASE_URL } from '../config/clientConfig';
import { DEFAULT_COURSE_COVER } from '../constants/assets';

const apiOrigin = API_BASE_URL.replace(/\/api\/?$/, '');

export const getCourseCoverImageUrl = (coverImage?: string | null): string => {
  const path = coverImage?.trim() || DEFAULT_COURSE_COVER;

  if (path.startsWith('http://') || path.startsWith('https://')) {
    return path;
  }

  if (path.startsWith('/')) {
    return path;
  }

  return `${apiOrigin}/${path.replace(/^\//, '')}`;
};
