const Report = require('../models/Report');
const Vital = require('../models/Vital');
const Share = require('../models/Share');

exports.getDashboardStats = async (req, res) => {
  try {
    const [totalReports, totalVitals, sharedReports, vitalStats, latestVital] = await Promise.all([
      Report.getCountByUserId(req.user.id),
      Vital.getStats(req.user.id).then(stats => stats.total_readings),
      Share.getCountByUserId(req.user.id),
      Vital.getStats(req.user.id),
      Vital.getLatest(req.user.id)
    ]);

    res.json({
      totalReports,
      totalVitals,
      sharedReports,
      vitalStats,
      latestVital
    });
  } catch (error) {
    res.status(error.status || 500).json({ error: error.message });
  }
};