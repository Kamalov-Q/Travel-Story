export const validateEmail = (email: string): boolean => {
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return regex.test(email);
};

/* export const getInitials = (name: string): string => {
  if (!name) return "U";
  const names = name.split(" ");
  const initials = names
    .map((n) => n[0])
    .join("")
    .toUpperCase();
  return initials;
}; */
export const getInitials = (name: string): string => {
  if (!name) return "U";
  const names = name.split(" ");
  const initials = names.map((n) => n[0].toUpperCase());
  return initials.join("");
};
