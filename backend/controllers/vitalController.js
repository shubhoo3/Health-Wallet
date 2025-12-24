const Vital = require('../models/Vital');

exports.addVital = async (req, res) => {
  try {
    const vitalData = {
      userId: req.user.id,
      ...req.body
    };

    if (!vitalData.date) {
      return res.status(400).json({ error: 'Date is required' });
    }

    const vital = await Vital.create(vitalData);

    res.status(201).json({
      message: 'Vital added successfully',
      vital
    });
  } catch (error) {
    res.status(error.status || 500).json({ error: error.message });
  }
};

exports.getAllVitals = async (req, res) => {
  try {
    const { startDate, endDate, limit } = req.query;
    const vitals = await Vital.findByUserId(req.user.id, { startDate, endDate, limit });
    res.json(vitals);
  } catch (error) {
    res.status(error.status || 500).json({ error: error.message });
  }
};

exports.getVital = async (req, res) => {
  try {
    const vital = await Vital.findById(req.params.id, req.user.id);
    res.json(vital);
  } catch (error) {
    res.status(error.status || 500).json({ error: error.message });
  }
};

exports.updateVital = async (req, res) => {
  try {
    await Vital.update(req.params.id, req.user.id, req.body);
    res.json({ message: 'Vital updated successfully' });
  } catch (error) {
    res.status(error.status || 500).json({ error: error.message });
  }
};

exports.deleteVital = async (req, res) => {
  try {
    await Vital.delete(req.params.id, req.user.id);
    res.json({ message: 'Vital deleted successfully' });
  } catch (error) {
    res.status(error.status || 500).json({ error: error.message });
  }
};

exports.getVitalStats = async (req, res) => {
  try {
    const stats = await Vital.getStats(req.user.id);
    res.json(stats);
  } catch (error) {
    res.status(error.status || 500).json({ error: error.message });
  }
};

exports.getLatestVital = async (req, res) => {
  try {
    const vital = await Vital.getLatest(req.user.id);
    res.json(vital);
  } catch (error) {
    res.status(error.status || 500).json({ error: error.message });
  }
};

// ============================================
// controllers/shareController.js
const Share = require('../models/Share');
const User = require('../models/User');

exports.shareReport = async (req, res) => {
  try {
    const { email, accessType, expiresAt } = req.body;

    if (!email) {
      return res.status(400).json({ error: 'Email is required' });
    }

    const shareData = {
      reportId: req.params.id,
      sharedWithEmail: email,
      sharedByUserId: req.user.id,
      accessType,
      expiresAt
    };

    const share = await Share.create(shareData);

    res.status(201).json({
      message: 'Report shared successfully',
      share
    });
  } catch (error) {
    res.status(error.status || 500).json({ error: error.message });
  }
};

exports.getReportShares = async (req, res) => {
  try {
    const shares = await Share.findByReportId(req.params.id, req.user.id);
    res.json(shares);
  } catch (error) {
    res.status(error.status || 500).json({ error: error.message });
  }
};

exports.getSharedWithMe = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    const reports = await Share.findSharedWithUser(user.email);
    res.json(reports);
  } catch (error) {
    res.status(error.status || 500).json({ error: error.message });
  }
};

exports.getSharedByMe = async (req, res) => {
  try {
    const reports = await Share.findSharedByUser(req.user.id);
    res.json(reports);
  } catch (error) {
    res.status(error.status || 500).json({ error: error.message });
  }
};

exports.revokeShare = async (req, res) => {
  try {
    await Share.delete(req.params.shareId, req.user.id);
    res.json({ message: 'Access revoked successfully' });
  } catch (error) {
    res.status(error.status || 500).json({ error: error.message });
  }
};