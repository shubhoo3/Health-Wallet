// models/Report.js
const { db } = require('../config/database');

class Report {
  // Create new report
  static create(reportData) {
    return new Promise((resolve, reject) => {
      const { userId, title, type, date, fileName, filePath, fileType, fileSize, vitals } = reportData;
      
      const sql = `INSERT INTO reports (user_id, title, type, date, file_name, file_path, file_type, file_size)
                   VALUES (?, ?, ?, ?, ?, ?, ?, ?)`;
      
      db.run(sql, [userId, title, type, date, fileName, filePath, fileType, fileSize], function(err) {
        if (err) {
          reject({ status: 500, message: 'Error creating report' });
        } else {
          const reportId = this.lastID;
          
          // Add vitals if provided
          if (vitals && Array.isArray(vitals) && vitals.length > 0) {
            const stmt = db.prepare('INSERT INTO report_vitals (report_id, vital_type, vital_value) VALUES (?, ?, ?)');
            
            vitals.forEach(vital => {
              stmt.run(reportId, vital.type || vital, vital.value || null);
            });
            
            stmt.finalize();
          }
          
          resolve({
            id: reportId,
            userId,
            title,
            type,
            date,
            fileName,
            filePath,
            fileType,
            fileSize
          });
        }
      });
    });
  }

  // Get all reports for user with filters
  static findByUserId(userId, filters = {}) {
    return new Promise((resolve, reject) => {
      let sql = `
        SELECT r.*, 
               GROUP_CONCAT(DISTINCT rv.vital_type) as vitals,
               GROUP_CONCAT(DISTINCT sr.shared_with_email) as shared_with
        FROM reports r
        LEFT JOIN report_vitals rv ON r.id = rv.report_id
        LEFT JOIN shared_reports sr ON r.id = sr.report_id
        WHERE r.user_id = ?
      `;
      
      const params = [userId];
      const { date, type, vitalType } = filters;

      if (date) {
        sql += ' AND r.date = ?';
        params.push(date);
      }

      if (type) {
        sql += ' AND r.type = ?';
        params.push(type);
      }

      if (vitalType) {
        sql += ' AND rv.vital_type = ?';
        params.push(vitalType);
      }

      sql += ' GROUP BY r.id ORDER BY r.date DESC, r.created_at DESC';

      db.all(sql, params, (err, rows) => {
        if (err) {
          reject({ status: 500, message: 'Database error' });
        } else {
          const reports = rows.map(row => ({
            ...row,
            vitals: row.vitals ? row.vitals.split(',') : [],
            sharedWith: row.shared_with ? row.shared_with.split(',') : []
          }));
          resolve(reports);
        }
      });
    });
  }

  // Get single report
  static findById(id, userId) {
    return new Promise((resolve, reject) => {
      const sql = `
        SELECT r.*, 
               GROUP_CONCAT(DISTINCT rv.vital_type) as vitals
        FROM reports r
        LEFT JOIN report_vitals rv ON r.id = rv.report_id
        WHERE r.id = ? AND r.user_id = ?
        GROUP BY r.id
      `;
      
      db.get(sql, [id, userId], (err, row) => {
        if (err) {
          reject({ status: 500, message: 'Database error' });
        } else if (!row) {
          reject({ status: 404, message: 'Report not found' });
        } else {
          resolve({
            ...row,
            vitals: row.vitals ? row.vitals.split(',') : []
          });
        }
      });
    });
  }

  // Update report
  static update(id, userId, updateData) {
    return new Promise((resolve, reject) => {
      const { title, type, date } = updateData;
      
      const sql = 'UPDATE reports SET title = ?, type = ?, date = ? WHERE id = ? AND user_id = ?';
      
      db.run(sql, [title, type, date, id, userId], function(err) {
        if (err) {
          reject({ status: 500, message: 'Error updating report' });
        } else if (this.changes === 0) {
          reject({ status: 404, message: 'Report not found' });
        } else {
          resolve({ message: 'Report updated successfully' });
        }
      });
    });
  }

  // Delete report
  static delete(id, userId) {
    return new Promise((resolve, reject) => {
      // First get the report to return file path
      db.get('SELECT file_path FROM reports WHERE id = ? AND user_id = ?', [id, userId], (err, row) => {
        if (err) {
          reject({ status: 500, message: 'Database error' });
        } else if (!row) {
          reject({ status: 404, message: 'Report not found' });
        } else {
          // Delete the report (cascade will delete related records)
          db.run('DELETE FROM reports WHERE id = ? AND user_id = ?', [id, userId], function(err) {
            if (err) {
              reject({ status: 500, message: 'Error deleting report' });
            } else {
              resolve({ 
                message: 'Report deleted successfully',
                filePath: row.file_path
              });
            }
          });
        }
      });
    });
  }

  // Get report count for user
  static getCountByUserId(userId) {
    return new Promise((resolve, reject) => {
      const sql = 'SELECT COUNT(*) as count FROM reports WHERE user_id = ?';
      
      db.get(sql, [userId], (err, row) => {
        if (err) {
          reject({ status: 500, message: 'Database error' });
        } else {
          resolve(row.count);
        }
      });
    });
  }

  // Search reports
  static search(userId, searchTerm) {
    return new Promise((resolve, reject) => {
      const sql = `
        SELECT r.*, 
               GROUP_CONCAT(DISTINCT rv.vital_type) as vitals
        FROM reports r
        LEFT JOIN report_vitals rv ON r.id = rv.report_id
        WHERE r.user_id = ? AND (r.title LIKE ? OR r.type LIKE ?)
        GROUP BY r.id
        ORDER BY r.date DESC
      `;
      
      const searchPattern = `%${searchTerm}%`;
      
      db.all(sql, [userId, searchPattern, searchPattern], (err, rows) => {
        if (err) {
          reject({ status: 500, message: 'Database error' });
        } else {
          const reports = rows.map(row => ({
            ...row,
            vitals: row.vitals ? row.vitals.split(',') : []
          }));
          resolve(reports);
        }
      });
    });
  }
}

module.exports = Report;