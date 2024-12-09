const express = require("express");
const multer = require("multer");
const cors = require("cors");
const readXlsxFile = require("read-excel-file/node");
const sqlite3 = require("sqlite3");
const { open } = require("sqlite");
const bodyParser = require("body-parser");

function convertArrayToObject(arr) {
  const headers = arr[0];
  const data = arr.slice(1);
  const result = [];
  for (let i = 0; i < data.length; i++) {
    const currentItem = data[i];
    const currentObject = {};
    for (let j = 0; j < headers.length; j++) {
      const key = isNaN(headers[j]) ? headers[j].replace(/\s+/g, "") : j;
      currentObject[key] = currentItem[j];
    }
    result.push(currentObject);
  }
  return result;
}

function generateRandomId() {
  return Math.floor(Math.random() * 1000000).toString();
}

let newData;
const tableName = "newTable3";

async function readAndProcessFile(file) {
  return new Promise(async (resolve, reject) => {
    try {
      const rows = await readXlsxFile(`./public/${file[0].filename}`);
      const col = rows[0];
      // console.log(col);
      const convertedArray = col.map(
        (columnName) => `${columnName.split(" ").join("")} TEXT`
      );
      const colName = col.map(
        (columnName) => `${columnName.split(" ").join("")}`
      );

      let data;
      open({
        filename: "./test.db",
        driver: sqlite3.Database,
      }).then(async (db) => {
        const table = await db.get(
          `SELECT name FROM sqlite_master WHERE type='table' AND name='${tableName}'`
        );
        newData = convertArrayToObject(rows);
        // await db.exec(`DROP TABLE ${tableName}`)
        if (!table) {
          await db.exec(
            `CREATE TABLE ${tableName} (${convertedArray.join(", ")})`
          );
          for (const key in newData) {
            if (Object.hasOwnProperty.call(newData, key)) {
              const element = newData[key];
              const values = colName
                .map((i) => {
                  const elementValue =
                    i === "Id" ? generateRandomId() : element[i];
                  return `"${elementValue}"`;
                })
                .join(", ");

              await db.exec(`INSERT INTO ${tableName} (${colName.join(", ")})
              VALUES (${values})`);
            }
          }
        } else {
          const rowCount = await db.get(`SELECT COUNT(*) FROM ${tableName}`);
          const excelCount = rows.slice(1).length;
          if (excelCount > rowCount["COUNT(*)"]) {
            const newRow = newData[newData.length - 1];
            const values = colName.map((i) => `"${newRow[i]}"`).join(", ");
            await db.exec(`INSERT INTO ${tableName} (${colName.join(", ")})
                VALUES (${values})`);
          }
        }
        data = await db.all(`SELECT * FROM ${tableName}`);
        resolve(data);
      });
    } catch (error) {
      reject(error);
    }
  });
}

const app = express();

app.use(cors());
app.use(express.static("public"));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "public");
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + "-" + file.originalname);
  },
});

const upload = multer({ storage }).array("file");

app.post("/upload", async (req, res) => {
  upload(req, res, async (err) => {
    if (err) {
      return res.status(500).json(err);
    }
    try {
      const result = await readAndProcessFile(req.files);
      // Trả về dữ liệu cho frontend
      res.status(200).json({ success: true, data: result });
    } catch (error) {
      console.error("Error:", error);
      res.status(500).json({ success: false, error: error.message });
    }
  });
});

app.get("/get", async (req, res) => {
  try {
    open({
      filename: "./test.db",
      driver: sqlite3.Database,
    }).then(async (db) => {
      const table = await db.get(
        `SELECT name FROM sqlite_master WHERE type='table' AND name='${tableName}'`
      );
      if (table) {
        data = await db.all(`SELECT * FROM ${tableName}`);
        res.json({ success: true, data: data });
      } else {
        res.json({ success: true, data: [] });
      }
    });
  } catch (error) {
    console.error("Error:", error);
    res.json({ success: false, error: error.message });
  }
});

app.post("/add", (req, res) => {
  // Lấy dữ liệu từ request body
  const dataToAdd = req.body;
  // Tạo câu truy vấn thêm dữ liệu
  const columns = Object.keys(dataToAdd).join(", ");
  const placeholders = Object.keys(dataToAdd).fill("?").join(", ");
  const query = `INSERT INTO ${tableName} (${columns}) VALUES (${placeholders})`;
  // Tạo một mảng giá trị từ các giá trị của object
  const values = Object.values(dataToAdd);
  try {
    open({
      filename: "./test.db",
      driver: sqlite3.Database,
    }).then(async (db) => {
      // Thực hiện truy vấn thêm dữ liệu
      try {
        const result = await db.run(query, values);
        res.status(200).json({ success: true, data: result });
      } catch (error) {
        console.log(error);
      }
    });
  } catch (error) {
    console.error("Error:", error);
    res.json({ success: false, error: error.message });
  }
});

app.delete("/delete/:id", (req, res) => {
  // Lấy ID từ tham số của đường dẫn
  const itemId = req.params.id;
  // Tạo câu truy vấn xóa dữ liệu
  const query = `DELETE FROM ${tableName} WHERE Id = ?`;
  try {
    open({
      filename: "./test.db",
      driver: sqlite3.Database,
    }).then(async (db) => {
      // Thực hiện truy vấn thêm dữ liệu
      try {
        await db.run(query, [itemId]);
        res.status(200).json({ success: true, message: "Delete success!" });
      } catch (error) {
        console.log(error);
      }
    });
  } catch (error) {
    console.error("Error:", error);
    res.json({ success: false, error: error.message });
  }
});

app.put("/update", (req, res) => {
  const { Id, ...updatedData } = req.body;
  const columns = Object.keys(updatedData)
    .map((column) => `${column} = ?`)
    .join(", ");
  const query = `UPDATE ${tableName} SET ${columns} WHERE Id = ?`;
  const values = [...Object.values(updatedData), Id];
  try {
    open({
      filename: "./test.db",
      driver: sqlite3.Database,
    }).then(async (db) => {
      try {
        const result = await db.run(query, values);
        res.status(200).json({ success: true, data: result });
      } catch (error) {
        console.log(error);
      }
    });
  } catch (error) {
    console.error("Error:", error);
  }
});

app.listen(8000, () => {
  console.log("App is running on port 8000");
});
