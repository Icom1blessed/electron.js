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
