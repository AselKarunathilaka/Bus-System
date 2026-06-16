const mockPaymentProvider = require("./mockPaymentProvider");
const payhereProvider = require("./payhereProvider");

const getPaymentProvider = () => {
  const provider = process.env.PAYMENT_PROVIDER || "mock";
  if (provider === "payhere") {
    return payhereProvider;
  }
  return mockPaymentProvider;
};

module.exports = { getPaymentProvider };
