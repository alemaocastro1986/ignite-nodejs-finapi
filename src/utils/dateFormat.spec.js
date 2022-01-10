const { dateFormat } = require("./dateFormat");

describe("Utils", () => {
  describe("dateFormat", () => {
    it("should return a fomatted date, when date params is timestamp", () => {
      const sut = dateFormat(new Date(1641836298924));
      expect(sut).toEqual("10/01/22");
    });

    it("should return a fomatted date, when date params is ISO date", () => {
      const sut = dateFormat(new Date("2022-01-10T17:08:11.776Z"));
      expect(sut).toEqual("10/01/22");
    });

    it("should return an error, when invalid date", () => {
      ["adalndalksnd", "22/01/2020", "22-01-2020T"].forEach((invalidDate) => {
        expect(() => dateFormat(invalidDate)).toThrow();
      });
    });
  });
});
