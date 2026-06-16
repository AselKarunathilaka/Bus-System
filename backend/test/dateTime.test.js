const test = require("node:test");
const assert = require("node:assert/strict");
const {
  parseTime,
  buildJourneyWindow,
  windowsOverlap,
} = require("../src/utils/dateTime");

test("parseTime supports 12-hour and 24-hour values", () => {
  assert.deepEqual(parseTime("08:30 AM"), { hours: 8, minutes: 30 });
  assert.deepEqual(parseTime("12:15 PM"), { hours: 12, minutes: 15 });
  assert.deepEqual(parseTime("12:15 AM"), { hours: 0, minutes: 15 });
  assert.deepEqual(parseTime("23:45"), { hours: 23, minutes: 45 });
});

test("parseTime rejects malformed values", () => {
  assert.equal(parseTime("25:00"), null);
  assert.equal(parseTime("13:00 PM"), null);
  assert.equal(parseTime("8 PM"), null);
});

test("buildJourneyWindow moves overnight arrival to the next day", () => {
  const window = buildJourneyWindow("2030-01-10", "10:00 PM", "02:00 AM");

  assert.equal(window.start.getDate(), 10);
  assert.equal(window.end.getDate(), 11);
  assert.equal(window.end.getTime() - window.start.getTime(), 4 * 60 * 60 * 1000);
});

test("windowsOverlap detects collisions but permits adjacent trips", () => {
  const first = buildJourneyWindow("2030-01-10", "08:00", "10:00");
  const overlapping = buildJourneyWindow("2030-01-10", "09:30", "11:00");
  const adjacent = buildJourneyWindow("2030-01-10", "10:00", "12:00");

  assert.equal(windowsOverlap(first, overlapping), true);
  assert.equal(windowsOverlap(first, adjacent), false);
});
