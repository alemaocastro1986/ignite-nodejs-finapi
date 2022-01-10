const { getBalance } = require("../utils/getBalance");
const { dateFormat } = require("../utils/dateFormat");

module.exports = (repository) => ({
  showAccount: async function (request, response) {
    const { id } = request.customer;
    const account = await repository.findOne({ id });
    return response.json(account);
  },

  createAccount: async function (request, response) {
    const { cpf, name } = request.body;

    const existsConsumer = await repository.findOne({
      cpf,
    });

    if (existsConsumer) {
      return response.status(400).json({
        error: "Customer already exists!",
      });
    }

    const customer = {
      cpf,
      name,
      statements: [],
    };

    const newCustomer = await repository.store(customer);

    return response.status(201).json(newCustomer);
  },

  upatedAccount: async function (request, response) {
    const { id } = request.customer;
    const { name } = request.body;
    const updatedCustomer = await repository.update(id, { name });
    return response.json(updatedCustomer);
  },

  deleteAccount: async function (request, response) {
    const { id } = request.customer;
    const removed = await repository.destroy(id);
    if (!removed) {
      return response.status(400).json({
        error: "Customer not removed",
      });
    }

    return response.status(204).json();
  },

  getStatement: async function (request, response) {
    const { cpf } = request.customer;
    const { statements } = await repository.findOne({ cpf });
    return response.json({
      statements,
      balance: getBalance(statements),
    });
  },

  getStatementBydate: async function (request, response) {
    const { cpf } = request.customer;
    const { date } = request.query;

    const { statements } = await repository.findOne({ cpf });

    const statementsFiltered = statements.filter((statement) => {
      const statementDateFormatted = dateFormat(statement.created_at);
      const queryDateFormatted = dateFormat(date);

      return statementDateFormatted === queryDateFormatted;
    });

    return response.json({
      statements: statementsFiltered,
      balance: getBalance(statementsFiltered),
    });
  },

  deposit: async function (request, response) {
    const { description, amount } = request.body;
    const customer = await repository.findOne({
      cpf: request.customer.cpf,
    });
    const statementOperation = {
      description,
      amount,
      created_at: new Date(),
      type: "credit",
    };

    customer.statements.push(statementOperation);
    await repository.update(customer.id, customer);
    return response.status(201).json(customer);
  },

  withdraw: async function (request, response) {
    const { amount } = request.body;
    const customer = await repository.findOne({
      cpf: request.customer.cpf,
    });

    const balance = getBalance(customer.statements);

    if (balance < amount) {
      return response.status(400).json({
        error: "Insufficient funds",
      });
    }

    customer.statements.push({
      type: "withdraw",
      amount,
      description: "",
      created_at: new Date(),
    });

    await repository.update(customer.id, customer);

    return response.status(201).json({
      message: "Withdraw is successfully",
    });
  },
});
