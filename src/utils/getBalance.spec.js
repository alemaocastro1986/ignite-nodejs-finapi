const { getBalance } = require("./getBalance");

describe("Utils", () => {
  describe("getBalance", () => {
    const mockedStatement = [
      { amount: 1000, type: "credit" },
      { amount: 2300, type: "credit" },
      { amount: 300, type: "withdraw" },
      { amount: 1000, type: "credit" },
    ];
    it("should return a balance of account", () => {
      const sut = getBalance(mockedStatement);
      expect(sut).toEqual(4000);
    });

    it("should return a zero, when empty statement", () => {
      const sut = getBalance([]);
      expect(sut).toEqual(0);
    });
  });
});
