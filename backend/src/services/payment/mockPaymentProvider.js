const crypto = require("crypto");

exports.initiatePayment = async (booking, amount, currency, customer) => {
  const paymentReference = `MOCK-${Date.now()}-${crypto.randomBytes(3).toString("hex").toUpperCase()}`;
  
  return {
    provider: "mock",
    paymentReference,
    bookingId: booking._id,
    amount,
    currency,
    customer,
    gatewayPayload: {
      type: "mock",
      mockReference: paymentReference,
    }
  };
};

exports.verifyPayment = async (payload) => {
  // Mock verification doesn't actually hit an external API
  return {
    verified: true,
    paymentReference: payload.paymentReference,
    status: payload.status === "success" ? "Paid" : "Failed",
    gatewayPaymentId: `MOCK-GW-${Date.now()}`,
    failureReason: payload.status === "failed" ? "Mock payment failed intentionally" : null
  };
};
