const db = require('../config/database');

const getUserByEmail = async (email) => {
  return await db.getUserByEmail(email);
};

module.exports = {
  getUserByEmail
}; 