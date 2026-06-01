import i18n from '../i18n/i18nInit';
import { THEME_STORAGE_KEY, THEME_MODES } from '../constants/theme';
import type { AppDispatch } from '../../app/store';
import { setTheme } from '../../entities/theme/model/store';
import { resetFilters } from '../../entities/course/model/store';

const COURSE_FILTERS_KEY = 'course_filters';
const TASK_FILTERS_KEY = 'taskFilters';
const I18N_STORAGE_KEY = 'i18nextLng';

export const resetAppSettings = (dispatch: AppDispatch) => {
  localStorage.removeItem(THEME_STORAGE_KEY);
  localStorage.removeItem(COURSE_FILTERS_KEY);
  localStorage.removeItem(TASK_FILTERS_KEY);
  localStorage.removeItem(I18N_STORAGE_KEY);

  dispatch(setTheme(THEME_MODES.LIGHT));
  dispatch(resetFilters());
  i18n.changeLanguage('ru');
};
