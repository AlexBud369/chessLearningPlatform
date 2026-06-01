const express = require('express');
const analysisController = require('../controllers/analysisController');
const authMiddleware = require('../middleware/auth.middleware');

const router = express.Router();

router.get('/:gameId/tree', authMiddleware, analysisController.getTree);
router.post('/:gameId/tree', authMiddleware, analysisController.saveFullTree);
router.post('/:gameId/nodes', authMiddleware, analysisController.addNode);
router.put('/nodes/:nodeId', authMiddleware, analysisController.updateNode);
router.delete('/nodes/:nodeId', authMiddleware, analysisController.deleteNode);

module.exports = router;