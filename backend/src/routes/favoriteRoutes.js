const express = require('express');
const router = express.Router();
const favoriteController = require('../controllers/favoriteController');
const authMiddleware = require('../middleware/auth.middleware');

router.use(authMiddleware);

router.get('/', favoriteController.getUserFavorites);
router.post('/:itemType/:itemId', favoriteController.addFavorite);
router.delete('/:itemType/:itemId', favoriteController.removeFavorite);

module.exports = router;