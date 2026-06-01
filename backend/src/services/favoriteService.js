const favoriteRepository = require('../repositories/favoriteRepository');
const { Course, Task, Theme } = require('../models');

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

  async getUserFavoritesWithDetails(userId) {
    const favorites = await favoriteRepository.findAllByUser(userId);
    const courseIds = favorites.filter((f) => f.item_type === 'course').map((f) => f.item_id);
    const taskIds = favorites.filter((f) => f.item_type === 'task').map((f) => f.item_id);

    const [courses, tasks] = await Promise.all([
      courseIds.length
        ? Course.findAll({
            where: { id: courseIds },
            include: [{ model: Theme, as: 'theme', attributes: ['id', 'name'] }],
          })
        : [],
      taskIds.length
        ? Task.findAll({
            where: { id: taskIds },
            include: [{ model: Theme, as: 'theme', attributes: ['id', 'name'] }],
          })
        : [],
    ]);

    return { courses, tasks };
  }

  async isFavorite(userId, itemType, itemId) {
    const favorite = await favoriteRepository.findByUserAndItem(userId, itemType, itemId);
    return !!favorite;
  }
}

module.exports = new FavoriteService();
