import Store from 'electron-store';

const store = new Store();

// Set data
store.set('user', { name: 'Alice', age: 25 });

// Get data
const user = store.get('user');
console.log(user);
