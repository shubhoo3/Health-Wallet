const express = require('express');
const router = express.Router();
const shareController = require('../controllers/shareController');
const { authenticateToken } = require('../middleware/auth');

router.post('/reports/:id', authenticateToken, shareController.shareReport);
router.get('/reports/:id', authenticateToken, shareController.getReportShares);
router.get('/with-me', authenticateToken, shareController.getSharedWithMe);
router.get('/by-me', authenticateToken, shareController.getSharedByMe);
router.delete('/:shareId', authenticateToken, shareController.revokeShare);

module.exports = router;