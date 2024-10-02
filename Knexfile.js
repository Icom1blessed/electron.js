// knexfile.js
const path = require('path');

module.exports = {
  client: 'sqlite3',
  connection: {
    filename: path.join(__dirname, 'mydatabase.db') // Make sure __dirname is used
  },
  useNullAsDefault: true // Required for SQLite
};
