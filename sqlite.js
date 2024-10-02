const sqlite3 = require('sqlite3').verbose();
const path = require('path');

// Create a database and open a connection
const dbPath = path.join(__dirname, 'mydatabase.db');
const db = new sqlite3.Database(dbPath, (err) => {
    if (err) {
        console.error('Error opening database:', err.message);
    } else {
        console.log('Connected to SQLite database.');
    }
});

// Drop the users table if it exists
db.run(`DROP TABLE IF EXISTS users`, (err) => {
    if (err) {
        console.error('Error dropping table:', err.message);
    } else {
        console.log('Dropped existing users table (if it existed).');

        // Create a new users table with the correct schema
        db.run(`CREATE TABLE users (id INTEGER PRIMARY KEY, name TEXT, age INTEGER)`, (err) => {
            if (err) {
                console.error('Error creating table:', err.message);
            } else {
                console.log('Created users table with name and age columns.');

                // Insert data into the table
                const insertUser = (name, age) => {
                    db.run(`INSERT INTO users (name, age) VALUES (?, ?)`, [name, age], function (err) {
                        if (err) {
                            return console.error('Error inserting data:', err.message);
                        }
                        console.log(`A row has been inserted with rowid ${this.lastID}`);
                    });
                };

                // Call the insert function
                insertUser('Alice', 25);
                insertUser('John Doe', 30);

                // Query data
                db.all(`SELECT * FROM users`, [], (err, rows) => {
                    if (err) {
                        console.error('Error querying data:', err.message);
                    } else {
                        console.log('Users:', rows);
                    }
                });

                // Close the database connection
                db.close((err) => {
                    if (err) {
                        console.error('Error closing database:', err.message);
                    } else {
                        console.log('Database connection closed.');
                    }
                });
            }
        });
    }
});
