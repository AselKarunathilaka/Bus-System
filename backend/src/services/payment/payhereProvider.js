const crypto = require("crypto");

exports.initiatePayment = async (booking, amount, currency, customer) => {
  const paymentReference = `PH-${Date.now()}-${crypto.randomBytes(3).toString("hex").toUpperCase()}`;
  
  const merchantId = process.env.PAYHERE_MERCHANT_ID;
  const merchantSecret = process.env.PAYHERE_MERCHANT_SECRET;
  
  // Format amount to 2 decimal places for PayHere hash
  const formattedAmount = parseFloat(amount).toFixed(2);
  
  // Hash formulation:
  // md5(merchant_id + order_id + payhere_amount + payhere_currency + uppercase(md5(payhere_secret)))
  const hashedSecret = crypto.createHash('md5').update(merchantSecret).digest('hex').toUpperCase();
  const amountFormatted = parseFloat(amount).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 }).replace(/,/g, '');
  const hashString = `${merchantId}${paymentReference}${amountFormatted}${currency}${hashedSecret}`;
  const hash = crypto.createHash('md5').update(hashString).digest('hex').toUpperCase();

  return {
    provider: "payhere",
    paymentReference,
    bookingId: booking._id,
    amount,
    currency,
    customer,
    gatewayPayload: {
      merchant_id: merchantId,
      return_url: process.env.PAYHERE_RETURN_URL || "http://localhost:3000/payment-success",
      cancel_url: process.env.PAYHERE_CANCEL_URL || "http://localhost:3000/payment-cancel",
      notify_url: process.env.PAYHERE_NOTIFY_URL || "http://localhost:5000/api/payments/payhere/notify",
      order_id: paymentReference,
      items: `Bus Ticket Booking - ${booking.bookingId}`,
      currency: currency,
      amount: formattedAmount,
      first_name: customer.name.split(' ')[0] || "Customer",
      last_name: customer.name.split(' ').slice(1).join(' ') || "Name",
      email: customer.email || "customer@example.com",
      phone: customer.phone,
      address: "Online",
      city: "Colombo",
      country: "Sri Lanka",
      hash: hash
    }
  };
};

exports.verifyPayment = async (payload) => {
  const {
    merchant_id,
    order_id,
    payhere_amount,
    payhere_currency,
    status_code,
    md5sig,
    payment_id
  } = payload;

  const merchantSecret = process.env.PAYHERE_MERCHANT_SECRET;
  const hashedSecret = crypto.createHash('md5').update(merchantSecret).digest('hex').toUpperCase();
  
  const localSigString = `${merchant_id}${order_id}${payhere_amount}${payhere_currency}${status_code}${hashedSecret}`;
  const localSig = crypto.createHash('md5').update(localSigString).digest('hex').toUpperCase();

  if (localSig !== md5sig) {
    return {
      verified: false,
      failureReason: "Invalid payment signature from PayHere"
    };
  }

  // 2 = Success, 0 = Pending, -1 = Canceled, -2 = Failed, -3 = Charged back
  let status = "Pending";
  if (status_code === "2") status = "Paid";
  else if (status_code === "-1") status = "Cancelled";
  else if (status_code === "-2" || status_code === "-3") status = "Failed";

  return {
    verified: true,
    paymentReference: order_id,
    status: status,
    gatewayPaymentId: payment_id,
    failureReason: status === "Failed" ? "Payment failed at gateway" : null
  };
};
