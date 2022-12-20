const showFormattedDate = (date: Date) => {
  return date.toLocaleDateString("id-ID", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });
};

export { showFormattedDate };

export default showFormattedDate;
