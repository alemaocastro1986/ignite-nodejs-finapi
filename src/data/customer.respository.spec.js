const CustomerRepository = require("./customer.respository");

describe("CustomerRepository", () => {
  let mockData = [
    {
      id: "7a0ca079-faea-49a0-8b3f-6267415b176a",
      name: "Jane Doe",
      cpf: "11111111111",
      statements: [],
    },
    {
      id: "7a0ca079-faea-49a0-8b3f-6267415b176b",
      name: "John Doe",
      cpf: "22222222222",
      statements: [],
    },
  ];
  const database = {
    read: jest.fn().mockResolvedValue(mockData),
    write: jest.fn().mockImplementation((data) => {
      mockData = data;
    }),
  };

  const repository = new CustomerRepository(database);
  it("should return an list of customers", async () => {
    const sut = await repository.listAll();

    expect(sut).toHaveLength(2);
  });

  it("should return an list of customers, when where clausule is found ", async () => {
    const sut = await repository.find({
      name: "doe",
    });

    expect(sut).toHaveLength(2);
  });

  it("should return an customer, when where clausule is valid ", async () => {
    const sut = await repository.findOne({
      name: "Jane",
    });

    expect(sut).toEqual({
      id: "7a0ca079-faea-49a0-8b3f-6267415b176a",
      name: "Jane Doe",
      cpf: "11111111111",
      statements: [],
    });
  });

  it("should return a new customer, when params is valid", async () => {
    await repository.store({
      name: "Jonny Doe",
      cpf: "33333333333",
      statement: [],
    });

    const sut = await repository.listAll();

    expect(sut).toHaveLength(3);
  });

  it("should return a updated customer, when params is valid", async () => {
    await repository.update("7a0ca079-faea-49a0-8b3f-6267415b176a", {
      name: "Jane Doe updated",
    });

    const sut = await repository.findOne({
      id: "7a0ca079-faea-49a0-8b3f-6267415b176a",
    });

    expect(sut).toEqual(
      expect.objectContaining({
        id: "7a0ca079-faea-49a0-8b3f-6267415b176a",
        name: "Jane Doe updated",
        cpf: "11111111111",
        statements: [],
      })
    );
  });

  it("should not update client, when id is invalid ", async () => {
    await repository.update("anything", {
      name: "Jane Doe updated",
    });

    expect(database.write).not.toBeCalled();
  });

  it("should return true, when customer is removed.", async () => {
    const sut = await repository.destroy(
      "7a0ca079-faea-49a0-8b3f-6267415b176a"
    );

    const sut2 = await repository.listAll();
    expect(sut).toBeTruthy();
    expect(sut2).toHaveLength(2);
  });

  it("should return false, when customer is removed.", async () => {
    const sut = await repository.destroy("invalid id");

    expect(sut).toBeFalsy();
  });
});
