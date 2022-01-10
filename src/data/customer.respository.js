const { v4: UUIDV4 } = require("uuid");

class CustomerRepository {
  db;
  constructor(database) {
    this.db = database;
  }
  async listAll() {
    const result = await this.db.read();
    return result;
  }

  async find(where) {
    const data = await this.db.read();

    return data.filter((item) => {
      return Object.keys(where).some(
        (key) =>
          item[key] === where[key] ||
          String(item[key]).match(new RegExp(where[key], "i"))
      );
    });
  }

  async findOne(where) {
    const data = await this.db.read();

    return data.filter((item) => {
      return Object.keys(where).some(
        (key) =>
          item[key] === where[key] ||
          String(item[key]).match(new RegExp(where[key], "i"))
      );
    })[0];
  }
  async store(data) {
    const id = UUIDV4();
    const customer = Object.assign(data, { id });

    const result = await this.db.read();
    result.push(customer);
    await this.db.write(result);
    return customer;
  }

  async update(id, data) {
    const list = await this.db.read();
    const customerIndex = list.findIndex((item) => item.id === id);

    if (customerIndex < 0) {
      return;
    }
    const customerUpdated = Object.assign(list[customerIndex], { ...data });
    list[customerIndex] = customerUpdated;

    await this.db.write(list);
    return customerUpdated;
  }

  async destroy(id) {
    const list = await this.db.read();
    const customerIndex = list.findIndex((item) => item.id === id);

    if (customerIndex < 0) {
      return false;
    }

    list.splice(customerIndex, 1);
    await this.db.write(list);
    return true;
  }
}

module.exports = CustomerRepository;
