const { BrowserWindow, app , dialog} = require('electron');
// require('electron-reload')(__dirname);
const path = require('path');
const sqlite3 = require('sqlite3').verbose();
const { ipcMain } = require('electron');
const mongoose = require('mongoose');
// const {exec,spawn} = require('child_process');
const { stderr } = require('process');
const axios = require('axios');
// const fetch = require('node-fetch');
const https = require('https');


// https.get('https://jsonplaceholder.typicode.com/todos/1', (res) => {
//     let data = '';
  
//     // A chunk of data has been received.
//     res.on('data', (chunk) => {
//       data += chunk;
//     });
  
//     // The whole response has been received.
//     res.on('end', () => {
//       console.log(JSON.parse(data));
//     });
//   }).on('error', (error) => {
//     console.error('Error:', error.message);
//   });


fetch('https://jsonplaceholder.typicode.com/todos/1')
  .then(response => response.json())
  .then(data => console.log(data))
  .catch(error => console.error('Error:', error));

axios.get('https://jsonplaceholder.typicode.com/todos/1')
  .then(response => console.log(response.data))
  .catch(error => console.error('Error:', error));





mongoose.connect('mongodb://localhost:27017/mydatabase')
.then(() => console.log('MongoDB connected!'))
.catch(err => console.error('connection error:',err));

// Initialize the database
let db = new sqlite3.Database(path.join(__dirname, 'mydatabase.db'), (err) => {
    if (err) {
        console.error('Error opening database:', err.message);
    } else {
        console.log('Connected to SQLite database');

        // Create the table if it doesn't exist
        db.run(`CREATE TABLE IF NOT EXISTS users (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT NOT NULL,
            email TEXT NOT NULL UNIQUE
        )`, (err) => {
            if (err) {
                console.error('Error creating table:', err.message);
            } else {
                // Insert a sample user after the table is created
                db.run(`INSERT INTO users (name, email) VALUES (?, ?)`, ['John Doe', 'john@example.com'], function (err) {
                    if (err) {
                        return console.error('Error inserting data:', err.message);
                    }
                    console.log(`A row has been inserted with rowid ${this.lastID}`);
                });

                // Now you can safely run queries after database initialization
                db.get('SELECT * FROM users WHERE id = ?', [1], (err, row) => {
                    if (err) {
                        console.error('Error selecting user:', err.message);
                    } else if (row) {
                        console.log('Email already exists: no new record inserted');
                    } else {
                        const email = 'newemail@example.com';  // Define a valid email
                        db.run(`INSERT INTO users (name, email) VALUES(?,?)`, ['John Doe', email], function(err) {
                            if (err) {
                                return console.error('Error inserting data:', err.message);
                            } else {
                                console.log(`A row has been inserted with rowid ${this.lastID}`);
                            }
                        });
                        console.log(row);
                    }
                });
            }
        });
    }
});


// app.on('ready',() => {
// const win = new BrowserWindow({
//   width:800,
//   height:600
// });
// win.loadFile('index.html'); 
// });

const createWindow = () => {
    const win = new BrowserWindow({
        width: 800,
        height: 600,
        webPreferences: {
            preload: path.join(__dirname, 'Preload.js'),
            nodeIntegration: true,  // If you need Node.js APIs in the renderer
            contextIsolation: false, // If you want to disable context isolation
        }
    });

    win.loadFile("index.html");
};

// Listen for IPC event for showing alert dialog
ipcMain.on('show-alert', (event) => {
    const focusedWindow = BrowserWindow.getFocusedWindow();
    
    // Show the alert using the dialog object
    dialog.showMessageBox(focusedWindow, {
        type: 'info',
        title: 'Alert',
        message: 'This is an alert dialog from Electron!',
        buttons: ['OK']  // Corrected from 'button' to 'buttons'
    });
});

// Electron app ready event
app.whenReady().then(createWindow);

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') app.quit();
});

app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
});

// IPC to fetch users, move inside the app.whenReady() function
app.whenReady().then(() => {
    createWindow();

    // IPC to fetch users
    ipcMain.on('fetch-users', (event) => {
        db.all(`SELECT * FROM users`, [], (err, rows) => {
            if (err) {
                event.reply('fetch-users-response', { error: err.message });
            } else {
                event.reply('fetch-users-response', { data: rows });
            }
        });
    });
});

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') app.quit();
});

app.on('quit', () => {
    db.close((err) => {
        if (err) {
            console.error('Error closing database:', err.message);
        } else {
            console.log('Database closed');
        }
    });
});

exec('echo "Hello from Electron!"',(error, stdout,stderr) => {
if (error) {
    console.error(`Error:${error.message}`);
    return;
}
if (stderr) {
    console.error(`stderr:${stderr}`);
    return;
}
console.log(`stdout:${stdout}`);
});


const ls = spawn('ls', ['-lh', '/usr']);

ls.stdout.on('data', (data) => {
    console.log(`stdout:${data}`);
});

ls.stderr.on('data',(data) => {
    console.error(`stderr:${data}`);
});

ls.on('close',(code) => {
    console.log(`child process exited with code ${code}`);
});



// // This will open a text file with the default text editor
// exec('notepad myfile.txt', (error, stdout, stderr) => {
//     if (error) {
//       console.error(`Error: ${error.message}`);
//       return;
//     }
//     if (stderr) {
//       console.error(`stderr: ${stderr}`);
//       return;
//     }
//     console.log(`stdout: ${stdout}`);
//   });

// if (process.platform === 'win32') {
//     exec('notepad myfile.txt');
//   } else if (process.platform === 'darwin') {
//     exec('open myfile.txt');
//   } else {
//     exec('xdg-open myfile.txt'); // Linux
//   }


// ipcMain.on('run-external-app', (event, arg) => {
//     exec(arg, (error, stdout, stderr) => {
//       if (error) {
//         event.reply('app-response', `Error: ${error.message}`);
//         return;
//       }
//       if (stderr) {
//         event.reply('app-response', `stderr: ${stderr}`);
//         return;
//       }
//       event.reply('app-response', `stdout: ${stdout}`);
//     });
//   });


  //handle data submission
  ipcMain.on('form-submission', (event,FormData) => {
    console.log('form Data recieved:', FormData);

    //respond back to the render process
    event.reply('form-response', {succcess:true, message:'form submitted successfully!'});
  });



ipcMain.on('make-http-request', (event, url) => {
    axios.get(url)
      .then(response => {
        // Send the data back to the renderer process
        event.reply('http-response', response.data);
      })
      .catch(error => {
        console.error('Error:', error);
      });
  });



  ipcMain.handle('fetch-data', async () => {
    // Simulating some asynchronous operation, like a network request
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({ message: 'Data fetched from main process' });
      }, 1000);
    });
  });
  

  //using callbacks
  ipcMain.on('fetch-data', (event) => {
    // Perform some task and send the result back to the renderer
    setTimeout(() => {
      event.reply('fetch-data-response', { message: 'Data fetched from main process' });
    }, 1000);
  });
  

  const Store = require('electron-store');
const store = new Store();

// Set item
store.set('key', 'value');

// Get item
const value = store.get('key');
console.log(value); // Output: value


 


  