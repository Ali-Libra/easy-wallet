export const isNotEmpty = (str : string | null): str is string => {
  return str !== null && str.trim() !== '';
};