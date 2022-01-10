const database = require("./database");
const { writeFile } = require("fs/promises");
const { resolve } = require("path");

describe("Database", () => {
  beforeEach(async () => {
    await writeFile(resolve(__dirname, "customers.test.json"), "[]", "utf-8");
  });
  it("Shold return a empty list of customers", async () => {
    const sut = await database.read();
    expect(sut).toEqual([]);
  });

  it("Shold return an true, when inserted customer", async () => {
    const sut = await database.write([
      {
        id: "7a0ca079-faea-49a0-8b3f-6267415b176a",
        name: "Jane Doe",
        cpf: "11111111111",
        statements: [],
      },
    ]);
    expect(sut).toBeTruthy();
  });

  it("Shold return an list containing, one customer", async () => {
    await database.write([
      {
        id: "7a0ca079-faea-49a0-8b3f-6267415b176a",
        name: "Jane Doe",
        cpf: "11111111111",
        statements: [],
      },
    ]);
    const sut = await database.read();
    expect(sut).toEqual([
      expect.objectContaining({
        id: expect.any(String),
        name: "Jane Doe",
        cpf: "11111111111",
        statements: [],
      }),
    ]);
  });
});
