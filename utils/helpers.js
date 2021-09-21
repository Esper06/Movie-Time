module.exports = {
  format_date: (date) => {
    var options = {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    };
    var theDate = new Date(date);
    console.log(theDate.toLocaleDateString("en-GB", options));
    return `${theDate.getMonth() + 1}/${new Date(
      date
    ).getDate()}/${theDate.getFullYear()}`;
  },
  format_plural: (word, amount) => {
    if (amount !== 1) {
      return `${word}s`;
    }

    return word;
  },
};
