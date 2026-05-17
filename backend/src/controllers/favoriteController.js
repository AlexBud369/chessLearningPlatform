const favoriteService = require('../services/favoriteService');

class FavoriteController {
  async getUserFavorites(req, res, next) {
    try {
      const { itemType } = req.query;
      const favorites = await favoriteService.getUserFavorites(req.user.id, itemType);
      res.json(favorites);
    } catch (error) {
      next(error);
    }
  }

  async addFavorite(req, res, next) {
    try {
      const { itemType, itemId } = req.params;
      const favorite = await favoriteService.addFavorite(req.user.id, itemType, parseInt(itemId));
      res.status(201).json(favorite);
    } catch (error) {
      next(error);
    }
  }

  async removeFavorite(req, res, next) {
    try {
      const { itemType, itemId } = req.params;
      await favoriteService.removeFavorite(req.user.id, itemType, parseInt(itemId));
      res.status(204).send();
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new FavoriteController();