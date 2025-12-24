const Report = require('../models/Report');
const { deleteFile } = require('../middleware/upload');
const path = require('path');

exports.uploadReport = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'File is required' });
    }

    const { title, type, date, vitals } = req.body;

    if (!title || !type || !date) {
      await deleteFile(req.file.path);
      return res.status(400).json({ error: 'Title, type, and date are required' });
    }

    const reportData = {
      userId: req.user.id,
      title,
      type,
      date,
      fileName: req.file.originalname,
      filePath: req.file.path,
      fileType: req.file.mimetype,
      fileSize: req.file.size,
      vitals: vitals ? JSON.parse(vitals) : []
    };

    const report = await Report.create(reportData);

    res.status(201).json({
      message: 'Report uploaded successfully',
      report
    });
  } catch (error) {
    if (req.file) {
      await deleteFile(req.file.path).catch(console.error);
    }
    res.status(error.status || 500).json({ error: error.message });
  }
};

exports.getAllReports = async (req, res) => {
  try {
    const { date, type, vitalType } = req.query;
    const reports = await Report.findByUserId(req.user.id, { date, type, vitalType });
    res.json(reports);
  } catch (error) {
    res.status(error.status || 500).json({ error: error.message });
  }
};

exports.getReport = async (req, res) => {
  try {
    const report = await Report.findById(req.params.id, req.user.id);
    res.json(report);
  } catch (error) {
    res.status(error.status || 500).json({ error: error.message });
  }
};

exports.updateReport = async (req, res) => {
  try {
    const { title, type, date } = req.body;
    await Report.update(req.params.id, req.user.id, { title, type, date });
    res.json({ message: 'Report updated successfully' });
  } catch (error) {
    res.status(error.status || 500).json({ error: error.message });
  }
};

exports.deleteReport = async (req, res) => {
  try {
    const result = await Report.delete(req.params.id, req.user.id);
    await deleteFile(result.filePath).catch(console.error);
    res.json({ message: result.message });
  } catch (error) {
    res.status(error.status || 500).json({ error: error.message });
  }
};

exports.downloadReport = async (req, res) => {
  try {
    const report = await Report.findById(req.params.id, req.user.id);
    const filePath = path.join(__dirname, '..', report.file_path);
    res.download(filePath, report.file_name);
  } catch (error) {
    res.status(error.status || 500).json({ error: error.message });
  }
};

exports.searchReports = async (req, res) => {
  try {
    const { q } = req.query;
    if (!q) {
      return res.status(400).json({ error: 'Search term is required' });
    }
    const reports = await Report.search(req.user.id, q);
    res.json(reports);
  } catch (error) {
    res.status(error.status || 500).json({ error: error.message });
  }
};

// ============================================
// controllers/vitalController.js
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
