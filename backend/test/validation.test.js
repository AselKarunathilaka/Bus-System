const test = require("node:test");
const assert = require("node:assert/strict");
const {
  cleanText,
  isValidEmail,
  isValidPhone,
  isStrongEnoughPassword,
  isPositiveNumber,
} = require("../src/utils/validation");

test("cleanText trims and limits user-provided text", () => {
  assert.equal(cleanText("  QuickBus  "), "QuickBus");
  assert.equal(cleanText("abcdef", 3), "abc");
  assert.equal(cleanText(null), "");
});

test("email and phone validation reject malformed input", () => {
  assert.equal(isValidEmail("user@example.com"), true);
  assert.equal(isValidEmail("user@"), false);
  assert.equal(isValidPhone("+94712345678"), true);
  assert.equal(isValidPhone("phone-number"), false);
});

test("password validation requires length, a letter, and a number", () => {
  assert.equal(isStrongEnoughPassword("quickbus1"), true);
  assert.equal(isStrongEnoughPassword("short1"), false);
  assert.equal(isStrongEnoughPassword("onlyletters"), false);
});

test("numeric validation rejects NaN and respects zero rules", () => {
  assert.equal(isPositiveNumber("12"), true);
  assert.equal(isPositiveNumber("not-a-number"), false);
  assert.equal(isPositiveNumber(0), false);
  assert.equal(isPositiveNumber(0, { allowZero: true }), true);
});
