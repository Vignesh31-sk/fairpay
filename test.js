const hanaClient = require("@sap/hana-client");

const connParams = {
  // serverNode: "10.191.153.87:39015",
  serverNode: "localhost:39015",
  uid: "SYSTEM",
  pwd: "Simplepass1",
};

const conn = hanaClient.createConnection();

try {
  conn.connect(connParams);
  console.log("✅ Connected successfully!");
  conn.disconnect();
} catch (err) {
  console.error("❌ Connection failed:", err.message);
}

conn.exec("SELECT CURRENT_USER FROM DUMMY", (err, result) => {
  if (err) {
    console.error("Query error:", err.message);
  } else {
    console.log("Query result:", result);
  }
  conn.disconnect();
});
