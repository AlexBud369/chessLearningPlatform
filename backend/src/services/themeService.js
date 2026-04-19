const themeRepository = require('../repositories/themeRepository');

class ThemeService {
  async createTheme(themeData, userRole) {
    if (!['trainer', 'admin'].includes(userRole)) {
      throw new Error('Forbidden: only trainers and admins can create themes');
    }
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
    if (!['trainer', 'admin'].includes(userRole)) {
      throw new Error('Forbidden: only trainers and admins can update themes');
    }
    const theme = await themeRepository.findById(id);
    if (!theme) {
      throw new Error('Theme not found');
    }
    return await themeRepository.update(id, updateData);
  }

  async deleteTheme(id, userRole) {
    if (!['trainer', 'admin'].includes(userRole)) {
      throw new Error('Forbidden: only trainers and admins can delete themes');
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