// models/Vital.js
const { db } = require('../config/database');

class Vital {
  // Create new vital
  static create(vitalData) {
    return new Promise((resolve, reject) => {
      const { 
        userId, date, bloodSugar, bloodPressure, heartRate, 
        temperature, weight, oxygenLevel, notes 
      } = vitalData;
      
      const sql = `INSERT INTO vitals (user_id, date, blood_sugar, blood_pressure, heart_rate, temperature, weight, oxygen_level, notes)
                   VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`;
      
      db.run(sql, [userId, date, bloodSugar, bloodPressure, heartRate, temperature, weight, oxygenLevel, notes], 
        function(err) {
          if (err) {
            reject({ status: 500, message: 'Error creating vital record' });
          } else {
            resolve({
              id: this.lastID,
              userId,
              date,
              bloodSugar,
              bloodPressure,
              heartRate,
              temperature,
              weight,
              oxygenLevel,
              notes
            });
          }
        }
      );
    });
  }

  // Get all vitals for user
  static findByUserId(userId, filters = {}) {
    return new Promise((resolve, reject) => {
      let sql = 'SELECT * FROM vitals WHERE user_id = ?';
      const params = [userId];
      
      const { startDate, endDate, limit } = filters;

      if (startDate && endDate) {
        sql += ' AND date BETWEEN ? AND ?';
        params.push(startDate, endDate);
      }

      sql += ' ORDER BY date DESC, created_at DESC';

      if (limit) {
        sql += ' LIMIT ?';
        params.push(parseInt(limit));
      }

      db.all(sql, params, (err, rows) => {
        if (err) {
          reject({ status: 500, message: 'Database error' });
        } else {
          resolve(rows);
        }
      });
    });
  }

  // Get single vital
  static findById(id, userId) {
    return new Promise((resolve, reject) => {
      const sql = 'SELECT * FROM vitals WHERE id = ? AND user_id = ?';
      
      db.get(sql, [id, userId], (err, row) => {
        if (err) {
          reject({ status: 500, message: 'Database error' });
        } else if (!row) {
          reject({ status: 404, message: 'Vital record not found' });
        } else {
          resolve(row);
        }
      });
    });
  }

  // Update vital
  static update(id, userId, updateData) {
    return new Promise((resolve, reject) => {
      const { 
        bloodSugar, bloodPressure, heartRate, 
        temperature, weight, oxygenLevel, notes 
      } = updateData;
      
      const sql = `UPDATE vitals 
                   SET blood_sugar = ?, blood_pressure = ?, heart_rate = ?, 
                       temperature = ?, weight = ?, oxygen_level = ?, notes = ?
                   WHERE id = ? AND user_id = ?`;
      
      db.run(sql, [bloodSugar, bloodPressure, heartRate, temperature, weight, oxygenLevel, notes, id, userId], 
        function(err) {
          if (err) {
            reject({ status: 500, message: 'Error updating vital record' });
          } else if (this.changes === 0) {
            reject({ status: 404, message: 'Vital record not found' });
          } else {
            resolve({ message: 'Vital record updated successfully' });
          }
        }
      );
    });
  }

  // Delete vital
  static delete(id, userId) {
    return new Promise((resolve, reject) => {
      const sql = 'DELETE FROM vitals WHERE id = ? AND user_id = ?';
      
      db.run(sql, [id, userId], function(err) {
        if (err) {
          reject({ status: 500, message: 'Error deleting vital record' });
        } else if (this.changes === 0) {
          reject({ status: 404, message: 'Vital record not found' });
        } else {
          resolve({ message: 'Vital record deleted successfully' });
        }
      });
    });
  }

  // Get statistics
  static getStats(userId) {
    return new Promise((resolve, reject) => {
      const sql = `
        SELECT 
          COUNT(*) as total_readings,
          AVG(blood_sugar) as avg_blood_sugar,
          MIN(blood_sugar) as min_blood_sugar,
          MAX(blood_sugar) as max_blood_sugar,
          AVG(blood_pressure) as avg_blood_pressure,
          MIN(blood_pressure) as min_blood_pressure,
          MAX(blood_pressure) as max_blood_pressure,
          AVG(heart_rate) as avg_heart_rate,
          MIN(heart_rate) as min_heart_rate,
          MAX(heart_rate) as max_heart_rate,
          AVG(temperature) as avg_temperature,
          AVG(weight) as avg_weight,
          AVG(oxygen_level) as avg_oxygen_level
        FROM vitals 
        WHERE user_id = ?
      `;
      
      db.get(sql, [userId], (err, row) => {
        if (err) {
          reject({ status: 500, message: 'Database error' });
        } else {
          resolve(row);
        }
      });
    });
  }

  // Get latest vital
  static getLatest(userId) {
    return new Promise((resolve, reject) => {
      const sql = 'SELECT * FROM vitals WHERE user_id = ? ORDER BY date DESC, created_at DESC LIMIT 1';
      
      db.get(sql, [userId], (err, row) => {
        if (err) {
          reject({ status: 500, message: 'Database error' });
        } else {
          resolve(row);
        }
      });
    });
  }

  // Get vitals by date range for chart
  static getByDateRange(userId, startDate, endDate) {
    return new Promise((resolve, reject) => {
      const sql = `
        SELECT date, 
               AVG(blood_sugar) as bloodSugar,
               AVG(blood_pressure) as bloodPressure,
               AVG(heart_rate) as heartRate,
               AVG(temperature) as temperature,
               AVG(weight) as weight,
               AVG(oxygen_level) as oxygenLevel
        FROM vitals
        WHERE user_id = ? AND date BETWEEN ? AND ?
        GROUP BY date
        ORDER BY date ASC
      `;
      
      db.all(sql, [userId, startDate, endDate], (err, rows) => {
        if (err) {
          reject({ status: 500, message: 'Database error' });
        } else {
          resolve(rows);
        }
      });
    });
  }
}

module.exports = Vital;