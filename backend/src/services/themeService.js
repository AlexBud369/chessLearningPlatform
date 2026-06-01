const themeRepository = require('../repositories/themeRepository');

class ThemeService {
  async createTheme(themeData) {
    return await themeRepository.create(themeData);
  }

  async getAllThemes() {
    return await themeRepository.findAll();
  }

  async getThemeById(id) {
    const theme = await themeRepository.findById(id);
    if (!theme) {
      throw new Error('Theme not found');
    }
    return theme;
  }

  async updateTheme(id, updateData, userRole) {
    if (userRole !== 'trainer') {
      throw new Error('Forbidden: only trainers can update themes');
    }
    const theme = await themeRepository.findById(id);
    if (!theme) {
      throw new Error('Theme not found');
    }
    return await themeRepository.update(id, updateData);
  }

  async deleteTheme(id, userRole) {
    if (userRole !== 'trainer') {
      throw new Error('Forbidden: only trainers can delete themes');
    }
    const theme = await themeRepository.findById(id);
    if (!theme) {
      throw new Error('Theme not found');
    }
    const coursesCount = await theme.countCourses?.() ?? 0;
    if (coursesCount > 0) {
      throw new Error('Cannot delete theme with existing courses');
    }
    return await themeRepository.delete(id);
  }
}

module.exports = new ThemeService();