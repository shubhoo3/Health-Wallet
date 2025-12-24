// models/User.js
const { db } = require('../config/database');
const bcrypt = require('bcryptjs');

class User {
  // Create new user
  static create(userData) {
    return new Promise(async (resolve, reject) => {
      const { name, email, password } = userData;
      
      try {
        const hashedPassword = await bcrypt.hash(password, 10);
        
        const sql = 'INSERT INTO users (name, email, password) VALUES (?, ?, ?)';
        
        db.run(sql, [name, email, hashedPassword], function(err) {
          if (err) {
            if (err.message.includes('UNIQUE constraint failed')) {
              reject({ status: 400, message: 'Email already exists' });
            } else {
              reject({ status: 500, message: 'Error creating user' });
            }
          } else {
            resolve({
              id: this.lastID,
              name,
              email,
              role: 'owner'
            });
          }
        });
      } catch (error) {
        reject({ status: 500, message: 'Error hashing password' });
      }
    });
  }

  // Find user by email
  static findByEmail(email) {
    return new Promise((resolve, reject) => {
      const sql = 'SELECT * FROM users WHERE email = ?';
      
      db.get(sql, [email], (err, row) => {
        if (err) {
          reject({ status: 500, message: 'Database error' });
        } else {
          resolve(row);
        }
      });
    });
  }

  // Find user by ID
  static findById(id) {
    return new Promise((resolve, reject) => {
      const sql = 'SELECT id, name, email, role, created_at FROM users WHERE id = ?';
      
      db.get(sql, [id], (err, row) => {
        if (err) {
          reject({ status: 500, message: 'Database error' });
        } else if (!row) {
          reject({ status: 404, message: 'User not found' });
        } else {
          resolve(row);
        }
      });
    });
  }

  // Verify password
  static async verifyPassword(plainPassword, hashedPassword) {
    return await bcrypt.compare(plainPassword, hashedPassword);
  }

  // Update user
  static update(id, userData) {
    return new Promise((resolve, reject) => {
      const { name, email } = userData;
      const sql = 'UPDATE users SET name = ?, email = ? WHERE id = ?';
      
      db.run(sql, [name, email, id], function(err) {
        if (err) {
          reject({ status: 500, message: 'Error updating user' });
        } else if (this.changes === 0) {
          reject({ status: 404, message: 'User not found' });
        } else {
          resolve({ message: 'User updated successfully' });
        }
      });
    });
  }

  // Delete user
  static delete(id) {
    return new Promise((resolve, reject) => {
      const sql = 'DELETE FROM users WHERE id = ?';
      
      db.run(sql, [id], function(err) {
        if (err) {
          reject({ status: 500, message: 'Error deleting user' });
        } else if (this.changes === 0) {
          reject({ status: 404, message: 'User not found' });
        } else {
          resolve({ message: 'User deleted successfully' });
        }
      });
    });
  }

  // Get all users (admin only)
  static getAll() {
    return new Promise((resolve, reject) => {
      const sql = 'SELECT id, name, email, role, created_at FROM users ORDER BY created_at DESC';
      
      db.all(sql, [], (err, rows) => {
        if (err) {
          reject({ status: 500, message: 'Database error' });
        } else {
          resolve(rows);
        }
      });
    });
  }

  // Change password
  static async changePassword(id, oldPassword, newPassword) {
    return new Promise(async (resolve, reject) => {
      try {
        // Get current user
        const user = await new Promise((res, rej) => {
          db.get('SELECT * FROM users WHERE id = ?', [id], (err, row) => {
            if (err) rej(err);
            else res(row);
          });
        });

        if (!user) {
          return reject({ status: 404, message: 'User not found' });
        }

        // Verify old password
        const validPassword = await bcrypt.compare(oldPassword, user.password);
        if (!validPassword) {
          return reject({ status: 401, message: 'Invalid old password' });
        }

        // Hash new password
        const hashedPassword = await bcrypt.hash(newPassword, 10);

        // Update password
        db.run('UPDATE users SET password = ? WHERE id = ?', [hashedPassword, id], function(err) {
          if (err) {
            reject({ status: 500, message: 'Error updating password' });
          } else {
            resolve({ message: 'Password changed successfully' });
          }
        });
      } catch (error) {
        reject({ status: 500, message: 'Server error' });
      }
    });
  }
}

module.exports = User;