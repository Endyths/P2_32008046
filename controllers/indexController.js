const toIndex = (req, res, next) => {
  res.render("index.ejs", { title: "Express" });
};

module.exports = toIndex;