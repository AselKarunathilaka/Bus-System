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
