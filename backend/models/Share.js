// models/Share.js
const { db } = require('../config/database');

class Share {
  // Share a report
  static create(shareData) {
    return new Promise((resolve, reject) => {
      const { reportId, sharedWithEmail, sharedByUserId, accessType, expiresAt } = shareData;
      
      // First verify the report belongs to the user
      db.get('SELECT * FROM reports WHERE id = ? AND user_id = ?', [reportId, sharedByUserId], (err, report) => {
        if (err) {
          return reject({ status: 500, message: 'Database error' });
        }
        if (!report) {
          return reject({ status: 404, message: 'Report not found or access denied' });
        }

        // Check if already shared with this email
        db.get('SELECT * FROM shared_reports WHERE report_id = ? AND shared_with_email = ?', 
          [reportId, sharedWithEmail], (err, existing) => {
            if (existing) {
              return reject({ status: 400, message: 'Report already shared with this email' });
            }

            const sql = `INSERT INTO shared_reports (report_id, shared_with_email, shared_by_user_id, access_type, expires_at)
                         VALUES (?, ?, ?, ?, ?)`;
            
            db.run(sql, [reportId, sharedWithEmail, sharedByUserId, accessType || 'read', expiresAt || null], 
              function(err) {
                if (err) {
                  reject({ status: 500, message: 'Error sharing report' });
                } else {
                  resolve({
                    id: this.lastID,
                    reportId,
                    sharedWithEmail,
                    sharedByUserId,
                    accessType: accessType || 'read',
                    expiresAt
                  });
                }
              }
            );
          }
        );
      });
    });
  }

  // Get all shares for a report
  static findByReportId(reportId, userId) {
    return new Promise((resolve, reject) => {
      // Verify user owns the report
      db.get('SELECT * FROM reports WHERE id = ? AND user_id = ?', [reportId, userId], (err, report) => {
        if (err) {
          return reject({ status: 500, message: 'Database error' });
        }
        if (!report) {
          return reject({ status: 404, message: 'Report not found' });
        }

        const sql = `
          SELECT sr.*, u.name as shared_by_name
          FROM shared_reports sr
          JOIN users u ON sr.shared_by_user_id = u.id
          WHERE sr.report_id = ?
          ORDER BY sr.created_at DESC
        `;
        
        db.all(sql, [reportId], (err, rows) => {
          if (err) {
            reject({ status: 500, message: 'Database error' });
          } else {
            resolve(rows);
          }
        });
      });
    });
  }

  // Get reports shared with user
  static findSharedWithUser(userEmail) {
    return new Promise((resolve, reject) => {
      const sql = `
        SELECT r.*, sr.access_type, sr.expires_at, sr.created_at as shared_at,
               u.name as shared_by_name, u.email as shared_by_email
        FROM reports r
        JOIN shared_reports sr ON r.id = sr.report_id
        JOIN users u ON sr.shared_by_user_id = u.id
        WHERE sr.shared_with_email = ?
        AND (sr.expires_at IS NULL OR sr.expires_at > datetime('now'))
        ORDER BY sr.created_at DESC
      `;
      
      db.all(sql, [userEmail], (err, rows) => {
        if (err) {
          reject({ status: 500, message: 'Database error' });
        } else {
          resolve(rows);
        }
      });
    });
  }

  // Get reports shared by user
  static findSharedByUser(userId) {
    return new Promise((resolve, reject) => {
      const sql = `
        SELECT r.*, sr.shared_with_email, sr.access_type, sr.expires_at, sr.created_at as shared_at
        FROM reports r
        JOIN shared_reports sr ON r.id = sr.report_id
        WHERE sr.shared_by_user_id = ?
        ORDER BY sr.created_at DESC
      `;
      
      db.all(sql, [userId], (err, rows) => {
        if (err) {
          reject({ status: 500, message: 'Database error' });
        } else {
          resolve(rows);
        }
      });
    });
  }

  // Revoke share
  static delete(shareId, userId) {
    return new Promise((resolve, reject) => {
      // Verify user owns the report being shared
      const sql = `
        DELETE FROM shared_reports 
        WHERE id = ? 
        AND shared_by_user_id = ?
      `;
      
      db.run(sql, [shareId, userId], function(err) {
        if (err) {
          reject({ status: 500, message: 'Error revoking access' });
        } else if (this.changes === 0) {
          reject({ status: 404, message: 'Share not found or access denied' });
        } else {
          resolve({ message: 'Access revoked successfully' });
        }
      });
    });
  }

  // Revoke all shares for a report
  static deleteByReportId(reportId, userId) {
    return new Promise((resolve, reject) => {
      // Verify user owns the report
      db.get('SELECT * FROM reports WHERE id = ? AND user_id = ?', [reportId, userId], (err, report) => {
        if (err || !report) {
          return reject({ status: 404, message: 'Report not found' });
        }

        db.run('DELETE FROM shared_reports WHERE report_id = ?', [reportId], function(err) {
          if (err) {
            reject({ status: 500, message: 'Error revoking access' });
          } else {
            resolve({ 
              message: 'All access revoked successfully',
              count: this.changes
            });
          }
        });
      });
    });
  }

  // Update share access type
  static updateAccessType(shareId, userId, accessType) {
    return new Promise((resolve, reject) => {
      const sql = `
        UPDATE shared_reports 
        SET access_type = ? 
        WHERE id = ? 
        AND shared_by_user_id = ?
      `;
      
      db.run(sql, [accessType, shareId, userId], function(err) {
        if (err) {
          reject({ status: 500, message: 'Error updating access type' });
        } else if (this.changes === 0) {
          reject({ status: 404, message: 'Share not found' });
        } else {
          resolve({ message: 'Access type updated successfully' });
        }
      });
    });
  }

  // Check if user has access to report
  static checkAccess(reportId, userEmail) {
    return new Promise((resolve, reject) => {
      const sql = `
        SELECT * FROM shared_reports 
        WHERE report_id = ? 
        AND shared_with_email = ?
        AND (expires_at IS NULL OR expires_at > datetime('now'))
      `;
      
      db.get(sql, [reportId, userEmail], (err, row) => {
        if (err) {
          reject({ status: 500, message: 'Database error' });
        } else {
          resolve(!!row);
        }
      });
    });
  }

  // Get share count for user
  static getCountByUserId(userId) {
    return new Promise((resolve, reject) => {
      const sql = 'SELECT COUNT(*) as count FROM shared_reports WHERE shared_by_user_id = ?';
      
      db.get(sql, [userId], (err, row) => {
        if (err) {
          reject({ status: 500, message: 'Database error' });
        } else {
          resolve(row.count);
        }
      });
    });
  }
}

module.exports = Share;