const { Theme } = require('../models');

class ThemeRepository {
  async create(data) {
    return await Theme.create(data);
  }

  async findAll() {
    return await Theme.findAll({ order: [['name', 'ASC']] });
  }

  async findById(id) {
    return await Theme.findByPk(id);
  }

  async update(id, updateData) {
    const [updatedCount, updatedRows] = await Theme.update(updateData, {
      where: { id },
      returning: true,
    });
    return updatedRows[0] || null;
  }

  async delete(id) {
    const deletedCount = await Theme.destroy({ where: { id } });
    return deletedCount > 0;
  }
}

module.exports = new ThemeRepository();