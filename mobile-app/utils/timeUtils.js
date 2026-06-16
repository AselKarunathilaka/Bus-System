export const getGreeting = (fullName) => {
  const hour = new Date().getHours();
  const firstName = fullName ? fullName.split(" ")[0] : "User";
  
  let greeting = "Good morning";
  if (hour >= 12 && hour < 17) {
    greeting = "Good afternoon";
  } else if (hour >= 17 && hour < 21) {
    greeting = "Good evening";
  } else if (hour >= 21 || hour < 5) {
    greeting = "Good night";
  }
  
  return `${greeting}, ${firstName}`;
};

export const getScheduleDeparture = (schedule) => {
  if (!schedule?.departureDate || !schedule?.departureTime) return null;

  const date = new Date(schedule.departureDate);
  const match = String(schedule.departureTime)
    .trim()
    .match(/^([01]?\d|2[0-3]):([0-5]\d)(?:\s*([AP]M))?$/i);

  if (Number.isNaN(date.getTime()) || !match) return null;

  let hours = Number(match[1]);
  const minutes = Number(match[2]);
  const period = match[3]?.toUpperCase();

  if (period === "PM" && hours !== 12) hours += 12;
  if (period === "AM" && hours === 12) hours = 0;

  date.setHours(hours, minutes, 0, 0);
  return date;
};

export const isBookableSchedule = (schedule) => {
  const departure = getScheduleDeparture(schedule);
  return schedule?.status === "Scheduled" && departure && departure > new Date();
};
