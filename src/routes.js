const { Router } = require("express");

const database = require("./data/database");
const CustomerRepository = require("./data/customer.respository");
const CustomerController = require("./controllers/CustomerController");

const cpfGuard = require("./middlewares/cpfGuard");

const routes = Router();

const customerRepository = new CustomerRepository(database);
const controller = CustomerController(customerRepository);

routes.post("/account", controller.createAccount);

routes.use(cpfGuard(customerRepository));

routes.get("/account", controller.showAccount);
routes.put("/account", controller.upatedAccount);
routes.delete("/account", controller.deleteAccount);

routes.get("/statement", controller.getStatement);
routes.get("/statement/date", controller.getStatementBydate);

routes.post("/deposit", controller.deposit);

routes.post("/withdraw", controller.withdraw);

module.exports = routes;
