const themeService = require('../services/themeService');

class ThemeController {
  async create(req, res, next) {
    try {
      const theme = await themeService.createTheme(req.body, req.user.role);
      res.status(201).json(theme);
    } catch (error) {
      next(error);
    }
  }

  async getAll(req, res, next) {
    try {
      const themes = await themeService.getAllThemes();
      res.json(themes);
    } catch (error) {
      next(error);
    }
  }

  async getById(req, res, next) {
    try {
      const theme = await themeService.getThemeById(req.params.id);
      res.json(theme);
    } catch (error) {
      next(error);
    }
  }

  async update(req, res, next) {
    try {
      const updated = await themeService.updateTheme(req.params.id, req.body, req.user.role);
      res.json(updated);
    } catch (error) {
      next(error);
    }
  }

  async delete(req, res, next) {
    try {
      await themeService.deleteTheme(req.params.id, req.user.role);
      res.status(204).send();
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new ThemeController();