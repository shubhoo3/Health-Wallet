const express = require('express');
const router = express.Router();
const reportController = require('../controllers/reportController');
const { authenticateToken } = require('../middleware/auth');
const { uploadSingle, handleUploadError } = require('../middleware/upload');

router.post('/', authenticateToken, uploadSingle, handleUploadError, reportController.uploadReport);
router.get('/', authenticateToken, reportController.getAllReports);
router.get('/search', authenticateToken, reportController.searchReports);
router.get('/:id', authenticateToken, reportController.getReport);
router.put('/:id', authenticateToken, reportController.updateReport);
router.delete('/:id', authenticateToken, reportController.deleteReport);
router.get('/:id/download', authenticateToken, reportController.downloadReport);

module.exports = router;