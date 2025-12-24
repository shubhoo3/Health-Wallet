const express = require('express');
const router = express.Router();
const vitalController = require('../controllers/vitalController');
const { authenticateToken } = require('../middleware/auth');

router.post('/', authenticateToken, vitalController.addVital);
router.get('/', authenticateToken, vitalController.getAllVitals);
router.get('/stats', authenticateToken, vitalController.getVitalStats);
router.get('/latest', authenticateToken, vitalController.getLatestVital);
router.get('/:id', authenticateToken, vitalController.getVital);
router.put('/:id', authenticateToken, vitalController.updateVital);
router.delete('/:id', authenticateToken, vitalController.deleteVital);

module.exports = router;