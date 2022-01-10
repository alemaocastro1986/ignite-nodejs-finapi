function cpfGuard(repository) {
  return async (request, response, next) => {
    const hasValidHeader = request?.headers && request?.headers?.cpf;
    if (!hasValidHeader) {
      return response.status(401).json({
        error: "Cpf not provided",
      });
    }

    const { cpf } = request.headers;

    const customer = await repository.findOne({ cpf });

    if (!customer) {
      return response.status(404).json({ error: "Customer not found" });
    }
    request.customer = { cpf, id: customer.id };
    return next();
  };
}

module.exports = cpfGuard;
