const favoriteRepository = require('../repositories/favoriteRepository');

class FavoriteService {
  async addFavorite(userId, itemType, itemId) {
    const existing = await favoriteRepository.findByUserAndItem(userId, itemType, itemId);
    if (existing) {
      throw new Error('Элемент уже в избранном');
    }
    return await favoriteRepository.create(userId, itemType, itemId);
  }

  async removeFavorite(userId, itemType, itemId) {
    const deleted = await favoriteRepository.deleteByUserAndItem(userId, itemType, itemId);
    if (!deleted) {
      throw new Error('Элемент не найден в избранном');
    }
    return true;
  }

  async getUserFavorites(userId, itemType = null) {
    return await favoriteRepository.findAllByUser(userId, itemType);
  }

  async isFavorite(userId, itemType, itemId) {
    const favorite = await favoriteRepository.findByUserAndItem(userId, itemType, itemId);
    return !!favorite;
  }
}

module.exports = new FavoriteService();