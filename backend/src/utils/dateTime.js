const TIME_PATTERN = /^([01]?\d|2[0-3]):([0-5]\d)(?:\s*([AP]M))?$/i;

const parseTime = (value) => {
  if (typeof value !== "string") return null;

  const match = value.trim().match(TIME_PATTERN);
  if (!match) return null;

  let hours = Number(match[1]);
  const minutes = Number(match[2]);
  const period = match[3]?.toUpperCase();

  if (period) {
    if (hours < 1 || hours > 12) return null;
    if (period === "PM" && hours !== 12) hours += 12;
    if (period === "AM" && hours === 12) hours = 0;
  }

  return { hours, minutes };
};

const buildJourneyWindow = (departureDate, departureTime, arrivalTime) => {
  const date = new Date(departureDate);
  const departure = parseTime(departureTime);
  const arrival = parseTime(arrivalTime);

  if (Number.isNaN(date.getTime()) || !departure || !arrival) return null;

  const start = new Date(date);
  start.setHours(departure.hours, departure.minutes, 0, 0);

  const end = new Date(date);
  end.setHours(arrival.hours, arrival.minutes, 0, 0);

  if (end <= start) {
    end.setDate(end.getDate() + 1);
  }

  return { start, end };
};

const windowsOverlap = (first, second) =>
  first.start < second.end && second.start < first.end;

module.exports = {
  parseTime,
  buildJourneyWindow,
  windowsOverlap,
};
