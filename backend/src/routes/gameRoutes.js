const express = require('express');
const gameController = require('../controllers/gameController');
const authMiddleware = require('../middleware/auth.middleware');

const router = express.Router();

router.post('/upload', authMiddleware, gameController.upload);
router.get('/', authMiddleware, gameController.getUserGames);
router.get('/:id', authMiddleware, gameController.getById);
router.put('/:id', authMiddleware, gameController.update);
router.delete('/:id', authMiddleware, gameController.delete);

module.exports = router;