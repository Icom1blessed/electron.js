const { contextBridge, ipcRenderer } = require('electron');

// Expose a limited API to the renderer process (browser window)
contextBridge.exposeInMainWorld('api', 'electronAPI', {
    showalert:() => ipcRenderer.send('show-alert'),
     sendFormData:(data) => ipcRenderer.send('form-submission', data),
     onFormResponse:(callback) => ipcRenderer.on('form-response', callback),

    fetchUsers: () => ipcRenderer.invoke('fetch-users'),

    // Listen for the reply from the main process
    onUsersFetched: (callback) => {
        ipcRenderer.on('fetch-users-response', (event, data) => {
            callback(data);
        });
    }
});


// Renderer Process (index.html or preload.js)
fetch('https://jsonplaceholder.typicode.com/todos/1')
  .then(response => response.json())
  .then(data => console.log(data))
  .catch(error => console.error('Error:', error));

