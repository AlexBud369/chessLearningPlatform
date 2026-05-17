const { Favorite } = require('../models');

class FavoriteRepository {
  async create(userId, itemType, itemId) {
    return await Favorite.create({
      user_id: userId,
      item_type: itemType,
      item_id: itemId,
    });
  }

  async findByUserAndItem(userId, itemType, itemId) {
    return await Favorite.findOne({
      where: {
        user_id: userId,
        item_type: itemType,
        item_id: itemId,
      },
    });
  }

  async deleteByUserAndItem(userId, itemType, itemId) {
    const deleted = await Favorite.destroy({
      where: {
        user_id: userId,
        item_type: itemType,
        item_id: itemId,
      },
    });
    return deleted > 0;
  }

  async findAllByUser(userId, itemType = null) {
    const where = { user_id: userId };
    if (itemType) {
      where.item_type = itemType;
    }
    return await Favorite.findAll({ where });
  }
}

module.exports = new FavoriteRepository();