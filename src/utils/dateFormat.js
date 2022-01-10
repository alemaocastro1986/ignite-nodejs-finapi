exports.dateFormat = (date) => {
  try {
    const formatter = new Intl.DateTimeFormat("pt-BR", {
      day: "2-digit",
      month: "2-digit",
      year: "2-digit",
    });

    return formatter.format(new Date(date));
  } catch (error) {
    throw err;
  }
};
