const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const PHONE_PATTERN = /^\+?[0-9]{7,15}$/;

const cleanText = (value, maxLength = 200) => {
  if (typeof value !== "string") return "";
  return value.trim().slice(0, maxLength);
};

const isValidEmail = (value) =>
  typeof value === "string" && EMAIL_PATTERN.test(value.trim().toLowerCase());

const isValidPhone = (value) =>
  typeof value === "string" && PHONE_PATTERN.test(value.trim());

const isStrongEnoughPassword = (value) =>
  typeof value === "string" &&
  value.length >= 8 &&
  /[A-Za-z]/.test(value) &&
  /\d/.test(value);

const isPositiveNumber = (value, { allowZero = false } = {}) => {
  const number = Number(value);
  return (
    Number.isFinite(number) &&
    (allowZero ? number >= 0 : number > 0)
  );
};

module.exports = {
  cleanText,
  isValidEmail,
  isValidPhone,
  isStrongEnoughPassword,
  isPositiveNumber,
};
