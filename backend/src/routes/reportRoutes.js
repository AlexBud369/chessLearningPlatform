const express = require('express');
const router = express.Router();
const reportController = require('../controllers/reportController');
const authMiddleware = require('../middleware/auth.middleware');
const { allowRoles } = require('../middleware/role.middleware');

router.use(authMiddleware);

router.get('/student/pdf', allowRoles('player', 'trainer', 'admin'), reportController.downloadStudentPdf);
router.get(
  '/trainer/students/pdf',
  allowRoles('trainer'),
  reportController.downloadTrainerPdf
);
router.get(
  '/trainer/students/excel',
  allowRoles('trainer'),
  reportController.downloadTrainerExcel
);

module.exports = router;
