const { User } = require('../models')

class UserRepository {
    async create (userData) {
        return await User.create(userData);
    }

    async findById (id) {
        return await User.findByPk(id);
    }

    async findByEmail (email) {
        return await User.findOne({ where: { email } });
    }

    async update (id, updateData) {
        return await User.update(
            updateData, { where: {id}, returning: true }
        )
    }

};

module.exports = new UserRepository();