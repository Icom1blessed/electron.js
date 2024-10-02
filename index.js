const net = require('net');

// const { app, net } = require('electron');


//create a tcp server
const server = net.createServer((socket) => {
    console.log('New connection established.');

    //handle data recieved from the client
    socket.on('data', (data) => {
        console.log('Recieved from client:', data.toString());
        socket.write('Hello from server!'); //send a response
    });


    //handle client disconnection
    socket.on('end', () => {
        console.log('client dissconnection.');
    }); 
});


//start the server and listen on port 8080
server.listen(8080, () => {
    console.log('server listen on port 8080');
});

//create A Tcp client to listen to the server
const client = net.createConnection({port:8080}, () => {
    console.log('connected to server!');
    client.write('Hello, server!');
});

client.on('data',(data) => {
    console.log('Recieved from server:', data.toString());
    client.end();// close the connection
});

client.on('end', () => {
    console.log('Dissconnected from server.');
});









// app.on('ready', () => {
//     // Create a request
//     const request = net.request('https://jsonplaceholder.typicode.com/todos/1');

//     // Listen for response
//     request.on('response', (response) => {
//         console.log(`STATUS: ${response.statusCode}`);
//         console.log(`HEADERS: ${JSON.stringify(response.headers)}`);

//         response.on('data', (chunk) => {
//             console.log(`BODY: ${chunk}`);
//         });

//         response.on('end', () => {
//             console.log('No more data in response.');
//         });
//     });

//     // End the request (actually send it)
//     request.end();
// });



async function fetchData() {
    try {
      const data = await ipcRenderer.invoke('fetch-data');
      console.log('Data received:', data);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  }
  