const mysql = require("mysql2");

const connection = mysql.createConnection({
  host: "localhost",
  user: "",
  password: "",
  database: "test_form_data",
});

connection.connect((err) => {
  if (err) {
    console.error("Error connecting to MySQL:", err);
  } else {
    console.log("Connected to MySQL");
  }
});

function execute(sql) {
  return new Promise((resolve, reject) => {
    connection.execute(sql, (err, result) => {
      if (err) {
        reject(err);
        return;
      }
      resolve(result);
    });
  });
}

// insert form data into the database
function insertFormData(selector, property, value) {
  const sql = "INSERT INTO form_data (selector, property, value) VALUES (?, ?, ?)";
  const params = [selector, property, value];

  connection.query(sql, params, (err, result) => {
    if (err) {
      console.error("Error inserting data:", err);
    } else {
      console.log("Form data inserted successfully");
    }
  });
}

async function getAllData() {
  let sql = "Select * from form_data;";
  let data = await execute(sql);
  console.log(data);
  return data;
}

async function searchByField() {
  let sql = 'SELECT * FROM form_data WHERE value = "Sheinkin 54"';
  let data = await execute(sql);
  console.log(data);
  return data;
}

async function updateField() {
  let sql =
    'UPDATE form_data SET value = "New" WHERE selector = \'input[id="user_last_name"]\'';
  let data = await execute(sql);
  console.log(data);
  return data;
}

async function deleteField() {
  let sql = "DELETE FROM form_data WHERE selector = 'input[id=\"user_last_name\"]'";
  let data = await execute(sql);
  console.log(data);
  return data;
}

// deleteField();

module.exports = { insertFormData, execute };
