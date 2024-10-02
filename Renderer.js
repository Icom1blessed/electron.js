const {ipcRenderer} = require('electron');
const axios = require('axios');

axios.get('https://jsonplaceholder.typicode.com/todos/1')
  .then(response => console.log(response.data))
  .catch(error => console.error('Error:', error));


ipcRenderer.send('fetch-users');

ipcRenderer.on('fetch-users-response', (event, result) => {
    if(result.error){
        console.error(result.error);
    } else{
        console.log(result.data);
    }
});


// // Trigger an external process (running 'echo' command)
// ipcRenderer.send('run-external-app', 'echo "Running external app"');

// // Receive the response
// ipcRenderer.on('app-response', (event, message) => {
//   console.log(message);
// });






window.electronAPI.onFormResponse((event,response) => {
    if (response.success) {
        alert(response.message);
        
    }
});

// Send request to main process to make the HTTP call
ipcRenderer.send('make-http-request', 'https://jsonplaceholder.typicode.com/todos/1');

// Listen for response from main process
ipcRenderer.on('http-response', (event, data) => {
  console.log('Data from main process:', data);
});





//using callbacks
ipcRenderer.send('fetch-data'); // Send the request

ipcRenderer.on('fetch-data-response', (event, data) => {
  console.log('Data received:', data);
});




let db;
const request = indexedDB.open("myDatabase", 1);

request.onupgradeneeded = (event) => {
    db = event.target.result;
    db.createObjectStore("users", { keyPath: "id" });
};

request.onsuccess = (event) => {
    db = event.target.result;
    const transaction = db.transaction("users", "readwrite");
    const store = transaction.objectStore("users");
    store.add({ id: 1, name: "John Doe" });
};

request.onerror = (event) => {
    console.error("Database error:", event.target.errorCode);
};
