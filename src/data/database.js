const { readFile, writeFile } = require("fs/promises");
const path = require("path");

class Database {
  constructor() {
    this.fileName = path.resolve(
      __dirname,
      process.env.NODE_ENV === "test" ? "customers.test.json" : "customers.json"
    );
  }

  async read() {
    const filedata = await readFile(this.fileName, "utf-8");

    return JSON.parse(filedata.toString());
  }

  async write(data) {
    await writeFile(this.fileName, JSON.stringify(data));
    return true;
  }
}

exports.Database = Database;

module.exports = new Database();
