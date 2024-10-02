const fs = require('fs');
const path = require('path');

// Path to the data file
const dataPath = path.join(__dirname, 'data.json');

// Write data
const data = { name: 'John', age: 30 };
fs.writeFileSync(dataPath, JSON.stringify(data));

// Read data
const rawData = fs.readFileSync(dataPath);
const parsedData = JSON.parse(rawData);
console.log(parsedData);



