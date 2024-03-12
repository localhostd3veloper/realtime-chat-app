export const getFormattedTime = (date: string) => {
  return new Date(date).toLocaleString('en', {
    timeStyle: 'short',
  });
};
