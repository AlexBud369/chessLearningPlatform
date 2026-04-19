const USER = {
    NAME_MAX_LENGTH: 100,
    EMAIL_MAX_LENGTH: 255,
    PASSWORD_HASH_LENGTH: 100,
    AVATAR_MAX_LENGTH: 255,
};

const TOKEN = {
    REFRESH_EXPIRES_IN_MS: 7 * 24 * 60 * 60 * 1000,  
};

const COOKIE = {
    REFRESH_TOKEN_NAME: 'refreshToken',
    MAX_AGE: 7 * 24 * 60 * 60 * 1000,
    HTTP_ONLY: true,
    SAME_SITE: 'strict',
};
const THEME = {
  NAME_MAX_LENGTH: 100,
  DESCRIPTION_MAX_LENGTH: 500,
};

const COURSE = {
  TITLE_MAX_LENGTH: 200,
  DESCRIPTION_MAX_LENGTH: 1000,
};

const LESSON = {
  TITLE_MAX_LENGTH: 200,
  CONTENT_MAX_LENGTH: 10000, 
};

const TASK = {
  FEN_MAX_LENGTH: 100,
  SOLUTION_MAX_LENGTH: 500,
  DIFFICULTY_VALUES: ['beginner', 'intermediate', 'advanced'],
};

module.exports = {
  USER,
  TOKEN,
  COOKIE,
  THEME,
  COURSE,
  LESSON,
  TASK,
  
};

