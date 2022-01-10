const cpfGuard = require("./cpfGuard");
const database = require("../data/database");

describe("CpfGuard middleware", () => {
  let mockrequest;
  let mockResponse;
  let nextFuntion = jest.fn();

  let mockRepository = {
    findOne: jest.fn(),
  };
  beforeEach(async () => {
    mockrequest = {};
    mockResponse = {
      json: jest.fn(),
      status: jest.fn().mockReturnThis(),
    };
  });

  test("without headers", async () => {
    const expectedResponse = {
      error: "Cpf not provided",
    };

    await cpfGuard(mockRepository)(mockrequest, mockResponse, nextFuntion);

    expect(mockResponse.status).toBeCalledWith(401);
    expect(mockResponse.json).toBeCalledWith(expectedResponse);
  });

  test("without 'cpf' header", async () => {
    const expectedResponse = {
      error: "Cpf not provided",
    };

    mockrequest = {
      headers: {},
    };

    await cpfGuard(mockRepository)(mockrequest, mockResponse, nextFuntion);

    expect(mockResponse.status).toBeCalledWith(401);
    expect(mockResponse.json).toBeCalledWith(expectedResponse);
  });

  test("with 'cpf' invalid", async () => {
    const expectedResponse = {
      error: "Customer not found",
    };

    mockrequest = {
      headers: {
        cpf: "anything",
      },
    };

    await cpfGuard(mockRepository)(mockrequest, mockResponse, nextFuntion);

    expect(mockRepository.findOne).toBeCalledWith({
      cpf: "anything",
    });

    expect(mockResponse.status).toBeCalledWith(404);
    expect(mockResponse.json).toBeCalledWith(expectedResponse);
  });

  test("with valid 'cpf'", async () => {
    let expectedResponse = {
      id: "7a0ca079-faea-49a0-8b3f-6267415b176a",
      cpf: "11111111111",
    };

    mockrequest = {
      headers: {
        cpf: "11111111111",
      },
    };

    mockRepository.findOne.mockResolvedValue({
      id: "7a0ca079-faea-49a0-8b3f-6267415b176a",
      name: "Jane Doe",
      cpf: "11111111111",
      statements: [],
    });

    await cpfGuard(mockRepository)(mockrequest, mockResponse, nextFuntion);

    expect(mockRepository.findOne).toBeCalledWith({
      cpf: "11111111111",
    });

    expect(nextFuntion).toBeCalledTimes(1);
    expect(mockrequest.customer).toEqual(expectedResponse);
  });
});
