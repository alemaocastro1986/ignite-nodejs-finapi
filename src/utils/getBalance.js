exports.getBalance = (statement) => {
  return statement.reduce((accumulator, operation) => {
    if (operation.type === "credit") {
      accumulator += operation.amount;
    } else {
      accumulator -= operation.amount;
    }
    return accumulator;
  }, 0);
};
