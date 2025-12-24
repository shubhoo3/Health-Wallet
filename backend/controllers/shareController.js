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
